"use client";

import { deleteShop } from "@/action/galmegi16Shop";
import { Button } from "@/components/ui/button";
import { Galmegi16Shop } from "@/utils/sale/galmegi16ShopTypes";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type EditShopProps = {
  shop: Galmegi16Shop;
  onDelete: () => Promise<void>;
};

export default function EditShop({ shop, onDelete }: EditShopProps) {
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
    <div>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={handleDeleteShop}
        className="bg-red-500 text-white hover:bg-red-400 hover:text-white"
      >
        <Trash2 />
      </Button>
      {isError && <p className="text-red-500">삭제에 실패했습니다.</p>}
    </div>
  );
}
