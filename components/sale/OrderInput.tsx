import { Orders } from "@/utils/sale/types";

type OrderInputProps = {
  orders: Orders;
  handleOrderChange: (index: number, key: number, value: string) => void;
  removeOrderLine: (index: number) => void;
};

export default function OrderInput({
  orders,
  handleOrderChange,
  removeOrderLine,
}: OrderInputProps) {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex flex-row gap-2 mb-2">
        <label className="w-1/4">이름</label>
        <label className="w-1/4">좋은데이</label>
        <label className="w-1/4 text-xs flex flex-col justify-center">
          부산갈매기
        </label>
        <label className="w-1/4">톡톡</label>
        <div className="w-1/12"></div>
      </div>
      {Object.keys(orders).map((key) => (
        <div key={key} className="flex flex-row gap-2 mb-2">
          <input
            className="border border-gray-300 rounded p-1 w-1/4 text-black"
            placeholder="이름"
            value={orders[Number(key)][0] || ""}
            onChange={(e) => handleOrderChange(Number(key), 0, e.target.value)}
          />
          <input
            type="number"
            pattern="\d*"
            className="border border-gray-300 rounded p-1 w-1/4 text-black"
            placeholder="0"
            onChange={(e) => handleOrderChange(Number(key), 1, e.target.value)}
          />
          <input
            type="number"
            pattern="\d*"
            className="border border-gray-300 rounded p-1 w-1/4 text-black"
            placeholder="0"
            onChange={(e) => handleOrderChange(Number(key), 2, e.target.value)}
          />
          <input
            type="number"
            pattern="\d*"
            className="border border-gray-300 rounded p-1 w-1/4 text-black"
            placeholder="0"
            onChange={(e) => handleOrderChange(Number(key), 3, e.target.value)}
          />
          <button
            className="bg-red-500 w-1/12 text-white rounded"
            onClick={() => removeOrderLine(Number(key))}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
