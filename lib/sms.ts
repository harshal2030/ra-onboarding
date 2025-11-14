export function sendSMS(
    phoneNumber: string,
    message: string,
): Promise<Response> {
    const smsSenderId = process.env.SMS_SENDERID;
    const smsClientSmsId = process.env.SMS_CLIENTSMSID;
    const smsAccountUsageTypeId = process.env.SMS_ACCOUNTUSAGETYPEID;
    const smsEntityId = process.env.SMS_ENTITYID;
    const smsTempId = process.env.SMS_TEMPID;
    const smsUser = process.env.SMS_USER;
    const smsUserPassword = process.env.SMS_USER_PASSWORD;
    const smsEndpoint = process.env.SMS_ENDPOINT;

    if (
        !message ||
        !smsSenderId ||
        !smsClientSmsId ||
        !smsAccountUsageTypeId ||
        !smsEntityId ||
        !smsTempId ||
        !smsUser ||
        !smsUserPassword ||
        !phoneNumber ||
        !smsEndpoint
    ) {
        throw new Error("SMS environment variables are not set");
    }

    const url = smsEndpoint;
    const data = {
        user: smsUser,
        password: smsUserPassword,
        listsms: [
            {
                sms: message,
                mobiles: phoneNumber,
                senderid: smsSenderId,
                clientsmsid: smsClientSmsId,
                accountusagetypeid: smsAccountUsageTypeId,
                entityid: smsEntityId,
                tempid: smsTempId,
            },
        ],
    };

    if (process.env.ENV === "dev") console.log(JSON.stringify(data));

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
