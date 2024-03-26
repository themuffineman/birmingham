"use client"
import LeadCard from "@/components/LeadCard";
import { useRef, useState } from "react";
import styles from '../components/components.module.css'

export default function Home() {

  
  const serviceRef = useRef(null)
  const locationRef = useRef(null)
  const [leadsData, setLeadsData] = useState([])
  const [statusUpdate, setStatusUpdate] = useState('Running')
  const [isStatus, setIsStatus] = useState(false)
  
  async function fetchLeads(e){
    try {
      e.preventDefault()
      setIsStatus(true)
      const socket = new WebSocket('ws://localhost:8080');
      socket.addEventListener('open', () => {
          setStatusUpdate('WebSocket connection established');
      });
  
      socket.addEventListener('message', event => {
        const message = event.data;
        try {
            const data = JSON.parse(message);
            setLeadsData((prev)=> [...prev,data])
            console.log('Received scraped data:', data);
        } catch (error) {
            setStatusUpdate(message)
            console.log('Received status update:', message);
        }
      });

      await fetch(`http://localhost:8080/?service=${serviceRef.current.value}&location=${locationRef.current.value}`)
    } catch (error) {
      console.error(error)
    }finally{
      setTimeout(()=>{
        setIsStatus(false)
      },3000)
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="text-8xl tracking-tighter font-extrabold text-black mb-20">There's work to done: <span className="text-neutral-500">Day 2</span></div>
      <form onSubmit={(event)=> fetchLeads(event)} className="w-[74rem] p-4 flex justify-between items-center">
        <div className="w-max flex gap-4 items-center p-2">
          <input ref={serviceRef} type="text" required={true} className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-md" placeholder="Enter Service"/>
          <input ref={locationRef} type="text" required={true} className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-md" placeholder="Enter Location"/>
          <input type="number" min={10} max={100} required={false} className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-28 rounded-md" placeholder="Results #" />
        </div>
        <div className="w-max flex justify-between items-center p-2">
          <button type="submit" className="p-2 w-36 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-600 hover:text-black hover:bg-yellow-300">Run</button>
        </div>
      </form>
      <div className="grid grid-cols-1 grid-flow-row gap-4 w-full justify-items-center">
        {leadsData?.map((lead)=>(
          <LeadCard name={lead.name} url={lead.url} emails={lead.emails} platform="google"/>
        ))}
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

