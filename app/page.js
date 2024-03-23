import LeadCard from "@/components/LeadCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="text-8xl tracking-tighter font-extrabold text-black mb-20">Hello Eugene</div>
      <div className="w-[74rem] p-4 flex justify-between items-center">
        <div className="w-max flex gap-4 items-center p-2">
          <input type="text" className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-md" placeholder="Enter Service"/>
          <input type="text" className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-md" placeholder="Enter Location"/>
        </div>
        <div className="w-max flex justify-between items-center p-2">
          <button className="p-2 w-36 rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-red-600 hover:text-black hover:bg-yellow-300">Run</button>
          <div className="w-max flex justify-between items-center p-2">
            <div className="size-5 rounded-full border-2 border-black border-t-neutral-400 animate-spin"/>
            <p className="p-2 text-black text-base font-normal">Running</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 grid-flow-row gap-4 w-full justify-items-center">
        <LeadCard/>
        <LeadCard/>
      </div>
    </main>
  );
}
