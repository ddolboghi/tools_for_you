"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Galmegi16Shop } from "@/utils/sale/galmegi16ShopTypes";
import { revalidateTag } from "next/cache";

export const getShops = async (businessZone: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/galmegi16_shop?select=id,name&business_zone=eq.${businessZone}&order=created_at.asc`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        next: { tags: ["fetchShops"] },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Galmegi16Shop[];
    return data;
  } catch (error) {
    return null;
  }
};

export const insertShop = async (businessZone: string, shopName: string) => {
  try {
    const { error } = await supabaseClient.from("galmegi16_shop").insert([
      {
        business_zone: businessZone,
        name: shopName,
      },
    ]);

    if (error) {
      throw error;
    }

    revalidateTag("fetchShops");
    return true;
  } catch (error) {
    return false;
  }
};

export const updateShop = async (shopId: number, shopName: string) => {
  try {
    const { error } = await supabaseClient
      .from("galmegi16_shop")
      .update({ name: shopName })
      .eq("id", shopId);

    if (error) {
      throw error;
    }

    revalidateTag("fetchShops");
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteShop = async (shopId: number) => {
  try {
    const { error } = await supabaseClient
      .from("galmegi16_shop")
      .delete()
      .eq("id", shopId);

    if (error) {
      throw error;
    }

    revalidateTag("fetchShops");
    return true;
  } catch (error) {
    return false;
  }
};
