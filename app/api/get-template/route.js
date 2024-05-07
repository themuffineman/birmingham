import { sendStatusCode } from "next/dist/server/api-utils"

export async function GET(req){

    try {
        const name = req.json()
        const result = await fetch(`http://localhost:8080/?name=${name}`)
        const resultJSON = JSON.parse(result)
        const src = resultJSON.src

        return Response.json({src: src}, {status: 200})
    } catch (error) {
        console.error(error)
        return Response.error().status({StatusCode: 500})
    }
}