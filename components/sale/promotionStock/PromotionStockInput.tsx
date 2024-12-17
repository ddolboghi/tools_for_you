"use client";

import { PromotionStock } from "@/utils/sale/types";
import { useState } from "react";

type PromotionStockInputProps = {
  promotionStocks: PromotionStock[];
  handlePromotionStockChange: (stocks: PromotionStock[]) => void;
};

export default function PromotionStockInput({
  promotionStocks,
  handlePromotionStockChange,
}: PromotionStockInputProps) {
  const [newPromotionStocks, setNewPromotionStocks] =
    useState<PromotionStock[]>(promotionStocks);

  const handleAdd = () => {
    const newStock = { name: "", quantity: undefined };
    const updatedStocks = [...newPromotionStocks, newStock];
    setNewPromotionStocks(updatedStocks);
    handlePromotionStockChange(updatedStocks);
  };

  const handleDelete = (index: number) => {
    if (index > -1 && index < newPromotionStocks.length) {
      const updatedStocks = [...newPromotionStocks];
      updatedStocks.splice(index, 1);
      setNewPromotionStocks(updatedStocks);
      handlePromotionStockChange(updatedStocks);
    }
  };

  const handleNameChange = (name: string, index: number) => {
    const updatedStocks = [...newPromotionStocks];
    updatedStocks[index] = { ...updatedStocks[index], name };
    setNewPromotionStocks(updatedStocks);
    handlePromotionStockChange(updatedStocks);
  };

  const handleQuantityChange = (quantity: string, index: number) => {
    const updatedStocks = [...newPromotionStocks];
    const newQuantity = quantity === "" ? 0 : parseFloat(quantity);
    updatedStocks[index] = { ...updatedStocks[index], quantity: newQuantity };
    setNewPromotionStocks(updatedStocks);
    handlePromotionStockChange(updatedStocks);
  };

  return (
    <section className="border border-gray-300 rounded p-4 w-full text-black mt-4">
      <div className="flex flex-row items-center gap-3 mb-2">
        <h1 className="text-lg font-bold">자사 판촉물 재고량</h1>
        <button
          type="button"
          className="bg-sky-500 text-white rounded p-1"
          onClick={handleAdd}
        >
          판촉물 추가하기
        </button>
      </div>
      {newPromotionStocks.map((promotionStock, index) => (
        <div
          key={index}
          className="flex flex-row justify-between items-center mb-2"
        >
          <input
            type="text"
            className="border border-gray-300 rounded p-1 w-1/2 text-black"
            value={promotionStock.name}
            onChange={(e) => handleNameChange(e.target.value, index)}
          />
          <input
            type="number"
            className="border border-gray-300 rounded p-1 w-1/4 text-black"
            placeholder="0"
            value={
              promotionStock.quantity === undefined
                ? ""
                : promotionStock.quantity
            }
            onChange={(e) => handleQuantityChange(e.target.value, index)}
          />
          <button
            type="button"
            className="ml-2 p-1 bg-red-500 text-white rounded"
            onClick={() => handleDelete(index)}
          >
            삭제
          </button>
        </div>
      ))}
    </section>
  );
}
