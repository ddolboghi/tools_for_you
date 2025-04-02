"use client";

import { Button } from "@/components/ui/button";
import { Orders, OrderSums } from "@/utils/sale/types";
import OrderInput from "./OrderInput";

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
  orderSums,
  additionalOrderSums,
}: OrderProps) {
  return (
    <div className="border border-gray-300 rounded p-4">
      <div className="flex flex-row justify-start items-center gap-3">
        <h1 className="text-lg font-bold">전환 및 추가주문</h1>
        <Button type="button" onClick={addOrderLine}>
          인원 추가하기
        </Button>
      </div>
      <section className="mb-4 text-sm">
        <h2 className="py-2 font-bold">
          전환: {orderSums[1]}t(좋은데이)/{orderSums[2]}t(부산갈매기)/
          {orderSums[3]}t(톡톡)
        </h2>
        <OrderInput
          orders={orders}
          handleOrderChange={handleOrderChange}
          removeOrderLine={removeOrderLine}
        />
      </section>
      <section className="mb-4 text-sm">
        <h2 className="py-2 font-bold">
          추가주문: {additionalOrderSums[1]}t(좋은데이)/{additionalOrderSums[2]}
          t(부산갈매기)/
          {additionalOrderSums[3]}
          t(톡톡)
        </h2>
        <OrderInput
          orders={additionalOrders}
          handleOrderChange={handleAdditionalOrderChange}
          removeOrderLine={removeOrderLine}
        />
      </section>
    </div>
  );
}
