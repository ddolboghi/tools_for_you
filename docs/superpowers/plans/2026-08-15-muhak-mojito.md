# 무학 모히또 집계 항목 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**PRD:** `/home/siwoli/work/abt/.claude/worktrees/muhak-mojito/docs/agents/0001-muhak-mojito.md`

**Goal:** 무학의 주류로 모히또를 추가하고, 그 과정에서 보고문이 데이터와 어긋날 수 있는 구조를 없앤다.

**Architecture:** 보고문 생성기가 주류명을 하드코딩하고 있어 데이터에만 항목을 더하면 합계와 항목 목록이 어긋난다. 그래서 먼저 출력이 바뀌지 않는 순수 리팩터 세 개로 하드코딩을 데이터 순회로 바꾸고(Task 2·3·4), 그 위에 모히또를 얹는다(Task 5·6). 각 리팩터는 변경 전 스냅샷과 글자 단위로 같아야 통과한다.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase. 테스트 프레임워크 없음.

**Spec:** `/home/siwoli/work/abt/.claude/worktrees/muhak-mojito/docs/agents/0001-muhak-mojito.md`

**Glossary:** `/home/siwoli/work/abt/.claude/worktrees/muhak-mojito/CONTEXT.md`

## Global Constraints

- **작업 디렉터리는 워크트리다.** `/home/siwoli/work/abt/.claude/worktrees/muhak-mojito`이고 브랜치는 `muhak-mojito`다. 레포 본체(`.claude/worktrees` 바깥)는 건드리지 않는다.
- **Task마다 마지막에 커밋한다.** 각 Task의 마지막 스텝이 커밋이며 메시지는 그 스텝에 적혀 있다. `git add`는 그 Task가 건드린 파일만 지정해서 한다. `git add -A`나 `git add .`는 쓰지 않는다.
- **푸시하지 않는다.** `git push`, `git merge`, 브랜치 전환은 하지 않는다. 원격 반영과 `main` 병합은 사용자가 결정한다.
- **Supabase 스키마를 바꾸지 않는다.** `calculation_result`와 `orders`가 JSON 컬럼이라 필요 없다.
- **전환·추가주문 칸의 숫자 인덱스는 재배치하지 않는다.** 좋은데이는 1, 부산갈매기는 2, 톡톡은 3으로 고정이고 새 칸은 뒤에만 붙인다. 저장된 과거 기록이 이 위치에 의존한다.
- **점유비의 "톡시리즈"와 전환·추가주문의 "톡톡"은 통일하지 않는다.** 같은 술이지만 각 맥락의 표기를 유지한다.
- **빌드에는 더미 `.env.local`이 필요하다.** `utils/getSupabaseClient.ts:6`이 모듈 로드 시점에 `createClient`를 호출하므로 환경변수가 없으면 코드와 무관하게 실패한다.
- **모든 상대 경로는 워크트리 기준이다.**

---

### Task 1: 스냅샷 하네스와 변경 전 기준값 확보

이후 세 개의 리팩터가 "출력이 안 바뀌었다"를 증명할 수단을 먼저 만든다. 코드는 아직 건드리지 않는다.

**Files:**
- Create: `scripts/report-snapshot.ts` (Task 7에서 삭제하는 임시 파일)
- Create: `.env.local` (gitignore 대상, Task 7까지 유지)

**Interfaces:**
- Consumes: 없음
- Produces: `/tmp/snap-baseline.txt` — 이후 모든 Task가 비교 대상으로 삼는 기준 출력

- [ ] **Step 1: 의존성 설치**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npm install
```

몇 분 걸린다. 완료되면 `node_modules`가 생긴다.

- [ ] **Step 2: 더미 환경변수 파일 생성**

`createClient`는 URL 형식이 유효하기만 하면 호출 시점에는 통과한다. 실제 Supabase에 연결되지 않는다.

`.env.local` 파일 내용:

```
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key
```

`.gitignore:34`에 `.env*.local`이 있으므로 레포에 남지 않는다.

- [ ] **Step 3: 스냅샷 하네스 작성**

`utils/sale/report.ts`의 의존성은 전부 순수 TypeScript다(React도 Supabase도 import하지 않는다). 그래서 브라우저 없이 보고문 문자열을 그대로 뽑아낼 수 있다.

`scripts/report-snapshot.ts` 파일 내용:

```ts
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

console.log(`===== ${label} / 상권 보고 =====`);
console.log(
  getBSKYReport(report, 40, "수영", orders, additionalOrders, [], [])
);
console.log(`===== ${label} / 담당자 보고 =====`);
console.log(getSMReport(report, orders, additionalOrders));
```

`"수영"` 상권을 쓰는 이유는 `additionalInfoBusinessZones`에 들어 있어서 타사 판촉과 재고 섹션까지 출력에 포함되기 때문이다.

- [ ] **Step 4: 기준 스냅샷 생성**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts baseline > /tmp/snap-baseline.txt 2>&1
```

`npx`가 `tsx`를 처음 받느라 잠깐 걸린다. `package.json`은 바뀌지 않는다.

