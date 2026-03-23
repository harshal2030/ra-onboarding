### ENV

```.env
DATABASE_URL="file:./dev.db"
JWT_SECRET="THE SECRET"
OTP_EXPIRE_MIN=2
ENV="dev"             # dev/prod
NEXT_PUBLIC_ENV="dev" # dev/prod


# SMS
SMS_SENDERID=""
SMS_CLIENTSMSID=""
SMS_ACCOUNTUSAGETYPEID="1"
SMS_ENTITYID=""
SMS_TEMPID=""
SMS_USER_PASSWORD=""
SMS_USER=""
SMS_ENDPOINT="https://mobicomm.dove-sms.com//REST/sendsms/"

# LEEGALITY
LEEGALITY_AUTH_TOKEN=""
LEEGALITY_PRIVATE_SALT=""
LEEGALITY_BASE_URL="https://sandbox.leegality.com/api/v3.0"
LEEGALITY_WORKFLOW_ID=""

```


### COMMANDS
- `export DATABASE_URL="file:./dev.db" && npx prisma migrate dev`

### Webhook Setup
- From workflow -> Invitee Configuration -> more options -> add `Base URL`, `Redirect URL`, `Webhook`


### Tasks
- Prisma to drizzle (deside)
- SqLite to Pg
- Add new tab: services
