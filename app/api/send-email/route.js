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
        

        await connectDB()
        console.log('Successfully Connected to Database')
        const newLead = await Lead.create({
            name: name,
            email: email
        })

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
            to: 'pendorastudios@gmail.com',
            subject: 'Testing 123',
            text: 'This is a test, this is a test',
            html: '<h1>This is a test, this is a test<h1>'

        }

        const result = await transport.sendMail(mailOptions)

        console.log(result)
        return Response.json({result})
    }catch(error){
        console.error(error)
        return Response.json({error})
    }

}