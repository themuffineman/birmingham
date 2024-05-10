import sgMail from '@sendgrid/mail'
import { MongoClient } from 'mongodb';
export async function POST(req){

    sgMail.setApiKey(process.env.SENDGRID_KEY)
    

    try{
        const {name, email, src} = await req.json()
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (typeof email !== 'string'){
            throw new Error('Expected Email String');
        }
        if (!emailPattern.test(email)){
            throw new Error('Invalid Email Format');
        }
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        const emailsCollection = client.db('pendora').collection('leads')
        const dataEmailExists = await emailsCollection.findOne({email: email})
        if(dataEmailExists){
            throw new Error('Email Already Exists')
        }
        
        const mailOptions = {
            to: email,
            from: {
                name: 'Pendora Studios',
                email: 'pendorastudios@gmail.com'
            },
            subject: 'Would you like help with your website?',
            text: `Greetings ${name}! I hope you're doing well! I'm Petrus, and I run a web design agency for A/E firms, and I'd love to work with your firm. That's why I went ahead and redesigned a section of your homepage (design is attached below) to demonstrate how your website could stand out among the best in your industry. If you're up for it I can build your firm a new website. If you're interested in this, simply let me know. Looking forward to potentially working together! Best regards Petrus PS: If you'd like to take a different design direction than the one I took, please feel free to let me know as well.`,
            html: `<main style='display: flex; padding: 2rem; flex-direction: column; gap: 1rem; font-family: Arial, Helvetica, sans-serif;'><header><h1 style='font-size: 1rem; color: black; font-weight: bold; margin: .4rem;'>Greetings ${name}! </h1><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>I hope you're doing well! I'm Petrus, and I run a web design agency for A/E firms, and I'd love to work with your firm.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>That's why I went ahead and redesigned a section of your homepage (design is attached below) to demonstrate how your website could stand out among the best in your industry.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>If you're up for it I can build your firm a new website </p><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>If you're interested in this, simply let me know or book a meeting with me using the link <a href="https://cal.com/pendora/30" target="_blank" style="color: blue; text-decoration: underline;">here</a>. Looking forward to potentially working together!</p></header><section style="display: flex; flex-direction: column; gap: 0;"><p style='font-weight: normal; margin: 0; padding-left: .4rem;'>Best regards</p><p style='font-size: .9rem; color: black; font-weight:400; margin: 0; padding-left: .4rem;'>PS: If you'd like to take a different design direction than the one I took, please feel free to let me know as well.</p>`,
            attachments:[
                {
                    content: src,
                    filename: "Website Redesign.jpeg",
                    type: "image/jpeg",
                    disposition: "attachment"

                }
            ]
        }
        
        const result = await sgMail.send(mailOptions)

        console.log(result)
        return Response.json({result}, {status: 200})
    }catch(error){
        console.error(error)
        return Response.json({error}, {status: 500})
    }

}