import SaleCalculation from "@/components/sale/SaleCalculation";
import Link from "next/link";

export default function page() {
  return (
    <main>
      <SaleCalculation />
      <footer className="text-center text-sm text-gray-500 py-2 bg-[#F6F8FA]">
        <Link
          href={"https://open.kakao.com/o/s9Kbw37g"}
          className="underline font-bold"
        >
          카카오톡 오픈채팅으로 문의
        </Link>
      </footer>
    </main>
  );
}
