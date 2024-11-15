import {
  AdditionalOrders,
  Drink,
  Orders,
  Percentages,
} from "@/utils/sale/types";
import { translateToKoreanDayOfWeek } from "./dates";
import {
  getAdditionalOrderSums,
  getOrderSums,
  sumPercentages,
  sumTableNum,
} from "./sale";

export const getReportTitle = (selectedBusinessZone: string) => {
  const kstDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const month = String(kstDate.getMonth() + 1).padStart(2, "");
  const day = String(kstDate.getDate()).padStart(2, "0");
  const dayOfWeek = translateToKoreanDayOfWeek(kstDate.getDay());
  return `<${month}월 ${day}일 ${dayOfWeek} ${selectedBusinessZone} 상권보고>`;
};

export const getReportTables = (drink: Drink) => {
  const muhakTotal = sumTableNum(drink["Muhak"]);
  const hiteTotal = sumTableNum(drink["Hite"]);
  const daesunTotal = sumTableNum(drink["Daesun"]);
  const lotteTotal = sumTableNum(drink["Lotte"]);
  const totalTableNum = muhakTotal + hiteTotal + daesunTotal + lotteTotal;
  return {
    sum: {
      muhak: muhakTotal,
      hitejinro: hiteTotal,
      daesunjujo: daesunTotal,
      lotte: lotteTotal,
      total: totalTableNum,
    },
    goodDay: drink["Muhak"][1] || " ",
    toc: drink["Muhak"][2] || " ",
    galmegi: drink["Muhak"][3] || " ",
    daesun: drink["Daesun"][1] || " ",
    gangali: drink["Daesun"][2] || " ",
    daesunEtc: drink["Daesun"][3] || " ",
    chamisul: drink["Hite"][1] || " ",
    jinro: drink["Hite"][2] || " ",
    jinrogold: drink["Hite"][3] || " ",
    sero: drink["Lotte"][1] || " ",
    serosalgu: drink["Lotte"][2] || " ",
    chungha: drink["Lotte"][3] || " ",
  };
};

export const getReportPercentages = (percentages: Percentages) => {
  const muhakPercentage = sumPercentages(percentages["Muhak"]);
  const hitePercentage = sumPercentages(percentages["Hite"]);
  const daesunPercentage = sumPercentages(percentages["Daesun"]);
  const lottePercentage = sumPercentages(percentages["Lotte"]);
  return {
    sum: {
      muhak: muhakPercentage,
      hitejinro: hitePercentage,
      daesunjujo: daesunPercentage,
      lotte: lottePercentage,
    },
    goodDay: percentages["Muhak"][1] ? percentages["Muhak"][1].toFixed(1) : " ",
    toc: percentages["Muhak"][2] ? percentages["Muhak"][2].toFixed(1) : " ",
    galmegi: percentages["Muhak"][3] ? percentages["Muhak"][3].toFixed(1) : " ",
    daesun: percentages["Daesun"][1]
      ? percentages["Daesun"][1].toFixed(1)
      : " ",
    gangali: percentages["Daesun"][2]
      ? percentages["Daesun"][2].toFixed(1)
      : " ",
    daesunEtc: percentages["Daesun"][3]
      ? percentages["Daesun"][3].toFixed(1)
      : " ",
    chamisul: percentages["Hite"][1] ? percentages["Hite"][1].toFixed(1) : " ",
    jinro: percentages["Hite"][2] ? percentages["Hite"][2].toFixed(1) : " ",
    jinrogold: percentages["Hite"][3] ? percentages["Hite"][3].toFixed(1) : " ",
    sero: percentages["Lotte"][1] ? percentages["Lotte"][1].toFixed(1) : " ",
    serosalgu: percentages["Lotte"][2]
      ? percentages["Lotte"][2].toFixed(1)
      : " ",
    chungha: percentages["Lotte"][3] ? percentages["Lotte"][3].toFixed(1) : " ",
  };
};

export const getTotalGalmegi = (
  drink: Drink,
  orders: Orders,
  additionalOrders: AdditionalOrders
) =>
  (drink["Muhak"][3] || 0) +
  getOrderSums(orders)[3] +
  getAdditionalOrderSums(additionalOrders)[3];

