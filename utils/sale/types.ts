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
