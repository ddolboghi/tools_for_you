import { BskyReport } from "@/utils/sale/types";

/**
 * 데이터 프레임
 * 이 데이터 프레임을 활용해서 테이블 수를 입력받고 보고 내용을 생성합니다.
 * 새로운 주류는 '주류명: {tables: 0, percentage: 0}' 형태로 추가합니다.
 */
export const bskyReport: BskyReport = {
  "가. 무학": {
    좋은데이: { tables: 0, percentage: 0 },
    톡시리즈: { tables: 0, percentage: 0 },
    부산갈매기: { tables: 0, percentage: 0 },
  },
  "나. 하이트진로": {
    참이슬: { tables: 0, percentage: 0 },
    진로: { tables: 0, percentage: 0 },
    기타: { tables: 0, percentage: 0 },
  },
  "다. 대선주조": {
    "대선(C1포함)": { tables: 0, percentage: 0 },
    기타: { tables: 0, percentage: 0 },
  },
  "라. 롯데": {
    새로: { tables: 0, percentage: 0 },
    "청하(별빛청하 포함)": { tables: 0, percentage: 0 },
  },
};
