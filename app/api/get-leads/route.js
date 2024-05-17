import { MongoClient } from "mongodb";

export async function GET(){
    try{
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        const intermidaryCollection = client.db('pendora').collection('intermediary')
        const emailDocuments = await intermidaryCollection.find({}).toArray()
        console.log(emailDocuments[1])
        
        return Response.json({leads: emailDocuments}, {status: 200})

    }catch(error){
        console.error(error)
        return Response.json({error: error}, {status: 500})
    }
}