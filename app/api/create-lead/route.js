import connectDB from "@/utils/connectDB";
import Lead from "@/utils/schemas";

export async function POST(req){
    try{
        const {name, email} = await req.json()
        await connectDB()
        console.log('Successfully Connected to Database')
        const newLead = await Lead.create({
            name: name,
            email: email
        })
        return Response.json({lead: newLead})
    
    }catch(error){
        console.error(error)
        return Response.json({error})
    }
}