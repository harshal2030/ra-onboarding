declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL?: string;
        JWT_SECRET?: string;
        OTP_EXPIRE_MIN?: number;
        ENV?: string;
        NEXT_PUBLIC_ENV?: string;
    }
}
