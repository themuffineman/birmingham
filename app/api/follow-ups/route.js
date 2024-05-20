import { MongoClient } from "mongodb";

export async function POST(req){
    const leadsNumber = req.json()
    try {
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        const intermidaryCollection = client.db('pendora').collection('leads')

        const now = new Date();
        const threeDaysAgoStart = new Date(now);
        threeDaysAgoStart.setDate(now.getDate() - 3);
        threeDaysAgoStart.setHours(0, 0, 0, 0);

        const threeDaysAgoEnd = new Date(now);
        threeDaysAgoEnd.setDate(now.getDate() - 2);
        threeDaysAgoEnd.setHours(0, 0, 0, 0);

        // Find documents created 3 days ago and limit to 100
        const emailDocuments = await intermidaryCollection.find({
            createdAt: {
                $gte: threeDaysAgoStart,
                $lt: threeDaysAgoEnd
            }
        }).limit(leadsNumber).toArray();
        
        return Response.json({leads: emailDocuments}, {status: 200}) 
    } catch (error) {
        return Response.json({error},{status:500})
    }
}