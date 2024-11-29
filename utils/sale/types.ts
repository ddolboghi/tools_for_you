export type Drink = {
  [key: string]: { [key: number]: number };
};

export type Percentages = {
  [key: string]: { [key: number]: number };
};

type OrdersDataType = {
  [key: number]: { [key: number]: number | string };
};

export type Orders = OrdersDataType;

export type OrderSums = { [key: number]: number };

type ReportBase = {
  sum: {
    muhak: number;
    hitejinro: number;
    daesunjujo: number;
    lotte: number;
  };
  goodDay: string;
  toc: string;
  daesun: string;
  gangali: string;
  daesunEtc: string;
  chamisul: string;
  jinro: string;
  jinrogold: string;
  sero: string;
  serosalgu: string;
  chungha: string;
};
type ReportWithTotal = ReportBase & { sum: { total: number } };

export type ReportTablesWithGalmegi = ReportWithTotal & {
  galmegi: string;
};

export type ReportTablesWithGalmegi16 = ReportWithTotal & {
  galmegi19: string;
  galmegi16: string;
};

export type ReportPercentagesWithGalmegi = ReportBase & {
  galmegi: string;
};

export type ReportPercentagesWithGalmegi16 = ReportBase & {
  galmegi19: string;
  galmegi16: string;
};

export function isReportWithGalmegi16(
  report:
    | ReportTablesWithGalmegi
    | ReportTablesWithGalmegi16
    | ReportPercentagesWithGalmegi
    | ReportPercentagesWithGalmegi16
): report is ReportTablesWithGalmegi16 | ReportPercentagesWithGalmegi16 {
  return "galmegi19" in report && "galmegi16" in report;
}
