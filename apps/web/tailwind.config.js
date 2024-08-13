const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