- [ ] **Step 5: 기준 스냅샷이 제대로 나왔는지 확인**

```bash
cat /tmp/snap-baseline.txt
```

확인할 것:
- 오류 메시지 없이 두 개의 `=====` 구분선이 보인다
- 상권 보고에 `가. 무학:`, `나. 하이트진로:`, `다. 대선주조:`, `라. 롯데:`, `마. 기타: 0t (0%)`가 모두 있다
- 무학 아래에 좋은데이·톡시리즈·부산갈매기 세 줄이 있다
- 담당자 보고에 `좋은데이 톡시리즈 :`와 `갈매기 :` 문구가 있다
- 백분율 총합이 100%다

**주의:** 보고문 첫 줄에는 오늘 날짜가 들어간다(`getReportTitle`이 `new Date()`를 쓴다). 자정을 넘겨 작업하면 그 줄만 달라지므로, 그때는 첫 줄 차이를 무시하고 비교한다.

- [ ] **Step 6: 커밋**

`.env.local`은 gitignore 대상이므로 커밋하지 않는다. `git add`에 넣지 말 것.

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git add scripts/report-snapshot.ts && git commit -m "chore: 보고문 스냅샷 하네스 추가"
```

---

### Task 2: 상권 보고문을 데이터 순회로 전환

출력을 바꾸지 않는 순수 리팩터다. 하드코딩된 네 회사 블록을 데이터 프레임 순회로 바꾼다.

**Files:**
- Modify: `utils/sale/report.ts:54-104` (`getBSKYReport`의 점유비 섹션)

**Interfaces:**
- Consumes: Task 1의 `/tmp/snap-baseline.txt`
- Produces: 없음. 함수 시그니처는 그대로다.

- [ ] **Step 1: 현재 하드코딩 구조 파악**

`utils/sale/report.ts:54-104`를 읽는다. 회사 한 곳당 형태가 이렇다.

```
가. 무학: 60t (60%)
␣␣- 좋은데이: 30t (30%)
␣␣- 톡시리즈: 12t (12%)
␣␣- 부산갈매기: 18t (18%)
<빈 줄>
```

항목 앞 공백 두 칸은 소스에서 `  `으로 쓰여 있다. 회사 블록 사이에는 빈 줄이 하나 있고, 이는 소스에서 줄 끝의 `\n` + 템플릿 리터럴 자체의 줄바꿈으로 만들어진다.

`data/sale/report.ts`의 키 순서가 보고문 순서와 이미 정확히 일치한다. 그래서 순회로 바꿔도 출력이 같다.

- [ ] **Step 2: 회사 블록을 만드는 헬퍼 추가**

`utils/sale/report.ts`의 `getBSKYReport` 위에 추가한다.

```ts
const formatOccupancySection = (bskyReport: BskyReport) =>
  Object.entries(bskyReport)
    .map(([company, drinks]) => {
      const header = `${company}: ${getTotalOccupancyNumByCompany(
        drinks,
        false
      )}t (${getTotalOccupancyNumByCompany(drinks, true)}%)`;
      const lines = Object.entries(drinks).map(
        ([drink, result]) =>
          `  - ${drink}: ${result.tables}t (${result.percentage}%)`
      );
      return [header, ...lines].join("\n");
    })
    .join("\n\n");
```

- [ ] **Step 3: 하드코딩된 점유비 섹션을 헬퍼 호출로 교체**

`reportContent` 템플릿 리터럴에서 `가. 무학:`부터 `청하(별빛청하 포함): ...%)\n`까지(즉 `utils/sale/report.ts:58-103`에 해당하는 부분)를 통째로 지우고 그 자리에 `${formatOccupancySection(bskyReport)}`를 넣는다.

교체 후 템플릿의 해당 구간은 이렇게 된다.

```ts
  let reportContent = `${getReportTitle(selectedBusinessZone)}
1. 점유비
  - 총 방문업소: ${totalBisness}개
  - 총 테이블 수: ${getTotalTableNum(bskyReport)}t\n
${formatOccupancySection(bskyReport)}\n
마. 기타: 0t (0%)\n
2. 전환 및 추가주문\n
```

`마. 기타: 0t (0%)` 줄은 데이터 프레임에 없는 항목이므로 하드코딩으로 남긴다. 지우지 말 것.

- [ ] **Step 4: 스냅샷을 다시 뽑아 기준과 비교**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts after-task2 > /tmp/snap-task2.txt 2>&1
diff <(tail -n +2 /tmp/snap-baseline.txt) <(tail -n +2 /tmp/snap-task2.txt)
```

기대: 아무 출력도 없다. `tail -n +2`는 라벨이 적힌 첫 줄을 빼기 위한 것이다.

차이가 나오면 대개 빈 줄 개수나 항목 앞 공백 두 칸 문제다. 원문의 `  `과 `\n` 위치를 다시 대조한다.

- [ ] **Step 5: 타입 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsc --noEmit
```

기대: 오류 없음.

