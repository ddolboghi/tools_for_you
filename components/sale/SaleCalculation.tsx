"use client";

import { useEffect, useRef, useState } from "react";
import { calculatePercentages } from "@/utils/sale/calculation";
import Result from "./Result";
import Order from "./Order";
import { BskyReport, Orders, OtherCompanyActivity } from "@/utils/sale/types";

import { businessZones } from "@/utils/sale/businessZones";
import { initOrder2 } from "@/data/sale/order";
import { getOrderSums } from "@/utils/sale/order";
import { initOtherCompanyActivities } from "@/utils/sale/otherCompanyActivity";
import { Button } from "@/components/ui/button";
import { bskyReport } from "@/data/sale/report";
import BusinessZoneSelector from "./BusinessZoneSelector";
import OtherCompanyActivitySection from "./otherCompanyActivity/OtherCompanyActivity";
import Galmegi16Report from "./galmegi16shop/Galmegi16Report";
import { insertReport } from "@/action/report";
import { LoaderCircle } from "lucide-react";

type ShowBusinewwWarning = {
  show: boolean;
  message: string;
};

export default function SaleCalculation() {
  const [updatedBskyReport, setUpdatedBskyReport] =
    useState<BskyReport>(bskyReport);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [totalBisness, setTotalBisness] = useState<number>(0);
  const [orders, setOrders] = useState<Orders>({});
  const [additionalOrders, setAdditionalOrders] = useState<Orders>({});

  const [orderCount, setOrderCount] = useState<number>(1);
  const [selectedBusinessZone, setSelectedBusinessZone] = useState<string>(
    businessZones[0].name
  );
  const [orderSums, setOrderSums] = useState(getOrderSums(orders));
  const [additionalOrderSums, setAdditionalOrderSums] = useState(
    getOrderSums(additionalOrders)
  );
  const [otherCompanyActivities, setOtherCompanyActivities] = useState<
    OtherCompanyActivity[]
  >(initOtherCompanyActivities);
  const [remarks, setRemarks] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBusinessWarning, setShowBusinessWarning] =
    useState<ShowBusinewwWarning>({ show: false, message: "" });
  const businessInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrderSums(getOrderSums(orders));
  }, [orders]);

  useEffect(() => {
    setAdditionalOrderSums(getOrderSums(additionalOrders));
  }, [additionalOrders]);

  const handleDrink = (company: string, drink: string, value: string) => {
    setUpdatedBskyReport((prev) => ({
      ...prev,
      [company]: {
        ...prev[company],
        [drink]: { ...prev[company][drink], tables: Number(value) },
      },
    }));
  };
  const handleTotalBisness = (value: string) => {
    const inputTotalBisness = Number(value);
    if (Number.isNaN(inputTotalBisness)) {
      setShowBusinessWarning((prev) => ({
        ...prev,
        show: true,
        message: "숫자를 입력해주세요.",
      }));
      return;
    }
    setTotalBisness(inputTotalBisness);
    setShowBusinessWarning((prev) => ({ ...prev, show: false, message: "" }));
  };

  const handleCalculateBtn = async () => {
    if (totalBisness <= 0) {
      setShowBusinessWarning((prev) => ({
        ...prev,
        show: true,
        message: "방문업소 수를 입력해주세요.",
      }));
      businessInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      businessInputRef.current?.focus();
      return;
    }

    setShowBusinessWarning((prev) => ({ ...prev, show: false, message: "" }));

    const updatedReport = calculatePercentages({ ...updatedBskyReport });
    setUpdatedBskyReport(updatedReport);
    setShowResult(true);
    setIsLoading(true);
    const sellers = Object.values(orders)
      .map((order) => order["0"])
      .join(",");
    await insertReport(
      selectedBusinessZone,
      totalBisness,
      updatedReport,
      sellers,
      orders,
      additionalOrders
    );
    setIsLoading(false);
  };

  const addOrderLine = () => {
    setOrders((prev) => ({
      ...prev,
      [orderCount]: initOrder2,
    }));

    setAdditionalOrders((prev) => ({
      ...prev,
      [orderCount]: initOrder2,
    }));

    setOrderCount(orderCount + 1);
  };

  const removeOrderLine = (index: number) => {
    setOrders((prev) => {
      const newOrders = { ...prev };
      delete newOrders[index];
      return newOrders;
    });

    setAdditionalOrders((prev) => {
      const newAdditionalOrders = { ...prev };
      delete newAdditionalOrders[index];
      return newAdditionalOrders;
    });
  };

  const handleOrderChange = (index: number, key: number, value: string) => {
    const numValue = Number(value);
    setOrders((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: key === 0 ? value : numValue,
      },
    }));

    if (key === 0) {
      setAdditionalOrders((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [key]: value,
        },
      }));
    }
  };

  const handleAdditionalOrderChange = (
    index: number,
    key: number,
    value: string
  ) => {
    const numValue = Number(value);
    setAdditionalOrders((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: key === 0 ? value : numValue,
      },
    }));

    if (key === 0) {
      setOrders((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [key]: value,
        },
      }));
    }
  };

  const handleSelectBusinessZone = (selectedBusinessZone: string) => {
    setSelectedBusinessZone(selectedBusinessZone);
  };

  const handleOtherCompanyActivity = (
    name: string,
    team: "daepanTeam" | "haengsaTeam",
    value: string
  ) => {
    const parsed = parseInt(value);
    setOtherCompanyActivities((prev) =>
      prev.map((activity) =>
        activity.name === name
          ? { ...activity, [team]: Number.isNaN(parsed) ? undefined : parsed }
          : activity
      )
    );
  };

  return (
    // w-full은 max-w와 중복이 아니다. 부모 .app-container가 align-items:center라
    // 이게 없으면 이 div가 fit-content로 크기를 정하고, 주문 입력 행의 고유 폭 요구
    // 때문에 좁은 화면에서도 500px로 고정돼 좌우가 잘린다.
    <div className="p-4 max-w-[500px] w-full">
      <section className="flex flex-col mb-4">
        <label className="text-lg mb-1 flex items-center">
          총 방문업소:
          <input
            ref={businessInputRef}
            type="number"
            pattern="\d*"
            className="ml-2 border border-gray-300 rounded p-1 text-black"
            placeholder="0"
            onChange={(e) => handleTotalBisness(e.target.value)}
          />
          <span className="ml-1">개</span>
        </label>
        {showBusinessWarning.show && (
          <p className="text-sm text-red-600 mt-1">
            {showBusinessWarning.message}
          </p>
        )}
      </section>

      <section className="flex flex-row mb-4 items-center">
        <h1 className="text-lg pr-2">상권 선택: </h1>
        <BusinessZoneSelector
          selectedBusinessZone={selectedBusinessZone}
          handleSelectBusinessZone={handleSelectBusinessZone}
        />
      </section>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCalculateBtn();
        }}
      >
        {Object.entries(bskyReport).map(([company, drinks], index) => (
          <section
            key={`company-${index}`}
            className="mb-4 border border-gray-300 p-2"
          >
            <h1 className="text-lg">{company}</h1>
            {Object.keys(drinks).map((drink, index) => (
              <div key={`drink-${index}`} className="mt-2">
                <span className="pr-1">{drink}:</span>
                <input
                  type="number"
                  pattern="\d*"
                  className="border border-gray-300 rounded p-1 w-1/2 text-black"
                  placeholder="0"
                  onChange={(e) => handleDrink(company, drink, e.target.value)}
                />
                t
              </div>
            ))}
          </section>
        ))}
        <Order
          orders={orders}
          additionalOrders={additionalOrders}
          handleOrderChange={handleOrderChange}
          addOrderLine={addOrderLine}
          removeOrderLine={removeOrderLine}
          handleAdditionalOrderChange={handleAdditionalOrderChange}
          orderSums={orderSums}
          additionalOrderSums={additionalOrderSums}
        />
        <OtherCompanyActivitySection
          otherCompanyActivities={otherCompanyActivities}
          handleOtherCompanyActivity={handleOtherCompanyActivity}
        />
        <section className="border border-gray-300 rounded p-4 w-full text-black mt-4">
          <h1 className="text-lg font-bold">특이사항</h1>
          <input
            type="text"
            className="border border-gray-300 rounded p-1 mt-2 w-full min-w-0 text-black"
            placeholder="없으면 비워두세요"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </section>
        <p className="text-xs text-gray-600">
          ⚠️테이블 수를 수정했다면 &quot;계산하기&quot;를 눌러주세요.
        </p>
        <Button
          type="submit"
          className="my-2 bg-[#3967b3] hover:bg-[#3871cc] text-white font-semibold rounded p-2 w-full"
          disabled={isLoading}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "계산하기"}
        </Button>
      </form>
      {showResult && (
        <Result
          bskyReport={updatedBskyReport}
          totalBisness={totalBisness}
          selectedBusinessZone={selectedBusinessZone}
          orders={orders}
          additionalOrders={additionalOrders}
          orderSums={orderSums}
          additionalOrderSums={additionalOrderSums}
          otherCompanyActivities={otherCompanyActivities}
          remarks={remarks}
        />
      )}
      <Galmegi16Report businessZone={selectedBusinessZone} />
    </div>
  );
}
