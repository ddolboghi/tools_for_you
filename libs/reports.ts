import { AdditionalOrders, Drink, Orders, Percentages } from "@/utils/types";
import { getReportDate } from "./dates";
import {
  getAdditionalOrderSums,
  getOrderSums,
  sumPercentages,
  sumTableNum,
} from "./sale";

export const getReport = (
  isForSm: boolean,
  drink: Drink,
  percentages: Percentages,
  totalBisness: number,
  orders: Orders,
  additionalOrders: AdditionalOrders
) => {
  const muhakTotal = sumTableNum(drink["Muhak"]);
  const hiteTotal = sumTableNum(drink["Hite"]);
  const daesunTotal = sumTableNum(drink["Daesun"]);
  const lotteTotal = sumTableNum(drink["Lotte"]);
  const totalTableNum = muhakTotal + hiteTotal + daesunTotal + lotteTotal;

  const muhakPer = sumPercentages(percentages["Muhak"]);
  const hitePer = sumPercentages(percentages["Hite"]);
  const daesunPer = sumPercentages(percentages["Daesun"]);
  const lottePer = sumPercentages(percentages["Lotte"]);

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

  if (isForSm) {
    return `<이순조SM 퇴근보고>
1. 야간판촉지역
광안 바닷가
2. 야간 음용비
좋은데이 : ${drink["Muhak"][1] || " "}T - ${
      percentages["Muhak"][1] ? percentages["Muhak"][1].toFixed(1) : " "
    }%
좋은데이 톡시리즈 : ${drink["Muhak"][2] || " "}T - ${
      percentages["Muhak"][2] ? percentages["Muhak"][2].toFixed(1) : " "
    }%
갈매기 : ${drink["Muhak"][3] || " "}T - ${
      percentages["Muhak"][3] ? percentages["Muhak"][3].toFixed(1) : " "
    }%
대선 : ${drink["Daesun"][1] || " "}T - ${
      percentages["Daesun"][1] ? percentages["Daesun"][1].toFixed(1) : " "
    }% 
강알리 : ${drink["Daesun"][2] || " "}T - ${
      percentages["Daesun"][2] ? percentages["Daesun"][2].toFixed(1) : " "
    }%
진로 : ${drink["Hite"][2] || " "}T - ${
      percentages["Hite"][2] ? percentages["Hite"][2].toFixed(1) : " "
    }%
진로(골드) : ${drink["Hite"][3] || " "}T - ${
      percentages["Hite"][3] ? percentages["Hite"][3].toFixed(1) : " "
    }%
참이슬 : ${drink["Hite"][1] || " "}T - ${
      percentages["Hite"][1] ? percentages["Hite"][1].toFixed(1) : " "
    }%
C1: T - %
기타
새로: ${drink["Lotte"][1] || " "}T - ${
      percentages["Lotte"][1] ? percentages["Lotte"][1].toFixed(1) : " "
    }%
새로(살구): ${drink["Lotte"][2] || " "}T - ${
      percentages["Lotte"][2] ? percentages["Lotte"][2].toFixed(1) : " "
    }%
청하: ${drink["Lotte"][3] || " "}T - ${
      percentages["Lotte"][3] ? percentages["Lotte"][3].toFixed(1) : " "
    }%

갈매기 드시던 테이블까지 ${
      (drink["Muhak"][3] || 0) + orderSums[3] + additionalOrderSums[3]
    }개입니다.`;
  }
  return `${getReportDate()}
1. 점유비
\u0020\u0020- 총 방문업소: ${totalBisness}개
\u0020\u0020- 총 테이블 수: ${totalTableNum}t
가. 무학 : ${muhakTotal}t (${muhakPer}%)
\u0020\u0020- 좋은데이: ${drink["Muhak"][1] || " "}t (${
    percentages["Muhak"][1] ? percentages["Muhak"][1].toFixed(1) : " "
  }%)
\u0020\u0020- 톡시리즈 : ${drink["Muhak"][2] || " "}t (${
    percentages["Muhak"][2] ? percentages["Muhak"][2].toFixed(1) : " "
  }%)
\u0020\u0020- 부산갈매기 : ${drink["Muhak"][3] || " "}t (${
    percentages["Muhak"][3] ? percentages["Muhak"][3].toFixed(1) : " "
  }%)
나. 하이트진로 : ${hiteTotal}t (${hitePer}%)
\u0020\u0020- 참이슬 : ${drink["Hite"][1] || " "}t (${
    percentages["Hite"][1] ? percentages["Hite"][1].toFixed(1) : " "
  }%)
\u0020\u0020- 진로 : ${drink["Hite"][2] || " "}t (${
    percentages["Hite"][2] ? percentages["Hite"][2].toFixed(1) : " "
  }%)
\u0020\u0020- 기타(진로골드) : ${drink["Hite"][3] || " "}t (${
    percentages["Hite"][3] ? percentages["Hite"][3].toFixed(1) : " "
  }%)
다. 대선주조 : ${daesunTotal}t (${daesunPer}%)
\u0020\u0020- 대선(C1포함) : ${drink["Daesun"][1] || " "}t (${
    percentages["Daesun"][1] ? percentages["Daesun"][1].toFixed(1) : " "
  }%)
\u0020\u0020- 강알리 : ${drink["Daesun"][2] || " "}t (${
    percentages["Daesun"][2] ? percentages["Daesun"][2].toFixed(1) : " "
  }%)
\u0020\u0020- 기타 : ${drink["Daesun"][3] || " "}t (${
    percentages["Daesun"][3] ? percentages["Daesun"][3].toFixed(1) : " "
  }%)
라. 롯데 : ${lotteTotal}t (${lottePer}%)
\u0020\u0020- 새로: ${drink["Lotte"][1] || " "}t (${
    percentages["Lotte"][1] ? percentages["Lotte"][1].toFixed(1) : " "
  }%)
\u0020\u0020- 새로(살구) : ${drink["Lotte"][2] || " "}t (${
    percentages["Lotte"][2] ? percentages["Lotte"][2].toFixed(1) : " "
  }%)
\u0020\u0020- 청하(별빛청하 포함) : ${drink["Lotte"][3] || " "}t (${
    percentages["Lotte"][3] ? percentages["Lotte"][3].toFixed(1) : " "
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
