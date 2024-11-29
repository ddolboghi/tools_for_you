export type Drink = {
  [key: string]: { [key: number]: number };
};

export type Percentages = {
  [key: string]: { [key: number]: number };
};

type OrderItem = {
  name: string;
  goodDay: number;
  toc: number;
} & (
  | { galmegi: number; galmegi19?: never; galmegi16?: never }
  | { galmegi?: never; galmegi19: number; galmegi16: number }
);

type OrdersDataType = {
  [key: number]: OrderItem;
};

export type OrderSums = { [key: number]: number };

export type Orders = OrdersDataType;

export type AdditionalOrders = OrdersDataType;

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
