import {
  BskyReport,
  Orders,
  OtherCompanyPromotionResult,
  PromotionStock,
} from "@/utils/sale/types";
import { getTotalOccupancyNumByCompany, getTotalTableNum } from "./calculation";
import { getGalmegiSumByWorker, getOrderSums } from "./order";
import { getReportTitle } from "./commonReports";
import { additionalInfoBusinessZones } from "@/utils/sale/businessZones";
import { getSMReportRows } from "./smReport";

const formatOccupancySection = (bskyReport: BskyReport) =>
  Object.entries(bskyReport)
    .map(([company, drinks]) => {
      const header = `${company}: ${getTotalOccupancyNumByCompany(
        drinks,
        false
      )}t (${getTotalOccupancyNumByCompany(drinks, true)}%)`;
      const lines = Object.entries(drinks).map(
        ([drink, result]) =>
          `  - ${drink}: ${result.tables}t (${result.percentage}%)`
      );
      return [header, ...lines].join("\n");
    })
    .join("\n\n");

export const getBSKYReport = (
  bskyReport: BskyReport,
  totalBisness: number,
  selectedBusinessZone: string,
  orders: Orders,
  additionalOrders: Orders,
  otherCompanyPromotions: OtherCompanyPromotionResult[],
  promotionStocks: PromotionStock[]
) => {
  let workerReportOfOrders = "";
  for (const order of Object.values(orders)) {
    workerReportOfOrders += `${order[0]}: ${order[1] || 0}t(좋은데이) / ${
      order[2] || 0
    }t(부산갈매기) / ${order[3] || 0}t(톡톡)\n`;
  }

  let workerReportOfAdditionalOrders = "";
  for (const order of Object.values(additionalOrders)) {
    workerReportOfAdditionalOrders += `${order[0]}: ${
      order[1] || 0
    }t(좋은데이) / ${order[2] || 0}t(부산갈매기) / ${order[3] || 0}t(톡톡)\n`;
  }

  const orderSums = getOrderSums(orders);
  const additionalOrderSums = getOrderSums(additionalOrders);

  const galmegiSumByWorker = getGalmegiSumByWorker(orders, additionalOrders);
  const formattedGalmegiSumByWorker = Object.entries(galmegiSumByWorker)
    .map(([worker, value]) => `${worker} : ${value}본`)
    .join("\n");

  const formattedPromotions = otherCompanyPromotions
    .map(
      (promotion) =>
        `${promotion.name} ${promotion.workerNumber || 0}명 / ${promotion.info}`
    )
    .join("\n");

  const formattedPromotionStocks = promotionStocks
    .map((stock) => ` - ${stock.name} ${stock.quantity || 0}박스`)
    .join("\n");

  let reportContent = `${getReportTitle(selectedBusinessZone)}
1. 점유비
\u0020\u0020- 총 방문업소: ${totalBisness}개
\u0020\u0020- 총 테이블 수: ${getTotalTableNum(bskyReport)}t\n
${formatOccupancySection(bskyReport)}\n
마. 기타: 0t (0%)\n
2. 전환 및 추가주문\n
가. 근무인원\n
부산 갈매기 총 판매 병 수
${formattedGalmegiSumByWorker}\n
나. 총 전환: ${orderSums[1] || 0}t(좋은데이) / ${
    orderSums[2] || 0
  }t(부산갈매기) / ${orderSums[3] || 0}t(톡톡)
${workerReportOfOrders}
다. 총 추가주문: ${additionalOrderSums[1] || 0}t(좋은데이) / ${
    additionalOrderSums[2] || 0
  }t(부산갈매기) / ${additionalOrderSums[3] || 0}t(톡톡)
${workerReportOfAdditionalOrders}
`;
  if (additionalInfoBusinessZones.includes(selectedBusinessZone)) {
    reportContent += `3. 타사 판촉인원 / 판촉물 및 판촉내용
${formattedPromotions}\n
4. ★자사 판촉물 재고량★ (박스로 기입해서 올려주세요)
${formattedPromotionStocks}`;
  }
  return reportContent;
};

export const getSMReport = (
  bskyReport: BskyReport,
  orders: Orders,
  additionalOrders: Orders
) => {
  const galmegiSums = getGalmegiSums(bskyReport, orders, additionalOrders);

  const totalTableNum = getTotalTableNum(bskyReport);

  const rows = getSMReportRows(bskyReport)
    .map((row) => `${row.label}${row.tables}T - ${row.percentage}%`)
    .join("\n");

  return `<이순조SM 퇴근보고>
1. 야간판촉지역
광안 바닷가
총 테이블 수 : ${totalTableNum}
2. 야간 음용비
${rows}

갈매기 드시던 테이블 ${
    bskyReport["가. 무학"]["부산갈매기"].tables
  },\n갈매기 전/추 ${galmegiSums.order},\n총 ${
    galmegiSums.sale + galmegiSums.order
  }개입니다.`;
};

export const getGalmegiSums = (
  bskyReport: BskyReport,
  orders: Orders,
  additionalOrders: Orders
): { [key: string]: number } => {
  const galmegiSumByWorker = getGalmegiSumByWorker(orders, additionalOrders);
  const galmegiOrderNum = Object.values(galmegiSumByWorker).reduce(
    (sum, value) => sum + value,
    0
  );
  return {
    sale: bskyReport["가. 무학"]["부산갈매기"].tables,
    order: galmegiOrderNum,
  };
};
