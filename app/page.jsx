"use client";
import LeadCard from "@/components/LeadCard";
import { useRef, useState } from "react";
import styles from "../components/components.module.css";
import Image from "next/image";
import papajohns from "../public/papajohns.jpg";
import LogInfo from "@/components/LogInfo";
import { Button } from "@/components/ui/button";
const industries = ["Interior Designers", "Architects"];
export default function Home() {
  const pagesRef = useRef(null);

  const [leadsData, setLeadsData] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState("Running");
  const [isStatus, setIsStatus] = useState(false);
  const [pagesToScrape, setPagesToScrape] = useState(935);
  const [emailsSent, setEmailsSent] = useState(335);
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [isEmailAll, setIsEmailAll] = useState(false);
  const [isTemplateAll, setIsTemplateAll] = useState(false);
  const [niche, setNiche] = useState("interior");
  let socket;

  async function fetchLeads(event) {
    try {
      event.preventDefault();
      setIsStatus(true);
      socket = new WebSocket("wss://papa-johns.onrender.com/scrape");

      socket.addEventListener("open", () => {
        setStatusUpdate("WebSocket connection established");
      });

      socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
        setStatusUpdate(`Failed to connect to WebSocket`);
        setTimeout(() => {
          setIsStatus(false);
        }, 3000);
        socket.close();
      });

      socket.addEventListener("close", () => {
        setStatusUpdate("Websocket Closed");
        setIsStatus(false);
      });

      socket.addEventListener("message", (event) => {
        const message = event.data;
        try {
          const data = JSON.parse(message);
          if (data.pages) {
            // if we recieved a pages object then thats the number of pages to scrape, if not, then its a lead
            setPagesToScrape(data.pages);
          } else {
            setLeadsData((prev) => {
              const copyPrev = prev ? JSON.parse(JSON.stringify(prev)) : [];
              copyPrev.push(data);
              return copyPrev;
            });
            console.log("Received scraped data:", data);
          }
        } catch (error) {
          setStatusUpdate(message); // if its not a json string then its a status update
          console.log("Received status update:", message);
        }
      });

      await fetch(
        `https://papa-johns.onrender.com/scrape?service=${service}&location=${location}&pageNumber=${pagesRef.current.value}`
      ); //papa-johns.com
    } catch (error) {
      console.error(error);
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
    console.log(niche);
    try {
      let newLeads = [];
      for (const lead of leadsData) {
        try {
          const result = await fetch(
            `https://html-to-image-nava.onrender.com/screenshot/?name=${lead.tempName}&niche=${niche}`
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
        {industries.map((industry, index) => (
          <button
            key={index}
            className={`w-max p-4 rounded-none font-mono font-bold   text-sm ${
              niche === industry.toLowerCase()
                ? "bg-black text-white ring-2 ring-red-500 "
                : "bg-neutral-200 text-black"
            }`}
            onClick={() => {
              setNiche(industry.toLowerCase());
            }}
          >
            {industry}
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
              placeholder="Page#"
            />
          </div>
        </div>
        <Button className="w-full rounded-none bg-yellow-500">Run</Button>
      </form>
      <div className="grid grid-cols-1 grid-flow-row gap-4 w-full justify-items-center">
        {leadsData?.map((lead, index) => (
          <LeadCard
            key={index}
            tempError={lead.tempError}
            niche={niche}
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

      {isStatus && (
        <div
          className={`w-max flex justify-between items-center p-3 fixed bottom-4 ${styles.status} left-1/2 -translate-x-1/2 bg-black rounded-md`}
        >
          <div className="size-5 rounded-full border-2 border-black border-t-white border-b-white animate-spin" />
          <p className="p-2 text-white text-base font-normal">{statusUpdate}</p>
        </div>
      )}
      <LogInfo data={[pagesToScrape, leadsData.length, emailsSent]} />
    </main>
  );
}
