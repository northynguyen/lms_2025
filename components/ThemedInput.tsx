import { useThemeColor } from '@/hooks/useThemeColor';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export type ThemedInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    placeholder?: string;
    type?: 'default' | 'rounded' | 'underline';
};

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
    ({ style, lightColor, darkColor, placeholder, type = 'default', ...rest }, ref) => {
        const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textPrimary');
        const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
        const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textPrimary');

        return (
            <TextInput
                ref={ref}
                placeholder={placeholder}
                placeholderTextColor={borderColor}
                style={[
                    styles.input,
                    type === 'rounded' ? styles.rounded : undefined,
                    type === 'underline' ? styles.underline : undefined,
                    { borderColor, backgroundColor, color: textColor },
                    style,
                ]}
                {...rest}
            />
        );
    }
);
const styles = StyleSheet.create({
    input: {
        height: 50,
        paddingHorizontal: 12,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 10,
        width: '100%',
    },
    rounded: {
        borderRadius: 10,
    },
    underline: {
        borderBottomWidth: 2,
        borderBottomColor: '#007AFF',
        borderRadius: 0,
    },
});
