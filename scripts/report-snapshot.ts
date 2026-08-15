/**
 * 보고문 출력 스냅샷 하네스. 리팩터 전후 문자열을 줄 단위로 비교하기 위한 임시 도구다.
 *
 * 실행: npx tsx scripts/report-snapshot.ts <라벨>
 *
 * 테이블 수를 주류 "이름"으로 찾아 채우는 것이 핵심이다. 데이터 프레임에 새 주류가
 * 생겨도 여기 없는 이름은 0이 되므로, 총 테이블 수와 기존 주류의 백분율이 그대로
 * 유지된다. 덕분에 "새 주류 줄 하나만 늘었다"를 diff로 증명할 수 있다.
 */
import { calculatePercentages } from "@/utils/sale/calculation";
import { getBSKYReport, getSMReport } from "@/utils/sale/report";
import { bskyReport } from "@/data/sale/report";
import type { BskyReport, Orders } from "@/utils/sale/types";

const TABLES: Record<string, number> = {
  좋은데이: 30,
  톡시리즈: 12,
  부산갈매기: 18,
  참이슬: 25,
  진로: 10,
  기타: 3,
  "대선(C1포함)": 20,
  새로: 5,
  "청하(별빛청하 포함)": 7,
};

const buildReport = (): BskyReport => {
  const filled: BskyReport = {};
  for (const [company, drinks] of Object.entries(bskyReport)) {
    filled[company] = {};
    for (const drink of Object.keys(drinks)) {
      filled[company][drink] = { tables: TABLES[drink] ?? 0, percentage: 0 };
    }
  }
  return calculatePercentages(filled);
};

const orders: Orders = {
  1: { 0: "김근무", 1: 2, 2: 3, 3: 1 },
  2: { 0: "이근무", 1: 1, 2: 0, 3: 2 },
};

const additionalOrders: Orders = {
  1: { 0: "김근무", 1: 1, 2: 1, 3: 0 },
  2: { 0: "이근무", 1: 0, 2: 2, 3: 1 },
};

const label = process.argv[2] ?? "snapshot";
const report = buildReport();

console.log(`# ${label}`);
console.log("===== 상권 보고 =====");
console.log(
  getBSKYReport(report, 40, "수영", orders, additionalOrders, [], [])
);
console.log("===== 담당자 보고 =====");
console.log(getSMReport(report, orders, additionalOrders));