- [ ] **Step 6: 커밋**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git add utils/sale/report.ts && git commit -m "refactor: 상권 보고문 점유비 섹션을 데이터 순회로 전환"
```

---

### Task 3: 담당자 보고문의 무학 부분을 데이터 순회로 전환

복사용 텍스트와 화면 컴포넌트가 같은 목록을 공유하도록 만든다. 이 Task도 출력이 바뀌지 않는 순수 리팩터다.

**Files:**
- Create: `utils/sale/smReport.ts`
- Modify: `utils/sale/report.ts:127-171` (`getSMReport`)
- Modify: `components/sale/SMReport.tsx:24-58`

**Interfaces:**
- Consumes: Task 2 이후의 `utils/sale/report.ts`
- Produces: `getSMReportRows(bskyReport: BskyReport): SMReportRow[]` — `SMReportRow`는 `{ label: string; tables: number; percentage: number }`. `label`은 콜론과 그 앞뒤 공백까지 포함한 완성된 접두사다.

- [ ] **Step 1: 현재 문구의 공백을 정확히 확인**

`utils/sale/report.ts:141-164`를 읽으면 구분자가 항목마다 다르다. 이건 우연이지 규칙이 아니지만, PRD R3이 기존 문구 유지를 요구하므로 그대로 보존한다.

| 항목 | 현재 접두사 |
|---|---|
| 좋은데이 | `좋은데이 : ` (콜론 앞 공백 있음) |
| 톡시리즈 | `좋은데이 톡시리즈 : ` |
| 부산갈매기 | `갈매기 : ` |
| 대선(C1포함) | `대선(C1포함) : ` |
| 진로 | `진로 : ` |
| 참이슬 | `참이슬 : ` |
| 새로 | `새로: ` (콜론 앞 공백 **없음**) |
| 청하(별빛청하 포함) | `청하(별빛청하 포함): ` (공백 **없음**) |

**허용된 예외 하나:** `utils/sale/report.ts:152`의 대선 줄은 `%` 뒤에 공백 한 칸이 붙은 채 줄이 끝난다. 이 후행 공백은 눈에 보이지 않고 복사된 텍스트에서도 티가 나지 않으므로, 이번 리팩터에서 사라져도 된다. 이것이 Step 4의 diff에서 유일하게 허용되는 차이다. 다른 차이는 전부 실패로 본다.

- [ ] **Step 2: 공유 행 목록 모듈 작성**

`utils/sale/smReport.ts` 파일 내용:

```ts
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
 * 담당자 보고의 항목 목록. 무학은 데이터 프레임 전부를 순서대로 싣고,
 * 타사는 담당자가 요청한 주요 제품만 골라 싣는다(기타 항목은 뺀다).
 */
export const getSMReportRows = (bskyReport: BskyReport): SMReportRow[] => {
  const muhak = Object.entries(bskyReport["가. 무학"]).map(
    ([drink, result]) => ({
      label: `${muhakLabels[drink] ?? drink} : `,
      tables: result.tables,
      percentage: result.percentage,
    })
  );

  const others: SMReportRow[] = [
    { label: "대선(C1포함) : ", ...bskyReport["다. 대선주조"]["대선(C1포함)"] },
    { label: "진로 : ", ...bskyReport["나. 하이트진로"]["진로"] },
    { label: "참이슬 : ", ...bskyReport["나. 하이트진로"]["참이슬"] },
    { label: "새로: ", ...bskyReport["라. 롯데"]["새로"] },
    {
      label: "청하(별빛청하 포함): ",
      ...bskyReport["라. 롯데"]["청하(별빛청하 포함)"],
    },
  ];

  return [...muhak, ...others];
};
```

- [ ] **Step 3: 복사용 텍스트를 행 목록 기반으로 교체**

`utils/sale/report.ts` 상단에 import를 추가한다.

```ts
import { getSMReportRows } from "./smReport";
```

`getSMReport`의 본문에서 `좋은데이 : `부터 `청하(별빛청하 포함): ...%` 까지(즉 `utils/sale/report.ts:141-164`) 열 줄 남짓을 지우고, 함수 안에 행 문자열을 먼저 만든다.

```ts
  const rows = getSMReportRows(bskyReport)
    .map((row) => `${row.label}${row.tables}T - ${row.percentage}%`)
    .join("\n");
```

그리고 템플릿 리터럴의 `2. 야간 음용비` 다음 줄부터를 이렇게 바꾼다.

```ts
  return `<이순조SM 퇴근보고>
1. 야간판촉지역
광안 바닷가
총 테이블 수 : ${totalTableNum}
2. 야간 음용비
${rows}

갈매기 드시던 테이블 ${
    bskyReport["가. 무학"]["부산갈매기"].tables
  },\n갈매기 전/추 ${galmegiSums.order},\n총 ${
    galmegiSums.sale + galmegiSums.order
  }개입니다.`;
```

마지막 문단의 `갈매기 드시던 테이블`은 `부산갈매기`를 직접 참조하는 별개 문장이므로 그대로 둔다.

- [ ] **Step 4: 스냅샷 비교**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts after-task3 > /tmp/snap-task3.txt 2>&1
diff <(tail -n +2 /tmp/snap-baseline.txt) <(tail -n +2 /tmp/snap-task3.txt)
```

