declare namespace NodeJS {
  export interface ProcessEnv {
    NG_APP_ENV: string;
    NG_APP_SUPABASE_URL: string;
    NG_APP_SUPABASE_ANON_KEY: string;
  }
}
