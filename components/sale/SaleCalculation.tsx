"use client";

import { useEffect, useState } from "react";
import { calculatePercentages } from "@/lib/sale/sale";
import Result from "./Result";
import Order from "./Order";
import {
  BskyReport,
  Orders,
  OtherCompanyPromotionResult,
  PromotionStock,
} from "@/utils/sale/types";

import {
  additionalInfoBusinessZones,
  businessZones,
} from "@/utils/sale/businessZones";
import { initOrder2 } from "@/data/sale/order";
import { getOrderSums } from "@/lib/sale/order";
import { initPromotionStocks } from "@/utils/sale/promotionStock";
import { initOtherCompanyPromotions } from "@/utils/sale/otherCompanyPromotion";
import { Button } from "@/components/ui/button";
import { bskyReport } from "@/data/sale/report";
import BusinessZoneSelector from "./BusinessZoneSelector";
import OtherCompanyPromotion from "./otherCompanyPromotion/OtherCompanyPromotion";
import PromotionStockInput from "./promotionStock/PromotionStockInput";
import Galmegi16Report from "./galmegi16shop/Galmegi16Report";
import { insertReport } from "@/action/report";
import { LoaderCircle } from "lucide-react";

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
  const [otherCompanyPromotions, setOtherCompanyPromotions] = useState<
    OtherCompanyPromotionResult[]
  >(initOtherCompanyPromotions);
  const [promotionStocks, setPromotionStocks] =
    useState<PromotionStock[]>(initPromotionStocks);
  const [isLoading, setIsLoading] = useState(false);

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
    setTotalBisness(Number(value));
  };

  const handleCalculateBtn = async () => {
    if (totalBisness === 0) {
      alert("방문업소 수를 입력해주세요!");
      return;
    }

    const updatedReport = calculatePercentages({ ...updatedBskyReport });
    setUpdatedBskyReport(updatedReport);
    setShowResult(true);
    setIsLoading(true);
    const sellers = Object.values(orders)
      .map((order) => order["0"])
      .join("");
    const response = await insertReport(
      selectedBusinessZone,
      totalBisness,
      updatedReport,
      orderSums,
      additionalOrderSums,
      sellers
    );
    if (!response) {
      console.error("Internal Server Error");
    }
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

  const handleOtherCompanyPromotion = (
    promotionResult: OtherCompanyPromotionResult
  ) => {
    setOtherCompanyPromotions((prev) => {
      const existingPromotionIndex = prev.findIndex(
        (promotion) => promotion.name === promotionResult.name
      );

      if (existingPromotionIndex !== -1) {
        const updatedPromotions = [...prev];
        updatedPromotions[existingPromotionIndex] = promotionResult;
        return updatedPromotions;
      } else {
        return [...prev, promotionResult];
      }
    });
  };

  const handlePromotionStockChange = (stocks: PromotionStock[]) => {
    setPromotionStocks(stocks);
  };

  return (
    <div className="p-4 max-w-[500px]">
      <section className="flex flex-row mb-4 items-center">
        <h1 className="text-lg pr-2">총 방문업소: </h1>
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 text-black"
          placeholder="0"
          onChange={(e) => handleTotalBisness(e.target.value)}
        />
        <span>개</span>
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
        {additionalInfoBusinessZones.includes(selectedBusinessZone) && (
          <>
            <OtherCompanyPromotion
              otherCompanyPromotions={otherCompanyPromotions}
              handleOtherCompanyPromotion={handleOtherCompanyPromotion}
            />
            <PromotionStockInput
              promotionStocks={promotionStocks}
              handlePromotionStockChange={handlePromotionStockChange}
            />
          </>
        )}
        <Button
          type="submit"
          className="my-2 bg-[#3967b3] hover:bg-[#3871cc] text-white font-semibold rounded p-2 w-full"
          disabled={isLoading}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "계산하기"}
        </Button>
        <p className="text-xs text-gray-600">
          ⚠️테이블 수를 수정했다면 &quot;계산하기&quot;를 눌러주세요.
        </p>
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
          otherCompanyPromotions={otherCompanyPromotions}
          promotionStocks={promotionStocks}
        />
      )}
      <Galmegi16Report businessZone={selectedBusinessZone} />
    </div>
  );
}
