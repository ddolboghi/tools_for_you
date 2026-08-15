import { OtherCompanyActivity } from "@/utils/sale/types";

type OtherCompanyActivityReportProps = {
  otherCompanyActivities: OtherCompanyActivity[];
};

export default function OtherCompanyActivityReport({
  otherCompanyActivities,
}: OtherCompanyActivityReportProps) {
  return (
    <section>
      <h1>3. 타사 활동</h1>
      <div>
        {otherCompanyActivities.map((activity) => (
          <p key={activity.name}>
            - {activity.name}: 대판팀 {activity.daepanTeam || 0}명 / 행사팀{" "}
            {activity.haengsaTeam || 0}명
          </p>
        ))}
      </div>
    </section>
  );
}
