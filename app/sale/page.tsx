import SaleCalculation from "@/components/sale/SaleCalculation";
import "./style.css";
import Link from "next/link";
import Guide from "@/components/sale/Guide";

export default function page() {
  return (
    <>
      <header className="flex flex-col items-center justify-center gap-2 border-b-[1px] py-2">
        <Guide />
        <div className="max-w-[500px] w-full px-4">
          <Link
            href="https://random-bibimbap.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 h-6 w-full rounded-md bg-[#fe6e00] text-white text-sm font-medium"
          >
            🍚 랜덤 비빔밥 만들기
          </Link>
        </div>
      </header>
      <main className="app-container">
        <SaleCalculation />
      </main>
      <footer className="text-center text-sm text-gray-500 py-2 bg-[#F6F8FA]">
        <Link
          href={"https://open.kakao.com/o/s9Kbw37g"}
          className="underline font-bold"
        >
          카카오톡 오픈채팅으로 문의
        </Link>
      </footer>
    </>
  );
}