export const getReport = (
  isForSm: boolean,
  drink: Drink,
  percentages: Percentages,
  totalBisness: number,
  selectedBusinessZone: string,
  orders: Orders,
  additionalOrders: AdditionalOrders
) => {
  const workerNames = Object.values(orders)
    .map((order) => order.name)
    .join(", ");
  const workers = new Set<string>([]);

  let workerReportOfOrders = "";
  for (const order of Object.values(orders)) {
    workers.add(order["name"] as string);
    workerReportOfOrders += `${order["name"]}: ${
      order["goodDay"] || ""
    }t(좋은데이) / ${order["toctoc"] || ""}t(톡소다) / ${
      order["galmegi"] || ""
    }t(부산갈매기)\n`;
  }

  let workerReportOfAdditionalOrders = "";
  for (const order of Object.values(additionalOrders)) {
    workerReportOfAdditionalOrders += `${order["name"]}: ${
      order["goodDay"] || ""
    }t(좋은데이) / ${order["toctoc"] || ""}t(톡소다) / ${
      order["galmegi"] || ""
    }t(부산갈매기)\n`;
  }

  const orderSums = getOrderSums(orders);
  const additionalOrderSums = getAdditionalOrderSums(additionalOrders);

  const reportTables = getReportTables(drink);
  const reportPercentages = getReportPercentages(percentages);

  if (isForSm) {
    return `<이순조SM 퇴근보고>
1. 야간판촉지역
광안 바닷가
2. 야간 음용비
좋은데이 : ${reportTables.goodDay}T - ${reportPercentages.goodDay}%
좋은데이 톡시리즈 : ${reportTables.toc}T - ${reportPercentages.toc}%
갈매기 : ${reportTables.galmegi}T - ${reportPercentages.galmegi}%
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

갈매기 드시던 테이블까지 ${
      (drink["Muhak"][3] || 0) + orderSums[3] + additionalOrderSums[3]
    }개입니다.`;
  }

  return `${getReportTitle(selectedBusinessZone)}
1. 점유비
\u0020\u0020- 총 방문업소: ${totalBisness}개
\u0020\u0020- 총 테이블 수: ${reportTables.sum.total}t
가. 무학 : ${reportTables.sum.muhak}t (${reportPercentages.sum.muhak}%)
\u0020\u0020- 좋은데이: ${reportTables.goodDay}t (${reportPercentages.goodDay}%)
\u0020\u0020- 톡시리즈 : ${reportTables.toc}t (${reportPercentages.toc}%)
\u0020\u0020- 부산갈매기 : ${reportTables.galmegi}t (${
    reportPercentages.galmegi
  }%)
나. 하이트진로 : ${reportTables.sum.hitejinro}t (${
    reportPercentages.sum.hitejinro
  }%)
\u0020\u0020- 참이슬 : ${reportTables.chamisul}t (${
    reportPercentages.chamisul
  }%)
\u0020\u0020- 진로 : ${reportTables.jinro}t (${reportPercentages.jinro}%)
\u0020\u0020- 기타(진로골드) : ${reportTables.jinrogold}t (${
    reportPercentages.jinrogold
  }%)
다. 대선주조 : ${reportTables.sum.daesunjujo}t (${
    reportPercentages.sum.daesunjujo
  }%)
\u0020\u0020- 대선(C1포함) : ${reportTables.daesun}t (${
    reportPercentages.daesun
  }%)
\u0020\u0020- 강알리 : ${reportTables.gangali}t (${reportPercentages.gangali}%)
\u0020\u0020- 기타 : ${reportTables.daesunEtc}t (${
    reportPercentages.daesunEtc
  }%)
라. 롯데 : ${reportTables.sum.lotte}t (${reportPercentages.sum.lotte}%)
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
  }t(부산갈매기)
${workerReportOfOrders}
다. 추가주문: ${additionalOrderSums[1] || 0}t(좋은데이) / ${
    additionalOrderSums[2] || 0
  }t(톡소다) / ${additionalOrderSums[3] || 0}t(부산갈매기) 
${workerReportOfAdditionalOrders}
`;
};
