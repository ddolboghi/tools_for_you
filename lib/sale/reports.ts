import {
  Drink,
  Orders,
  OtherCompanyPromotionResult,
  Percentages,
} from "@/utils/sale/types";
import { translateToKoreanDayOfWeek } from "./dates";
import {
  getGalmegiSums,
  getProviderPercentages,
  getProviderSums,
} from "./sale";
import { getOrderSums } from "./order";

export const getReportTitle = (selectedBusinessZone: string) => {
  const kstDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const month = String(kstDate.getMonth() + 1).padStart(2, "");
  const day = String(kstDate.getDate()).padStart(2, "0");
  const dayOfWeek = translateToKoreanDayOfWeek(kstDate.getDay());
  return `<${month}월 ${day}일 ${dayOfWeek} ${selectedBusinessZone} 상권보고>`;
};

export const getWorkerNames = (orders: Orders) =>
  `- ${Object.values(orders)
    .map((order) => order[0])
    .join(" / ")}`;

export const getReportTables = (drink: Drink) => {
  return {
    goodDay: drink["Muhak"][1] || 0,
    toc: drink["Muhak"][2] || 0,
    galmegi19: drink["Muhak"][3] || 0,
    galmegi16: drink["Muhak"][4] || 0,
    daesun: drink["Daesun"][1] || 0,
    gangali: drink["Daesun"][2] || 0,
    daesunEtc: drink["Daesun"][3] || 0,
    chamisul: drink["Hite"][1] || 0,
    jinro: drink["Hite"][2] || 0,
    jinrogold: drink["Hite"][3] || 0,
    sero: drink["Lotte"][1] || 0,
    serosalgu: drink["Lotte"][2] || 0,
    chungha: drink["Lotte"][3] || 0,
  };
};

export const getReportPercentages = (percentages: Percentages) => {
  return {
    goodDay: percentages["Muhak"][1] ? percentages["Muhak"][1].toFixed(1) : 0,
    toc: percentages["Muhak"][2] ? percentages["Muhak"][2].toFixed(1) : 0,
    galmegi19: percentages["Muhak"][3] ? percentages["Muhak"][3].toFixed(1) : 0,
    galmegi16: percentages["Muhak"][4] ? percentages["Muhak"][4].toFixed(1) : 0,
    daesun: percentages["Daesun"][1] ? percentages["Daesun"][1].toFixed(1) : 0,
    gangali: percentages["Daesun"][2] ? percentages["Daesun"][2].toFixed(1) : 0,
    daesunEtc: percentages["Daesun"][3]
      ? percentages["Daesun"][3].toFixed(1)
      : 0,
    chamisul: percentages["Hite"][1] ? percentages["Hite"][1].toFixed(1) : 0,
    jinro: percentages["Hite"][2] ? percentages["Hite"][2].toFixed(1) : 0,
    jinrogold: percentages["Hite"][3] ? percentages["Hite"][3].toFixed(1) : 0,
    sero: percentages["Lotte"][1] ? percentages["Lotte"][1].toFixed(1) : 0,
    serosalgu: percentages["Lotte"][2] ? percentages["Lotte"][2].toFixed(1) : 0,
    chungha: percentages["Lotte"][3] ? percentages["Lotte"][3].toFixed(1) : 0,
  };
};

