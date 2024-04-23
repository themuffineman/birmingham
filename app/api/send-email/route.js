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
            text: `Hi ${name}, I hope you're doing well! I'm Petrus, and I specialize in creating top-notch websites for architectural and interior design firms. After checking out your website, I believe there's huge potential to elevate its design to convey trust and showcase your expertise even more effectively. That's why I'm reaching out to redesign your homepage for free. This way I can demonstrate how your website could stand out among the best in the industry. If you like the redesign, we can discuss further collaboration. If not, no worries – there's absolutely no obligation or cost involved. If you're interested, simply let me know or book a call using the link here. Looking forward to potentially working together! Best regards, Petrus`,
            html: `<main style='display: flex; padding: 2rem; flex-direction: column; gap: 1rem; font-family: Arial, Helvetica, sans-serif;'><header><h1 style='font-size: 1rem; color: black; font-weight: bold; margin: .5rem;'>Greetings ${name}! </h1><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>I hope all is well. I recently took a look at your website and noticed there's massive opportunity for your website to improve. That's why I'd like to offer you a FREE redesign of your homepage. This way, I can demonstrate how it can drive tangible results for your business. If you like it, we can proceed with further collaboration. If not, there's no obligation, and you won't pay a dime.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .5rem;'>If this is something you'd be interested in feel free to respond or book a meeting <a href="https://cal.com/pendora/30" target="_blank" style="color: blue; text-decoration: underline;">here</a> to talk about your goals and how I can help you achieve them through your website. My name is Petrus by the way I help A/E firms build performant websites</p></header><section style="display: flex; flex-direction: column; gap: 0;"><p style='font-weight: bold; margin: 0; padding: .5rem;'>Petrus</p><p style='font-weight: normal; color: gray; font-size: small; margin: 0; padding: .5rem;'>Web designer and developer</p></section></main>`
        }

        const result = await sgMail.send(mailOptions)

        console.log(result)
        return Response.json({result}, {status: 200})
    }catch(error){
        console.error(error)
        return Response.json({error}, {status: 500})
    }

}