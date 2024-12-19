import { PromotionStock } from "@/utils/sale/types";

type PromotionStockReportProps = {
  promotionStocks: PromotionStock[];
};

export default function PromotionStockReport({
  promotionStocks,
}: PromotionStockReportProps) {
  return (
    <section>
      <h1>4. ★자사 판촉물 재고량★ (박스로 기입해서 올려주세요)</h1>
      <div>
        {promotionStocks.map((stock, index) => (
          <p key={`${index}-${stock.name}`}>
            &nbsp;- {stock.name} {stock.quantity || 0}박스
          </p>
        ))}
      </div>
    </section>
  );
}
