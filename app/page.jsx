"use client"
import LeadCard from "@/components/LeadCard";
import { useRef, useState } from "react";
import styles from '../components/components.module.css'
import Image from "next/image";
import papajohns from '../public/papajohns.jpg'

export default function Home(){
  const pagesRef= useRef(null)
  const [leadsData, setLeadsData] = useState([])
  const [statusUpdate, setStatusUpdate] = useState('Running')
  const [isStatus, setIsStatus] = useState(false)
  const [pagesToScrape, setPagesToScrape] = useState(0)
  const [emailsSent, setEmailsSent] = useState(0)
  const [location, setLocation] = useState('')
  const [service, setService] = useState('')
  const [isEmailAll,setIsEmailAll] = useState(false)
  const [isTemplateAll,setIsTemplateAll] = useState(false)
  const [niche, setNiche] = useState('interior')
  let socket;

  async function fetchLeads(event){
    try {
      event.preventDefault()
      setIsStatus(true)
      socket = new WebSocket('wss://papa-johns.onrender.com/scrape');  

      socket.addEventListener('open', () => {
        setStatusUpdate('WebSocket connection established');
      });


      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        setStatusUpdate(`Failed to connect to WebSocket`);
        setTimeout(()=>{
          setIsStatus(false)
        },3000)
        socket.close()
      });

      socket.addEventListener('close', ()=>{
        setStatusUpdate('Websocket Closed')
        setIsStatus(false)
      })


      socket.addEventListener('message', event => {
        const message = event.data;
        try {
            const data = JSON.parse(message);
            if(data.pages){          // if we recieved a pages object then thats the number of pages to scrape, if not, then its a lead
              setPagesToScrape(data.pages)
            }else{                             
              setLeadsData((prev)=> {
                const copyPrev = prev? JSON.parse(JSON.stringify(prev)) : []
                copyPrev.push(data)
                return copyPrev
              })
              console.log('Received scraped data:', data);
            }
        }catch(error){
          setStatusUpdate(message)  // if its not a json string then its a status update
          console.log('Received status update:', message);
        }
      });

      await fetch(`https://papa-johns.onrender.com/scrape?service=${service}&location=${location}&pageNumber=${pagesRef.current.value}`)  //papa-johns.com
    }catch (error) {
      console.error(error)
    }
  }
  async function sendAllEmails(){
    setIsEmailAll(true)
    const errorLeads = []
    for (const lead of leadsData){
      try {
        const result = await fetch('/api/send-email', {method: "POST", body: JSON.stringify(lead)})
        if (!result.ok){
          throw new Error('Failed to send emails. Server returned ' + result.status + ' ' + result.statusText);
        }
        setEmailsSent(prev=> prev+1)
      }catch(error){
        errorLeads.push(lead)
        console.error('Lead: ', lead.name,'|',error)
      }
    }
    setLeadsData(errorLeads)
    setIsEmailAll(false)
    
  }
  async function generateAllTemplates(){
    setIsTemplateAll(true);
    console.log(niche)
    try {
      let newLeads = []
      for (const lead of leadsData){
        try {
          const result = await fetch('api/get-template', {method:"POST", body: JSON.stringify(lead)});
          const leadResult = await result.json();
          newLeads.push(leadResult);
        } catch (error) {
          console.error(error);
        }
      }
      setLeadsData(newLeads)
    } catch (error) {
      console.error(error);
    } finally {
      setIsTemplateAll(false);
    }
  }
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="text-xl tracking-tighter font-extrabold text-black mb-4 flex flex-col items-center">
        <Image
        src={papajohns}
        width={200}
        height={200}
        priority={true}
        />
      </div>
      <div className="flex gap-5">
        <button className={`w-max p-4 rounded-md bg-neutral-200 text-black text-base ${niche === 'interior'? 'bg-neutral-300 ring-4 ring-blue-400 ': ''}`} onClick={()=> {setNiche('interior')}}>
          Interior Designers
        </button>
        <button className={`w-max p-4 rounded-md bg-neutral-200 text-black text-base ${niche === 'architecture'? 'bg-neutral-300 ring-4 ring-blue-400 ': ''}`} onClick={()=> {setNiche('architecture')}}>
          Architects
        </button>
      </div>
      <form onSubmit={(event)=> fetchLeads(event)} className="w-[74rem] p-4 flex justify-between items-center">
        <div className="w-max flex gap-4 items-center p-2">
          <input onChange={(e)=> setService(e.target.value)} type="text" required={true} className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-md" placeholder="Enter Service"/>
          <input onChange={(e)=> setLocation(e.target.value)} type="text" required={true} className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-md" placeholder="Enter Location"/>
          <input ref={pagesRef} type="number" required={true} className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-20 rounded-md" placeholder="Page#" />
          <div className="p-2 text-black bg-neutral-300 font-semibold w-max rounded-md">Max Pages: {pagesToScrape}</div>
          <div className="p-2 text-black bg-neutral-300 font-semibold w-max rounded-md">Results: {leadsData?.length}</div>
          <div className="p-2 text-black bg-neutral-300 font-semibold w-max rounded-md">Emails Sent: {emailsSent}</div>
        </div>
        <div className="w-max flex flex-col gap-2 justify-between items-center p-2">
          <button type="submit" className="p-2 w-36 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-300 hover:text-black hover:bg-yellow-500">Run</button>
        </div>
      </form>
      <div className="grid grid-cols-1 grid-flow-row gap-4 w-full justify-items-center">
        {leadsData?.map((lead, index)=>(
          <LeadCard key={index} tempError={lead.tempError} niche={niche} project={lead.project} name={lead.name} url={lead.url} emails={lead.emails} index={index} setLeadsData={setLeadsData} setEmailsSent={setEmailsSent} tempName={lead.tempName} src={lead.src? lead.src : ''}/>
        ))}
      </div>
      <div className="flex gap-4 w-max mt-20 ">
        <button onClick={()=> sendAllEmails()} className="p-2 size-max flex gap-2 items-center rounded-md hover:ring active:translate-y-1 transition-transform border-2 border-black hover:ring-black text-white bg-yellow-500 hover:text-black hover:bg-yellow-500">
          Send All Emails
          {isEmailAll && <span className='size-4 rounded-full border-2 border-t-neutral-400 animate-spin'/>}
        </button>
        <button onClick={()=> generateAllTemplates()} className="p-2 size-max flex gap-2 items-center rounded-md hover:ring active:translate-y-1 transition-transform border-2 border-black hover:ring-black text-white bg-yellow-500 hover:text-black hover:bg-yellow-500">
          Generate All Templates
          {isTemplateAll && <span className='size-4 rounded-full border-2 border-t-neutral-400 animate-spin'/>}
        </button>
      </div>
      {isStatus && (
        <div className={`w-max flex justify-between items-center p-3 fixed bottom-4 ${styles.status} left-1/2 -translate-x-1/2 bg-black rounded-md`}>
          <div className="size-5 rounded-full border-2 border-black border-t-white border-b-white animate-spin"/>
          <p className="p-2 text-white text-base font-normal">{statusUpdate}</p>
        </div>
      )}
    </main>
  );
}


