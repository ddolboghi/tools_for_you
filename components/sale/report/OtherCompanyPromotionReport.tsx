import { OtherCompanyPromotionResult } from "@/utils/sale/types";

type OtherCompanyPromotionReportProps = {
  otherCompanyPromotions: OtherCompanyPromotionResult[];
};

export default function OtherCompanyPromotionReport({
  otherCompanyPromotions,
}: OtherCompanyPromotionReportProps) {
  return (
    <section>
      <h1>3. 타사 판촉인원 / 판촉물 및 판촉내용</h1>
      <div>
        {otherCompanyPromotions.map((promotion, index) => (
          <p key={`${index}-${promotion.name}`}>
            {promotion.name} {promotion.workerNumber || 0}명 / {promotion.info}
          </p>
        ))}
      </div>
    </section>
  );
}
