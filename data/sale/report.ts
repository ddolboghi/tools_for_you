import { BskyReport } from "@/utils/sale/types";
/**
 * 데이터 프레임
 * 이 데이터 프레임을 활용해서 테이블 수를 입력받고 보고 내용을 생성합니다.
 * 새로운 주류는 '주류명: {tables: 0, percentage: 0}' 형태로 추가합니다.
 * 회사 안에서 '기타'는 항상 마지막에 둡니다.
 * 주류가 하나뿐인 회사는 보고문과 입력 폼에서 회사 줄 하나로 표시됩니다.
 */
export const bskyReport: BskyReport = {
  "가. 무학": {
    좋은데이: { tables: 0, percentage: 0 },
    모히또: { tables: 0, percentage: 0 },
    톡시리즈: { tables: 0, percentage: 0 },
    부산갈매기: { tables: 0, percentage: 0 },
    기타: { tables: 0, percentage: 0 },
  },
  "나. 하이트진로": {
    참이슬: { tables: 0, percentage: 0 },
    진로: { tables: 0, percentage: 0 },
    기타: { tables: 0, percentage: 0 },
  },
  "다. 대선주조": {
    "대선(C1포함)": { tables: 0, percentage: 0 },
    부산: { tables: 0, percentage: 0 },
    기타: { tables: 0, percentage: 0 },
  },
  "라. 롯데": {
    새로: { tables: 0, percentage: 0 },
    "청하(별빛청하 포함)": { tables: 0, percentage: 0 },
    기타: { tables: 0, percentage: 0 },
  },
  "마. 기타 주류회사": {
    기타: { tables: 0, percentage: 0 },
  },
};
