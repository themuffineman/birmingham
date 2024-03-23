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
    <div className='flex justify-between items-center ring ring-slate-500 w-[60rem] rounded-md p-4'>
        <div className='text-black font-bold text-lg'>Hello World Inc</div>
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <button className="bg-neutral-300 rounded-md p-2 text-base font-semibold">Check Emails</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max">
                <DropdownMenuLabel>Emails</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-4">
                    <div className='text-black flex-1 w-full font-semibold text-base'>petrusheya@gmail.com</div>
                    <button className="p-2 w-max flex-1 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-400 hover:text-black hover:bg-red-600">Delete</button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Dialog className="w-screen relative">
            <DialogTrigger className="bg-neutral-300 rounded-md p-2 text-base font-semibold">Preview Url</DialogTrigger>
            <DialogContent className="w-[90vw]">
                <iframe src='https://ui.shadcn.com/docs/components/dialog' className='h-[80vh] w-full'/>
            </DialogContent>
        </Dialog>
        <div className='flex gap-3 items-center'>
            <button className="p-2 w-max flex-1 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-yellow-500 hover:text-black hover:bg-yellow-300 text-base font-semibold">Add</button>
            <button className="p-2 w-max flex-1 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-400 hover:text-black hover:bg-red-600 text-base font-semibold">Delete</button>
        </div>
    </div>
  )
}

export default LeadCard