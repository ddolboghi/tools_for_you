import SaleCalculation from "@/components/sale/2.0/SaleCalculation";
import AlarmPopUp from "@/components/ui/AlarmPopUp";
import Link from "next/link";

export default function page() {
  return (
    <main>
      <Link
        href="/sale/1.0"
        className="text-sm ml-4 p-1 rounded bg-black text-white"
      >
        이전 버전 사용하기
      </Link>
      <AlarmPopUp />
      <SaleCalculation />
    </main>
  );
}
