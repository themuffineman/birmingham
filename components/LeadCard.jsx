import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
  

const LeadCard = () => {
  return (
    <div className='flex w-max p-4 '>
        <div className='text-black flex-1 w-full font-medium text-base'>Hello World Inc</div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button>Emails</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max">
                <DropdownMenuLabel>Emails</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex">
                    <div className='text-black flex-1 w-full font-medium text-base'>petrusheya@gmail.com</div>
                    <button className="p-2 w-max flex-1 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-400 hover:text-black hover:bg-red-600">Delete</button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className="w-max">
                <iframe src='https://ui.shadcn.com/docs/components/dialog' className='h-[80vh] w-full'/>
            </DialogContent>
        </Dialog>
        <div className='flex gap-3 items-center'>
            <button className="p-2 w-max flex-1 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-500 hover:text-black hover:bg-yellow-300">Add</button>
            <button className="p-2 w-max flex-1 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-400 hover:text-black hover:bg-red-600">Delete</button>
        </div>
    </div>
  )
}

export default LeadCard