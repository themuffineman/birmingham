"use client";
import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Globe, Loader2, Mail, MailCheck, Webhook } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const LeadCard = ({
  tempName,
  emails,
  name,
  url,
  index,
  setLeadsData,
  setEmailsSent,
  src,
  niche,
  tempError,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const newEmail = useRef(null);
  if (!emails || emails.length === 0) {
    return null;
  }

  async function sendEmail(name, email) {
    try {
      if (!src) {
        alert("Template not generated");
        throw new Error("No template");
      }
      setLoading(true);
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({ name: name, email: email, src: src }),
      });
      const confirmation = await res.json();
      if (confirmation.error) {
        alert("Error Sending Email");
        throw new Error(confirmation);
      }
      console.log("Success Sending Email:", confirmation);
      setEmailsSent((prev) => prev + 1);
      deleteLead(index);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  function deleteLead(leadIndex) {
    setLeadsData((prev) => {
      // const copyPrev = JSON.parse(JSON.stringify(prev))
      // copyPrev.splice(LeadIndex, 1)
      // return copyPrev
      const newPrev = prev.filter((_, index) => leadIndex !== index);
      return newPrev;
    });
  }
  function deleteEmails(emailIndex) {
    setLeadsData((prev) => {
      // const updatedLeads = [...prev];
      // const leadCopy = { ...updatedLeads[index] };
      // const emailToKeep = leadCopy.emails[emailIndex];
      // leadCopy.emails = [emailToKeep];
      // updatedLeads[index] = leadCopy;
      // return updatedLeads;

      const newLeads = prev.map((lead, leadIndex) => {
        if (leadIndex === index) {
          const newEmails = lead.emails.filter(
            (_, index) => index === emailIndex
          );
          return { ...lead, emails: newEmails };
        } else {
          return lead;
        }
      });
      return newLeads;
    });
  }
  function editEmails(text) {
    setLeadsData((prev) => {
      const newLeads = prev.map((lead, leadIndex) => {
        if (leadIndex === index) {
          return { ...lead, emails: [`${text}`] };
        } else {
          return lead;
        }
      });
      return newLeads;
    });
  }
  function editName(newName) {
    setLeadsData((prev) => {
      const newLead = prev.map((lead, leadIndex) => {
        if (index === leadIndex) {
          return { ...lead, name: newName };
        } else {
          return lead;
        }
      });
      return newLead;
    });
  }
  async function getTemplate() {
    try {
      setImageLoading(true);
      const result = await fetch(
        `https://html-to-image-production-4cb8.up.railway.app/screenshot?name=${tempName}&niche=${niche}`
      );
      const resultJSON = await result.json();
      setLeadsData((prev) => {
        const newLeads = prev.map((lead, leadIndex) => {
          if (leadIndex === index) {
            return { ...lead, src: resultJSON.src };
          } else {
            return lead;
          }
        });
        return newLeads;
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate image");
    } finally {
      setImageLoading(false);
    }
  }
  function editTempName(name) {
    setLeadsData((prev) => {
      const newLead = prev.map((lead, leadIndex) => {
        if (index === leadIndex) {
          return { ...lead, tempName: name };
        } else {
          return lead;
        }
      });
      return newLead;
    });
  }

  return (
    <div
      className={`${
        tempError && "bg-red-500 animate-pulse"
      } grid grid-row-1 grid-flow-col justify-between items-center justify-items-center border border-black w-max gap-4 rounded-none bg-white p-4`}
    >
      <Popover>
        <PopoverTrigger className="relative rounded-none">
          <div className="text-black relative p-1 rounded-none font-bold text-lg truncate min-w-40 max-w-40 w-40 h-10 ring-2 ring-blue-200 text-center">
            {name}
          </div>
          <p className="absolute font-semibold text-black text-xs -top-[0.65rem] right-[1/2] z-50 translate-x-[1/2] bg-white">
            name
          </p>
        </PopoverTrigger>
        <PopoverContent className="w-max h-max rounded-none max-h-[25rem] flex flex-col gap-2 overflow-auto">
          <div className="flex flex-col items-start gap-2 p-2 bg-white w-max">
            <input
              value={name}
              onChange={(e) => editName(e.target.value)}
              type="text"
              className="w-full p-2 bg-neutral-300"
            />
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <div className="flex gap-1 bg-neutral-100 border border-black rounded-none p-2 text-sm font-semibold">
            Name on Template
            <Mail />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-max h-max rounded-none max-h-[25rem] flex flex-col gap-2 overflow-auto">
          <div className="flex flex-col items-start gap-2 p-2 bg-white w-max">
            <p className="text-black text-base w-full ">{name}</p>
            <input
              value={tempName}
              onChange={(e) => editTempName(e.target.value)}
              type="text"
              className="w-full p-2 bg-neutral-300"
            />
          </div>
        </PopoverContent>
      </Popover>
      <Dialog className="w-screen relative">
        <DialogTrigger className="flex gap-1 bg-neutral-100 border border-black rounded-none p-2 text-base font-semibold">
          Template
          <Globe />
        </DialogTrigger>
        <DialogContent className="w-[90vw] rounded-none h-[90vh] overflow-hidden">
          <img
            alt="templateImage"
            src={`data:image/jpeg;base64,${src}`}
            className="size-full object-cover"
          />
        </DialogContent>
      </Dialog>
      <Popover>
        <PopoverTrigger>
          <div className="flex gap-1 bg-neutral-100 border border-black rounded-none p-2 text-base font-semibold">
            Emails
            <MailCheck />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-max rounded-none h-max max-h-[25rem] flex flex-col gap-2 overflow-auto">
          {emails?.map((email, index) => (
            <div key={email} className="flex gap-4 w-full items-center">
              <div className="text-black flex-1 w-full font-semibold text-base">
                {email}
              </div>
              <div className="flex gap-3 w-max">
                {emails?.length === 1 && (
                  <Popover>
                    <PopoverTrigger>
                      <button className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-green-400 hover:text-black hover:bg-green-600">
                        Edit Email
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col items-start gap-2 p-2 bg-white w-full">
                        <input
                          ref={newEmail}
                          type="text"
                          className="w-full p-2 bg-neutral-300"
                        />
                        <button
                          onClick={() => editEmails(newEmail.current.value)}
                          className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-green-400 hover:text-black hover:bg-green-600"
                        >
                          Submit
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                {emails?.length !== 1 && (
                  <button
                    onClick={() => deleteEmails(index)}
                    className="p-2 w-max rounded-md hover:ring active:translate-y-1 transition-transform hover:ring-black text-white bg-green-400 hover:text-black hover:bg-green-600"
                  >
                    Use Email
                  </button>
                )}
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <a
        className=" flex gap-1 bg-neutral-100 border border-black rounded-none p-2 text-base font-semibold"
        href={url}
        target="_blank"
      >
        <span>Open URL</span>
        <svg
          className="fill-black"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
        </svg>
      </a>
      <div className="flex gap-3 items-center ">
        <Button
          onClick={() => getTemplate()}
          className="p-2 w-max flex gap-3 items-center rounded-none active:translate-y-1 transition-transform  text-white bg-yellow-500 border border-black hover:text-black hover:bg-yellow-300 text-base font-semibold"
        >
          <span>Generate Template </span>
          {imageLoading && <Loader2 className="animate-spin" />}
        </Button>

        <div>
          <button
            onClick={() => deleteLead(index)}
            className="p-2 w-max rounded-none  active:translate-y-1 transition-transform border border-black text-white bg-red-400 hover:text-black hover:bg-red-600 text-base font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
