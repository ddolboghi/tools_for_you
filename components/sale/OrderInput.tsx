import { orderDrinks } from "@/data/sale/order";
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
      <div className="flex flex-row gap-1 mb-2">
        <label className="flex-1 min-w-0 text-xs">이름</label>
        {orderDrinks.map((drink) => (
          <label key={drink} className="flex-1 min-w-0 text-xs">
            {drink}
          </label>
        ))}
        <div className="w-6 shrink-0"></div>
      </div>
      {Object.keys(orders).map((key) => (
        <div key={key} className="flex flex-row gap-1 mb-2">
          <input
            className="border border-gray-300 rounded p-1 flex-1 min-w-0 text-black"
            placeholder="이름"
            value={orders[Number(key)][0] || ""}
            onChange={(e) => handleOrderChange(Number(key), 0, e.target.value)}
          />
          {orderDrinks.map((drink, drinkIdx) => (
            <input
              key={drink}
              type="number"
              pattern="\d*"
              className="border border-gray-300 rounded p-1 flex-1 min-w-0 text-black"
              placeholder="0"
              onChange={(e) =>
                handleOrderChange(Number(key), drinkIdx + 1, e.target.value)
              }
            />
          ))}
          <button
            className="bg-red-500 w-6 shrink-0 text-white rounded"
            onClick={() => removeOrderLine(Number(key))}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