export const getReport = (
  isForSm: boolean,
  drink: Drink,
  percentages: Percentages,
  totalBisness: number,
  selectedBusinessZone: string,
  orders: Orders,
  additionalOrders: Orders,
  otherCompanyPromotions: OtherCompanyPromotionResult[]
) => {
  const workerNames = getWorkerNames(orders);

  let workerReportOfOrders = "";
  for (const order of Object.values(orders)) {
    workerReportOfOrders += `${order[0]}: ${order[1] || 0}t(좋은데이) / ${
      order[2] || 0
    }t(톡소다) / ${order[3] || 0}t(부산갈매기19) / ${
      order[4] || 0
    }t(부산갈매기16)\n`;
  }

  let workerReportOfAdditionalOrders = "";
  for (const order of Object.values(additionalOrders)) {
    workerReportOfAdditionalOrders += `${order[0]}: ${
      order[1] || 0
    }t(좋은데이) / ${order[2] || 0}t(톡소다) / ${
      order[3] || 0
    }t(부산갈매기19) / ${order[4] || 0}t(부산갈매기16)\n`;
  }

  const orderSums = getOrderSums(orders);
  const additionalOrderSums = getOrderSums(additionalOrders);

  const reportTables = getReportTables(drink);
  const reportPercentages = getReportPercentages(percentages);

  const providerSums = getProviderSums(drink);
  const providerPercentages = getProviderPercentages(percentages);

  const galmegiSums = getGalmegiSums(drink, orderSums, additionalOrderSums);

  const formattedPromotions = otherCompanyPromotions
    .map(
      (promotion) =>
        `${promotion.name} ${promotion.workerNumber}명 / ${promotion.info}`
    )
    .join("\n");

  if (isForSm) {
    return `<이순조SM 퇴근보고>
1. 야간판촉지역
광안 바닷가
2. 야간 음용비
좋은데이 : ${reportTables.goodDay}T - ${reportPercentages.goodDay}%
좋은데이 톡시리즈 : ${reportTables.toc}T - ${reportPercentages.toc}%
갈매기19 : ${reportTables.galmegi19}T - ${reportPercentages.galmegi19}%
갈매기16 : ${reportTables.galmegi16}T - ${reportPercentages.galmegi16}%
대선 : ${reportTables.daesun}T - ${reportPercentages.daesun}% 
강알리 : ${reportTables.gangali}T - ${reportPercentages.gangali}%
진로 : ${reportTables.jinro}T - ${reportPercentages.jinro}%
진로(골드) : ${reportTables.jinrogold}T - ${reportPercentages.jinrogold}%
참이슬 : ${reportTables.chamisul}T - ${reportPercentages.chamisul}%
C1: T - %
기타
새로: ${reportTables.sero}T - ${reportPercentages.sero}%
새로(살구): ${reportTables.serosalgu}T - ${reportPercentages.serosalgu}%
청하: ${reportTables.chungha}T - ${reportPercentages.chungha}%

갈매기19 드시던 테이블 ${galmegiSums.original19},\n갈매기16 드시던 테이블 ${galmegiSums.original16},\n갈매기19 전/추 ${galmegiSums["19"]},\n갈매기16 전/추 ${galmegiSums["16"]},\n총 ${galmegiSums.total}개입니다.`;
  }

  return `${getReportTitle(selectedBusinessZone)}
1. 점유비
\u0020\u0020- 총 방문업소: ${totalBisness}개
\u0020\u0020- 총 테이블 수: ${providerSums.total}t
가. 무학 : ${providerSums.muhak}t (${providerPercentages.muhak}%)
\u0020\u0020- 좋은데이: ${reportTables.goodDay}t (${reportPercentages.goodDay}%)
\u0020\u0020- 톡시리즈 : ${reportTables.toc}t (${reportPercentages.toc}%)
\u0020\u0020- 부산갈매기19 : ${reportTables.galmegi19}t (${
    reportPercentages.galmegi19
  }%)
\u0020\u0020- 부산갈매기16 : ${reportTables.galmegi16}t (${
    reportPercentages.galmegi16
  }%)
나. 하이트진로 : ${providerSums.hitejinro}t (${providerPercentages.hitejinro}%)
\u0020\u0020- 참이슬 : ${reportTables.chamisul}t (${
    reportPercentages.chamisul
  }%)
\u0020\u0020- 진로 : ${reportTables.jinro}t (${reportPercentages.jinro}%)
\u0020\u0020- 기타(진로골드) : ${reportTables.jinrogold}t (${
    reportPercentages.jinrogold
  }%)
다. 대선주조 : ${providerSums.daesunjujo}t (${providerPercentages.daesunjujo}%)
\u0020\u0020- 대선(C1포함) : ${reportTables.daesun}t (${
    reportPercentages.daesun
  }%)
\u0020\u0020- 강알리 : ${reportTables.gangali}t (${reportPercentages.gangali}%)
\u0020\u0020- 기타 : ${reportTables.daesunEtc}t (${
    reportPercentages.daesunEtc
  }%)
라. 롯데 : ${providerSums.lotte}t (${providerPercentages.lotte}%)
\u0020\u0020- 새로: ${reportTables.sero}t (${reportPercentages.sero}%)
\u0020\u0020- 새로(살구) : ${reportTables.serosalgu}t (${
    reportPercentages.serosalgu
  }%)
\u0020\u0020- 청하(별빛청하 포함) : ${reportTables.chungha}t (${
    reportPercentages.chungha
  }%)
마. 기타 0t (0%)\n
2. 전환 및 추가주문
가. 근무인원
${workerNames}
나. 전환: ${orderSums[1] || 0}t(좋은데이) / ${orderSums[2] || 0}t(톡소다) / ${
    orderSums[3] || 0
  }t(부산갈매기19) / ${orderSums[4] || 0}t(부산갈매기16)
${workerReportOfOrders}
다. 추가주문: ${additionalOrderSums[1] || 0}t(좋은데이) / ${
    additionalOrderSums[2] || 0
  }t(톡소다) / ${additionalOrderSums[3] || 0}t(부산갈매기19) / ${
    additionalOrderSums[4] || 0
  }t(부산갈매기16)
${workerReportOfAdditionalOrders}
3. 타사 판촉인원 / 판촉물 및 판촉내용
${formattedPromotions}
`;
};
