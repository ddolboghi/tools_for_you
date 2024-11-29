"use client";

import { Orders, OrderSums } from "@/utils/sale/types";

type OrderProps = {
  orders: Orders;
  additionalOrders: Orders;
  handleOrderChange: (index: number, key: number, value: string) => void;
  addOrderLine: () => void;
  removeOrderLine: (index: number) => void;
  handleAdditionalOrderChange: (
    index: number,
    key: number,
    value: string
  ) => void;
  onSplit: boolean;
  orderSums: OrderSums;
  additionalOrderSums: OrderSums;
};

export default function Order({
  orders,
  additionalOrders,
  handleOrderChange,
  addOrderLine,
  removeOrderLine,
  handleAdditionalOrderChange,
  onSplit,
  orderSums,
  additionalOrderSums,
}: OrderProps) {
  return (
    <div className="border border-gray-300 rounded p-4">
      <div className="flex flex-row justify-start items-center gap-3">
        <h1 className="text-lg font-bold">전환 및 추가주문</h1>
        <button
          type="button"
          className="bg-blue-500 text-white rounded p-2"
          onClick={addOrderLine}
        >
          인원 추가하기
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
                className="border border-gray-300 rounded p-1 w-1/4 mr-2 text-black"
                placeholder="이름"
                value={orders[Number(key)][0] || ""}
                onChange={(e) =>
                  handleOrderChange(Number(key), 0, e.target.value)
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mr-2 text-black"
                placeholder="0"
                onChange={(e) =>
                  handleOrderChange(Number(key), 1, e.target.value)
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                placeholder="0"
                onChange={(e) =>
                  handleOrderChange(Number(key), 2, e.target.value)
                }
              />
              {onSplit ? (
                <>
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                    placeholder="0"
                    onChange={(e) =>
                      handleOrderChange(Number(key), 3, e.target.value)
                    }
                  />
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                    placeholder="0"
                    onChange={(e) =>
                      handleOrderChange(Number(key), 4, e.target.value)
                    }
                  />
                </>
              ) : (
                <input
                  type="number"
                  pattern="\d*"
                  className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                  placeholder="0"
                  onChange={(e) =>
                    handleOrderChange(Number(key), 3, e.target.value)
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
                className="border border-gray-300 rounded p-1 w-1/4 mr-2 text-black"
                placeholder="이름"
                value={orders[Number(key)][0] || ""}
                onChange={(e) =>
                  handleOrderChange(Number(key), 0, e.target.value)
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                placeholder="0"
                onChange={(e) =>
                  handleAdditionalOrderChange(Number(key), 1, e.target.value)
                }
              />
              <input
                type="number"
                pattern="\d*"
                className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                placeholder="0"
                onChange={(e) =>
                  handleAdditionalOrderChange(Number(key), 2, e.target.value)
                }
              />
              {onSplit ? (
                <>
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                    placeholder="0"
                    onChange={(e) =>
                      handleAdditionalOrderChange(
                        Number(key),
                        3,
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="number"
                    pattern="\d*"
                    className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                    placeholder="0"
                    onChange={(e) =>
                      handleAdditionalOrderChange(
                        Number(key),
                        4,
                        e.target.value
                      )
                    }
                  />
                </>
              ) : (
                <input
                  type="number"
                  pattern="\d*"
                  className="border border-gray-300 rounded p-1 w-1/4 mx-2 text-black"
                  placeholder="0"
                  onChange={(e) =>
                    handleAdditionalOrderChange(Number(key), 3, e.target.value)
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
