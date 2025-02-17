import { Orders } from "@/utils/sale/types";
import { translateToKoreanDayOfWeek } from "./dates";

export const getReportTitle = (selectedBusinessZone: string) => {
  const kstDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const month = String(kstDate.getMonth() + 1).padStart(2, "");
  const day = String(kstDate.getDate()).padStart(2, "0");
  const dayOfWeek = translateToKoreanDayOfWeek(kstDate.getDay());
  return `<${month}월 ${day}일 ${dayOfWeek} ${selectedBusinessZone} 상권보고>`;
};

export const getWorkerNames = (orders: Orders) =>
  `- ${Object.values(orders)
    .map((order) => order[0])
    .join(" / ")}`;
