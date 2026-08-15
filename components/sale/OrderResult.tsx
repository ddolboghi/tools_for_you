"use client";

import { Orders, OrderSums } from "@/utils/sale/types";
import { formatOrderQuantities } from "@/utils/sale/order";

type OrderResultProps = {
  orders: Orders;
  additionalOrders: Orders;
  orderSums: OrderSums;
  additionalOrderSums: OrderSums;
};

export default function OrderResult({
  orders,
  additionalOrders,
  orderSums,
  additionalOrderSums,
}: OrderResultProps) {
  return (
    <section>
      <div>
        <h3>나. 총 전환: {formatOrderQuantities(orderSums, " / ")}</h3>
        {Object.values(orders).map((order, orderIdx) => (
          <p key={orderIdx}>
            {order[0]}: {formatOrderQuantities(order, " / ")}
          </p>
        ))}
      </div>
      <br />
      <div>
        <h3>다. 총 추가주문: {formatOrderQuantities(additionalOrderSums, " / ")}</h3>
        {Object.values(additionalOrders).map((order, orderIdx) => (
          <p key={orderIdx}>
            {order[0]}: {formatOrderQuantities(order, " / ")}
          </p>
        ))}
      </div>
    </section>
  );
}
