import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import connectDB from "@/utils/connectDB";
import Lead from "@/utils/schemas";

export async function POST(req){

    try{
        const {name, email} = await req.json()
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string'){
            throw new Error('Expected String');
        }
        if (!emailPattern.test(email)){
            throw new Error('Invalid Email Format');
        }
        

        // await connectDB()
        // console.log('Successfully Connected to Database')
        // const newLead = await Lead.create({
        //     name: name,
        //     email: email
        // })

        const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
        oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'pendorastudios@gmail.com',
                clientId: process.env.CLIENT_ID, 
                clientSecret: process.env.CLIENT_SECRET, 
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'Pendora Studios <pendorastudios@gmail.com>',
            to: email,
            subject: 'Would you like help with your website?',
            text: `Greetings ${name}! I hope all is well. I recently took a look at your website and noticed it's not being used to its full potential. That's why I'd like to offer you a FREE website redesign. This way, I can demonstrate its capability to drive tangible results for your business. If you like it, we can proceed with further collaboration. If not, there's no obligation, and you won't pay a dime. Your website has the potential to be a powerful asset for your business, and I'd hate to see it go underutilized. I'm available to schedule a call to talk about your goals and how we can help you achieve them through your website. My name is Petrus by the way I help businesses turn their websites into money making assets. From your friendly neighbourhood web developer, Petrus`,
            html: `<main style='display: flex; padding: 2rem; flex-direction: column; gap: 1rem; font-family: Arial, Helvetica, sans-serif;'><header><h1 style='font-size: 1rem; color: black; font-weight: bold; margin: .5rem;'>Hello ${name}!</h1><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>I hope all is well. I recently took a look at your website and I noticed it's not being used to its full potential.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>That's why I'd like to offer you a <span style='font-weight: bold;'>free</span> website redesign. This way, I can demonstrate its capability to drive tangible results for your business. If you like it, we can proceed with further collaboration. If not, there's no obligation, and you won't pay a dime.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>Your website has the potential to be a powerful asset for your business, and I'd hate to see it go underutilized.</p><p style='font-size: 1rem; color: black; font-weight: normal; margin: .5rem;'> I'm available to schedule a call to talk about your goals and how we can help you achieve them through your website. My name is Petrus by the way I help businesses turn their websites into money making assets.</p></header><section><p>From your friendly neighbourhood web developer</p><p style='font-weight: bold;'>Petrus</p></section></main>`
        }

        const result = await transport.sendMail(mailOptions)

        console.log(result)
        return Response.json({result})
    }catch(error){
        console.error(error)
        return Response.json({error})
    }

}