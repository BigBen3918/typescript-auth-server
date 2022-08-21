import nodemailer from "nodemailer";

const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                type: "OAuth2",
                user: process.env.USER,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: process.env.OAUTH_ACCESS_TOKEN
            },
        });

        const mailOptions: any = {
            from: process.env.USER,
            to: email,
            subject: subject,
            text: "Please confirm url...",
            html: `<p>🙋🏻‍♀️  &mdash; Please enter this url : <a href="http://localhost:5000/">${text}</a></p>`,
            textEncoding: 'base64',
            headers: [
                { key: 'X-Application-Developer', value: 'Amit Agarwal' },
                { key: 'X-Application-Version', value: 'v1.0.0.2' },
            ],
        };

        await transporter.sendMail(mailOptions);
        transporter.close();

        return true;
    } catch (error) {
        throw new Error("Email Not Sent");
    }
};

export default { sendEmail };
