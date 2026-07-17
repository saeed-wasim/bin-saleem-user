// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      adminBaseUrl: process.env.ADMIN_BASE_URL || "http://localhost:3001",
      userBaseUrl: process.env.USER_BASE_URL || "http://localhost:4000",
      databasePath: process.env.DATABASE_PATH || "./database.sqlite",
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})