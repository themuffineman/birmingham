
export async function POST(req){

    try {
        let newLeads = []
        const leads = await req.json()
        console.log('Heres the leads req:', leads)
        for (const lead of leads) {
            let resultJSON;
            try {
                const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${lead.TempName}`);
                resultJSON = await result.json();
            } catch (error) {
                console.error(error);
            }finally{
                newLeads.push({...lead, src: resultJSON.src ?? undefined});
            }
        }

        return Response.json({leads: newLeads}, {status: 200})
    } catch (error) {
        console.error(error)
        return Response.json({error}, {status:500})
    }
}