"use client";
import { getReportDate } from "@/libs/dates";
import { getReport } from "@/libs/reports";
import {
  getAdditionalOrderSums,
  getOrderSums,
  sumPercentages,
  sumTableNum,
} from "@/libs/sale";
import { AdditionalOrders, Drink, Orders, Percentages } from "@/utils/types";
import { useMemo } from "react";

type ResultProps = {
  drink: Drink;
  percentages: Percentages;
  totalBisness: number;
  orders: Orders;
  additionalOrders: AdditionalOrders;
};

const calculateTotals = (drink: Drink) => ({
  muhak: sumTableNum(drink["Muhak"]),
  hite: sumTableNum(drink["Hite"]),
  daesun: sumTableNum(drink["Daesun"]),
  lotte: sumTableNum(drink["Lotte"]),
});

const calculatePercentages = (percentages: Percentages) => ({
  muhak: sumPercentages(percentages["Muhak"]),
  hite: sumPercentages(percentages["Hite"]),
  daesun: sumPercentages(percentages["Daesun"]),
  lotte: sumPercentages(percentages["Lotte"]),
});

export default function Result({
  drink,
  percentages,
  totalBisness,
  orders,
  additionalOrders,
}: ResultProps) {
  const brandTotals = useMemo(() => calculateTotals(drink), [drink]);
  const brandPercentages = useMemo(
    () => calculatePercentages(percentages),
    [percentages]
  );

  const workerNames = useMemo(
    () =>
      Object.values(orders)
        .map((order) => order.name)
        .join(", "),
    [orders]
  );

  const orderSums = useMemo(() => getOrderSums(orders), [orders]);
  const additionalOrderSums = useMemo(
    () => getAdditionalOrderSums(additionalOrders),
    [additionalOrders]
  );

  const BSKYReport = useMemo(
    () =>
      getReport(
        false,
        drink,
        percentages,
        totalBisness,
        orders,
        additionalOrders
      ),
    [drink, percentages, totalBisness, orders, additionalOrders]
  );

  const smReport = useMemo(
    () =>
      getReport(
        true,
        drink,
        percentages,
        totalBisness,
        orders,
        additionalOrders
      ),
    [drink, percentages, totalBisness, orders, additionalOrders]
  );
  const handleBSKYReportClipboard = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      navigator.clipboard.writeText(BSKYReport).then(() => {
        alert("클립보드에 복사했습니다.");
      });
    }
  };

  const handleSMReportClipboard = () => {
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
        <h1>{getReportDate()}</h1>
        <h2>1. 점유비</h2>
        <p>&nbsp;&nbsp;- 총 방문업소: {totalBisness}</p>
        <p>
          &nbsp;&nbsp;- 총 테이블 수:{" "}
          {Object.values(brandTotals).reduce((acc, cur) => acc + cur, 0)}t
        </p>
        <section>
          <h3>
            가. 무학: {brandTotals.muhak}t ({brandPercentages.muhak}%)
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
            나. 하이트진로: {brandTotals.hite}t ({brandPercentages.hite}%)
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
            다. 대선주조: {brandTotals.daesun}t ({brandPercentages.daesun}%)
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
            라. 롯데: {brandTotals.lotte}t ({brandPercentages.lotte}%)
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
          <p>{workerNames}</p>
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
            {(drink["Muhak"][3] || 0) + orderSums[3] + additionalOrderSums[3]}
            개입니다.
          </p>
        </section>
      </div>
      <button
        className="my-2 bg-blue-500 text-white rounded p-2 w-full"
        onClick={handleBSKYReportClipboard}
      >
        수영구 톡방용 보고 복사하기
      </button>
      <button
        className="my-2 bg-green-400 text-white rounded p-2 w-full"
        onClick={handleSMReportClipboard}
      >
        담당자님용 보고 복사하기
      </button>
    </div>
  );
}
