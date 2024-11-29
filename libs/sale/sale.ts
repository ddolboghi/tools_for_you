import { Orders, OrderSums } from "@/utils/sale/types";

export const sumTableNum = (drinkOfCompany: { [key: number]: number }) => {
  return Object.values(drinkOfCompany).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
};

export const sumPercentages = (percentagesOfCompany: {
  [key: number]: number;
}) => {
  return (
    Math.round(
      Object.values(percentagesOfCompany).reduce((acc, cur) => acc + cur, 0) *
        10
    ) / 10
  );
};

type PercentageType = { [key: string]: { [key: number]: number } };

export const calculateAdjustedPercentages = (
  drink: { [key: string]: { [key: number]: number } },
  tableNum: number
): PercentageType => {
  const newPercentages: PercentageType = {};
  let totalPercentage = 0;

  // 초기 백분율 계산
  Object.entries(drink).forEach(([company, values]) => {
    newPercentages[company] = {};
    Object.entries(values).forEach(([index, value]) => {
      if (value > 0) {
        const percentage = (value / tableNum) * 100;
        const roundedPercentage = Math.round(percentage * 10) / 10;
        newPercentages[company][Number(index)] = roundedPercentage;
        totalPercentage += roundedPercentage;
      }
    });
  });

  // 총합이 100이 아닌 경우 조정
  let diff = (1000 - totalPercentage * 10) / 10;
  if (diff !== 0) {
    // 구조를 배열로 변환하고 주류 개수를 기준으로 오름차순 정렬
    const allPercentages: [string, number, number][] = [];
    Object.entries(newPercentages).forEach(([company, values]) => {
      Object.entries(values).forEach(([index, value]) => {
        allPercentages.push([company, Number(index), value]);
      });
    });
    allPercentages.sort((a, b) => a[2] - b[2]);

    // 가장 작은 값부터 +-0.1 더하기
    let i = 0;
    while (Math.abs(diff) > 0.001) {
      // 부동소수점 오차를 고려한 종료 조건
      const [company, index] = allPercentages[i % allPercentages.length];

      let adjustment = 0;
      if (diff > 0) {
        adjustment = 0.1;
      } else if (diff < 0) {
        adjustment = -0.1;
      }

      newPercentages[company][index] += adjustment;
      newPercentages[company][index] =
        Math.round(newPercentages[company][index] * 10) / 10;

      diff -= adjustment;
      i++;
    }
  }
  return newPercentages;
};

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
