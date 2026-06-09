import Mailgen from "mailgen";
import nodemailer from "nodemailer"


//Genrate Mail Conctent
//tools..
//configureations 
//Send the Mail

const sendEmail = async (options) => {
    
    //defaullt branading
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Project manager",
            link: "https://pkm.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from: "mail.PKM@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failled silently. Make sure that you have provided your MAILTRAP Credentials in the .env file");
        console.log("Error :", error);
    }
}

const emailVerificationMailgenContent = (username, verficationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our app, excited to have you on board.",
            action: {
                instructions: "To Verify your email please click on the following button",
                button: {
                    color: "#5e2f2f",
                    text: "Verify Your Email",
                    link: verficationUrl
                }
            },
            outro: "Need help, or have questions? Jsut Reply to this email. we'd love to help."
        }
    }
}

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset the password of your account ",
            action: {
                instructions: "To reset your password click on following link or button",
                button: {
                    color: "#420c0c",
                    text: "Reset Password",
                    link: passwordResetUrl
                }
            },
            outro: "Need help, or have questions? Jsut Reply to this email. we'd love to help."
        }
    }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}