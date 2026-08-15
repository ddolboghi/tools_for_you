/**
 * 전환·추가주문 입력 칸.
 *
 * 배열 위치 i가 저장 키 i + 1에 대응한다. 이 값이 Supabase에 숫자 위치로 저장되므로
 * 중간에 끼워 넣으면 과거 기록과 자리가 어긋난다. 새 칸은 반드시 뒤에만 더한다.
 */
export const orderDrinks = ["좋은데이", "부산갈매기", "톡톡", "모히또"] as const;

/** 새 입력 행의 초기값. 0번 키는 근무자 이름이고 나머지는 orderDrinks 순서다. */
export const initOrder2: { [key: number]: number | string } =
  orderDrinks.reduce<{ [key: number]: number | string }>(
    (acc, _, index) => ({ ...acc, [index + 1]: 0 }),
    { 0: "" }
  );
