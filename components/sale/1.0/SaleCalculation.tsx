"use client";

import { FormEvent, useEffect, useState } from "react";
import Daesun from "./Daesun";
import Hite from "./Hite";
import Lotte from "./Lotte";
import Muhak from "./Muhak";
import { calculateAdjustedPercentages, sumTableNum } from "@/lib/sale/1.0/sale";
import Result from "../1.0/Result";
import Order from "../1.0/Order";
import {
  Drink,
  Orders,
  OtherCompanyPromotionResult,
  Percentages,
  PromotionStock,
} from "@/utils/sale/types";
import BusinessZoneSelector from "../BusinessZoneSelector";
import {
  additionalInfoBusinessZones,
  businessZones,
} from "@/utils/sale/businessZones";
import { initOrder1 } from "@/data/sale/order";
import { getOrderSums } from "@/lib/sale/order";
import Galmegi16Report from "../galmegi16shop/Galmegi16Report";
import OtherCompanyPromotion from "../otherCompanyPromotion/OtherCompanyPromotion";
import PromotionStockInput from "../promotionStock/PromotionStockInput";
import { initPromotionStocks } from "@/utils/sale/promotionStock";
import { initOtherCompanyPromotions } from "@/utils/sale/otherCompanyPromotion";

export default function SaleCalculation() {
  const [drink, setDrink] = useState<Drink>({
    Muhak: {},
    Hite: {},
    Daesun: {},
    Lotte: {},
  });
  const [percentages, setPercentages] = useState<Percentages>({
    Muhak: {},
    Hite: {},
    Daesun: {},
    Lotte: {},
  });
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

  useEffect(() => {
    setOrderSums(getOrderSums(orders));
  }, [orders]);

  useEffect(() => {
    setAdditionalOrderSums(getOrderSums(additionalOrders));
  }, [additionalOrders]);

  const handleDrink = (company: string, index: number, value: string) => {
    setDrink((prev) => ({
      ...prev,
      [company]: {
        ...prev[company],
        [index]: Number(value),
      },
    }));
  };

  const handleTotalBisness = (value: string) => {
    setTotalBisness(Number(value));
  };

  const handleCalculateBtn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const muhakTotal = sumTableNum(drink["Muhak"]);
    const hiteTotal = sumTableNum(drink["Hite"]);
    const daesunTotal = sumTableNum(drink["Daesun"]);
    const lotteTotal = sumTableNum(drink["Lotte"]);
    const tableNum = muhakTotal + hiteTotal + daesunTotal + lotteTotal;
    setPercentages(calculateAdjustedPercentages(drink, tableNum));
    setShowResult(true);
  };

  const addOrderLine = () => {
    setOrders((prev) => ({
      ...prev,
      [orderCount]: initOrder1,
    }));

    setAdditionalOrders((prev) => ({
      ...prev,
      [orderCount]: initOrder1,
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
    <div className="p-4">
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
      <form onSubmit={(e) => handleCalculateBtn(e)}>
        <Muhak
          handleDrink={(index, value) => handleDrink("Muhak", index, value)}
        />
        <Hite
          handleDrink={(index, value) => handleDrink("Hite", index, value)}
        />
        <Daesun
          handleDrink={(index, value) => handleDrink("Daesun", index, value)}
        />
        <Lotte
          handleDrink={(index, value) => handleDrink("Lotte", index, value)}
        />
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
        <button
          type="submit"
          className="my-2 bg-blue-500 text-white rounded p-2 w-full"
        >
          계산하기
        </button>
      </form>
      {showResult && (
        <Result
          drink={drink}
          percentages={percentages}
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
