"use client";

import { useEffect, useState } from "react";
import ShopList from "./ShopList";
import { Galmegi16Shop } from "@/utils/sale/galmegi16ShopTypes";
import { getShops } from "@/action/galmegi16Shop";
import AddShop from "./AddShop";
import { getGalmegi16ShopReport } from "@/lib/sale/galmegi16ShopReport";

type Galmegi16ReportProps = {
  businessZone: string;
};

export default function Galmegi16Report({
  businessZone,
}: Galmegi16ReportProps) {
  const [shopList, setShopList] = useState<Galmegi16Shop[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShopList = async () => {
    setIsLoading(true);
    const shopList = await getShops(businessZone);
    if (shopList) {
      setShopList(shopList);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchShopList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessZone]);

  const handleGalmegi16ShopReportClipboard = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      const galmegi16ShopReport = getGalmegi16ShopReport(
        businessZone,
        shopList
      );
      navigator.clipboard.writeText(galmegi16ShopReport).then(() => {
        alert("클립보드에 복사했습니다.");
      });
    }
  };
  return (
    <div>
      <ShopList
        businessZone={businessZone}
        shopList={shopList}
        onFetch={() => fetchShopList()}
        isLoading={isLoading}
      />
      <AddShop businessZone={businessZone} onAdd={() => fetchShopList()} />
      <button
        type="button"
        className="my-2 bg-cyan-300 text-gray-600 font-semibold rounded p-2 w-full"
        onClick={handleGalmegi16ShopReportClipboard}
      >
        갈매기 보고 복사하기
      </button>
    </div>
  );
}
