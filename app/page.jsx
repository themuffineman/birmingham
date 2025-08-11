"use client";
import LeadCard from "@/components/LeadCard";
import { useRef, useState } from "react";
import LogInfo from "@/components/LogInfo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
const industries = ["Interior Designers", "Architects"];
//table for leads and env var for backednd url
export default function Home() {
  const pagesRef = useRef(null);

  const [leadsData, setLeadsData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [pagesToScrape, setPagesToScrape] = useState(935);
  const [emailsSent, setEmailsSent] = useState(335);
  const [location, setLocation] = useState("");
  const [isEmailAll, setIsEmailAll] = useState(false);
  const [isTemplateAll, setIsTemplateAll] = useState(false);
  const [service, setService] = useState("interior");
  let socket;

  async function fetchLeads(event) {
    try {
      event.preventDefault();
      setIsStatus(true);
      socket = new WebSocket(
        `wss://papa-johns.onrender.com/scrape?location=${location}&service=${service}`
      );

      socket.addEventListener("open", () => {
        toast.info("Connection established");
      });

      socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
        toast.info(`Failed to establish connection: ${error.message}`);
        socket.close();
      });

      socket.addEventListener("close", () => {
        toast.info("Connection Closed");
        setIsLoading(false);
      });

      socket.addEventListener("message", (event) => {
        const message = event.data;
        const data = JSON.parse(message);
        if (data.type === "count") {
          setPagesToScrape(data.message);
        } else if (data.type === "lead") {
          setLeadsData((prev) => [...prev, data.message]);
          toast.success(`Lead Added`, {
            description: `${data.message}`,
          });
        } else if (data.type === "status") {
          toast.info(data.message);
        } else if (data.type === "error") {
          toast.error(data.message);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error(`An error occurred while fetching leads`, {
        description: error.message,
      });
    }
  }
  async function sendAllEmails() {
    setIsEmailAll(true);
    const errorLeads = [];
    for (const lead of leadsData) {
      try {
        const result = await fetch("/api/send-email", {
          method: "POST",
          body: JSON.stringify(lead),
        });
        if (!result.ok) {
          throw new Error(
            "Failed to send emails. Server returned " +
              result.status +
              " " +
              result.statusText
          );
        }
        setEmailsSent((prev) => prev + 1);
      } catch (error) {
        errorLeads.push(lead);
        console.error("Lead: ", lead.name, "|", error);
      }
    }
    setLeadsData(errorLeads);
    setIsEmailAll(false);
  }
  async function generateAllTemplates() {
    setIsTemplateAll(true);
    try {
      let newLeads = [];
      for (const lead of leadsData) {
        try {
          const result = await fetch(
            `https://html-to-image-nava.onrender.com/screenshot/?name=${lead.tempName}&service=${service}`
          );
          if (!result.ok) {
            newLeads.push({ ...lead, src: undefined, tempError: true });
          } else {
            const leadResult = await result.json();
            newLeads.push({ ...lead, src: leadResult.src, tempError: false });
          }
        } catch (error) {
          console.error(error);
          newLeads.push(lead);
        }
      }
      setLeadsData(newLeads);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTemplateAll(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 pt-5">
      <div className="text-xl tracking-tighter font-extrabold text-black mb-4 flex flex-col items-center">
        <h1 className="relative text-center z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-6xl">
          Google Maps <br />
          Leads Scraper
        </h1>
      </div>
      <div className="flex gap-5">
        {industries.map((item, index) => (
          <button
            key={index}
            className={`w-max p-4 rounded-none font-mono font-bold   text-sm ${
              service === item.toLowerCase()
                ? "bg-black text-white ring-2 ring-red-500 "
                : "bg-neutral-200 text-black"
            }`}
            onClick={() => {
              setService(item.toLowerCase());
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => fetchLeads(event)}
        className="w-max p-4 flex justify-center flex-col gap-2 items-center"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-start gap-2 flex-col">
            <p className="text-sm font-bold">Enter Location</p>
            <input
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              required={true}
              className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-none focus-visible:border-red-500"
              placeholder="Enter Location"
            />
          </div>
          <div className="flex items-start gap-2 flex-col">
            <p className="text-sm font-bold">Enter Page Number</p>

            <input
              ref={pagesRef}
              type="number"
              min={1}
              required={true}
              className="p-2 text-black bg-neutral-300 focus:ring-1 focus:ring-black w-60 rounded-none focus-visible:border-red-500"
              placeholder="Page Number"
            />
          </div>
        </div>
        <Button className="w-full rounded-none transition-transform active:translate-y-1 bg-yellow-500">
          Run {isLoading && <Loader2 className="stroke-black animate-spin " />}
        </Button>
      </form>
      <div className="grid grid-cols-1 grid-flow-row gap-4 w-full justify-items-center">
        {leadsData?.map((lead, index) => (
          <LeadCard
            key={index}
            tempError={lead.tempError}
            niche={service}
            project={lead.project}
            name={lead.name}
            url={lead.url}
            emails={lead.emails}
            index={index}
            setLeadsData={setLeadsData}
            setEmailsSent={setEmailsSent}
            tempName={lead.tempName}
            src={lead.src ? lead.src : ""}
          />
        ))}
      </div>

      {leadsData.length > 0 && (
        <div className="flex gap-4 w-max mt-20 ">
          <Button
            onClick={() => sendAllEmails()}
            variant="secondary"
            className="border-2 rounded-none border-black hover:bg-black hover:text-white"
          >
            Send All Emails
            {isEmailAll && (
              <span className="size-4 rounded-full border-2 border-t-neutral-400 animate-spin" />
            )}
          </Button>
          <Button
            onClick={() => generateAllTemplates()}
            variant="secondary"
            className="border-2 rounded-none border-black hover:bg-black hover:text-white"
          >
            Generate All Templates
            {isTemplateAll && (
              <span className="size-4 rounded-full border-2 border-t-neutral-400 animate-spin" />
            )}
          </Button>
        </div>
      )}

      <LogInfo data={[pagesToScrape, leadsData.length, emailsSent]} />
    </main>
  );
}
