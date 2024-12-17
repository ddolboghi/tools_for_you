"use client";

import { OtherCompanyPromotionResult } from "@/utils/sale/types";
import { useState } from "react";

type OtherCompanyPromotionInputProps = {
  companyName: string;
  promotionInfo: string;
  handleOtherCompanyPromotion: (
    promotionResult: OtherCompanyPromotionResult
  ) => void;
};

export default function OtherCompanyPromotionInput({
  companyName,
  promotionInfo,
  handleOtherCompanyPromotion,
}: OtherCompanyPromotionInputProps) {
  const [promotionWorkerNumber, setPromotionWorkerNumber] = useState<
    number | undefined
  >();
  const [newPromotionInfo, setNewPromotionInfo] = useState(promotionInfo);

  const handlePromotionWorkerNumber = (value: string) => {
    const parsingResult = parseInt(value);
    const newWorkerNumber = Number.isNaN(parsingResult)
      ? undefined
      : parsingResult;
    setPromotionWorkerNumber(newWorkerNumber);
    handleOtherCompanyPromotion({
      name: companyName,
      workerNumber: newWorkerNumber || 0,
      info: newPromotionInfo,
    });
  };

  const handleNewPromotionInfo = (value: string) => {
    setNewPromotionInfo(value);
    handleOtherCompanyPromotion({
      name: companyName,
      workerNumber: promotionWorkerNumber || 0,
      info: value,
    });
  };

  return (
    <div className="flex flex-row gap-2 items-center align-middle py-1.5">
      <div className="flex flex-row items-center align-middle">
        <span className="whitespace-nowrap pr-1">{companyName}</span>
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-[60px] text-black"
          value={
            promotionWorkerNumber !== undefined ? promotionWorkerNumber : ""
          }
          placeholder="0"
          onChange={(e) => handlePromotionWorkerNumber(e.target.value)}
        />
        <span>명</span>
      </div>
      <span>/</span>
      <input
        type="text"
        className="border border-gray-300 rounded p-1 w-full text-black"
        value={newPromotionInfo}
        onChange={(e) => handleNewPromotionInfo(e.target.value)}
      />
    </div>
  );
}
