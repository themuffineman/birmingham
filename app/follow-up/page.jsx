import FollowUpCard from '@/components/FollowUpCard'
import React, { useState } from 'react'

const page = () => {
  const [leads, setLeads] = useState([])
  const [leadsNumber, setLeadsNumber] = useState(10)


  async function fetchLeads(){
    try {
      const leads = await fetch('api/follow-ups', {method:"POST", body: JSON.stringify(leadsNumber)})
      if(!leads.ok){
        throw new Error(leads.statusText)
      }
      const leadsData = leads.json()
      setLeads(leadsData.leads)
    } catch (error) {
      console.log(error)
      alert('Error Fetching Leads')
    }
  }
  return (
    <div className='flex flex-col p-[5rem] items-center justify-center gap-10'>
      <h1 className='text-2xl text-black'>Follow Up Section✌</h1>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <div className='flex gap-2 items-center'>
          <input className='bg-neutral-300 ring-2 ring-blue-300' type="number" placeholder='Leads No.' value={leadsNumber} onChange={(e) => setLeadsNumber(e.target.value) } min={10} max={100}/>
          <button onClick={()=> fetchLeads} className="p-2 w-36 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-300 hover:text-black hover:bg-yellow-500">Fetch Leads</button>
        </div>
        <div className="grid grid-cols-1 grid-flow-row gap-4 w-full justify-items-center">
          {leads?.map((lead)=>(
            <FollowUpCard key={lead.name} name={lead.name} email={lead.email}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page