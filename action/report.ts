"use server";

import { supabaseClient } from "@/utils/getSupabaseClient";
import { transformOrdersToArray } from "@/utils/sale/order";
import { BskyReport, Orders } from "@/utils/sale/types";

export const insertReport = async (
  businessZone: string,
  visitShopNumber: number,
  calculationResult: BskyReport,
  sellers: string,
  orders: Orders,
  additionalOrders: Orders
) => {
  try {
    const transformedOrders = transformOrdersToArray(orders);
    const transformedAdditionalOrders =
      transformOrdersToArray(additionalOrders);

    const { error } = await supabaseClient
      .from("report")
      .insert([
        {
          business_zone: businessZone,
          visit_shop_number: visitShopNumber,
          calculation_result: calculationResult,
          sellers: sellers,
          orders: transformedOrders,
          additional_orders: transformedAdditionalOrders,
        },
      ])
      .select();

    if (error) {
      throw error;
    }
    return true;
  } catch (e) {
    return false;
  }
};
