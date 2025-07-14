import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // Simplified configuration - SWC works great out of the box
      devTarget: 'es2022',
    }),
  ],
  
  build: {
    target: 'es2022',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          charts: ['recharts', 'react-window'],
          maps: ['react-leaflet', 'leaflet'],
        },
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
  },
  
  server: {
    port: 3000,
    host: true,
    hmr: { overlay: false },
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@data': resolve(__dirname, 'src/data'),
    },
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})

// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react-swc'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import { resolve } from 'path'

// export default defineConfig({
//   plugins: [
//     react({
//       plugins: [['@swc/plugin-styled-components', {}]],
//       devTarget: 'es2022',
//     }),
//   ],
  
//   build: {
//     target: 'es2022',
//     minify: 'terser',
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'],
//           router: ['react-router-dom'],
//           ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
//           charts: ['recharts', 'react-window'],
//           maps: ['react-leaflet', 'leaflet'],
//         },
//       },
//     },
//     sourcemap: process.env.NODE_ENV === 'development',
//   },
  
//   server: {
//     port: 3000,
//     host: true,
//     hmr: { overlay: false },
//   },
  
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, 'src'),
//       '@components': resolve(__dirname, 'src/components'),
//       '@hooks': resolve(__dirname, 'src/hooks'),
//       '@utils': resolve(__dirname, 'src/utils'),
//       '@types': resolve(__dirname, 'src/types'),
//       '@data': resolve(__dirname, 'src/data'),
//     },
//   },
  
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: ['./src/test/setup.ts'],
//     css: true,
//   },
// })