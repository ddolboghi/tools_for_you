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

export type OrderSums = { [key: string]: number };

export type ProviderSums = {
  muhak: number;
  hitejinro: number;
  daesunjujo: number;
  lotte: number;
  total: number;
};

export type ProviderPercentages = {
  muhak: number;
  hitejinro: number;
  daesunjujo: number;
  lotte: number;
};

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

export type ReportTables = {
  goodDay: number;
  toc: number;
  galmegi19: number;
  galmegi16: number;
  daesun: number;
  gangali: number;
  daesunEtc: number;
  chamisul: number;
  jinro: number;
  jinrogold: number;
  sero: number;
  serosalgu: number;
  chungha: number;
};

export type ReportPercentages = {
  goodDay: string | number;
  toc: string | number;
  galmegi19: string | number;
  galmegi16: string | number;
  daesun: string | number;
  gangali: string | number;
  daesunEtc: string | number;
  chamisul: string | number;
  jinro: string | number;
  jinrogold: string | number;
  sero: string | number;
  serosalgu: string | number;
  chungha: string | number;
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
