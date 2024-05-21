"use client"
import React, {useRef, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'  

const LeadCard = ({tempName, emails, name, url, index, setLeadsData, setEmailsSent, src, niche, tempError}) => {

    const [loading, setLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const newEmail = useRef(null)

    async function sendEmail(name, email){
        try {
            if(!src){
                alert('Template not generated')
                throw new Error('No template')
            }
            setLoading(true)
            const res = await fetch('/api/send-email', {method: "POST" , body: JSON.stringify({name: name, email: email, src: src})})
            const confirmation = await res.json()
            if(confirmation.error){
                alert('Error Sending Email')
                throw new Error(confirmation)
            }
            console.log('Success Sending Email:', confirmation)
            setEmailsSent(prev => prev+1)
            deleteLead(index)

        }catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }
    }   
    function deleteLead(leadIndex){   
        setLeadsData((prev)=> {
            // const copyPrev = JSON.parse(JSON.stringify(prev))
            // copyPrev.splice(LeadIndex, 1)
            // return copyPrev
            const newPrev = prev.filter((_, index)=> leadIndex !== index)
            return newPrev
        });
    }
    function deleteEmails(emailIndex){
        setLeadsData((prev) => {
            // const updatedLeads = [...prev];
            // const leadCopy = { ...updatedLeads[index] };
            // const emailToKeep = leadCopy.emails[emailIndex];
            // leadCopy.emails = [emailToKeep];
            // updatedLeads[index] = leadCopy;
            // return updatedLeads;

            const newLeads = prev.map((lead,leadIndex)=>{
                if(leadIndex === index){
                    const newEmails = lead.emails.filter((_,index)=> index === emailIndex )
                    return {...lead, emails: newEmails}
                }else{
                    return lead
                }
            })
            return newLeads
        });
    }
    function editEmails(text){
        setLeadsData((prev) => {


            const newLeads = prev.map((lead, leadIndex)=>{
                if(leadIndex === index){
                    return {...lead, emails: [`${text}`]}
                }else{
                    return lead
                }
            })
            return newLeads 


        });
    }
    function editName(newName){
        setLeadsData((prev)=>{
            const newLead = prev.map((lead, leadIndex)=>{
                if(index === leadIndex){
                    return {...lead, name: newName}
                }else{
                    return lead
                }
            })
            return newLead;
        })
    }
    async function getTemplate(){
        try {
            setImageLoading(true)
            const result = await fetch(`https://html-to-image-nava.onrender.com/screenshot/?name=${tempName}&niche=${niche}`)
            const resultJSON = await result.json()
            setLeadsData((prev)=>{
                const newLeads = prev.map((lead, leadIndex)=>{
                    if(leadIndex === index){
                        return {...lead, src: resultJSON.src}
                    }else{
                        return lead
                    }
                })
                return newLeads
            })
        } catch (error) {
            console.error(error)
            alert('Failed to generate image')
        }finally{
            setImageLoading(false)
        }
    }
    function editTempName(name){
        setLeadsData((prev)=>{
            const newLead = prev.map((lead, leadIndex)=>{
                if(index === leadIndex){
                    return {...lead, tempName:name}
                }else{
                    return lead
                }
            })
            return newLead;
        })
    }

  return (
    <div className={`${tempError && 'bg-red-500 animate-pulse'} grid grid-row-1 grid-flow-col justify-between items-center justify-items-center ring ring-slate-500 w-[80rem] rounded-md p-4`}>
        <Popover>
            <PopoverTrigger className='relative'>
                <div className='text-black relative p-1 rounded-sm font-bold text-lg truncate min-w-40 max-w-40 w-40 h-10 ring-2 ring-blue-200 text-center'>
                   {name}
                </div>
                <p className='absolute font-semibold text-black text-xs -top-[0.65rem] right-[1/2] z-50 translate-x-[1/2] bg-white'>name</p>
            </PopoverTrigger>
            <PopoverContent className="w-max h-max max-h-[25rem] flex flex-col gap-2 overflow-auto">
                <div className='flex flex-col items-start gap-2 p-2 bg-white w-max'>
                    <input value={name} onChange={(e)=> editName(e.target.value)} type="text" className='w-full p-2 bg-neutral-300' />
                </div>
            </PopoverContent>
        </Popover>
        <Popover>
            <PopoverTrigger>
                <div className="flex gap-1 bg-neutral-300 rounded-md p-2 text-base font-semibold">
                    Temp-Name
                    <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-max h-max max-h-[25rem] flex flex-col gap-2 overflow-auto">
                <div className='flex flex-col items-start gap-2 p-2 bg-white w-max'>
                    <p className='text-black text-base w-full '>{name}</p>
                    <input value={tempName} onChange={(e)=> editTempName(e.target.value)} type="text" className='w-full p-2 bg-neutral-300' />
                </div>
            </PopoverContent>
        </Popover>
        <Dialog className="w-screen relative">
            <DialogTrigger className="flex gap-1 bg-neutral-300 rounded-md p-2 text-base font-semibold">
                Template
                <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z"/></svg>
            </DialogTrigger>
            <DialogContent className="w-[90vw] h-[90vh] overflow-hidden">
                <img
                    alt='templateImage'
                    src={`data:image/jpeg;base64,${src}`}
                    className='size-full object-cover'
                />
            </DialogContent>
        </Dialog>
        <Popover>
            <PopoverTrigger>
                <div className="flex gap-1 bg-neutral-300 rounded-md p-2 text-base font-semibold">
                    Emails
                    <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-max h-max max-h-[25rem] flex flex-col gap-2 overflow-auto">
                {
                    emails?.map((email, index)=>(
                        <div key={email} className="flex gap-4 w-full items-center">
                            <div className='text-black flex-1 w-full font-semibold text-base'>{email}</div>
                            <div className='flex gap-3 w-max'>
                                {
                                    emails?.length === 1 &&(
                                        <Popover>
                                            <PopoverTrigger>
                                                <button className='p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-green-400 hover:text-black hover:bg-green-600'>Edit Email</button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div className='flex flex-col items-start gap-2 p-2 bg-white w-full'>
                                                    <input ref={newEmail} type="text" className='w-full p-2 bg-neutral-300' />
                                                    <button onClick={()=> editEmails(newEmail.current.value)} className='p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-green-400 hover:text-black hover:bg-green-600'>Submit</button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }
                                {
                                    emails?.length !== 1 && (
                                        <button onClick={()=> deleteEmails(index)} className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-green-400 hover:text-black hover:bg-green-600">
                                            Use Email
                                        </button>
                                    )
                                }
                                
                            </div>
                        </div>
                    ))
                }
            </PopoverContent>
        </Popover>
        <a className=" flex gap-1 bg-neutral-200 rounded-md p-2 text-base font-semibold" href={url} target='_blank'>
            <span>Open URL</span>
            <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z"/></svg>
        </a>
        <div className='flex gap-3 items-center '>
            <button onClick={() => getTemplate()} className="p-2 w-max flex gap-3 items-center rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-500 hover:text-black hover:bg-yellow-300 text-base font-semibold">
                <span>Generate Template </span>
                {imageLoading && <span className='size-4 rounded-full border-2 border-t-neutral-400 animate-spin'/>}
            </button>
            {/* <button onClick={()=> sendEmail(name, emails[0])} className="p-2 w-max flex gap-3 items-center rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-500 hover:text-black hover:bg-yellow-300 text-base font-semibold">
                <span>Send Email</span>
                {loading && <span className='size-4 rounded-full border-2 border-t-neutral-400 animate-spin'/>}
            </button> */}
            <div>
                <button onClick={()=> deleteLead(index)} className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-400 hover:text-black hover:bg-red-600 text-base font-semibold">Delete</button>
            </div>
        </div>
    </div>
  )
}

export default LeadCard