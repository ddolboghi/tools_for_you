"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { BskyReport, OrderSums } from "@/utils/sale/types";

export const insertReport = async (
  businessZone: string,
  visitShopNumber: number,
  calculationResult: BskyReport,
  orderSums: OrderSums,
  additionalOrderSums: OrderSums,
  sellers: string
) => {
  try {
    const { error } = await supabaseClient
      .from("report")
      .insert([
        {
          business_zone: businessZone,
          visit_shop_number: visitShopNumber,
          calculation_result: calculationResult,
          order_sums: orderSums,
          additional_order_sums: additionalOrderSums,
          sellers: sellers,
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
