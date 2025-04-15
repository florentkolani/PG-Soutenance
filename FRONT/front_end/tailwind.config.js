module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    screens: {
      'sm': '640px',     // Mobile devices
      'md': '768px',     // Tablets
      'lg': '1024px',    // Laptops
      'xl': '1280px',    // Desktop
      '2xl': '1536px',   // Large screens
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ]
}