/**
 * Design tokens utility functions and TypeScript types
 * Generated from Figma design tokens
 */

// Color token types
export type ColorToken = 
  | 'primary-100' | 'primary-200' | 'primary-300' | 'primary-400' | 'primary-500' | 'primary-600' | 'primary-700'
  | 'secondary-100' | 'secondary-200' | 'secondary-300' | 'secondary-400' | 'secondary-500' | 'secondary-600' | 'secondary-700'
  | 'tertiary-100' | 'tertiary-200' | 'tertiary-300' | 'tertiary-400' | 'tertiary-500' | 'tertiary-600' | 'tertiary-700'
  | 'grey-100' | 'grey-200' | 'grey-300' | 'grey-400' | 'grey-500' | 'grey-600' | 'grey-700'
  | 'text-primary' | 'text-secondary' | 'text-disabled' | 'text-link' | 'text-destructive'
  | 'surface-bg' | 'surface-input-enabled' | 'surface-input-disabled' | 'surface-overlay';

export type FontSizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type SpacingToken = '0' | 'xs' | 's' | 'm' | 'lg' | 'xl' | '2xl' | '3xl';
export type RadiusToken = '0' | 's' | 'm' | 'lg' | 'xl';

// Utility functions to get CSS variable values
export const getColor = (token: ColorToken): string => `var(--color-${token})`;
export const getFontSize = (token: FontSizeToken): string => `var(--font-size-${token})`;
export const getSpacing = (token: SpacingToken): string => `var(--spacing-${token})`;
export const getRadius = (token: RadiusToken): string => `var(--radius-${token})`;

// Typography utilities
export const titleFont = 'var(--font-family-title)';
export const bodyFont = 'var(--font-family-body)';
export const fontWeightRegular = 'var(--font-weight-regular)';
export const fontWeightBold = 'var(--font-weight-bold)';

// Common style combinations
export const textStyles = {
  'heading-xl': {
    fontFamily: titleFont,
    fontSize: getFontSize('3xl'),
    fontWeight: fontWeightBold,
    lineHeight: 'var(--font-line-height-3xl)',
  },
  'heading-lg': {
    fontFamily: titleFont,
    fontSize: getFontSize('2xl'),
    fontWeight: fontWeightBold,
    lineHeight: 'var(--font-line-height-2xl)',
  },
  'heading-md': {
    fontFamily: titleFont,
    fontSize: getFontSize('xl'),
    fontWeight: fontWeightBold,
    lineHeight: 'var(--font-line-height-xl)',
  },
  'body-lg': {
    fontFamily: bodyFont,
    fontSize: getFontSize('lg'),
    fontWeight: fontWeightRegular,
    lineHeight: 'var(--font-line-height-lg)',
  },
  'body-md': {
    fontFamily: bodyFont,
    fontSize: getFontSize('md'),
    fontWeight: fontWeightRegular,
    lineHeight: 'var(--font-line-height-md)',
  },
  'body-sm': {
    fontFamily: bodyFont,
    fontSize: getFontSize('sm'),
    fontWeight: fontWeightRegular,
    lineHeight: 'var(--font-line-height-sm)',
  },
} as const;

// Theme toggle utility
export const toggleDarkMode = () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
};

export const setTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const getTheme = (): 'light' | 'dark' => {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? 'dark' : 'light';
};
