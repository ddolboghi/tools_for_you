"use client";

import {
  getReport,
  getReportPercentages,
  getReportTables,
  getReportTitle,
  getTotalGalmegi,
} from "@/libs/sale/reports";
import {
  Drink,
  isReportWithGalmegi16,
  Orders,
  OrderSums,
  Percentages,
} from "@/utils/sale/types";
import { useMemo } from "react";
import OrderResult from "./OrderResult";

type ResultProps = {
  onSplit: boolean;
  drink: Drink;
  percentages: Percentages;
  totalBisness: number;
  selectedBusinessZone: string;
  orders: Orders;
  additionalOrders: Orders;
  orderSums: OrderSums;
  additionalOrderSums: OrderSums;
};

export default function Result({
  onSplit,
  drink,
  percentages,
  totalBisness,
  selectedBusinessZone,
  orders,
  additionalOrders,
  orderSums,
  additionalOrderSums,
}: ResultProps) {
  const hasGalmegi16 = drink["Muhak"][4] !== undefined;
  const workerNames = useMemo(
    () =>
      Object.values(orders)
        .map((order) => order[0])
        .join(", "),
    [orders]
  );

  const BSKYReport = useMemo(
    () =>
      getReport(
        false,
        drink,
        percentages,
        totalBisness,
        selectedBusinessZone,
        orders,
        additionalOrders
      ),
    [
      drink,
      percentages,
      totalBisness,
      selectedBusinessZone,
      orders,
      additionalOrders,
    ]
  );

  const smReport = useMemo(
    () =>
      getReport(
        true,
        drink,
        percentages,
        totalBisness,
        selectedBusinessZone,
        orders,
        additionalOrders
      ),
    [
      drink,
      percentages,
      totalBisness,
      selectedBusinessZone,
      orders,
      additionalOrders,
    ]
  );

  const reportTable = useMemo(() => getReportTables(drink), [drink]);
  const reportPercentages = useMemo(
    () => getReportPercentages(percentages),
    [percentages]
  );

  const totalGalmegi = useMemo(
    () => getTotalGalmegi(drink, orders, additionalOrders),
    [drink, orders, additionalOrders]
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
        <h1>{getReportTitle(selectedBusinessZone)}</h1>
        <h2>1. 점유비</h2>
        <p>&nbsp;&nbsp;- 총 방문업소: {totalBisness}</p>
        <p>&nbsp;&nbsp;- 총 테이블 수: {reportTable.sum.total}t</p>
        <section>
          <h3>
            가. 무학: {reportTable.sum.muhak}t ({reportPercentages.sum.muhak}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 좋은데이: {reportTable.goodDay}t (
            {reportPercentages.goodDay}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 톡시리즈: {reportTable.toc}t ({reportPercentages.toc}
            %)
          </p>
          {isReportWithGalmegi16(reportTable) &&
            isReportWithGalmegi16(reportPercentages) && (
              <>
                <p>
                  &nbsp;&nbsp;- 부산갈매기19: {reportTable.galmegi19}t (
                  {reportPercentages.galmegi19}%)
                </p>
                <p>
                  &nbsp;&nbsp;- 부산갈매기16: {reportTable.galmegi16}t (
                  {reportPercentages.galmegi16}%)
                </p>
              </>
            )}
          {!isReportWithGalmegi16(reportTable) &&
            !isReportWithGalmegi16(reportPercentages) && (
              <p>
                &nbsp;&nbsp;- 부산갈매기: {reportTable.galmegi}t (
                {reportPercentages.galmegi}%)
              </p>
            )}
        </section>
        <section>
          <h3>
            나. 하이트진로: {reportTable.sum.hitejinro}t (
            {reportPercentages.sum.hitejinro}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 참이슬: {reportTable.chamisul}t (
            {reportPercentages.chamisul}%)
          </p>
          <p>
            &nbsp;&nbsp;- 진로: {reportTable.jinro}t ({reportPercentages.jinro}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 기타(진로 골드): {reportTable.jinrogold}t (
            {reportPercentages.jinrogold}%)
          </p>
        </section>
        <section>
          <h3>
            다. 대선주조: {reportTable.sum.daesunjujo}t (
            {reportPercentages.sum.daesunjujo}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 대선(C1포함): {reportTable.daesun}t (
            {reportPercentages.daesun}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 강알리: {reportTable.gangali}t (
            {reportPercentages.gangali}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 기타: {reportTable.daesunEtc}t (
            {reportPercentages.daesunEtc}
            %)
          </p>
        </section>
        <section>
          <h3>
            라. 롯데: {reportTable.sum.lotte}t ({reportPercentages.sum.lotte}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 새로: {reportTable.sero}t ({reportPercentages.sero}%)
          </p>
          <p>
            &nbsp;&nbsp;- 새로(살구): {reportTable.serosalgu}t (
            {reportPercentages.serosalgu}%)
          </p>
          <p>
            &nbsp;&nbsp;- 청하(별빛청하 포함): {reportTable.chungha}t (
            {reportPercentages.chungha}%)
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
        <OrderResult
          onSplit={onSplit}
          orders={orders}
          additionalOrders={additionalOrders}
          orderSums={orderSums}
          additionalOrderSums={additionalOrderSums}
        />
        {selectedBusinessZone === "광안" && (
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
                좋은데이 : {reportTable.goodDay}T - {reportPercentages.goodDay}%
              </p>
              <p>
                좋은데이 톡시리즈 : {reportTable.toc}T - {reportPercentages.toc}
                %
              </p>
              {hasGalmegi16 && (
                <>
                  <p>
                    갈매기19 : {reportTable.galmegi19}T -{" "}
                    {reportPercentages.galmegi19}%
                  </p>
                  <p>
                    갈매기16 : {reportTable.galmegi16}T -{" "}
                    {reportPercentages.galmegi16}%
                  </p>
                </>
              )}
              {!isReportWithGalmegi16(reportTable) &&
                !isReportWithGalmegi16(reportPercentages) && (
                  <p>
                    갈매기19 : {reportTable.galmegi}T -{" "}
                    {reportPercentages.galmegi}%
                  </p>
                )}
              <p>
                대선 : {reportTable.daesun}T - {reportPercentages.daesun}%
              </p>
              <p>
                강알리 : {reportTable.gangali}T - {reportPercentages.gangali}%
              </p>
              <p>
                진로 : {reportTable.jinro}T - {reportPercentages.jinro}%
              </p>
              <p>
                진로(골드) : {reportTable.jinrogold}T -{" "}
                {reportPercentages.jinrogold}%
              </p>
              <p>
                참이슬 : {reportTable.chamisul}T - {reportPercentages.chamisul}%
              </p>
              <p>C1: T - %</p>
              <h2>기타</h2>
              <p>
                새로: {reportTable.sero}T - {reportPercentages.sero}% %
              </p>
              <p>
                새로(살구): {reportTable.serosalgu}T -{" "}
                {reportPercentages.serosalgu}%
              </p>
              <p>
                청하: {reportTable.chungha}T - {reportPercentages.chungha}%
              </p>
              <br />
              <p>갈매기 드시던 테이블까지 {totalGalmegi}개입니다.</p>
            </section>
          </div>
        )}
        <button
          type="button"
          className="my-2 bg-blue-500 text-white rounded p-2 w-full"
          onClick={handleBSKYReportClipboard}
        >
          상권 톡방용 보고 복사하기
        </button>
        {selectedBusinessZone === "광안" && (
          <button
            type="button"
            className="my-2 bg-green-400 text-white rounded p-2 w-full"
            onClick={handleSMReportClipboard}
          >
            담당자님용 보고 복사하기
          </button>
        )}
      </div>
    </div>
  );
}
