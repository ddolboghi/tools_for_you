export type Drink = {
  [key: string]: { [key: number]: number };
};

export type Percentages = {
  [key: string]: { [key: number]: number };
};

type OrdersDataType = {
  [key: number]: { [key: string]: number | string };
};

export type OrderSums = {
  1: number;
  2: number;
  3: number;
};

export type Orders = OrdersDataType;

export type AdditionalOrders = OrdersDataType;
