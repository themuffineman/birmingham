
export async function POST(req){

    try {
        const {name} = await req.json()
        console.log('name is', name)
        const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${name}`)
        const resultJSON = await result.json()
        const src = resultJSON.src

        return Response.json({src: src}, {status: 200})
    } catch (error) {
        console.error(error)
        return Response.json({error}, {status:500})
    }
}