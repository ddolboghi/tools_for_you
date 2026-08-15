import OtherCompanyActivityInput from "./OtherCompanyActivityInput";
import { OtherCompanyActivity } from "@/utils/sale/types";

type OtherCompanyActivitySectionProps = {
  otherCompanyActivities: OtherCompanyActivity[];
  handleOtherCompanyActivity: (
    name: string,
    team: "daepanTeam" | "haengsaTeam",
    value: string
  ) => void;
};

export default function OtherCompanyActivitySection({
  otherCompanyActivities,
  handleOtherCompanyActivity,
}: OtherCompanyActivitySectionProps) {
  return (
    <section className="border border-gray-300 rounded p-4 w-full text-black mt-4">
      <h1 className="text-lg font-bold">타사 활동</h1>
      {otherCompanyActivities.map((activity) => (
        <OtherCompanyActivityInput
          key={activity.name}
          activity={activity}
          handleOtherCompanyActivity={handleOtherCompanyActivity}
        />
      ))}
    </section>
  );
}
