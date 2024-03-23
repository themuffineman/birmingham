import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

const LeadCard = () => {
  return (
    <div>
        <div>Hello World Inc</div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button>Emails</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max">
                <DropdownMenuLabel>Emails</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex">
                    <div className='text-black flex-1 w-full font-medium text-base'>petrusheya@gmail.com</div>
                    <button className="p-2 w-max flex-1 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-600 hover:text-black hover:bg-yellow-300">Delete</button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        
        

    </div>
  )
}

export default LeadCard