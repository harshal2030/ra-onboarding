declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL?: string;
        JWT_SECRET?: string;
        OTP_EXPIRE_MIN?: number;
        ENV?: string;
        NEXT_PUBLIC_ENV?: string;
        SMS_SENDERID?: string;
        SMS_CLIENTSMSID?: string;
        SMS_ACCOUNTUSAGETYPEID?: string;
        SMS_ENTITYID?: string;
        SMS_TEMPID?: string;
        SMS_USER_PASSWORD?: string;
        SMS_USER?: string;
        SMS_ENDPOINT?: string;
    }
}
