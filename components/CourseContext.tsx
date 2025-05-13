import { Course } from '@/interfaces/Interfaces';
import React, { createContext, useContext } from 'react';

interface CourseContextType {
  course: Course | null;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ course: Course | null; children: React.ReactNode }> = ({
  course,
  children,
}) => {
  return <CourseContext.Provider value={{ course }}>{children}</CourseContext.Provider>;
};