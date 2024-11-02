export type Drink = {
  [key: string]: { [key: number]: number };
};

export type Percentages = {
  [key: string]: { [key: number]: number };
};

type OrdersDataType = {
  [key: number]: { [key: string]: number | string };
};

export type Orders = OrdersDataType;

export type AdditionalOrders = OrdersDataType;
