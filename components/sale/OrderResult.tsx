"use client";

import { Orders, OrderSums } from "@/utils/sale/types";

type OrderResultProps = {
  onSplit: boolean;
  orders: Orders;
  additionalOrders: Orders;
  orderSums: OrderSums;
  additionalOrderSums: OrderSums;
};

export default function OrderResult({
  onSplit,
  orders,
  additionalOrders,
  orderSums,
  additionalOrderSums,
}: OrderResultProps) {
  console.log(orderSums, additionalOrderSums);
  if (onSplit) {
    return (
      <section>
        <div>
          <h3>
            나. 전환: {orderSums[1] || 0}t(좋은데이) / {orderSums[2] || 0}
            t(톡소다) / {orderSums[3] || 0}t(부산갈매기19) / {orderSums[4] || 0}
            t(부산갈매기16)
          </h3>
          {Object.values(orders).map((order, orderIdx) => (
            <p key={orderIdx}>
              {order[0]}: {order[1] || ""}t(좋은데이) / {order[2] || ""}
              t(톡소다) / {order[3] || ""}t(부산갈매기19) / {order[4] || ""}
              t(부산갈매기16)
            </p>
          ))}
        </div>
        <br />
        <div>
          <h3>
            다. 추가주문: {additionalOrderSums[1] || 0}t(좋은데이) /{" "}
            {additionalOrderSums[2] || 0}
            t(톡소다) / {additionalOrderSums[3] || 0}t(부산갈매기19) /{" "}
            {additionalOrderSums[4] || 0}t(부산갈매기16)
          </h3>
          {Object.values(additionalOrders).map((order, orderIdx) => (
            <p key={orderIdx}>
              {order[0]}: {order[1] || ""}t(좋은데이) / {order[2] || ""}
              t(톡소다) / {order[3] || ""}t(부산갈매기19) / {order[4] || ""}
              t(부산갈매기16)
            </p>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section>
      <div>
        <h3>
          나. 전환: {orderSums[1] || 0}t(좋은데이) / {orderSums[2] || 0}
          t(톡소다) / {orderSums[3] || 0}t(부산갈매기)
        </h3>
        {Object.values(orders).map((order, orderIdx) => (
          <p key={orderIdx}>
            {order[0]}: {order[1] || ""}t(좋은데이) / {order[2] || ""}
            t(톡소다) / {order[3] || ""}
            t(부산갈매기)
          </p>
        ))}
      </div>
      <br />
      <div>
        <h3>
          다. 추가주문: {additionalOrderSums[1] || 0}t(좋은데이) /{" "}
          {additionalOrderSums[2] || 0}
          t(톡소다) / {additionalOrderSums[3] || 0}t(부산갈매기)
        </h3>
        {Object.values(additionalOrders).map((order, orderIdx) => (
          <p key={orderIdx}>
            {order[0]}: {order[1] || ""}t(좋은데이) / {order[2] || ""}t(톡소다)
            / {order[3] || ""}
            t(부산갈매기)
          </p>
        ))}
      </div>
    </section>
  );
}
