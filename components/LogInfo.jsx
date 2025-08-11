import { ChevronDown } from "lucide-react";
import React from "react";

const LogInfo = ({ data }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className={` fixed ${
        isOpen ? "" : "translate-y-[7.4rem]"
      } left-2 z-50 w-52 h-40 bottom-0 flex flex-col items-center  bg-black shadow-lg `}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsOpen(!isOpen);
        }}
        className=" text-black border-t-2 gap-3 p-1  border-x-2 cursor-pointer border-black hover:bg-neutral-100  flex items-center bg-white justify-end w-full mb-2"
      >
        <p className="font-mono">Telemetry</p>
        <ChevronDown />
      </div>
      {data.map((item, index) => (
        <p
          key={index}
          className="text-white w-full font-mono text-sm px-4 mb-2"
        >
          {item}
        </p>
      ))}
    </div>
  );
};

export default LogInfo;
