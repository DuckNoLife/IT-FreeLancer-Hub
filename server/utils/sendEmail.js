const Brevo = require('@getbrevo/brevo');

// Configure API Client
const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendEmail = async (options) => {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    // 1. Set Sender and Recipient
    sendSmtpEmail.sender = { 
        "name": process.env.FROM_NAME || "Elite Support", 
        "email": process.env.FROM_EMAIL 
    };
    sendSmtpEmail.to = [{ "email": options.email }];

    // 2. Set Subject and Content
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = `
        <html>
            <body>
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>System Notification</h2>
                    <p>${options.message}</p>
                    <hr/>
                    <small>If you did not request this, please ignore this email.</small>
                </div>
            </body>
        </html>
    `;

    // 3. Send Request
    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(' Email sent successfully. ID:', data.messageId);
        return data;
    } catch (error) {
        console.error(' Failed to send email:', error);
        throw error;
    }
};

module.exports = sendEmail;