
export async function POST(req){

    try {
        const leads = await req.json()
        const errorTemplates = leads.map(async (lead)=>{
            const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${lead.name}`)
            const resultJSON = await result.json()
            return {index: lead.index, src: resultJSON.src}
            
        })

        return Response.json({src: src}, {status: 200})
    } catch (error) {
        console.error(error)
        return Response.json({error}, {status:500})
    }
}