"use client";

import { deleteShop } from "@/action/galmegi16Shop";
import { Galmegi16Shop } from "@/utils/sale/galmegi16ShopTypes";
import { useState } from "react";

type EditShopProps = {
  index: number;
  shop: Galmegi16Shop;
  onDelete: () => Promise<void>;
};

export default function EditShop({ index, shop, onDelete }: EditShopProps) {
  const [isError, setIsError] = useState(false);

  const handleDeleteShop = async () => {
    const response = confirm(
      `${shop.name}을(를) 삭제하시겠어요?\n타 상권 업소를 삭제하지 말아 주세요.`
    );
    if (response) {
      const result = await deleteShop(shop.id);
      if (!result) {
        setIsError(true);
      } else {
        onDelete();
        setIsError(false);
      }
    }
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <p>
        {index + 1}. {shop.name}
      </p>
      <button
        type="button"
        onClick={handleDeleteShop}
        className="bg-red-500 text-white rounded p-1 ml-2 text-[10px]"
      >
        삭제
      </button>
      {isError && <p className="text-red-500">삭제에 실패했습니다.</p>}
    </div>
  );
}
