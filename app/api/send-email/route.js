import sgMail from '@sendgrid/mail'
import connectDB from '@/utils/connectDB';
import Lead from '@/utils/schemas'

export async function POST(req){

    sgMail.setApiKey(process.env.SENDGRID_KEY)

    try{
        const {name, email, service, location} = await req.json()
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
            text: `Hello ${name}!I hope all is well over there. I recently had the chance to look at your website and I believe it can be massively improved. My name is Petrus and what I do is help businesses get their website higher within the search results, so when people search for ${service} in ${location}, you're one of the first things they see. That's why I'd like to do full analysis of your website and give you a report of the things that need to be fixed or improved. All for free.If this is something you'd be interested in, please feel free to reach out to me. Or book a meeting herePetrusWeb designer and developer`,
            html: `<main style='display: flex; padding: 2rem; flex-direction: column; gap: 1rem; font-family: Arial, Helvetica, sans-serif;'><header><h1 style='font-size: 1rem; color: black; font-weight: bold; margin: .5rem;'> Hello ${name}!</h1><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>I hope all is well over there. I recently had the chance to look at your website and I believe it can be massively improved. My name is Petrus and what I do is help businesses get their website higher within the search results, so when people search for ${service} in ${location}, you're one of the first things they see.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>That's why I'd like to do full analysis of your website and give you a report of the things that need to be fixed or improved. <strong>All for free.</strong></p><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>If this is something you'd be interested in, please feel free to reach out to me.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'> Or book a meeting <a href="https://cal.com/pendora/30" target="_blank" style="color: blue; text-decoration: underline;">here</a></p></header><section style="display: flex; flex-direction: column; gap: 0;"><p style='font-weight: bold; margin: 0; padding: .5rem;'>Petrus</p><p style='font-weight: normal; color: gray; font-size: small; margin: 0; padding: .5rem;'>Web designer and developer</p></section></main>`
        }

        const result = await sgMail.send(mailOptions)

        console.log(result)
        return Response.json({result}, {status: 200})
    }catch(error){
        console.error(error)
        return Response.json({error}, {status: 500})
    }

}