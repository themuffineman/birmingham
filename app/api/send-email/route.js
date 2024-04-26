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
        const dataEmailExists = await Lead.findOne({email: email})
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
            text: `Hi ${name}, I hope you're doing well! I'm Petrus, and I specialize in creating top-notch websites for architectural and interior design firms. After checking out your website, I believe there's huge potential to elevate its design to convey trust and showcase your expertise even more effectively. That's why I'm reaching out to redesign your homepage for free. This way I can demonstrate how your website could stand out among the best in the industry. If you like the redesign, we can discuss further collaboration. If not, no worries – there's absolutely no obligation or cost involved. If you're interested, simply let me know or book a call using the link here. Looking forward to potentially working together! Best regards, Petrus`,
            html: `<main style='display: flex; padding: 2rem; flex-direction: column; gap: 1rem; font-family: Arial, Helvetica, sans-serif;'><header><h1 style='font-size: 1rem; color: black; font-weight: bold; margin: .4rem;'>Greetings ${name}! </h1><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>I hope you're doing well! I'm Petrus, and I specialize in creating top-notch websites for architectural and interior design firms.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>After checking out your website, I believe there's huge potential to elevate its design to convey trust and showcase your expertise even more effectively. That's why I'm reaching out to redesign your homepage for free.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>This way I can demonstrate how your website could stand out among the best in the industry. If you like the redesign, we can discuss further collaboration. If not, no worries, there's absolutely no obligation or cost involved.</p><p style='font-size: 1rem; color: black; font-weight: light; margin: .4rem;'>If you're interested, simply let me know or book a call using the link <a href="https://cal.com/pendora/30" target="_blank" style="color: blue; text-decoration: underline;">here</a>. Looking forward to potentially working together!</p></header><section style="display: flex; flex-direction: column; gap: 0;"><p style='font-weight: normal; margin: 0; padding-left: .4rem;'>Best regards</p><p style='font-weight: bold; margin: 0; padding-left: .4rem;'>Petrus</p></section></main>`
        }
        
        const result = await sgMail.send(mailOptions)
        
        const newLead = await Lead.create({
            name: name,
            email: email
        })
        console.log(result)
        return Response.json({result}, {status: 200})
    }catch(error){
        console.error(error)
        return Response.json({error}, {status: 500})
    }

}