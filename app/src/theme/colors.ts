export const colors = {
  primary: {
    main: '#66BB6A',      // Vert nature vibrant
    dark: '#388E3C',
    light: '#A5D6A7',
    contrast: '#FFFFFF',
  },
  nature: {
    sky: '#87CEEB',       // Bleu ciel
    skyLight: '#B4E5F9',
    grass: '#81C784',     // Vert herbe
    grassDark: '#66BB6A',
    grassLight: '#A5D6A7',
    cloud: '#FFFFFF',
    sun: '#FFE082',
    flower: '#FFB74D',
  },
  secondary: {
    orange: '#FF9800',
    yellow: '#FFC107',
    gold: '#FFD700',
  },
  neutral: {
    white: '#FFFFFF',
    cream: '#FAFAFA',
    lightGrey: '#E0E0E0',
    grey: '#9E9E9E',
    darkGrey: '#616161',
    black: '#333333',
  },
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  success: {
    main: '#4CAF50',
    light: '#C8E6C9',
    dark: '#2E7D32',
  },
  error: {
    main: '#F44336',
    light: '#FFCDD2',
    dark: '#C62828',
  },
  reader: {
    light: {
      background: '#FFFFFF',
      text: '#333333',
    },
    sepia: {
      background: '#F5E6D3',
      text: '#5C4033',
    },
    dark: {
      background: '#1A1A1A',
      text: '#E0E0E0',
    },
  },
  divisions: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 100,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
};
