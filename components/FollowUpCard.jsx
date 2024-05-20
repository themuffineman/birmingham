// import React from 'react'
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

// const FollowUpCard = ({name, email}) => {
//   return(
//     <div className='w-[40rem] flex gap-20'>
//         <div className='text-black relative p-1 rounded-sm font-bold text-lg truncate min-w-40 max-w-40 w-40 h-10 ring-2 ring-blue-200 text-center'>
//             {name}
//         </div>
//         <Popover>
//             <PopoverTrigger className='relative'>
//                 <div className='text-black relative p-1 rounded-sm font-bold text-lg truncate min-w-40 max-w-40 w-40 h-10 ring-2 ring-blue-200 text-center'>
//                    Emails
//                 </div>
//                 <p className='absolute font-semibold text-black text-xs -top-[0.65rem] right-[1/2] z-50 translate-x-[1/2] bg-white'>name</p>
//             </PopoverTrigger>
//             <PopoverContent className="w-max h-max max-h-[25rem] flex flex-col gap-2 overflow-auto">
//                 <div className='flex flex-col items-start gap-2 p-2 bg-white w-max'>
//                     {email}
//                 </div>
//             </PopoverContent>
//         </Popover>
//     </div>
//   )
// }

// export default FollowUpCard