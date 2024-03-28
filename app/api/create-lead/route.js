import connectDB from "@/utils/connectDB";
import Lead from "@/utils/schemas";

export default async function POST(req, res){
    try{
        const {name, email} = req.body
        await connectDB()
        console.log('Successfully Connected to Database')
        const newLead = await Lead.create({
            name: name,
            email: email
        })
        Response.json({lead: newLead})
    }catch(error){
        console.log(error)
    }
}