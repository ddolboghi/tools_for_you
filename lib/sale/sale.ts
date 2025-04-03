import { BskyReport, ReportCompany } from "@/utils/sale/types";

export const getTotalTableNum = (bskyReport: BskyReport) => {
  return Object.values(bskyReport)
    .flatMap((category) => Object.values(category))
    .reduce((sum, item) => sum + item.tables, 0);
};

export const getTotalOccupancyNumByCompany = (
  reportCompany: ReportCompany,
  isRatio: boolean
): number => {
  return (
    Math.round(
      Object.values(reportCompany).reduce(
        (sum, result) => sum + (isRatio ? result.percentage : result.tables),
        0
      ) * 10
    ) / 10
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

export const calculatePercentages = (bskyReport: BskyReport): BskyReport => {
  const totalTableNum = getTotalTableNum(bskyReport);
  if (totalTableNum === 0) return bskyReport;

  let totalPercentage = 0;

  // 초기 백분율 계산
  Object.values(bskyReport).forEach((occupancyReslut) => {
    Object.values(occupancyReslut).forEach((result) => {
      if (result.tables >= 0) {
        const percentage = (result.tables / totalTableNum) * 100;
        const roundedPercentage = Math.round(percentage * 10) / 10;
        result.percentage = roundedPercentage;
        totalPercentage += roundedPercentage;
      }
    });
  });

  // 총합이 100이 아닌 경우 조정
  let diff = (1000 - totalPercentage * 10) / 10;
  if (diff !== 0) {
    // 구조를 배열로 변환하고 주류 개수를 기준으로 오름차순 정렬
    const allPercentages: [string, string, number][] = [];
    Object.entries(bskyReport).forEach(([company, occupancyReslut]) => {
      Object.entries(occupancyReslut).forEach(([drink, result]) => {
        if (result.percentage > 0) {
          allPercentages.push([company, drink, result.percentage]);
        }
      });
    });
    allPercentages.sort((a, b) => a[2] - b[2]);

    // 가장 작은 값부터 +-0.1 더하기
    let i = 0;
    while (allPercentages.length > 0 && Math.abs(diff) > 0.001) {
      const [company, drink] = allPercentages[i % allPercentages.length];

      let adjustment = 0;
      if (diff > 0) {
        adjustment = 0.1;
      } else if (diff < 0) {
        adjustment = -0.1;
      }

      bskyReport[company][drink].percentage += adjustment;
      bskyReport[company][drink].percentage =
        Math.round(bskyReport[company][drink].percentage * 10) / 10;

      diff -= adjustment;
      i++;
    }
  }

  return bskyReport;
};
