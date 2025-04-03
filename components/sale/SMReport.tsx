import { BskyReport } from "@/utils/sale/types";

type SMReportProps = {
  bskyReport: BskyReport;
  totalTableNum: number;
  galmegiSums: { [key: string]: number };
};

export default function SMReport({
  bskyReport,
  totalTableNum,
  galmegiSums,
}: SMReportProps) {
  return (
    <div className="border border-gray-300">
      <h1>
        {"<"}이순조SM 퇴근보고{">"}
      </h1>
      <section>
        <h1>1. 야간판촉지역</h1>
        <p>광안 바닷가</p>
        <p>총 테이블 수 : {totalTableNum}</p>
      </section>
      <section>
        <h1>2. 야간 음용비</h1>
        <p>
          좋은데이 : {bskyReport["가. 무학"]["좋은데이"].tables}T -{" "}
          {bskyReport["가. 무학"]["좋은데이"].percentage}%
        </p>
        <p>
          좋은데이 톡시리즈 : {bskyReport["가. 무학"]["톡시리즈"].tables}T -{" "}
          {bskyReport["가. 무학"]["톡시리즈"].percentage}%
        </p>
        <p>
          갈매기 : {bskyReport["가. 무학"]["부산갈매기"].tables}T -{" "}
          {bskyReport["가. 무학"]["부산갈매기"].percentage}%
        </p>
        <p>
          대선(C1포함) : {bskyReport["다. 대선주조"]["대선(C1포함)"].tables}T -{" "}
          {bskyReport["다. 대선주조"]["대선(C1포함)"].percentage}%
        </p>
        <p>
          진로 : {bskyReport["나. 하이트진로"]["진로"].tables}T -{" "}
          {bskyReport["나. 하이트진로"]["진로"].percentage}%
        </p>
        <p>
          참이슬 : {bskyReport["나. 하이트진로"]["참이슬"].tables}T -{" "}
          {bskyReport["나. 하이트진로"]["참이슬"].percentage}%
        </p>
        <p>
          새로: {bskyReport["라. 롯데"]["새로"].tables}T -{" "}
          {bskyReport["라. 롯데"]["새로"].percentage}%
        </p>
        <p>
          청하(별빛청하 포함):{" "}
          {bskyReport["라. 롯데"]["청하(별빛청하 포함)"].tables}T -{" "}
          {bskyReport["라. 롯데"]["청하(별빛청하 포함)"].percentage}%
        </p>
        <br />
        <p>갈매기 드시던 테이블 {galmegiSums.sale},</p>
        <p>갈매기 전/추 {galmegiSums.order},</p>
        <p>총 {galmegiSums.sale + galmegiSums.order}개입니다.</p>
      </section>
    </div>
  );
}
