import { businessZones } from "@/utils/sale/businessZones";

type BusinessZoneSelectorProps = {
  selectedBusinessZone: string;
  handleSelectBusinessZone: (businessZone: string) => void;
};

export default function BusinessZoneSelector({
  selectedBusinessZone,
  handleSelectBusinessZone,
}: BusinessZoneSelectorProps) {
  return (
    <select
      value={selectedBusinessZone}
      onChange={(e) => handleSelectBusinessZone(e.target.value)}
      className="text-sm border border-gray-300 rounded p-1 text-black"
    >
      {businessZones.map((businessZone) => (
        <option
          key={businessZone.id}
          value={businessZone.name}
          className="text-sm"
        >
          {businessZone.name}
        </option>
      ))}
    </select>
  );
}
