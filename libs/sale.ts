import { AdditionalOrders, Orders } from "@/utils/types";

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
      const percentage = (value / tableNum) * 100;
      const roundedPercentage = Math.round(percentage * 10) / 10;
      newPercentages[company][Number(index)] = roundedPercentage;
      totalPercentage += roundedPercentage;
    });
  });

  // 총합이 100이 아닌 경우 조정
  let diff = (1000 - totalPercentage * 10) / 10;
  if (diff !== 0) {
    // 모든 퍼센티지를 배열로 변환하고 오름차순으로 정렬
    const allPercentages: [string, number, number][] = [];
    Object.entries(newPercentages).forEach(([company, values]) => {
      Object.entries(values).forEach(([index, value]) => {
        allPercentages.push([company, Number(index), value]);
      });
    });
    allPercentages.sort((a, b) => a[2] - b[2]);

    // 가장 작은 값부터 0.1씩 더하기
    let i = 0;
    while (Math.abs(diff) > 0.001) {
      // 부동소수점 오차를 고려한 종료 조건
      const [company, index, value] = allPercentages[i % allPercentages.length];
      const adjustment = diff > 0 ? 0.1 : -0.1;

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
  const orderSums = { 1: 0, 2: 0, 3: 0 };
  for (const order of Object.values(orders)) {
    orderSums[1] += Number(order["goodDay"]) || 0;
    orderSums[2] += Number(order["toctoc"]) || 0;
    orderSums[3] += Number(order["galmegi"]) || 0;
  }
  return orderSums;
};

export const getAdditionalOrderSums = (additionalOrders: AdditionalOrders) => {
  const additionalOrderSums = { 1: 0, 2: 0, 3: 0 };
  for (const addi of Object.values(additionalOrders)) {
    additionalOrderSums[1] += Number(addi["goodDay"]) || 0;
    additionalOrderSums[2] += Number(addi["toctoc"]) || 0;
    additionalOrderSums[3] += Number(addi["galmegi"]) || 0;
  }
  return additionalOrderSums;
};
