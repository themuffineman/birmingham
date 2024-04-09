"use client"
import React, { useEffect, useState } from 'react'
import { DropdownMenuItem, DropdownMenu} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from './ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
  
  

const LeadCard = ({platform = 'google', emails, name, url, index, setLeadsData, screenshot, setEmailsSent}) => {

    const [loading, setLoading] = useState(false)
    const [propEmails, setPropEmails] = useState(emails? emails : [])

   
    async function sendEmail(name, email){
        try {
            setLoading(true)
            const res = await fetch('/api/send-email', {method: "POST" , body: JSON.stringify({name: name, email: email})})
            const confirmation = await res.json()
            if (confirmation.error){
                alert('Error Sending Email')
                throw new Error(confirmation.error)
            }
            console.log('Success Sending Email:', confirmation)
            setEmailsSent(prev => prev++)
            deleteLead() 

        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }
    }   

    function deleteLead(){ 
        setLeadsData((prev)=> [...prev.slice(0, index), ...prev.slice(index + 1)])
    }
    function deleteEmails(emailIndex) {
        setPropEmails(prev => {
          return prev.filter((_, index) => index === emailIndex);
        });
    }

  return (
    <div className='grid grid-row-1 grid-flow-col justify-between items-center justify-items-center ring ring-slate-500 w-[80rem] rounded-md p-4'>
        <div className='text-black font-bold text-lg truncate max-w-40 w-40'>{name}</div>
        <Popover >
            <PopoverTrigger>
                <button className="flex gap-1 bg-neutral-300 rounded-md p-2 text-base font-semibold">
                    Emails
                    <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[15rem] h-max max-h-[25rem] flex flex-col gap-2 overflow-auto">
                    {
                        propEmails?.map((email, index)=>(
                                <div key={email} className="flex gap-4 w-full items-center">
                                    <div className='text-black flex-1 w-full font-semibold text-base'>{email}</div>
                                    <div className='flex gap-3 w-max'>
                                        <button onClick={()=> deleteEmails(index)} className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-green-400 hover:text-black hover:bg-green-600">
                                            Use Email
                                        </button>
                                       
                                    </div>
                                </div>
                        ))
                    }
              
            </PopoverContent>
        </Popover>
        <Dialog className="w-screen relative">
            <DialogTrigger className="flex gap-1 bg-neutral-300 rounded-md p-2 text-base font-semibold">
                Preview
                <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z"/></svg>
            </DialogTrigger>
            <DialogContent className="w-[90vw]">
                <iframe src={url} className='h-[80vh] w-full'/>
            </DialogContent>
        </Dialog>
        <Dialog className="w-screen relative">
            <DialogTrigger className="flex gap-1 bg-neutral-300 rounded-md p-2 text-base font-semibold">
                Screenshot
                <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z"/></svg>
            </DialogTrigger>
            <DialogContent className="w-[20vw]">
                <img src={screenshot} className='w-full'/>
            </DialogContent>
        </Dialog>
        <a className=" flex gap-1 bg-neutral-200 rounded-md p-2 text-base font-semibold" href={url} target='_blank'>
            <span>Open URL</span>
            <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z"/></svg>
        </a>
        <div className="bg-neutral-200 rounded-md p-2 text-base font-semibold" >
            {platform === 'google'? 
            <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="-40.446 -22.19 350.532 133.14"><path d="M115.39 46.71c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/><path d="M163.39 46.71c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/><path d="M209.39 25.87v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/><path d="M224.64 2.53v65h-9.5v-65z" fill="#34A853"/><path d="M261.66 54.01l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/><path d="M34.93 40.94v-9.41h31.71c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C15.96 68.88 0 53.42 0 34.44 0 15.46 15.96 0 34.94 0c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65z" fill="#4285F4"/></svg>:
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="#DD2C00" d="M10.7,32.7c-0.5,0-0.9-0.3-1.2-0.8c-0.2-0.4-0.3-1-0.4-1.7c-0.2-2.2,0-5.5,0.7-6.5c0.3-0.5,0.8-0.7,1.2-0.7c0.3,0,0.6,0.1,7.1,2.8c0,0,1.9,0.8,1.9,0.8c0.7,0.3,1.1,1,1.1,1.8c0,0.8-0.5,1.4-1.2,1.6c0,0-2.7,0.9-2.7,0.9C11.2,32.7,11,32.7,10.7,32.7z M24,36.3c0,6.3,0,6.5-0.1,6.8c-0.2,0.5-0.6,0.8-1.1,0.9c-1.6,0.3-6.6-1.6-7.7-2.8c-0.2-0.3-0.3-0.5-0.4-0.8c0-0.2,0-0.4,0.1-0.6c0.1-0.3,0.3-0.6,4.8-5.9c0,0,1.3-1.6,1.3-1.6c0.4-0.6,1.3-0.7,2-0.5c0.7,0.3,1.2,0.9,1.1,1.6C24,33.5,24,36.3,24,36.3z M22.8,22.9c-0.3,0.1-1.3,0.4-2.5-1.6c0,0-8.1-12.9-8.3-13.3c-0.1-0.4,0-1,0.4-1.4c1.2-1.3,7.7-3.1,9.4-2.7c0.6,0.1,0.9,0.5,1.1,1c0.1,0.6,0.9,12.5,1,15.2C24.1,22.5,23.1,22.8,22.8,22.9z M27.2,25.9c-0.4-0.6-0.4-1.4,0-1.9c0,0,1.7-2.3,1.7-2.3c3.6-5,3.8-5.3,4.1-5.4c0.4-0.3,0.9-0.3,1.4-0.1c1.4,0.7,4.4,5.1,4.6,6.7c0,0,0,0,0,0.1c0,0.6-0.2,1-0.6,1.3c-0.3,0.2-0.5,0.3-7.4,1.9c-1.1,0.3-1.7,0.4-2,0.5c0,0,0-0.1,0-0.1C28.4,26.9,27.6,26.5,27.2,25.9z M38.9,34.4c-0.2,1.6-3.5,5.8-5.1,6.4c-0.5,0.2-1,0.2-1.4-0.2c-0.3-0.2-0.5-0.6-4.1-6.4l-1.1-1.7c-0.4-0.6-0.3-1.4,0.2-2.1c0.5-0.6,1.2-0.8,1.9-0.6c0,0,2.7,0.9,2.7,0.9c6,2,6.2,2,6.4,2.2C38.8,33.4,39,33.9,38.9,34.4z"></path></svg>}
        </div>
        <div className='flex gap-3 items-center '>
            <button onClick={()=> sendEmail(name, emails[0])} className="p-2 w-max flex gap-3 items-center rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-500 hover:text-black hover:bg-yellow-300 text-base font-semibold">
                <span>Add</span>
                {loading && <span className='size-4 rounded-full border-2 border-t-neutral-400 animate-spin'/>}
            </button>
            <div>
                <button onClick={()=> deleteLead()} className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-400 hover:text-black hover:bg-red-600 text-base font-semibold">Delete</button>
            </div>
        </div>
    </div>
  )
}

export default LeadCard