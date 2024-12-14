import { otherCompanyPromotions } from "@/utils/sale/otherCompanyPromotion";
import OtherCompanyPromotionInput from "./OtherCompanyPromotionInput";
import { OtherCompanyPromotionResult } from "@/utils/sale/types";

type OtherCompanyPromotionProps = {
  handleOtherCompanyPromotion: (
    promotionResult: OtherCompanyPromotionResult
  ) => void;
};

export default function OtherCompanyPromotion({
  handleOtherCompanyPromotion,
}: OtherCompanyPromotionProps) {
  return (
    <section className="border border-gray-300 rounded p-4 w-full text-black mt-4">
      <h1 className="text-lg font-bold">타사 판촉인원 / 판촉물 및 판촉내용</h1>
      {otherCompanyPromotions.map((promotion) => (
        <OtherCompanyPromotionInput
          key={promotion.id}
          companyName={promotion.name}
          promotionInfo={promotion.info}
          handleOtherCompanyPromotion={handleOtherCompanyPromotion}
        />
      ))}
    </section>
  );
}
