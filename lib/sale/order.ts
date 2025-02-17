import { Orders, OrderSums } from "@/utils/sale/types";

export const getOrderSums = (orders: Orders) => {
  const orderSums: OrderSums = {};
  const keys = Object.keys(Object.values(orders)[0] || {});
  keys.forEach((key) => {
    if (Number(key) > 0) orderSums[Number(key)] = 0;
  });

  for (const order of Object.values(orders)) {
    Object.entries(order).forEach(([key, value]) => {
      if (key !== "0") {
        orderSums[Number(key)] += Number(value) || 0;
      }
    });
  }

  return orderSums;
};

export const getGalmegiSumByWorker = (
  orders: Orders,
  additionalOrders: Orders
) => {
  const galmegiSums: { [key: string]: number } = {};
  for (const order of Object.values(orders)) {
    galmegiSums[order[0]] = 0;
  }

  for (const order of Object.values(orders)) {
    galmegiSums[order[0]] += Number(order[2]) || 0;
  }
  for (const addiOrder of Object.values(additionalOrders)) {
    galmegiSums[addiOrder[0]] += Number(addiOrder[2]) || 0;
  }
  return galmegiSums;
};
