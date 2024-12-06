"use client";

import { insertShop } from "@/action/galmegi16Shop";
import { FormEvent, useState } from "react";

type AddShopProps = {
  businessZone: string;
  onAdd: () => Promise<void>;
};

function AddShop({ businessZone, onAdd }: AddShopProps) {
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleShopNameChange = (inputShopName: string) => {
    setShopName(inputShopName);
  };

  const submmitAddShop = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await insertShop(businessZone, shopName);
    if (!result) {
      setIsError(true);
    } else {
      onAdd();
      setIsError(false);
    }
    setLoading(false);
    setShopName("");
  };

  return (
    <form onSubmit={(e) => submmitAddShop(e)} className="">
      <input
        className="border border-gray-300 rounded p-1 w-1/2 mr-2 text-black"
        placeholder="업소명"
        value={shopName}
        onChange={(e) => handleShopNameChange(e.target.value)}
      />
      <button type="submit" className="my-2 bg-blue-500 text-white rounded p-2">
        추가
      </button>
      {loading && <p>추가 중...</p>}
      {isError && <p className="text-red-500">저장에 실패했습니다.</p>}
    </form>
  );
}

export default AddShop;
