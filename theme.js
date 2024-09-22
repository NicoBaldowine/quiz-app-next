// theme.js

import { createTheme } from '@nextui-org/react';

const customTheme = createTheme({
  type: 'light', // or 'dark'
  theme: {
    fonts: {
      sans: 'var(--font-inter), sans-serif',
    },
    // Add more customizations here if needed
  },
});

export default customTheme;


