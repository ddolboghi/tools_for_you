import { BskyReport } from "@/utils/sale/types";

export type SMReportRow = {
  /** 콜론과 그 앞뒤 공백까지 포함한 완성된 접두사. 예: "좋은데이 : " */
  label: string;
  tables: number;
  percentage: number;
};

/**
 * 담당자 보고에서만 쓰는 표시 이름. 데이터 프레임의 이름과 다른 것만 적는다.
 * 여기 없는 주류는 데이터 프레임의 이름을 그대로 쓰므로, 무학에 주류가 늘어도
 * 이 표를 손댈 필요가 없다.
 */
const muhakLabels: Record<string, string> = {
  톡시리즈: "좋은데이 톡시리즈",
  부산갈매기: "갈매기",
};

/**
 * 담당자 보고의 항목 목록. 무학은 데이터 프레임 순서를 그대로 싣고,
 * 타사는 담당자가 요청한 주요 제품만 골라 싣는다.
 * 기타는 주류가 아니라 잔여 항목이므로 어느 회사의 것도 싣지 않는다.
 * 마. 기타 주류회사도 같은 이유로 나오지 않는다.
 */
export const getSMReportRows = (bskyReport: BskyReport): SMReportRow[] => {
  const muhak = Object.entries(bskyReport["가. 무학"])
    .filter(([drink]) => drink !== "기타")
    .map(([drink, result]) => ({
      label: `${muhakLabels[drink] ?? drink} : `,
      tables: result.tables,
      percentage: result.percentage,
    }));

  const others: SMReportRow[] = [
    { label: "대선(C1포함) : ", ...bskyReport["다. 대선주조"]["대선(C1포함)"] },
    // 부산은 대선(C1포함)에 합산하지 않고 자기 값을 그대로 싣는다. 두 줄을 나란히
    // 두면 대선 숫자가 이전보다 작아진 이유가 보고문 안에서 설명된다.
    { label: "부산 : ", ...bskyReport["다. 대선주조"]["부산"] },
    { label: "진로 : ", ...bskyReport["나. 하이트진로"]["진로"] },
    { label: "참이슬 : ", ...bskyReport["나. 하이트진로"]["참이슬"] },
    { label: "새로: ", ...bskyReport["라. 롯데"]["새로(살구 포함)"] },
    {
      label: "청하(별빛청하 포함): ",
      ...bskyReport["라. 롯데"]["청하(별빛청하 포함)"],
    },
  ];

  return [...muhak, ...others];
};
