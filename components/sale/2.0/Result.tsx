"use client";

import {
  getBSKYReport,
  getGalmegiSums,
  getSMReport,
} from "@/lib/sale/2.0/report";
import {
  BskyReport,
  Orders,
  OrderSums,
  OtherCompanyPromotionResult,
  PromotionStock,
} from "@/utils/sale/types";
import { useMemo } from "react";
import OrderResult from "./OrderResult";
import SMReport from "../2.0/SMReport";
import PromotionStockReport from "../report/PromotionStockReport";
import OtherCompanyPromotionReport from "../report/OtherCompanyPromotionReport";
import { getReportTitle } from "@/lib/sale/commonReports";
import {
  getTotalOccupancyNumByCompany,
  getTotalTableNum,
} from "@/lib/sale/2.0/sale";
import { getGalmegiSumByWorker } from "@/lib/sale/order";

type ResultProps = {
  bskyReport: BskyReport;
  totalBisness: number;
  selectedBusinessZone: string;
  orders: Orders;
  additionalOrders: Orders;
  orderSums: OrderSums;
  additionalOrderSums: OrderSums;
  otherCompanyPromotions: OtherCompanyPromotionResult[];
  promotionStocks: PromotionStock[];
};

export default function Result({
  bskyReport,
  totalBisness,
  selectedBusinessZone,
  orders,
  additionalOrders,
  orderSums,
  additionalOrderSums,
  otherCompanyPromotions,
  promotionStocks,
}: ResultProps) {
  const updatedBskyReport = bskyReport;

  const BSKYReport = useMemo(
    () =>
      getBSKYReport(
        updatedBskyReport,
        totalBisness,
        selectedBusinessZone,
        orders,
        additionalOrders,
        otherCompanyPromotions,
        promotionStocks
      ),
    [
      updatedBskyReport,
      totalBisness,
      selectedBusinessZone,
      orders,
      additionalOrders,
      otherCompanyPromotions,
      promotionStocks,
    ]
  );

  const smReport = useMemo(
    () => getSMReport(updatedBskyReport, orders, additionalOrders),
    [updatedBskyReport, orders, additionalOrders]
  );

  const galmegiSums = useMemo(
    () => getGalmegiSums(updatedBskyReport, orders, additionalOrders),
    [updatedBskyReport, orders, additionalOrders]
  );

  const totalTableNum = useMemo(
    () => getTotalTableNum(updatedBskyReport),
    [updatedBskyReport]
  );

  const galmegiSumByWorker = useMemo(
    () => getGalmegiSumByWorker(orders, additionalOrders),
    [orders, additionalOrders]
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
        <p>&nbsp;&nbsp;- 총 테이블 수: {totalTableNum}t</p>
        <br />
        <section>
          {Object.entries(updatedBskyReport).map(
            ([company, occupancyReslut]) => (
              <div key={company}>
                <h3>{company}</h3>:{" "}
                <span>
                  {getTotalOccupancyNumByCompany(bskyReport[company], false)}t (
                  {getTotalOccupancyNumByCompany(bskyReport[company], true)}%)
                </span>
                {Object.entries(occupancyReslut).map(([drink, result]) => (
                  <p key={drink}>
                    &nbsp;&nbsp;- {drink}: {result.tables}t ({result.percentage}
                    %)
                  </p>
                ))}
                <br />
              </div>
            )
          )}
          <p>마. 기타 0t (0%)</p>
        </section>
        <br />
        <h2>2. 전환 및 추가주문</h2>
        <br />
        <section>
          <h3>가. 근무인원</h3>
          <br />
          <p>부산 갈매기 총 판매 병 수</p>
          {Object.entries(galmegiSumByWorker).map(([worker, value]) => (
            <p key={worker}>
              {worker} : {value}본
            </p>
          ))}
          <br />
        </section>
        <OrderResult
          orders={orders}
          additionalOrders={additionalOrders}
          orderSums={orderSums}
          additionalOrderSums={additionalOrderSums}
        />
        {selectedBusinessZone === "수영" && (
          <div>
            <br />
            <OtherCompanyPromotionReport
              otherCompanyPromotions={otherCompanyPromotions}
            />
            <br />
            <PromotionStockReport promotionStocks={promotionStocks} />
          </div>
        )}
        {selectedBusinessZone === "광안" && (
          <SMReport
            bskyReport={updatedBskyReport}
            totalTableNum={totalTableNum}
            galmegiSums={galmegiSums}
          />
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
