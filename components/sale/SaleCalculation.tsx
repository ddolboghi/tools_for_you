"use client";

import { useState } from "react";
import Daesun from "./Daesun";
import Hite from "./Hite";
import Lotte from "./Lotte";
import Muhak from "./Muhak";
import { calculateAdjustedPercentages, sumTableNum } from "@/libs/sale";
import Result from "./Result";
import Order from "./Order";
import { AdditionalOrders, Drink, Orders, Percentages } from "@/utils/types";

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
  const [additionalOrders, setAdditionalOrders] = useState<AdditionalOrders>(
    {}
  );
  const [orderCount, setOrderCount] = useState<number>(1);

  const handleDrink = (company: string, index: number, value: string) => {
    setDrink((prev) => ({
      ...prev,
      [company]: {
        ...prev[company],
        [index]: Number(value),
      },
    }));
  };

  const muhakTotal = sumTableNum(drink["Muhak"]);
  const hiteTotal = sumTableNum(drink["Hite"]);
  const daesunTotal = sumTableNum(drink["Daesun"]);
  const lotteTotal = sumTableNum(drink["Lotte"]);
  const tableNum = muhakTotal + hiteTotal + daesunTotal + lotteTotal;

  const handleTotalBisness = (value: string) => {
    setTotalBisness(Number(value));
  };

  const handleCalculateBtn = () => {
    setPercentages(calculateAdjustedPercentages(drink, tableNum));
    setShowResult(true);
  };

  const handleOrderChange = (index: number, key: string, value: string) => {
    const numValue = Number(value);
    setOrders((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: key === "name" ? value : numValue,
      },
    }));

    if (key === "name") {
      setAdditionalOrders((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          name: value,
        },
      }));
    }
  };

  const addOrderLine = () => {
    setOrders((prev) => ({
      ...prev,
      [orderCount]: { name: "", goodDay: 0, toctoc: 0, galmegi: 0 },
    }));

    setAdditionalOrders((prev) => ({
      ...prev,
      [orderCount]: { name: "", goodDay: 0, toctoc: 0, galmegi: 0 },
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

  const handleAdditionalOrderChange = (
    index: number,
    key: string,
    value: string
  ) => {
    const numValue = Number(value);
    setAdditionalOrders((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]:
          key === "goodDay" || key === "toctoc" || key === "galmegi"
            ? numValue
            : 0,
      },
    }));
  };

  return (
    <div className="p-4">
      <section className="flex flex-row mb-4 items-center">
        <h1 className="text-lg pr-2">총 방문업소: </h1>
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1"
          placeholder="0"
          onChange={(e) => handleTotalBisness(e.target.value)}
        />
        <span>개</span>
      </section>
      <Muhak
        handleDrink={(index, value) => handleDrink("Muhak", index, value)}
      />
      <Hite handleDrink={(index, value) => handleDrink("Hite", index, value)} />
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
      />
      <button
        className="my-2 bg-blue-500 text-white rounded p-2 w-full"
        onClick={handleCalculateBtn}
      >
        계산하기
      </button>
      {showResult && (
        <Result
          totalBisness={totalBisness}
          drink={drink}
          percentages={percentages}
          orders={orders}
          additionalOrders={additionalOrders}
        />
      )}
    </div>
  );
}