기대: 대선 줄의 후행 공백 하나가 사라진 차이만 나온다. 즉 `대선(C1포함) : 20t - 20% `가 `대선(C1포함) : 20t - 20%`가 된 것 하나뿐이다. 항목 이름이나 순서가 바뀌었으면 실패다.

`diff` 출력에서 후행 공백은 눈에 안 보이므로 이렇게 확인한다.

```bash
diff <(tail -n +2 /tmp/snap-baseline.txt) <(tail -n +2 /tmp/snap-task3.txt) | cat -A | head -20
```

- [ ] **Step 5: 화면 컴포넌트를 같은 행 목록으로 교체**

`components/sale/SMReport.tsx`에서 `2. 야간 음용비` 섹션의 여덟 개 `<p>` 블록(24-58행)을 행 목록 순회로 바꾼다. import를 추가하고:

```tsx
import { getSMReportRows } from "@/utils/sale/smReport";
```

`<section>` 내부를 이렇게 만든다.

```tsx
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
```

이제 텍스트와 화면이 같은 함수를 쓰므로 서로 어긋날 수 없다.

- [ ] **Step 6: 타입 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsc --noEmit
```

기대: 오류 없음.

- [ ] **Step 7: 커밋**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git add utils/sale/smReport.ts utils/sale/report.ts components/sale/SMReport.tsx && git commit -m "refactor: 담당자 보고문 무학 항목을 데이터 순회로 전환"
```

---

### Task 4: 전환·추가주문 칸 목록 상수화 및 죽은 코드 삭제

칸 이름이 열 군데에 흩어져 있는 것을 상수 하나로 모은다. 이 Task도 출력이 바뀌지 않는 순수 리팩터다.

**Files:**
- Modify: `data/sale/order.ts` (전체)
- Modify: `utils/sale/report.ts:21-33, 109-116`
- Modify: `components/sale/Order.tsx:40-63`
- Modify: `components/sale/OrderResult.tsx:18-50`

**Interfaces:**
- Consumes: Task 3 이후 상태
- Produces:
  - `orderDrinks: readonly string[]` — 전환·추가주문 칸 이름. 배열 위치 `i`가 저장 키 `i + 1`에 대응한다.
  - `initOrder2: { [key: number]: number | string }` — `orderDrinks`에서 파생된 새 입력 행의 초기값
  - `formatOrderQuantities(source: { [key: number]: number | string }, separator: string): string` — `2t(좋은데이) / 3t(부산갈매기)` 형태의 문자열

- [ ] **Step 1: 칸 목록 상수와 초기값 파생**

`data/sale/order.ts` 전체를 이 내용으로 바꾼다. `initOrder1`은 어디서도 쓰이지 않는 죽은 코드이므로 여기서 사라진다.

```ts
/**
 * 전환·추가주문 입력 칸.
 *
 * 배열 위치 i가 저장 키 i + 1에 대응한다. 이 값이 Supabase에 숫자 위치로 저장되므로
 * 중간에 끼워 넣으면 과거 기록과 자리가 어긋난다. 새 칸은 반드시 뒤에만 더한다.
 */
export const orderDrinks = ["좋은데이", "부산갈매기", "톡톡"] as const;

/** 새 입력 행의 초기값. 0번 키는 근무자 이름이고 나머지는 orderDrinks 순서다. */
export const initOrder2: { [key: number]: number | string } =
  orderDrinks.reduce<{ [key: number]: number | string }>(
    (acc, _, index) => ({ ...acc, [index + 1]: 0 }),
    { 0: "" }
  );
```

- [ ] **Step 2: 수량 문자열 헬퍼 추가**

`utils/sale/order.ts` 맨 아래에 추가한다. 구분자를 인자로 받는 이유는 보고문이 `" / "`를 쓰고 화면 헤더가 `"/"`를 쓰기 때문이다.

```ts
import { orderDrinks } from "@/data/sale/order";

/**
 * `2t(좋은데이) / 3t(부산갈매기) / 1t(톡톡)` 형태의 문자열을 만든다.
 * source는 주문 한 행이거나 합계 객체 둘 다 될 수 있다. 둘 다 키가 1부터인 숫자다.
 */
export const formatOrderQuantities = (
  source: { [key: number]: number | string },
  separator: string
) =>
  orderDrinks
    .map((drink, index) => `${source[index + 1] || 0}t(${drink})`)
    .join(separator);
```

`utils/sale/order.ts` 상단의 기존 import 줄 아래에 `orderDrinks` import를 둔다.

- [ ] **Step 3: 보고문의 전환·추가주문 줄 교체**

`utils/sale/report.ts` 상단 import에 `formatOrderQuantities`를 더한다.

```ts
import {
  formatOrderQuantities,
  getGalmegiSumByWorker,
  getOrderSums,
} from "./order";
```

`getBSKYReport`의 21-33행에 있는 두 개의 근무자별 루프를 이렇게 바꾼다.

