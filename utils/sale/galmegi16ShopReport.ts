import { Galmegi16Shop } from "@/utils/sale/galmegi16ShopTypes";

export const getGalmegi16ShopReport = (
  businessZone: string,
  shopList: Galmegi16Shop[]
) => {
  let shopListText = shopList
    .map((shop, index) => `${index + 1}. ${shop.name}`)
    .join("\n");

  if (shopListText.length === 0) {
    shopListText = "없음";
  }

  return `<갈매기 16>입고 업소 리스트
상권명 : ${businessZone}
${shopListText}`;
};
