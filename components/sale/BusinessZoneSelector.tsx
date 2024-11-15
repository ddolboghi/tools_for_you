import { businessZones } from "@/utils/sale/businessZones";

type BusinessZoneSelectorProps = {
  selectedBusinessZone: string;
  onSelectBusinessZone: (businessZone: string) => void;
};

export default function BusinessZoneSelector({
  selectedBusinessZone,
  onSelectBusinessZone,
}: BusinessZoneSelectorProps) {
  return (
    <select
      value={selectedBusinessZone}
      onChange={(e) => onSelectBusinessZone(e.target.value)}
      className="text-sm border border-gray-300 rounded p-1"
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
