
export async function POST(req){

    try {
        let newLeads = []
        const leads = await req.json()
        console.log('Heres the leads req:', leads)
        for (const lead of leads) {
            try {
                const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${lead.name}`);
                const resultJSON = await result.json();
                if (!resultJSON.src) {
                    throw new Error(`Src not found for: ${lead.name}`);
                }
                newLeads.push({ ...lead, src: resultJSON.src });
            } catch (error) {
                console.error(error);
            }
        }


        // const newLeads = await Promise.all(
        //     leads.map(async (lead) => {
        //       try{
        //         const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${lead.name}`);
        //         const resultJSON = await result.json();
        //         if (!resultJSON.src) {
        //           throw new Error('Failed to generate Template');
        //         }
        //         return { ...lead, src: resultJSON.src && resultJSON.src };
        //       }catch (error) {
        //         console.error(error);
        //         return { ...lead, src: undefined };
        //       }
        //     })
        // );
        
        const filteredLeads = newLeads.filter(lead => lead !== undefined)

        return Response.json({leads: filteredLeads}, {status: 200})
    } catch (error) {
        console.error(error)
        return Response.json({error}, {status:500})
    }
}