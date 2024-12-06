"use client";

import ShopListSkeleton from "../ui/ShopListSkeleton";
import EditShop from "./EditShop";
import { Galmegi16Shop } from "@/utils/sale/galmegi16ShopTypes";

type ShopListProps = {
  businessZone: string;
  shopList: Galmegi16Shop[];
  onFetch: () => Promise<void>;
  isLoading: boolean;
};

export default function ShopList({
  businessZone,
  shopList,
  onFetch,
  isLoading,
}: ShopListProps) {
  return (
    <section className="mb-4 border border-gray-300 p-2">
      <h1>
        {"<"}갈매기 16{">"}입고 업소 리스트
      </h1>
      <h2>상권명: {businessZone}</h2>
      {isLoading ? (
        <ShopListSkeleton />
      ) : (
        shopList.map((shop, index) => (
          <div key={shop.name}>
            <EditShop index={index} shop={shop} onDelete={() => onFetch()} />
          </div>
        ))
      )}
      {shopList.length === 0 && <p>없음</p>}
    </section>
  );
}
