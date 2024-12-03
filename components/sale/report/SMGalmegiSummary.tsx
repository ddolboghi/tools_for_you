import { GalmegiSums } from "@/utils/sale/types";

type SMGalmegiSummaryProps = {
  galmegiSums: GalmegiSums;
};

export default function SMGalmegiSummary({
  galmegiSums,
}: SMGalmegiSummaryProps) {
  return (
    <div>
      <p>갈매기19 드시던 테이블 {galmegiSums.original19},</p>
      <p>갈매기16 드시던 테이블 {galmegiSums.original16},</p>
      <p>갈매기19 전/추 {galmegiSums["19"]},</p>
      <p>갈매기16 전/추 {galmegiSums["16"]},</p>
      <p>총 {galmegiSums.total}개입니다.</p>
    </div>
  );
}
