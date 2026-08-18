import { BskyReport, Orders, OtherCompanyActivity } from "@/utils/sale/types";
import { getTotalOccupancyNumByCompany, getTotalTableNum } from "./calculation";
import {
  formatOrderQuantities,
  getGalmegiSumByWorker,
  getOrderSums,
} from "./order";
import { getReportTitle } from "./commonReports";
import { getSMReportRows } from "./smReport";

const formatOccupancySection = (bskyReport: BskyReport) =>
  Object.entries(bskyReport)
    .map(([company, drinks]) => {
      const header = `${company}: ${getTotalOccupancyNumByCompany(
        drinks,
        false
      )}T (${getTotalOccupancyNumByCompany(drinks, true)}%)`;
      // 주류가 하나면 회사 합계와 그 주류의 값이 언제나 같아 항목 줄이 중복이다.
      // 회사 이름이 아니라 개수로 판정하므로 나중에 주류가 늘면 저절로 맞는다.
      if (Object.keys(drinks).length === 1) return header;
      const lines = Object.entries(drinks).map(
        ([drink, result]) =>
          `  - ${drink}: ${result.tables}T (${result.percentage}%)`
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
  otherCompanyActivities: OtherCompanyActivity[],
  remarks: string
) => {
  let workerReportOfOrders = "";
  for (const order of Object.values(orders)) {
    workerReportOfOrders += `${order[0]}: ${formatOrderQuantities(
      order,
      " / "
    )}\n`;
  }

  let workerReportOfAdditionalOrders = "";
  for (const order of Object.values(additionalOrders)) {
    workerReportOfAdditionalOrders += `${order[0]}: ${formatOrderQuantities(
      order,
      " / "
    )}\n`;
  }

  const orderSums = getOrderSums(orders);
  const additionalOrderSums = getOrderSums(additionalOrders);

  const galmegiSumByWorker = getGalmegiSumByWorker(orders, additionalOrders);
  const formattedGalmegiSumByWorker = Object.entries(galmegiSumByWorker)
    .map(([worker, value]) => `${worker} : ${value}본`)
    .join("\n");

  const formattedActivities = otherCompanyActivities
    .map(
      (activity) =>
        `- ${activity.name}: 대판팀 ${activity.daepanTeam || 0}명 / 행사팀 ${
          activity.haengsaTeam || 0
        }명`
    )
    .join("\n");

  let reportContent = `${getReportTitle(selectedBusinessZone)}
1. 점유비
\u0020\u0020- 총 방문업소: ${totalBisness}개
\u0020\u0020- 총 테이블 수: ${getTotalTableNum(bskyReport)}T\n
${formatOccupancySection(bskyReport)}\n
2. 전환 및 추가주문\n
가. 근무인원\n
부산 갈매기 총 판매 병 수
${formattedGalmegiSumByWorker}\n
나. 총 전환: ${formatOrderQuantities(orderSums, " / ")}
${workerReportOfOrders}
다. 총 추가주문: ${formatOrderQuantities(additionalOrderSums, " / ")}
${workerReportOfAdditionalOrders}
`;
  reportContent += `3. 타사 활동
${formattedActivities}

4. 특이사항
- ${remarks.trim() || "없음"}`;
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
