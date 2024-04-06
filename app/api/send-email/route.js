import nodemailer from 'nodemailer'
import { google } from 'googleapis'

export async function POST(){
    
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
    oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
    
    try{
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                type: 'OAuth2',
                user: 'petrusheya@gmail.com',
                clientId: process.env.CLIENT_ID, 
                clientSecret: process.env.CLIENT_SECRET, 
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from: 'Papa Johns',
            to: 'petrusheya@gmail.com',
            subject: 'Testing 123',
            text: 'This is a test, this is a test',
            html: '<h1>This is a test, this is a test<h1>'

        }
        const result = await transport.sendMail(mailOptions)
        return Response.json({result})
    }catch(error){
        console.error(error)
        return Response.json({error})
    }

}