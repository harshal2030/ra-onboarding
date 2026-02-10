import nodemailer from "nodemailer";
import { MAIL_HOST, MAIL_PORT, MAIL_PASSWORD, MAIL_USERNAME } from "../constants/config";

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

export const EMAIL_HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Onboarding Completed – Research Analyst Services</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:20px 30px; background:#0f2a44; color:#ffffff;">
              <h2 style="margin:0; font-size:20px;">Indo Thai Securities Limited</h2>
              <p style="margin:4px 0 0; font-size:13px;">Research Analyst Desk</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:14px; line-height:1.6;">
              <p>Dear Client,</p>

              <p>
                Thank you for choosing <strong>Indo Thai Securities Limited</strong>.
              </p>

              <p>
                We confirm that your onboarding for our
                <strong>Research Analyst (RA) services</strong> has been successfully
                completed, and we have received the
                <strong>duly e-signed Research Analyst Agreement</strong>.
              </p>

              <p>
                As confirmation, we are attaching a copy of the executed agreement for
                your records. Our research services will be provided in accordance with
                the terms and conditions outlined in the agreement and applicable
                regulatory guidelines.
              </p>

              <p>
                You will start receiving research communications and updates through
                the registered contact details shared during onboarding.
              </p>

              <p>
                In case you have any queries regarding our research services or require
                any assistance, please feel free to contact us.
              </p>

              <p>
                We appreciate your trust and look forward to supporting your investment
                decisions with our research insights.
              </p>

              <p style="margin-top:30px;">
                Warm regards,<br />
                <strong>Indo Thai Securities Limited</strong><br />
                Research Analyst Desk<br />
                Email: <strong>helpdesk@indothai.co.in</strong><br />
                Phone: <strong>0731-4255800</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:15px 30px; background:#f0f0f0; color:#666666; font-size:12px;">
              This is a system-generated email. Please do not reply to this message.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
