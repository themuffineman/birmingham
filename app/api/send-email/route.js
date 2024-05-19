import sgMail from '@sendgrid/mail'
import { MongoClient } from 'mongodb';

export async function POST(req){

    sgMail.setApiKey(process.env.SENDGRID_KEY)

    try{

        const emailData = await req.json()
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        const emailsCollection = client.db('pendora').collection('leads')

        if (typeof emailData.emails[0] !== 'string'){
            throw new Error('Expected Email String');
        }
        if (!emailPattern.test(emailData.emails[0])){
            throw new Error('Invalid Email Format');
        }
        if(!emailData.src){
            throw new Error('Lead Has No src')
        }
        if(!emailData.project){
            throw new Error('Lead Has No Project')
        }
        const dataEmailExists = await emailsCollection.findOne({email: emailData.emails[0]})
        if(dataEmailExists){
            throw new Error('Emails Already Exists')
        }
        
        const mailOptions = {
            to: emailData.emails[0],
            from: {
                name: 'Pendora Studios',
                email: 'pendorastudios@gmail.com'
            },
            subject: 'Would you like help with your website?',
            text: `Greetings ${emailData.name}! I hope you're doing well! I'm Petrus, and I run a web design agency for A/E firms, and I'd love to work with your firm. That's why I went ahead and redesigned a section of your homepage (design is attached below) to demonstrate how your website could stand out among the best in your industry. If you're up for it I can build your firm a new website. If you're interested in this, simply let me know. Looking forward to potentially working together! Best regards Petrus PS: If you'd like to take a different design direction than the one I took, please feel free to let me know as well.`,
            html: `
                <body>
                    <p>Hello ${emailData.name},</p>
                    <p>I recently visited your website and was very impressed by your portfolio, especially the ${emailData.project}. Your work is outstanding!</p>
                    <p>However, I believe your website could be greatly enhanced to better convert visitors into leads and represent your firm in a way that better reflects the quality of your projects and firm.</p>
                    <p>That’s why I would love to offer you a new website design at zero cost. You only pay if you're satisfied with the results. To give you a better idea of what I can offer, I’ve attached a design concept for your homepage that I created.</p>
                    <p>Would you be available for a brief chat to discuss this further?</p>
                    <p>Best regards,<br>Petrus</p>
                </body>
            `,
            attachments:[
                {
                    content: emailData.src,
                    filename: "Website Redesign.jpeg",
                    type: "image/jpeg",
                    disposition: "attachment"

                }
            ]
        }
        const result = await sgMail.send(mailOptions)
        await emailsCollection.insertOne({name: emailData.name, email: emailData.emails[0], url: emailData.url})

        return Response.json({success: result}, {status: 200})

    }catch(error){
        console.error(error)
        return Response.json({error}, {status: 500})
    }

}