```ts
  let workerReportOfOrders = "";
  for (const order of Object.values(orders)) {
    workerReportOfOrders += `${order[0]}: ${formatOrderQuantities(
      order,
      " / "
    )}\n`;
  }

  let workerReportOfAdditionalOrders = "";
  for (const order of Object.values(additionalOrders)) {
    workerReportOfAdditionalOrders += `${order[0]}: ${formatOrderQuantities(
      order,
      " / "
    )}\n`;
  }
```

같은 파일 109-116행의 합계 줄 두 개를 이렇게 바꾼다.

```ts
나. 총 전환: ${formatOrderQuantities(orderSums, " / ")}
${workerReportOfOrders}
다. 총 추가주문: ${formatOrderQuantities(additionalOrderSums, " / ")}
${workerReportOfAdditionalOrders}
```

- [ ] **Step 4: 스냅샷 비교**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts after-task4 > /tmp/snap-task4.txt 2>&1
diff <(tail -n +2 /tmp/snap-task3.txt) <(tail -n +2 /tmp/snap-task4.txt)
```

기대: 아무 출력도 없다. 이번에는 Task 3 결과와 비교한다(대선 후행 공백은 이미 Task 3에서 사라졌으므로).

- [ ] **Step 5: 화면 헤더 교체**

`components/sale/Order.tsx`에서 import를 추가한다.

```tsx
import { formatOrderQuantities } from "@/utils/sale/order";
```

40-63행의 두 `<h2>`를 이렇게 바꾼다. 구분자가 `"/"`인 것에 주의한다. 보고문과 달리 화면 헤더에는 슬래시 양옆에 공백이 없다.

```tsx
      <section className="mb-4 text-sm">
        <h2 className="py-2 font-bold">
          전환: {formatOrderQuantities(orderSums, "/")}
        </h2>
        <OrderInput
          orders={orders}
          handleOrderChange={handleOrderChange}
          removeOrderLine={removeOrderLine}
        />
      </section>
      <section className="mb-4 text-sm">
        <h2 className="py-2 font-bold">
          추가주문: {formatOrderQuantities(additionalOrderSums, "/")}
        </h2>
        <OrderInput
          orders={additionalOrders}
          handleOrderChange={handleAdditionalOrderChange}
          removeOrderLine={removeOrderLine}
        />
      </section>
```

- [ ] **Step 6: 화면 결과 교체**

`components/sale/OrderResult.tsx`에서 import를 추가한다.

```tsx
import { formatOrderQuantities } from "@/utils/sale/order";
```

18-50행의 `<section>` 내부를 이렇게 바꾼다. 여기는 보고문과 같은 `" / "`를 쓴다.

```tsx
    <section>
      <div>
        <h3>나. 총 전환: {formatOrderQuantities(orderSums, " / ")}</h3>
        {Object.values(orders).map((order, orderIdx) => (
          <p key={orderIdx}>
            {order[0]}: {formatOrderQuantities(order, " / ")}
          </p>
        ))}
      </div>
      <br />
      <div>
        <h3>다. 총 추가주문: {formatOrderQuantities(additionalOrderSums, " / ")}</h3>
        {Object.values(additionalOrders).map((order, orderIdx) => (
          <p key={orderIdx}>
            {order[0]}: {formatOrderQuantities(order, " / ")}
          </p>
        ))}
      </div>
    </section>
```

- [ ] **Step 7: 입력 UI를 칸 목록 순회로 교체**

`components/sale/OrderInput.tsx` 전체를 이 내용으로 바꾼다. 칸 개수가 데이터에서 오므로 폭도 고정 분수 대신 `flex-1`로 나눈다. 이래야 Task 6에서 칸이 하나 늘어도 레이아웃이 버틴다.

```tsx
import { orderDrinks } from "@/data/sale/order";
import { Orders } from "@/utils/sale/types";

type OrderInputProps = {
  orders: Orders;
  handleOrderChange: (index: number, key: number, value: string) => void;
  removeOrderLine: (index: number) => void;
};

