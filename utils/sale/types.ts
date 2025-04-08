type OrdersDataType = {
  [key: number]: { [key: number]: number | string };
};

export type Orders = OrdersDataType;

export type OrderSums = { [key: string]: number };

export type GalmegiSums = {
  original19: number;
  original16: number;
  "19": number;
  "16": number;
  total: number;
};

export type OtherCompanyPromotionResult = {
  name: string;
  workerNumber: number | undefined;
  info: string;
};

export type PromotionStock = {
  name: string;
  quantity: number | undefined;
};

type ReportResult = {
  tables: number;
  percentage: number;
};

export type ReportCompany = {
  [key: string]: ReportResult;
};

export type BskyReport = {
  [key: string]: ReportCompany;
};
