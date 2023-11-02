declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      MONGO_URI: string
      PORT: string
      COOKIE_KEY: string

      // add more variables if needed
    }
  }
}
