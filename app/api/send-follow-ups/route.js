import { Recipient, EmailParams, MailerSend } from "mailersend";

export async function POST(req){
    const {name, email} = req.json()

    const mailersend = new MailerSend({
        api_key: process.env.MAILERSEND,
    });
    
    const recipients = [new Recipient(email, "Recipient")];
    
    const emailParams = new EmailParams()
        .setFrom("pendorastudios@gmail.com")
        .setFromName("Pendora Studios")
        .setRecipients(recipients)
        .setSubject("Would you like help with your website")
        .setHtml("Greetings from the team, you got this message through MailerSend.")
        .setText("Greetings from the team, you got this message through MailerSend.");
    
    mailersend.send(emailParams);
}