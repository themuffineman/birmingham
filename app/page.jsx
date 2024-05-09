"use client"
import LeadCard from "@/components/LeadCard";
import { useState } from "react";
import styles from '../components/components.module.css'
import Image from "next/image";
import papajohns from '../public/papajohns.jpg'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function Home() {
  // const pagesRef= useRef(null)
  // const [statusUpdate, setStatusUpdate] = useState('Running')
  // const [pagesToScrape, setPagesToScrape] = useState(0)
  // const [location, setLocation] = useState('')
  // const [service, setService] = useState('')
  // const [websocketLive, setWebsocketLive] = useState(false)
  const [isStatus, setIsStatus] = useState(false)
  const [emailsSent, setEmailsSent] = useState(0)
  const [leadsData, setLeadsData] = useState([])
  let socket;


  async function fetchLeads(){
    try {
      setIsStatus(true)
      const response = await fetch('/api/get-leads')
      const responseJSON = await response.json()
      setLeadsData(responseJSON.leads)
    } catch (error) {
      console.error(error)
      alert("Error fetching leads from db")
    }finally{
      setIsStatus(false)
    }
  }

  async function createLeads(){
    fetch('https://papa-johns.onrender.com/leads')
  }

  // async function fetchLeads(event){
  //   try {
  //     event.preventDefault()
  //     setIsStatus(true)
  //     socket = new WebSocket('wss://papa-johns.onrender.com/scrape');  
  //     socket.addEventListener('open', () => {
  //       setWebsocketLive(true)
  //       setStatusUpdate('WebSocket connection established');
  //     });
  //     socket.addEventListener('error', (error) => {
  //       console.error('WebSocket error:', error);
  //       setStatusUpdate(`Failed to connect to WebSocket`);
  //     });
  //     socket.addEventListener('message', event => {
  //       const message = event.data;
  //       try {
  //           const data = JSON.parse(message);
  //           if(data.pages){          // if we recieved a pages object then thats the number of pages to scrape, if not, then its a lead
  //             setPagesToScrape(data.pages)
  //           }else{                             
  //             setLeadsData((prev)=> {
  //               const copyPrev = prev? JSON.parse(JSON.stringify(prev)) : []
  //               copyPrev.push(data)
  //               return copyPrev
  //             })
  //             console.log('Received scraped data:', data);
  //           }
  //       }catch(error){
  //         setStatusUpdate(message)  // if its not a json string then its a status update
  //         console.log('Received status update:', message);
  //       }
  //     });

  //     await fetch(`https://papa-johns.onrender.com/scrape?service=${service}&location=${location}&pageNumber=${pagesRef.current.value}`)  //papa-johns.com
  //   }catch (error) {
  //     console.error(error)
  //   }finally{
  //     socket.close()
  //     setWebsocketLive(false)
  //     setTimeout(()=>{
  //       setIsStatus(false)
  //     },3000)
  //   }
  // }
  // function closeWebsocket(){
  //   if (socket) {
  //     socket.close();
  //     console.log('WebSocket connection closed manually');
  //   }
  // }
  
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
      <div className="w-max flex gap-4 items-center p-2">
        <div className="p-2 text-black bg-neutral-300 font-semibold w-max rounded-md">Results: {leadsData?.length}</div>
        <div className="p-2 text-black bg-neutral-300 font-semibold w-max rounded-md">Emails Sent: {emailsSent}</div>
        <button onClick={()=> fetchLeads()} className="p-2 w-36 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-300 hover:text-black hover:bg-yellow-500">Fetch Leads</button>
        <Popover>
            <PopoverTrigger>
              <div className="p-2 w-36 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-700 hover:text-black hover:bg-yellow-500">Create Leads</div>                
            </PopoverTrigger>
            <PopoverContent className="w-max h-max max-h-[25rem] flex flex-col gap-2 overflow-auto">
              <button onClick={()=> createLeads()} className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-300 hover:text-black hover:bg-yellow-500">Are you sure?</button>                
            </PopoverContent>
        </Popover>
      </div>
      {/* <form onSubmit={(event)=> fetchLeads(event)} className="w-[74rem] p-4 flex justify-between items-center">
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
          {
            websocketLive && <button onClick={()=> closeWebsocket()} className="p-2 w-36 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-500 hover:text-black hover:bg-red-600">Cancel</button>
          }
        </div>
      </form> */}
      <div className="grid grid-cols-1 grid-flow-row gap-4 w-full justify-items-center">
        {leadsData?.map((lead, index)=>(
          <LeadCard key={index} name={lead.name} url={lead.url} emails={lead.emails} index={index} setLeadsData={setLeadsData} platform="google" setEmailsSent={setEmailsSent}/>
        ))}
      </div>
      {isStatus && (
        <div className={`w-max flex justify-between items-center p-3 fixed bottom-4 ${styles.status} left-1/2 -translate-x-1/2 bg-black rounded-md`}>
          <div className={`${styles.spin} size-5 rounded-full border-2 border-black border-t-white border-b-white animate-spin`}/>
          <p className="p-2 text-white text-base font-normal">Fetching Leads</p>
        </div>
      )}
    </main>
  );
}


