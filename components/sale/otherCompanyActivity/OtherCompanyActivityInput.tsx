"use client";

import { OtherCompanyActivity } from "@/utils/sale/types";

type OtherCompanyActivityInputProps = {
  activity: OtherCompanyActivity;
  handleOtherCompanyActivity: (
    name: string,
    team: "daepanTeam" | "haengsaTeam",
    value: string
  ) => void;
};

export default function OtherCompanyActivityInput({
  activity,
  handleOtherCompanyActivity,
}: OtherCompanyActivityInputProps) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-x-1 gap-y-1 py-1.5">
      <span className="whitespace-nowrap">{activity.name}:</span>
      <span className="whitespace-nowrap">대판팀</span>
      <input
        type="number"
        pattern="\d*"
        className="border border-gray-300 rounded p-1 w-[48px] min-w-0 text-black"
        value={activity.daepanTeam !== undefined ? activity.daepanTeam : ""}
        placeholder="0"
        onChange={(e) =>
          handleOtherCompanyActivity(activity.name, "daepanTeam", e.target.value)
        }
      />
      <span className="whitespace-nowrap">명 /</span>
      <span className="whitespace-nowrap">행사팀</span>
      <input
        type="number"
        pattern="\d*"
        className="border border-gray-300 rounded p-1 w-[48px] min-w-0 text-black"
        value={activity.haengsaTeam !== undefined ? activity.haengsaTeam : ""}
        placeholder="0"
        onChange={(e) =>
          handleOtherCompanyActivity(
            activity.name,
            "haengsaTeam",
            e.target.value
          )
        }
      />
      <span className="whitespace-nowrap">명</span>
    </div>
  );
}
