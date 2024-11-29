"use client";

import { Switch } from "../ui/switch";

type GalmegiSplitSwitchProps = {
  onSplit: boolean;
  handleGalmegiSplit: () => void;
};

export default function GalmegiSplitSwitch({
  onSplit,
  handleGalmegiSplit,
}: GalmegiSplitSwitchProps) {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Switch
        id="galmegi-split-switch"
        checked={onSplit}
        onCheckedChange={handleGalmegiSplit}
      />
      <label
        htmlFor="galmegi-split-switch"
        className={`rounded-md px-1 ${onSplit && " text-neutral-300"}`}
      >
        갈매기16 추가
      </label>
    </div>
  );
}
