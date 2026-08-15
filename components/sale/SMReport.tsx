import { BskyReport } from "@/utils/sale/types";
import { getSMReportRows } from "@/utils/sale/smReport";

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
        {getSMReportRows(bskyReport).map((row) => (
          <p key={row.label}>
            {row.label}
            {row.tables}T - {row.percentage}%
          </p>
        ))}
        <br />
        <p>갈매기 드시던 테이블 {galmegiSums.sale},</p>
        <p>갈매기 전/추 {galmegiSums.order},</p>
        <p>총 {galmegiSums.sale + galmegiSums.order}개입니다.</p>
      </section>
    </div>
  );
}
