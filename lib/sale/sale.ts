import { Drink, OrderSums } from "@/utils/sale/types";

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
  drink: Drink,
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

export const getProviderSums = (drink: Drink) => {
  const muhakTotal = sumTableNum(drink["Muhak"]);
  const hiteTotal = sumTableNum(drink["Hite"]);
  const daesunTotal = sumTableNum(drink["Daesun"]);
  const lotteTotal = sumTableNum(drink["Lotte"]);
  const totalTableNum = muhakTotal + hiteTotal + daesunTotal + lotteTotal;

  return {
    muhak: muhakTotal,
    hitejinro: hiteTotal,
    daesunjujo: daesunTotal,
    lotte: lotteTotal,
    total: totalTableNum,
  };
};

export const getProviderPercentages = (percentages: PercentageType) => {
  const muhakPercentage = sumPercentages(percentages["Muhak"]);
  const hitePercentage = sumPercentages(percentages["Hite"]);
  const daesunPercentage = sumPercentages(percentages["Daesun"]);
  const lottePercentage = sumPercentages(percentages["Lotte"]);

  return {
    muhak: muhakPercentage,
    hitejinro: hitePercentage,
    daesunjujo: daesunPercentage,
    lotte: lottePercentage,
  };
};

export const getGalmegiSums = (
  drink: Drink,
  orderSums: OrderSums,
  additionalOrderSums: OrderSums
) => {
  const originalGalmegi19Num = drink["Muhak"][3] || 0;
  const originalGalmegi16Num = drink["Muhak"][4] || 0;
  const galmegi19OrderNum = orderSums[3] + additionalOrderSums[3];
  const galmegi16OrderNum = orderSums[4] + additionalOrderSums[4];
  return {
    original19: originalGalmegi19Num,
    original16: originalGalmegi16Num,
    "19": galmegi19OrderNum,
    "16": galmegi16OrderNum,
    total:
      originalGalmegi19Num +
      originalGalmegi16Num +
      galmegi19OrderNum +
      galmegi16OrderNum,
  };
};
