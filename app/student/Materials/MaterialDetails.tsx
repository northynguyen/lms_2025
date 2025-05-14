import { Material, Section } from '@/interfaces/Interfaces';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useMemo, useState } from 'react';
import MaterialContent from './MaterialContent';

const MaterialDetails = () => {
    const { materialData, courseSections } = useLocalSearchParams();
    const navigation = useNavigation();
    const parsedMaterial: Material = useMemo(
        () => JSON.parse(materialData as string),
        [materialData]
    );

    const parsedSections: Section[] = useMemo(
        () => JSON.parse(courseSections as string),
        [courseSections]
    );

    const [currentMaterial, setCurrentMaterial] = useState<Material>(parsedMaterial);

    const getFlattenedSortedMaterials = () => {
        return parsedSections
            .flatMap(section =>
                section.courseMaterials.map(material => ({
                    ...material,
                    section: section.sectionId,
                    sectionOrder: section.orderNumber ?? 0,
                }))
            )
            .sort((a, b) => {
                if (a.sectionOrder === b.sectionOrder) {
                    return a.orderNum - b.orderNum;
                }
                return a.sectionOrder - b.sectionOrder;
            });
    };

    const findNextMaterial = () => {
        const allMaterials = getFlattenedSortedMaterials();
        const currentIndex = allMaterials.findIndex(m => m.id === currentMaterial.id);
        return allMaterials[currentIndex + 1] || null;
    };

    const findPreviousMaterial = () => {
        const allMaterials = getFlattenedSortedMaterials();
        const currentIndex = allMaterials.findIndex(m => m.id === currentMaterial.id);
        return allMaterials[currentIndex - 1] || null;
    };

    return (
        <MaterialContent
            material={currentMaterial}
            onNext={() => {
                const next = findNextMaterial();
                if (next) setCurrentMaterial(next);
            }}
            onPrev={() => {
                const prev = findPreviousMaterial();
                if (prev) setCurrentMaterial(prev);
            }}
            hasPrev={!!findPreviousMaterial()}
            hasNext={!!findNextMaterial()}
        />
    );
};

export default MaterialDetails;
