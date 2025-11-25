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
SMS_ENDPOINT="https://mobicomm.dove-sms.com//REST/sendsms/ "

```


### TODO
- Implement webhook to get the esign status and updated db
- When user edit the previous step, delete the esign details to initiate the esign one more time.
- Update templete, add more pages and details
