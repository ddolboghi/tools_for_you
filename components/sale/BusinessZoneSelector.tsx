import { businessZones } from "@/utils/sale/businessZones";
import { ChevronDown } from "lucide-react";

type BusinessZoneSelectorProps = {
  selectedBusinessZone: string;
  handleSelectBusinessZone: (businessZone: string) => void;
};

import { useState } from "react";

export default function BusinessZoneSelector({
  selectedBusinessZone,
  handleSelectBusinessZone,
}: BusinessZoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (businessZoneName: string) => {
    handleSelectBusinessZone(businessZoneName);
    setIsOpen(false);
  }

  return (
    <div className="relative w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center text-sm border border-gray-300 rounded p-1 text-black w-1/2 text-left"
      >
        {selectedBusinessZone || "상권을 선택해주세요."}
        <ChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && (
        <ul className="absolute w-1/2 border border-gray-300 bg-white max-h-72 overflow-y-auto rounded shadow-md mt-1">
          {businessZones.map((businessZone) => (
            <li
              key={businessZone.id}
              onClick={() => handleSelect(businessZone.name)}
              className="p-2 text-sm hover:bg-gray-200 cursor-pointer"
            >
              {businessZone.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

