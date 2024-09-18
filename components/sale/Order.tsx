"use client";

type OrderProps = {
  orders: {
    [key: number]: { [key: string]: number | string };
  };
  additionalOrders: {
    [key: number]: { [key: string]: number | string };
  };
  handleOrderChange: (index: number, key: string, value: string) => void;
  addOrderLine: () => void;
  removeOrderLine: (index: number) => void;
  handleAdditionalOrderChange: (
    index: number,
    key: string,
    value: string
  ) => void;
  addAdditionalOrderLine: () => void;
  removeAdditionalOrderLine: (index: number) => void;
};

export default function Order({
  orders,
  additionalOrders,
  handleOrderChange,
  addOrderLine,
  removeOrderLine,
  handleAdditionalOrderChange,
  addAdditionalOrderLine,
  removeAdditionalOrderLine,
}: OrderProps) {
  const orderSums = { 1: 0, 2: 0, 3: 0 };
  for (const order of Object.values(orders)) {
    orderSums[1] += Number(order["goodDay"]) || 0;
    orderSums[2] += Number(order["toctoc"]) || 0;
    orderSums[3] += Number(order["galmegi"]) || 0;
  }

  const additionalOrderSums = { 1: 0, 2: 0, 3: 0 };
  for (const addi of Object.values(additionalOrders)) {
    additionalOrderSums[1] += Number(addi["goodDay"]) || 0;
    additionalOrderSums[2] += Number(addi["toctoc"]) || 0;
    additionalOrderSums[3] += Number(addi["galmegi"]) || 0;
  }

  return (
    <div className="border border-gray-300 rounded p-4">
      <h1 className="text-lg font-bold">전환 및 추가주문</h1>
      <section className="mb-4 text-sm">
        <h2 className="py-2 font-bold">
          전환: {orderSums[1]}t(좋은데이)/{orderSums[2]}t(톡소다)/
          {orderSums[3]}t(부산갈매기)
        </h2>
        <div className="flex flex-col mb-2">
          <div className="flex flex-row mb-1">
            <label className="w-1/4">이름</label>
            <label className="w-1/4">t(좋은데이)</label>
            <label className="w-1/4">t(톡소다)</label>
            <label className="w-1/4">t(부산갈매기)</label>
          </div>
          {Object.keys(orders).map((key) => (
            <div key={key} className="flex flex-row mb-2">
              <input
                className="border border-gray-300 rounded p-1 w-1/4 mr-2"
                placeholder="이름"
                onChange={(e) =>
                  handleOrderChange(Number(key), "name", e.target.value)
                }
              />
              <input
                className="border border-gray-300 rounded p-1 w-1/4 mr-2"
                placeholder="0"
                onChange={(e) =>
                  handleOrderChange(Number(key), "goodDay", e.target.value)
                }
              />
              <input
                className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                placeholder="0"
                onChange={(e) =>
                  handleOrderChange(Number(key), "toctoc", e.target.value)
                }
              />
              <input
                className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                placeholder="0"
                onChange={(e) =>
                  handleOrderChange(Number(key), "galmegi", e.target.value)
                }
              />
              <button
                className="bg-red-500 text-white rounded p-1 ml-2"
                onClick={() => removeOrderLine(Number(key))}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 text-white rounded p-2"
          onClick={addOrderLine}
        >
          인원 추가하기
        </button>
      </section>
      <section className="mb-4 text-sm">
        <h2 className="py-2 font-bold">
          추가주문: {additionalOrderSums[1]}t(좋은데이)/{additionalOrderSums[2]}
          t(톡소다)/{additionalOrderSums[3]}t(부산갈매기)
        </h2>
        <div className="flex flex-col mb-2">
          <div className="flex flex-row mb-1">
            <label className="w-1/4">이름</label>
            <label className="w-1/4">t(좋은데이)</label>
            <label className="w-1/4">t(톡소다)</label>
            <label className="w-1/4">t(부산갈매기)</label>
          </div>
          {Object.keys(additionalOrders).map((key) => (
            <div key={key} className="flex flex-row mb-2">
              <input
                className="border border-gray-300 rounded p-1 w-1/4 mr-2"
                placeholder="이름"
                onChange={(e) =>
                  handleAdditionalOrderChange(
                    Number(key),
                    "name",
                    e.target.value
                  )
                }
              />
              <input
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
                className="border border-gray-300 rounded p-1 w-1/4 mx-2"
                placeholder="0"
                onChange={(e) =>
                  handleAdditionalOrderChange(
                    Number(key),
                    "toctoc",
                    e.target.value
                  )
                }
              />
              <input
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
              <button
                className="bg-red-500 text-white rounded p-1 ml-2"
                onClick={() => removeAdditionalOrderLine(Number(key))}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 text-white rounded p-2"
          onClick={addAdditionalOrderLine}
        >
          인원 추가하기
        </button>
      </section>
    </div>
  );
}
