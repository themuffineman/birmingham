
export async function POST(req, res){

    try {
        const lead = await req.json()
        console.log('Heres the leads req:', lead)
        const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${lead.tempName}&niche=${lead.niche}`);
        const resultJSON = await result.json();
        if(!resultJSON.src){
            return Response.json({...lead, src: undefined, tempError: true}, {status:200})
        }else{
            return Response.json({...lead, src: resultJSON.src, tempError: false}, {status: 200})
        }
    } catch(error){
        console.error(error)
        return res.status(500).send('Internal Server Error');
    }
}