// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2028-11-01',
  runtimeConfig: {
    public: {
        // If you want to expose any of these variables to the client-side,
        // prefix them with VITE_ or include them here.
    },
    private: {
        GOOGLE_CREDENTIALS_TYPE: process.env.GOOGLE_CREDENTIALS_TYPE,
        GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
        GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID,
        GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY, // Handle newlines
        GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
        GOOGLE_TOKEN_URI: process.env.GOOGLE_TOKEN_URI,
        GOOGLE_AUTH_PROVIDER_CERT_URL: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
        GOOGLE_CLIENT_CERT_URL: process.env.GOOGLE_CLIENT_CERT_URL,
    }
  },
  devtools: { enabled: true }
})
