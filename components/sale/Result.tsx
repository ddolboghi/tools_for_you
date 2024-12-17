"use client";

import {
  getBSKYReport,
  getReportPercentages,
  getReportTables,
  getReportTitle,
  getSMReport,
  getWorkerNames,
} from "@/lib/sale/reports";
import {
  Drink,
  Orders,
  OrderSums,
  OtherCompanyPromotionResult,
  Percentages,
  PromotionStock,
} from "@/utils/sale/types";
import { useMemo } from "react";
import OrderResult from "./OrderResult";
import {
  getGalmegiSums,
  getProviderPercentages,
  getProviderSums,
} from "@/lib/sale/sale";
import SMGalmegiSummary from "./report/SMGalmegiSummary";

type ResultProps = {
  drink: Drink;
  percentages: Percentages;
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
  drink,
  percentages,
  totalBisness,
  selectedBusinessZone,
  orders,
  additionalOrders,
  orderSums,
  additionalOrderSums,
  otherCompanyPromotions,
  promotionStocks,
}: ResultProps) {
  const workerNames = useMemo(() => getWorkerNames(orders), [orders]);

  const BSKYReport = useMemo(
    () =>
      getBSKYReport(
        drink,
        percentages,
        totalBisness,
        selectedBusinessZone,
        orders,
        additionalOrders,
        otherCompanyPromotions,
        promotionStocks
      ),
    [
      drink,
      percentages,
      totalBisness,
      selectedBusinessZone,
      orders,
      additionalOrders,
      otherCompanyPromotions,
      promotionStocks,
    ]
  );

  const smReport = useMemo(
    () =>
      getSMReport(drink, percentages, totalBisness, orders, additionalOrders),
    [drink, percentages, totalBisness, orders, additionalOrders]
  );

  const providerSums = useMemo(() => getProviderSums(drink), [drink]);
  const providerPercentages = useMemo(
    () => getProviderPercentages(percentages),
    [percentages]
  );

  const reportTables = useMemo(() => getReportTables(drink), [drink]);
  const reportPercentages = useMemo(
    () => getReportPercentages(percentages),
    [percentages]
  );

  const galmegiSums = useMemo(
    () => getGalmegiSums(drink, orderSums, additionalOrderSums),
    [drink, orderSums, additionalOrderSums]
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
        <p>&nbsp;&nbsp;- 총 테이블 수: {providerSums.total}t</p>
        <section>
          <h3>
            가. 무학: {providerSums.muhak}t ({providerPercentages.muhak}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 좋은데이: {reportTables.goodDay}t (
            {reportPercentages.goodDay}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 톡시리즈: {reportTables.toc}t ({reportPercentages.toc}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 부산갈매기19: {reportTables.galmegi19}t (
            {reportPercentages.galmegi19}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 부산갈매기16: {reportTables.galmegi16}t (
            {reportPercentages.galmegi16}
            %)
          </p>
        </section>
        <section>
          <h3>
            나. 하이트진로: {providerSums.hitejinro}t (
            {providerPercentages.hitejinro}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 참이슬: {reportTables.chamisul}t (
            {reportPercentages.chamisul}%)
          </p>
          <p>
            &nbsp;&nbsp;- 진로: {reportTables.jinro}t ({reportPercentages.jinro}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 기타(진로 골드): {reportTables.jinrogold}t (
            {reportPercentages.jinrogold}%)
          </p>
        </section>
        <section>
          <h3>
            다. 대선주조: {providerSums.daesunjujo}t (
            {providerPercentages.daesunjujo}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 대선(C1포함): {reportTables.daesun}t (
            {reportPercentages.daesun}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 강알리: {reportTables.gangali}t (
            {reportPercentages.gangali}
            %)
          </p>
          <p>
            &nbsp;&nbsp;- 기타: {reportTables.daesunEtc}t (
            {reportPercentages.daesunEtc}
            %)
          </p>
        </section>
        <section>
          <h3>
            라. 롯데: {providerSums.lotte}t ({providerPercentages.lotte}%)
          </h3>
          <p>
            &nbsp;&nbsp;- 새로: {reportTables.sero}t ({reportPercentages.sero}%)
          </p>
          <p>
            &nbsp;&nbsp;- 새로(살구): {reportTables.serosalgu}t (
            {reportPercentages.serosalgu}%)
          </p>
          <p>
            &nbsp;&nbsp;- 청하(별빛청하 포함): {reportTables.chungha}t (
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
          orders={orders}
          additionalOrders={additionalOrders}
          orderSums={orderSums}
          additionalOrderSums={additionalOrderSums}
        />
        {selectedBusinessZone === "수영" && (
          <div>
            <br />
            <h1>3. 타사 판촉인원 / 판촉물 및 판촉내용</h1>
            <div>
              {otherCompanyPromotions.map((promotion, index) => (
                <p key={`${index}-${promotion.name}`}>
                  {promotion.name} {promotion.workerNumber || 0}명 /{" "}
                  {promotion.info}
                </p>
              ))}
            </div>
            <br />
            <h1>4. ★자사 판촉물 재고량★ (박스로 기입해서 올려주세요)</h1>
            <div>
              {promotionStocks.map((stock, index) => (
                <p key={`${index}-${stock.name}`}>
                  &nbsp;- {stock.name} {stock.quantity || 0}박스
                </p>
              ))}
            </div>
          </div>
        )}
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
                좋은데이 : {reportTables.goodDay}T - {reportPercentages.goodDay}
                %
              </p>
              <p>
                좋은데이 톡시리즈 : {reportTables.toc}T -{" "}
                {reportPercentages.toc}%
              </p>
              <p>
                갈매기19 : {reportTables.galmegi19}T -{" "}
                {reportPercentages.galmegi19}% %
              </p>
              <p>
                갈매기16 : {reportTables.galmegi16}T -{" "}
                {reportPercentages.galmegi16}%
              </p>
              <p>
                대선 : {reportTables.daesun}T - {reportPercentages.daesun}%
              </p>
              <p>
                강알리 : {reportTables.gangali}T - {reportPercentages.gangali}%
              </p>
              <p>
                진로 : {reportTables.jinro}T - {reportPercentages.jinro}%
              </p>
              <p>
                진로(골드) : {reportTables.jinrogold}T -{" "}
                {reportPercentages.jinrogold}%
              </p>
              <p>
                참이슬 : {reportTables.chamisul}T - {reportPercentages.chamisul}
                %
              </p>
              <p>C1: T - %</p>
              <h2>기타</h2>
              <p>
                새로: {reportTables.sero}T - {reportPercentages.sero}% %
              </p>
              <p>
                새로(살구): {reportTables.serosalgu}T -{" "}
                {reportPercentages.serosalgu}%
              </p>
              <p>
                청하: {reportTables.chungha}T - {reportPercentages.chungha}%
              </p>
              <br />
              <SMGalmegiSummary galmegiSums={galmegiSums} />
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
