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

/**
 * `orders` 객체를 배열 형태로 변환합니다.
 * 각 객체는 `"0"` key를 `name`으로 변환하고, 나머지 숫자 key들은 그대로 유지합니다.
 *
 * ### 예시
 * ```ts
 * const orders = {
 *   "1": { "0": "A", "1": 1, "2": 2, "3": 0 },
 *   "2": { "0": "B", "1": 2, "2": 3, "3": 1 }
 * };
 *
 * const result = transformOrdersToArray(orders);
 * // 결과:
 * // [
 * //   { name: 'A', 1: 1, 2: 2, 3: 0 },
 * //   { name: 'B', 1: 2, 2: 3, 3: 1 }
 * // ]
 * ```
 *
 * @param {Orders} orders - 숫자 key를 가진 주문 데이터 객체
 * @returns {Array<{ name: string } & Record<number, number>>} 변환된 주문 객체들의 배열
 */
export const transformOrdersToArray = (orders: Orders) => {
  return Object.values(orders).map((entry) => {
    const { 0: name, ...rest } = entry;
    return { name, ...rest };
  });
};
