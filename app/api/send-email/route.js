import sgMail from '@sendgrid/mail'
import connectDB from '@/utils/connectDB';
import Lead from '@/utils/schemas'

export async function POST(req){

    sgMail.setApiKey(process.env.SENDGRID_KEY)

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
        const newLead = await Lead.create({
            name: name,
            email: email
        })

        const mailOptions = {
            to: email,
            from: {
                name: 'Pendora Studios',
                email: 'pendorastudios@gmail.com'
            },
            subject: 'Would you like help with your website?',
            text: `Hello ${name}! I hope all is well over there. I recently had the chance to look at your website and I believe it can be massively improved. That's why I'd like to offer you a free website redesign of your homepage. I just want to show you where and how your website could be improved and how it can drive real results for your business. If this is something you'd be interested in please let me know. My name is Petrus by the way am a web designer and developer`,
            html: `<main style='display: flex; padding: 2rem; flex-direction: column; gap: 1rem; font-family: Arial, Helvetica, sans-serif;'><header><h1 style='font-size: 1rem; color: black; font-weight: bold; margin: .5rem;'> Hello ${name}!</h1><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>I hope all is well over there. I recently had the chance to look at your website and I believe it can be massively improved. That's why I'd like to offer you a free website redesign of your homepage. I just want to show you where and how your website could be improved and how it can drive real results for your business. If this is something you'd be interested in please let me know. My name is Petrus by the way am a web designer and developer</p></header><section style="display: flex; flex-direction: column; gap: 0;"><p style='font-weight: bold; margin: 0; padding: .5rem;'>Petrus</p><p style='font-weight: normal; color: gray; font-size: small; margin: 0; padding: .5rem;'>Web designer and developer</p></section></main>`
        }

        const result = await sgMail.send(mailOptions)

        console.log(result)
        return Response.json({result}, {status: 200})
    }catch(error){
        console.error(error)
        return Response.json({error}, {status: 500})
    }

}