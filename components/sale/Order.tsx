"use client";

import { getOrderSums } from "@/libs/sale/sale";
import { AdditionalOrders, Orders } from "@/utils/sale/types";
import { useMemo, useState } from "react";

type OrderProps = {
  orders: Orders;
  additionalOrders: AdditionalOrders;
  handleOrderChange: (index: number, key: string, value: string) => void;
  addOrderLine: (onSplit: boolean) => void;
  removeOrderLine: (index: number) => void;
  handleAdditionalOrderChange: (
    index: number,
    key: string,
    value: string
  ) => void;
};

export default function Order({
  orders,
  additionalOrders,
  handleOrderChange,
  addOrderLine,
  removeOrderLine,
  handleAdditionalOrderChange,
}: OrderProps) {
  const [onSplit, setOnSplit] = useState(false);

  const orderSums = useMemo(() => getOrderSums(orders), [orders]);

  const additionalOrderSums = useMemo(
    () => getOrderSums(additionalOrders),
    [additionalOrders]
  );

  const handleGalmegiSplit = () => {
    setOnSplit(!onSplit);
  };

  const handleAddWorker = () => {
    addOrderLine(onSplit);
  };
  console.log(additionalOrderSums);
  return (
    <div className="border border-gray-300 rounded p-4">
      <div className="flex flex-row justify-start items-center gap-3">
        <h1 className="text-lg font-bold">전환 및 추가주문</h1>
        <button
          type="button"
          className="bg-blue-500 text-white rounded p-2"
          onClick={handleAddWorker}
        >
          인원 추가하기
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white rounded"
          onClick={handleGalmegiSplit}
        >
          갈매기 19,16 나누기
        </button>
      </div>
      <section className="mb-4 text-sm">
        {onSplit ? (
          <h2 className="py-2 font-bold">
            전환: {orderSums[1]}t(좋은데이)/{orderSums[2]}t(톡소다)/
            {orderSums[3]}t(부산갈매기19)/{orderSums[4]}t(부산갈매기16)
          </h2>
        ) : (
          <h2 className="py-2 font-bold">
            전환: {orderSums[1]}t(좋은데이)/{orderSums[2]}t(톡소다)/
            {orderSums[3]}t(부산갈매기)
          </h2>
        )}
        <div className="flex flex-col mb-2">
          <div className="flex flex-row mb-1 justify-evenly">
            <label className="w-1/5">이름</label>
            <label className="w-1/5">좋은데이</label>
            <label className="w-1/5">톡소다</label>
            {onSplit ? (
              <>
                <label className="w-1/5 text-xs">부산갈매기19</label>
                <label className="w-1/5 text-xs">부산갈매기16</label>
              </>
            ) : (
              <label className="w-1/5">부산갈매기</label>
            )}
          </div>
          {Object.keys(orders).map((key) => (
            <div key={key} className="flex flex-row mb-2">
              <input
                className="border border-gray-300 rounded p-1 w-1/4 mr-2"
                placeholder="이름"
                value={orders[Number(key)]["name"] || ""}
                onChange={(e) =>
                  handleOrderChange(Number(key), "name", e.target.value)
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mr-2"
                placeholder="0"
                onChange={(e) =>
                  handleOrderChange(Number(key), "goodDay", e.target.value)
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                placeholder="0"
                onChange={(e) =>
                  handleOrderChange(Number(key), "toc", e.target.value)
                }
              />
              {onSplit ? (
                <>
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                    placeholder="0"
                    onChange={(e) =>
                      handleOrderChange(
                        Number(key),
                        "galmegi19",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                    placeholder="0"
                    onChange={(e) =>
                      handleOrderChange(
                        Number(key),
                        "galmegi16",
                        e.target.value
                      )
                    }
                  />
                </>
              ) : (
                <input
                  type="number"
                  pattern="\d*"
                  className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                  placeholder="0"
                  onChange={(e) =>
                    handleOrderChange(Number(key), "galmegi", e.target.value)
                  }
                />
              )}
              <button
                className="bg-red-500 text-white rounded p-1 ml-2"
                onClick={() => removeOrderLine(Number(key))}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-4 text-sm">
        {onSplit ? (
          <h2 className="py-2 font-bold">
            추가주문: {additionalOrderSums[1]}t(좋은데이)/
            {additionalOrderSums[2]}
            t(톡소다)/{additionalOrderSums[3]}t(부산갈매기19)/
            {additionalOrderSums[4]}t(부산갈매기16)
          </h2>
        ) : (
          <h2 className="py-2 font-bold">
            추가주문: {additionalOrderSums[1]}t(좋은데이)/
            {additionalOrderSums[2]}
            t(톡소다)/{additionalOrderSums[3]}t(부산갈매기)
          </h2>
        )}
        <div className="flex flex-col mb-2">
          <div className="flex flex-row mb-1 justify-evenly">
            <label className="w-1/5">이름</label>
            <label className="w-1/5">좋은데이</label>
            <label className="w-1/5">톡소다</label>
            {onSplit ? (
              <>
                <label className="w-1/5 text-xs">부산갈매기19</label>
                <label className="w-1/5 text-xs">부산갈매기16</label>
              </>
            ) : (
              <label className="w-1/5">부산갈매기</label>
            )}
          </div>
          {Object.keys(additionalOrders).map((key) => (
            <div key={key} className="flex flex-row mb-2">
              <input
                className="border border-gray-300 rounded p-1 w-1/4 mr-2"
                placeholder="이름"
                value={orders[Number(key)]["name"] || ""}
                onChange={(e) =>
                  handleOrderChange(Number(key), "name", e.target.value)
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                placeholder="0"
                onChange={(e) =>
                  handleAdditionalOrderChange(
                    Number(key),
                    "goodDay",
                    e.target.value
                  )
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                placeholder="0"
                onChange={(e) =>
                  handleAdditionalOrderChange(
                    Number(key),
                    "toc",
                    e.target.value
                  )
                }
              />
              {onSplit ? (
                <>
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                    placeholder="0"
                    onChange={(e) =>
                      handleAdditionalOrderChange(
                        Number(key),
                        "galmegi19",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                    placeholder="0"
                    onChange={(e) =>
                      handleAdditionalOrderChange(
                        Number(key),
                        "galmegi16",
                        e.target.value
                      )
                    }
                  />
                </>
              ) : (
                <input
                  type="number"
                  pattern="\d*"
                  className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                  placeholder="0"
                  onChange={(e) =>
                    handleAdditionalOrderChange(
                      Number(key),
                      "galmegi",
                      e.target.value
                    )
                  }
                />
              )}
              <button
                className="bg-red-500 text-white rounded p-1 ml-2"
                onClick={() => removeOrderLine(Number(key))}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
