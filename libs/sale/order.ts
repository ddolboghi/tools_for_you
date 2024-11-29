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

export const getInitOrder = (onSplit: boolean, orders: Orders): Orders => {
  if (onSplit) {
    Object.keys(orders).forEach((key) => {
      orders[Number(key)][3] = 0;
      orders[Number(key)][4] = 0;
    });
    return orders;
  }
  Object.keys(orders).forEach((key) => {
    orders[Number(key)][3] = 0;
    delete orders[Number(key)][4];
  });
  return orders;
};

export const getInitOrderSums = (onSplit: boolean, orderSums: OrderSums) => {
  if (onSplit) {
    orderSums[3] = 0;
    orderSums[4] = 0;
    return orderSums;
  }
  orderSums[3] = 0;
  delete orderSums[4];
  return orderSums;
};
