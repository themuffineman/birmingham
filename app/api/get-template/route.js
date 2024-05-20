
export async function POST(req){
    let resultJSON;
    let lead;
    try {
        lead = await req.json()
        console.log('Heres the leads req:', lead)
        const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${lead.tempName}&niche=${lead.niche}`);
        resultJSON = await result.json();
        if(!resultJSON.src){
            throw new Error('Error Fetching Template')
        }
    
        return Response.json({...lead, src: resultJSON.src, tempError: false}, {status: 200})
    } catch(error){
        console.error(error)
        return Response.json({...lead, src: undefined, tempError: true}, {status:200})
    }
}