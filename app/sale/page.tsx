export const runtime = "edge";

import SaleCalculation from "@/components/sale/SaleCalculation";
import "./style.css";
import { headers } from "next/headers";
import Link from "next/link";
import Guide from "@/components/sale/Guide";

export default function page() {
  const headersList = headers();
  const host = headersList.get("host");
  const isVercelHost = host?.endsWith(".vercel.app");

  return (
    <>
      <header className="flex items-center justify-center border-b-[1px]">
        {!isVercelHost && <Guide />}
      </header>
      <main className="app-container">
        {isVercelHost ? (
          <div className="my-6 px-4 py-5 mx-auto max-w-xs rounded-xl bg-slate-50 shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <h1 className="text-lg font-medium text-slate-800 mb-3">
              사이트를 새로운 주소로 옮겼어요!
            </h1>
            <p className="font-semibold mb-2">
              이 사이트는 6월부터 이용할 수 없어요.
            </p>
            <Link
              href="https://abt-tool.pages.dev/sale"
              className="w-full py-2.5 px-4 bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-transform hover:bg-teal-800 active:scale-98 flex items-center justify-center"
            >
              <span>새 사이트로 가기</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <SaleCalculation />
        )}
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
