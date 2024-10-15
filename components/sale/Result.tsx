"use client";

import { translateToKoreanDayOfWeek } from "@/libs/dates";
import { sumPercentages, sumTableNum } from "@/libs/sale";

type ResultProps = {
  drink: { [key: string]: { [key: number]: number } };
  percentages: { [key: string]: { [key: number]: number } };
  totalBisness: number;
  orders: {
    [key: number]: { [key: string]: number | string };
  };
  additionalOrders: {
    [key: number]: { [key: string]: number | string };
  };
};

export default function Result({
  drink,
  percentages,
  totalBisness,
  orders,
  additionalOrders,
}: ResultProps) {
  const kstDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const month = String(kstDate.getMonth() + 1).padStart(2, "");
  const day = String(kstDate.getDate()).padStart(2, "0");
  const dayOfWeek = translateToKoreanDayOfWeek(kstDate.getDay());

  const muhakTotal = sumTableNum(drink["Muhak"]);
  const hiteTotal = sumTableNum(drink["Hite"]);
  const daesunTotal = sumTableNum(drink["Daesun"]);
  const lotteTotal = sumTableNum(drink["Lotte"]);
  const totalTableNum = muhakTotal + hiteTotal + daesunTotal + lotteTotal;

  const muhakPer = sumPercentages(percentages["Muhak"]);
  const hitePer = sumPercentages(percentages["Hite"]);
  const daesunPer = sumPercentages(percentages["Daesun"]);
  const lottePer = sumPercentages(percentages["Lotte"]);

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

  const workersString = Array.from(workers).join(", ");

  let workerReportOfAdditionalOrders = "";
  for (const order of Object.values(additionalOrders)) {
    workerReportOfAdditionalOrders += `${order["name"]}: ${
      order["goodDay"] || ""
    }t(좋은데이) / ${order["toctoc"] || ""}t(톡소다) / ${
      order["galmegi"] || ""
    }t(부산갈매기)\n`;
  }

  const orderSums = { 1: 0, 2: 0, 3: 0 };
  for (const order of Object.values(orders)) {
    orderSums[1] += Number(order["goodDay"]) || 0;
    orderSums[2] += Number(order["toctoc"]) || 0;
    orderSums[3] += Number(order["galmegi"]) || 0;
  }

  const additionalOrderSums = { 1: 0, 2: 0, 3: 0 };
  for (const addi of Object.values(additionalOrders)) {
    additionalOrderSums[1] += Number(addi["goodDay"]) || 0;
    additionalOrderSums[2] += Number(addi["toctoc"]) || 0;
    additionalOrderSums[3] += Number(addi["galmegi"]) || 0;
  }
  console.log(percentages);
  const report = `<${month}월 ${day}일 ${dayOfWeek} 광안 상권보고>
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
${workersString}
나. 전환: ${orderSums[1] || 0}t(좋은데이) / ${orderSums[2] || 0}t(톡소다) / ${
    orderSums[3] || 0
  }t(부산갈매기)
${workerReportOfOrders}
다. 추가주문: ${additionalOrderSums[1] || 0}t(좋은데이) / ${
    additionalOrderSums[2] || 0
  }t(톡소다) / ${additionalOrderSums[3] || 0}t(부산갈매기) 
${workerReportOfAdditionalOrders}
`;

  const smReport = `<이순조SM 퇴근보고>
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
    drink["Muhak"][3] || 0 + orderSums[3] + additionalOrderSums[3]
  }개입니다.`;
  const handleAllWriteClipboard = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      navigator.clipboard.writeText(report).then(() => {
        alert("클립보드에 복사했습니다.");
      });
    }
  };

  const handleSMWriteClipboard = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      navigator.clipboard.writeText(smReport).then(() => {
        alert("클립보드에 복사했습니다.");
      });
    }
  };

  return (
    <div>
      <div className="border border-blue-300">
        <h1>
          {"<"}
          {month}월 {day}일 {dayOfWeek} 광안 상권 보고{">"}
        </h1>
        <h2>1. 점유비</h2>
        <p>&nbsp;&nbsp;- 총 방문업소: {totalBisness}</p>
        <p>&nbsp;&nbsp;- 총 테이블 수: {totalTableNum}t</p>
        <section>
          <h3>
            가. 무학: {muhakTotal}t ({muhakPer}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 좋은데이: {drink["Muhak"][1] || 0}t (
            {percentages["Muhak"][1] ? percentages["Muhak"][1].toFixed(1) : 0}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 톡시리즈: {drink["Muhak"][2] || 0}t (
            {percentages["Muhak"][2] ? percentages["Muhak"][2].toFixed(1) : 0}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 부산갈매기: {drink["Muhak"][3] || 0}t (
            {percentages["Muhak"][3] ? percentages["Muhak"][3].toFixed(1) : 0}%)
          </p>
        </section>
        <section>
          <h3>
            나. 하이트진로: {hiteTotal}t ({hitePer}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 참이슬: {drink["Hite"][1] || 0}t (
            {percentages["Hite"][1] ? percentages["Hite"][1].toFixed(1) : 0}%)
          </p>
          <p>
            &nbsp;&nbsp;- 진로: {drink["Hite"][2] || 0}t (
            {percentages["Hite"][2] ? percentages["Hite"][2].toFixed(1) : 0}%)
          </p>
          <p>
            &nbsp;&nbsp;- 기타(진로 골드): {drink["Hite"][3] || 0}t (
            {percentages["Hite"][3] ? percentages["Hite"][3].toFixed(1) : 0}%)
          </p>
        </section>
        <section>
          <h3>
            다. 대선주조: {daesunTotal}t ({daesunPer}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 대선(C1포함): {drink["Daesun"][1] || 0}t (
            {percentages["Daesun"][1] ? percentages["Daesun"][1].toFixed(1) : 0}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 강알리: {drink["Daesun"][2] || 0}t (
            {percentages["Daesun"][2] ? percentages["Daesun"][2].toFixed(1) : 0}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 기타: {drink["Daesun"][3] || 0}t (
            {percentages["Daesun"][3] ? percentages["Daesun"][3].toFixed(1) : 0}
            %)
          </p>
        </section>
        <section>
          <h3>
            라. 롯데: {lotteTotal}t ({lottePer}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 새로: {drink["Lotte"][1] || 0}t (
            {percentages["Lotte"][1] ? percentages["Lotte"][1].toFixed(1) : 0}%)
          </p>
          <p>
            &nbsp;&nbsp;- 새로(살구): {drink["Lotte"][2] || 0}t (
            {percentages["Lotte"][2] ? percentages["Lotte"][2].toFixed(1) : 0}%)
          </p>
          <p>
            &nbsp;&nbsp;- 청하(별빛청하 포함): {drink["Lotte"][3] || 0}t (
            {percentages["Lotte"][3] ? percentages["Lotte"][3].toFixed(1) : 0}%)
          </p>
        </section>
        <section>
          <h3>마. 기타 0t (0%)</h3>
        </section>
        <br />
        <h2>2. 전환 및 추가주문</h2>
        <section>
          <h3>가. 근무인원</h3>
          <p>{workersString}</p>
        </section>
        <section>
          <h3>
            나. 전환: {orderSums[1] || 0}t(좋은데이) / {orderSums[2] || 0}
            t(톡소다) / {orderSums[3] || 0}t(부산갈매기)
          </h3>
          {Object.values(orders).map((order, orderIdx) => (
            <p key={orderIdx}>
              {order["name"]}: {order["goodDay"] || ""}t(좋은데이) /{" "}
              {order["toctoc"] || ""}t(톡소다) / {order["galmegi"] || ""}
              t(부산갈매기)
            </p>
          ))}
        </section>
        <br />
        <section>
          <h3>
            다. 추가주문: {additionalOrderSums[1] || 0}t(좋은데이) /{" "}
            {additionalOrderSums[2] || 0}
            t(톡소다) / {additionalOrderSums[3] || 0}t(부산갈매기)
          </h3>
          {Object.values(additionalOrders).map((order, orderIdx) => (
            <p key={orderIdx}>
              {order["name"]}: {order["goodDay"] || ""}t(좋은데이) /{" "}
              {order["toctoc"] || ""}t(톡소다) / {order["galmegi"] || ""}
              t(부산갈매기)
            </p>
          ))}
        </section>
      </div>
      <div className="border border-blue-300">
        <h1>
          {"<"}이순조SM 퇴근보고{">"}
        </h1>
        <section>
          <h1>1. 야간판촉지역</h1>
          <p>광안 바닷가</p>
        </section>
        <section>
          <h1>2. 야간 음용비</h1>
          <p>
            좋은데이 : {drink["Muhak"][1] || " "}T -{" "}
            {percentages["Muhak"][1] ? percentages["Muhak"][1].toFixed(1) : " "}
            %
          </p>
          <p>
            좋은데이 톡시리즈 : {drink["Muhak"][2] || " "}T -{" "}
            {percentages["Muhak"][2] ? percentages["Muhak"][2].toFixed(1) : " "}
            %
          </p>
          <p>
            갈매기 : {drink["Muhak"][3] || " "}T -{" "}
            {percentages["Muhak"][3] ? percentages["Muhak"][3].toFixed(1) : " "}
            %
          </p>
          <p>
            대선 : {drink["Daesun"][1] || " "}T -{" "}
            {percentages["Daesun"][1]
              ? percentages["Daesun"][1].toFixed(1)
              : " "}
            %
          </p>
          <p>
            강알리 : {drink["Daesun"][2] || " "}T -{" "}
            {percentages["Daesun"][2]
              ? percentages["Daesun"][2].toFixed(1)
              : " "}
            %
          </p>
          <p>
            진로 : {drink["Hite"][2] || " "}T -{" "}
            {percentages["Hite"][2] ? percentages["Hite"][2].toFixed(1) : " "}%
          </p>
          <p>
            진로(골드) : {drink["Hite"][3] || " "}T -{" "}
            {percentages["Hite"][3] ? percentages["Hite"][3].toFixed(1) : " "}%
          </p>
          <p>
            참이슬 : {drink["Hite"][1] || " "}T -{" "}
            {percentages["Hite"][1] ? percentages["Hite"][1].toFixed(1) : " "}%
          </p>
          <p>C1: T - %</p>
          <h2>기타</h2>
          <p>
            새로: {drink["Lotte"][1] || " "}T -{" "}
            {percentages["Lotte"][1] ? percentages["Lotte"][1].toFixed(1) : " "}
            %
          </p>
          <p>
            새로(살구): {drink["Lotte"][2] || " "}T -{" "}
            {percentages["Lotte"][2] ? percentages["Lotte"][2].toFixed(1) : " "}
            %
          </p>
          <p>
            청하: {drink["Lotte"][3] || " "}T -{" "}
            {percentages["Lotte"][3] ? percentages["Lotte"][3].toFixed(1) : " "}
            %
          </p>
          <br />
          <p>
            갈매기 드시던 테이블까지{" "}
            {drink["Muhak"][3] || 0 + orderSums[3] + additionalOrderSums[3]}
            개입니다.
          </p>
        </section>
      </div>
      <button
        className="my-2 bg-blue-500 text-white rounded p-2 w-full"
        onClick={handleAllWriteClipboard}
      >
        수영구 톡방용 보고 복사하기
      </button>
      <button
        className="my-2 bg-green-400 text-white rounded p-2 w-full"
        onClick={handleSMWriteClipboard}
      >
        담당자님용 보고 복사하기
      </button>
    </div>
  );
}
