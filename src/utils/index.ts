import nodemailer from "nodemailer";

const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                type: "OAuth2",
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
            },
        });

        await transporter.sendMail({
            from: "benjamin199551@gmail.com",
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Successfully Email Sent");
    } catch (error) {
        throw new Error("Email Not Sent");
    }
};

export default { sendEmail };