export default function OrderInput({
  orders,
  handleOrderChange,
  removeOrderLine,
}: OrderInputProps) {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex flex-row gap-1 mb-2">
        <label className="flex-1 min-w-0 text-xs">이름</label>
        {orderDrinks.map((drink) => (
          <label key={drink} className="flex-1 min-w-0 text-xs">
            {drink}
          </label>
        ))}
        <div className="w-6 shrink-0"></div>
      </div>
      {Object.keys(orders).map((key) => (
        <div key={key} className="flex flex-row gap-1 mb-2">
          <input
            className="border border-gray-300 rounded p-1 flex-1 min-w-0 text-black"
            placeholder="이름"
            value={orders[Number(key)][0] || ""}
            onChange={(e) => handleOrderChange(Number(key), 0, e.target.value)}
          />
          {orderDrinks.map((drink, drinkIdx) => (
            <input
              key={drink}
              type="number"
              pattern="\d*"
              className="border border-gray-300 rounded p-1 flex-1 min-w-0 text-black"
              placeholder="0"
              onChange={(e) =>
                handleOrderChange(Number(key), drinkIdx + 1, e.target.value)
              }
            />
          ))}
          <button
            className="bg-red-500 w-6 shrink-0 text-white rounded"
            onClick={() => removeOrderLine(Number(key))}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: 타입 확인과 죽은 코드 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsc --noEmit && grep -rn "initOrder1" --include="*.ts" --include="*.tsx" . || echo "initOrder1 없음 - 정상"
```

기대: 타입 오류가 없고 `initOrder1`이 검색되지 않는다.

- [ ] **Step 9: 커밋**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git add data/sale/order.ts utils/sale/order.ts utils/sale/report.ts components/sale/Order.tsx components/sale/OrderResult.tsx components/sale/OrderInput.tsx && git commit -m "refactor: 전환·추가주문 칸 목록을 상수로 통합하고 initOrder1 삭제"
```

---

### Task 5: 모히또를 점유비 데이터 프레임에 추가

여기서부터 동작이 바뀐다. 앞의 세 리팩터 덕분에 데이터 한 줄만 고치면 입력 폼, 화면, 두 보고문에 전부 반영된다.

**Files:**
- Modify: `data/sale/report.ts:9-13`

**Interfaces:**
- Consumes: Task 2·3·4 이후 상태
- Produces: 없음

- [ ] **Step 1: 모히또 키 추가**

`data/sale/report.ts`의 `"가. 무학"` 블록을 이렇게 바꾼다. 모히또는 좋은데이 바로 다음이다.

```ts
  "가. 무학": {
    좋은데이: { tables: 0, percentage: 0 },
    모히또: { tables: 0, percentage: 0 },
    톡시리즈: { tables: 0, percentage: 0 },
    부산갈매기: { tables: 0, percentage: 0 },
  },
```

- [ ] **Step 2: 스냅샷을 뽑아 변화가 딱 두 줄인지 확인**

하네스의 `TABLES`에 모히또가 없으므로 테이블 수는 0이 된다. 따라서 총 테이블 수와 다른 주류의 백분율은 전혀 바뀌지 않고, 두 보고문에 0짜리 모히또 줄만 하나씩 늘어야 한다.

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts after-task5 > /tmp/snap-task5.txt 2>&1
diff <(tail -n +2 /tmp/snap-task4.txt) <(tail -n +2 /tmp/snap-task5.txt)
```

기대 출력은 정확히 이 두 줄의 추가다.

```
>   - 모히또: 0t (0%)
> 모히또 : 0T - 0%
```

상권 보고에서는 좋은데이 다음, 담당자 보고에서도 좋은데이 다음에 들어가야 한다. 다른 줄의 숫자가 하나라도 바뀌었으면 실패다.

- [ ] **Step 3: 모히또에 값이 들어갔을 때 합계에 반영되는지 확인**

`scripts/report-snapshot.ts`의 `TABLES`에 모히또를 임시로 추가한다.

```ts
  좋은데이: 30,
  모히또: 9,
```

그리고 실행한다.

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts mojito-filled | head -20
```

확인할 것:
- `총 테이블 수`가 이전보다 9 늘었다
- `가. 무학:` 합계에 모히또 9t가 포함되어 있다
- 무학 합계가 좋은데이·모히또·톡시리즈·부산갈매기 네 항목 값의 합과 정확히 같다
- 전체 백분율 총합이 여전히 100%다

확인이 끝나면 `TABLES`에서 모히또 줄을 **지워서 원상복구한다.** 이후 Task의 diff 기준이 어긋나면 안 된다.

- [ ] **Step 4: 원상복구 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts recheck > /tmp/snap-recheck.txt 2>&1
diff <(tail -n +2 /tmp/snap-task5.txt) <(tail -n +2 /tmp/snap-recheck.txt)
```

기대: 아무 출력도 없다. 나오면 `TABLES`를 제대로 되돌리지 않은 것이다.

- [ ] **Step 5: 커밋**

Task 6으로 넘어가기 전에 반드시 여기서 커밋한다. 두 변경의 diff가 섞이면 원인 분리가 안 된다.

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git add data/sale/report.ts && git commit -m "feat: 무학에 모히또 점유비 항목 추가"
```

---

### Task 6: 전환·추가주문에 모히또 칸 추가

**Files:**
- Modify: `data/sale/order.ts` (`orderDrinks` 한 줄)

**Interfaces:**
- Consumes: Task 4의 `orderDrinks`
- Produces: 없음

- [ ] **Step 1: 칸 목록 맨 뒤에 모히또 추가**

`data/sale/order.ts`의 `orderDrinks`를 이렇게 바꾼다. 반드시 맨 뒤여야 한다.

```ts
export const orderDrinks = ["좋은데이", "부산갈매기", "톡톡", "모히또"] as const;
```

`initOrder2`는 이 배열에서 파생되므로 자동으로 키 4를 갖게 된다. 다른 파일은 손대지 않는다.

- [ ] **Step 2: 보고문에 모히또가 반영되는지 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npx tsx scripts/report-snapshot.ts after-task6 > /tmp/snap-task6.txt 2>&1
diff <(tail -n +2 /tmp/snap-task5.txt) <(tail -n +2 /tmp/snap-task6.txt)
```

하네스의 주문 픽스처에는 키 4가 없으므로 `|| 0`이 걸려 `0t(모히또)`가 붙는다. 기대 차이는 전환·추가주문 관련 여섯 줄(합계 두 줄, 근무자별 네 줄)에 각각 ` / 0t(모히또)`가 끝에 붙는 것뿐이다. 점유비 섹션과 담당자 보고는 전혀 바뀌지 않아야 한다.

- [ ] **Step 3: 근무자별 부산갈매기 집계가 그대로인지 확인**

`getGalmegiSumByWorker`는 인덱스 2를 직접 읽는다. 모히또가 4번이므로 영향이 없어야 한다.

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && grep -A 3 "부산 갈매기 총 판매 병 수" /tmp/snap-task6.txt
```

기대: `김근무 : 4본`, `이근무 : 2본`. Task 5 스냅샷과 같은 값이어야 한다. 다음 명령으로 직접 대조한다.

```bash
diff <(grep "본$" /tmp/snap-task5.txt) <(grep "본$" /tmp/snap-task6.txt)
```

기대: 아무 출력도 없다.

- [ ] **Step 4: 레이아웃을 눈으로 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npm run dev
```

브라우저에서 `http://localhost:3002/sale`을 연다. 개발자 도구로 화면 폭을 390px(일반적인 휴대폰 폭)로 좁힌 뒤 "인원 추가하기"를 누른다.

확인할 것:
- 입력 행에 이름·좋은데이·부산갈매기·톡톡·모히또 다섯 칸과 삭제 버튼이 한 줄에 들어간다
- 라벨 글자가 잘리거나 칸 밖으로 넘치지 않는다
- 숫자를 입력할 수 있고 삭제 버튼이 눌린다

칸이 너무 좁아 못 쓸 정도면 `components/sale/OrderInput.tsx`의 라벨에 `break-keep`을 더하거나, 라벨 행만 `text-[10px]`로 낮춘다. 입력값을 담는 `<input>`의 `flex-1 min-w-0`은 유지한다.

확인이 끝나면 개발 서버를 종료한다.

- [ ] **Step 5: 무학 입력란과 두 보고문을 화면에서 확인**

개발 서버를 다시 띄운 상태에서 `/sale` 화면에 값을 넣어본다.

1. 총 방문업소에 10을 넣는다
2. 상권을 "광안"으로 고른다 (담당자 보고는 광안에서만 보인다)
3. 무학 항목에 좋은데이 30, 모히또 9, 톡시리즈 12, 부산갈매기 18을 넣는다
4. "계산하기"를 누른다

확인할 것:
- 무학 입력란의 칸 순서가 좋은데이·모히또·톡시리즈·부산갈매기다
- "계산 결과 보기"를 펼치면 무학 아래 네 항목이 같은 순서로 나온다
- 담당자 보고에 `좋은데이 : `, `모히또 : `, `좋은데이 톡시리즈 : `, `갈매기 : ` 네 줄이 이 순서로 있다
- 담당자 보고에 `새로: `와 `청하(별빛청하 포함): `이 콜론 앞 공백 없이 그대로 있다
- "상권 톡방용 보고 복사하기"를 누르고 붙여넣으면 무학 합계가 네 항목의 합과 일치한다

`insertReport`가 더미 Supabase로 실패하지만 `action/report.ts:38`이 예외를 삼키므로 화면 동작에는 지장이 없다.

- [ ] **Step 6: 커밋**

레이아웃 조정으로 `OrderInput.tsx`를 손댔다면 그것도 함께 넣는다.

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git add data/sale/order.ts components/sale/OrderInput.tsx && git commit -m "feat: 전환·추가주문에 모히또 칸 추가"
```

---

### Task 7: ADR 작성과 마무리

**Files:**
- Create: `docs/adr/0001-order-columns-are-append-only.md`
- Delete: `scripts/report-snapshot.ts`
- Delete: `.env.local` 은 남긴다 (gitignore 대상이라 레포에 영향 없음, 이후 빌드에 필요)

**Interfaces:**
- Consumes: Task 6 이후 상태
- Produces: 없음

- [ ] **Step 1: ADR 작성**

`docs/adr/0001-order-columns-are-append-only.md` 파일 내용:

```markdown
# 1. 전환·추가주문 칸은 뒤에만 더한다

날짜: 2026-08-15

## 상태

채택

## 맥락

무학의 주류로 모히또가 추가되면서 점유비뿐 아니라 전환·추가주문에도 모히또 칸이 필요해졌다.

전환·추가주문 데이터는 근무자 한 명당 한 행이고, 각 칸이 `{0: 이름, 1: 좋은데이, 2: 부산갈매기, 3: 톡톡}`처럼 숫자 키로 저장된다. 이 구조가 그대로 Supabase의 `report.orders`와 `report.additional_orders`에 JSON으로 들어간다. 즉 칸의 의미가 이름이 아니라 위치로 정해진다.

점유비 쪽은 사정이 다르다. 그쪽은 주류명을 키로 쓰는 객체라 순서를 바꿔도 저장된 값의 의미가 흔들리지 않는다. 그래서 모히또를 좋은데이 다음에 끼워 넣었다.

## 결정

전환·추가주문의 칸은 뒤에만 더한다. 모히또는 네 번째 주류 칸(키 4)이 되고, 좋은데이 1·부산갈매기 2·톡톡 3은 영구히 고정한다.

칸 목록은 `data/sale/order.ts`의 `orderDrinks` 배열 하나로 관리하고, 입력 UI·합계 헤더·화면 결과·보고문이 모두 이 배열을 순회한다. 배열의 위치 `i`가 저장 키 `i + 1`에 대응한다.

## 결과

이 결정 이후 저장되는 기록은 다섯 번째 값을 갖고, 그 이전 기록은 갖지 않는다. **이 경계는 되돌릴 수 없다.** 과거 데이터를 분석할 때 모히또 칸의 부재와 값 0을 구분하려면 이 날짜를 기준으로 삼아야 한다.

칸을 중간에 끼워 넣으면 그 뒤 칸들의 의미가 과거 기록과 어긋난다. 앞으로 주류를 더할 때도 반드시 배열 끝에 붙여야 한다.

점유비와 전환·추가주문이 서로 다른 규칙을 갖게 된 것은 의도된 것이다. 저장 구조가 다르기 때문이다.
```

- [ ] **Step 2: 하네스 삭제**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && rm scripts/report-snapshot.ts && rmdir scripts 2>/dev/null; ls scripts 2>&1 || echo "scripts 삭제됨"
```

- [ ] **Step 3: 전체 빌드**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npm run build
```

기대: 성공. `.env.local`의 더미 값 덕분에 `createClient`가 모듈 로드 시점에 터지지 않는다.

실패하면 오류가 환경변수 때문인지 코드 때문인지부터 가른다. 메시지에 `supabaseUrl is required`가 있으면 `.env.local`이 없거나 잘못된 것이다.

- [ ] **Step 4: 린트**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && npm run lint
```

기대: 오류 없음. 경고는 허용한다.

- [ ] **Step 5: 최종 상태 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git status --short
```

기대되는 변경 목록:

```
 M components/sale/Order.tsx
 M components/sale/OrderInput.tsx
 M components/sale/OrderResult.tsx
 M components/sale/SMReport.tsx
 M data/sale/order.ts
 M data/sale/report.ts
 M utils/sale/order.ts
 M utils/sale/report.ts
?? CLAUDE.md
?? CONTEXT.md
?? docs/
?? utils/sale/smReport.ts
```

`.env.local`, `node_modules`, `.next`는 gitignore 대상이라 목록에 없어야 한다. `scripts/`가 남아 있으면 Step 2를 다시 한다.

- [ ] **Step 6: 커밋**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git add docs/adr/0001-order-columns-are-append-only.md scripts && git commit -m "docs: 주문 칸 추가 결정 ADR 작성 및 스냅샷 하네스 제거"
```

`git add scripts`는 삭제된 `scripts/report-snapshot.ts`를 스테이징하기 위한 것이다.

- [ ] **Step 7: 커밋 이력 확인**

```bash
cd /home/siwoli/work/abt/.claude/worktrees/muhak-mojito && git log --oneline main..HEAD && git status --short
```

기대: 커밋 여덟 개(문서 1 + Task 1~7)가 보이고, `git status`는 깨끗하다.

**푸시하거나 `main`에 병합하지 않는다.** 여기서 멈춘다.

---

## 수용 기준 대조

PRD의 수용 기준이 어느 Task에서 확인되는지다.

| 수용 기준 | 확인 위치 |
|---|---|
| 무학 입력란에 모히또 칸이 좋은데이 다음에 나온다 | Task 6 Step 5 |
| 모히또 값이 총 테이블 수와 무학 점유비에 반영된다 | Task 5 Step 3 |
| 상권 보고문 무학 블록에 모히또 줄이 있다 | Task 5 Step 2 |
| 무학 합계가 네 항목 값의 합과 일치한다 | Task 5 Step 3, Task 6 Step 5 |
| 모히또 0일 때 상권 보고문이 변경 전과 글자 단위로 같다 | Task 2 Step 4, Task 5 Step 2 |
| 담당자 보고문에 "좋은데이 톡시리즈"와 "갈매기"가 남아 있다 | Task 3 Step 4, Task 6 Step 5 |
| 담당자 보고문에 모히또 줄이 있다 | Task 5 Step 2 |
| 담당자 보고의 텍스트와 화면이 같은 항목을 같은 순서로 보여준다 | Task 3 Step 5 (같은 함수를 공유하므로 구조적으로 보장) |
| 전환·추가주문에 다섯 번째 칸이 있고 레이아웃이 안 깨진다 | Task 6 Step 1, Step 4 |
| 전환·추가주문 세 곳 모두에 모히또가 나온다 | Task 6 Step 2 (보고문), Step 4 (화면) |
| 근무자별 부산갈매기 집계가 그대로다 | Task 6 Step 3 |
| `initOrder1`이 코드베이스에 없다 | Task 4 Step 8 |
| `docs/adr/`에 ADR 파일이 있다 | Task 7 Step 1 |
