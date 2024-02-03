import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'spring-wood': {
          '50': '#f6f4ed',
          DEFAULT: '#f6f4ed',
          '100': '#f1eee3',
          '200': '#e2dbc6',
          '300': '#cfc3a2',
          '400': '#bba67c',
          '500': '#ad9262',
          '600': '#a07f56',
          '700': '#856749',
          '800': '#6d553f',
          '900': '#594635',
          '950': '#2f231b'
        },
        'sweet-pink': {
          '50': '#fdf3f3',
          '100': '#fce4e4',
          '200': '#fbcdcd',
          '300': '#f59797',
          '400': '#f07979',
          '500': '#e54e4e',
          '600': '#d13131',
          '700': '#b02525',
          '800': '#922222',
          '900': '#792323',
          '950': '#420d0d'
        }
      }
    }
  },
  plugins: []
};
export default config;
