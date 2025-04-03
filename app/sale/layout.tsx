import Guide from "@/components/sale/Guide";
import Link from "next/link";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="flex items-center justify-center border-b-[1px]">
        <Guide />
      </header>
      {children}
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
