# 부산 항목 추가와 기타 항목 체계화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 대선주조에 부산 항목을 독립 집계로 추가하고, 모든 회사에 기타 항목을 두고, 하드코딩되어 있던 `마. 기타`를 실제 값을 받는 회사로 승격하며, 상권 보고문의 테이블 단위를 대문자 `T`로 통일한다.

**Architecture:** `data/sale/report.ts`의 데이터 프레임이 단일 출처다. 입력 폼·백분율 계산·총 테이블 수·화면 결과·상권 보고문이 이미 이 프레임을 순회하므로, 항목 추가는 데이터 한 줄로 전파된다. 손으로 고칠 곳은 하드코딩이 남은 두 군데(`마. 기타` 줄, 담당자 보고문의 타사 큐레이션 목록)와, 항목이 하나인 회사를 한 줄로 렌더링하는 분기 세 곳(상권 보고문·화면 결과·입력 폼)이다.

**Tech Stack:** Next.js 14.2.11 App Router, React 18, TypeScript strict, Tailwind CSS, Supabase (`@supabase/supabase-js`)

**PRD:** `/home/siwoli/work/abt/docs/agents/0003-daesun-busan-and-etc.md`

**Spec:** `/home/siwoli/work/abt/docs/agents/0003-daesun-busan-and-etc.md`

## Global Constraints

이 절의 요구사항은 모든 태스크에 암묵적으로 포함된다.

- **테스트가 없는 프로젝트다.** 검증은 `npm run build` 통과 + 스냅샷 문자열 비교 + 브라우저 자동화다. 테스트 파일을 새로 만들지 않는다.
- **`.env.local`은 더미 값만 담는다.** `NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key`. 이 파일은 gitignore 대상이며 절대 커밋하지 않는다. 실제 Supabase 자격증명을 찾거나 만들지 않는다. `utils/getSupabaseClient.ts`가 모듈 로드 시점에 환경변수를 읽으므로 이 파일이 없으면 빌드가 코드와 무관하게 실패한다.
- **`npm run lint`를 실행하지 않는다.** 워크트리에서 `@next/next` ESLint 플러그인이 중복 로드되어 환경적으로 실패한다. 검증은 `npm run build`다.
- **2번 항목(전환·추가주문)의 소문자 `t`는 그대로 둔다.** `utils/sale/order.ts`의 `formatOrderQuantities`가 만드는 `0t(좋은데이)` 표기를 건드리지 않는다. 대문자 통일은 1번 항목(점유비)의 회사 줄·항목 줄·총 테이블 수 줄에만 적용한다. 이건 빠뜨린 게 아니라 PRD 범위 밖으로 명시된 결정이다.
- **항목 줄 생략은 항목 개수(`Object.keys(drinks).length === 1`)로만 판정한다.** 회사 이름이나 항목 이름을 조건에 박아 넣지 않는다.
- **담당자 보고문에는 어느 회사의 `기타`도, `마. 기타 주류회사`도 싣지 않는다.**
- **담당자 보고문에서 백분율을 새로 계산하지 않는다.** 항목별 백분율은 이미 100% 보정을 거친 값이며, 재계산하면 같은 밤의 상권 보고문과 어긋난다.
- **`git add`는 그 태스크가 건드린 파일만 지정한다.** `git add -A`와 `git add .`는 금지다.
- **`git push`, `git merge`, `git checkout`, `git stash`, 브랜치 생성을 하지 않는다.** 병합과 원격 반영은 사용자가 직접 지시한다.
- **서브에이전트나 리뷰어를 띄우지 않는다.** 리뷰는 컨트롤러가 보고서를 받은 뒤에 붙인다.
- **`pkill -f "next dev"`를 절대 쓰지 않는다.** `-f`가 Bash 툴 자신의 명령줄에 매칭되어 셸을 죽인다. 포트로 죽인다: `fuser -k 3003/tcp`.

---

## File Structure

| 파일 | 책임 | 태스크 |
| --- | --- | --- |
| `data/sale/report.ts` | 데이터 프레임. 회사와 주류의 목록 그 자체 | 2 |
| `utils/sale/report.ts` | 상권 보고문·담당자 보고문 문자열 생성 | 2 |
| `components/sale/Result.tsx` | 화면에 보여주는 계산 결과(상권 보고문의 미러) | 2 |
| `components/sale/SaleCalculation.tsx` | 테이블 수 입력 폼 | 3 |
| `utils/sale/smReport.ts` | 담당자 보고문의 항목 목록과 라벨 | 4 |

건드리지 않는 파일: `utils/sale/calculation.ts`(데이터 프레임 구조에 무관하게 동작한다), `utils/sale/order.ts`, `data/sale/order.ts`, `components/sale/SMReport.tsx`(`getSMReportRows`를 순회하므로 4번 태스크로 자동 반영된다).

---

## Task 1: 변경 전 기준값 스냅샷 확보

R6은 "새 항목을 모두 0으로 둔 상권 보고문이 세 가지를 빼면 변경 전과 글자 단위로 같다"를 요구한다. 코드를 고치기 전에 변경 전 출력을 파일로 남겨야 이 비교가 가능하다. 이 태스크는 커밋할 소스 코드를 만들지 않는다 — 산출물은 워크스페이스의 기준값 파일이다.

**Files:**
- Create: `<workspace>/snapshot.js` (git-ignored 워크스페이스. 커밋하지 않는다)
- Create: `<workspace>/baseline.txt` (git-ignored)

**Interfaces:**
- Consumes: 없음
- Produces: `<workspace>/baseline.txt` — 태스크 2가 자기 출력과 비교할 기준값. `<workspace>/snapshot.js` — 태스크 2가 그대로 다시 실행할 스크립트.

- [ ] **Step 1: `.env.local`을 더미 값으로 만든다**

```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key
EOF
```

- [ ] **Step 2: 변경 전 코드가 빌드되는지 확인한다**

Run: `npm run build`
Expected: 성공. 실패하면 내 변경 때문이 아니므로 환경 문제를 먼저 보고한다.

- [ ] **Step 3: 보고문 생성 함수를 JS로 트랜스파일한다**

`tsc`는 `@/` 경로 별칭을 모르기 때문에 `TS2307`/`TS2792` 오류를 낸다. **그래도 JS는 정상적으로 나온다.** 타입만 쓰는 `@/utils/sale/types` import는 컴파일 과정에서 지워지고, 값으로 쓰는 `@/data/sale/order`만 출력에 남는다. 그 하나를 자기참조 심링크로 해결한다.

```bash
rm -rf /tmp/snap
npx tsc utils/sale/report.ts utils/sale/calculation.ts utils/sale/order.ts \
        utils/sale/commonReports.ts utils/sale/smReport.ts \
        data/sale/report.ts data/sale/order.ts \
        --outDir /tmp/snap --target es2020 --module commonjs --skipLibCheck
# CommonJS 해석기가 '@'를 패키지 디렉터리로 보게 만들어 '@/data/sale/order'를 /tmp/snap/data/sale/order.js로 잇는다
mkdir -p /tmp/snap/node_modules && ln -sfn /tmp/snap /tmp/snap/node_modules/@
ls /tmp/snap/utils/sale/report.js /tmp/snap/data/sale/report.js
```

Expected: `tsc`가 `TS2307` 오류를 출력하지만 두 `.js` 파일이 존재한다. 파일이 없으면 진짜 실패다.

- [ ] **Step 4: 스냅샷 스크립트를 쓴다**

`<workspace>`를 실제 워크스페이스 경로로 바꿔 저장한다.

```javascript
// 상권 보고문과 담당자 보고문을 고정 입력으로 뽑아 출력한다.
// R6 비교용이므로 새 항목(무학 기타, 대선주조 부산, 롯데 기타, 마 기타 주류회사)에는
// 값을 넣지 않는다. 값을 넣으면 변경 전에는 없던 숫자가 생겨 비교가 무의미해진다.
const { getBSKYReport, getSMReport } = require("/tmp/snap/utils/sale/report.js");
const { calculatePercentages } = require("/tmp/snap/utils/sale/calculation.js");
const { bskyReport } = require("/tmp/snap/data/sale/report.js");

bskyReport["가. 무학"]["좋은데이"].tables = 20;
bskyReport["다. 대선주조"]["대선(C1포함)"].tables = 12;

calculatePercentages(bskyReport);

// order[0]은 근무자 이름, order[1..4]는 좋은데이/부산갈매기/톡톡/모히또 순이다
const orders = { 1: ["김근무", 0, 0, 0, 0] };
const additionalOrders = { 1: ["김근무", 0, 0, 0, 0] };

console.log(
  getBSKYReport(bskyReport, 30, "광안", orders, additionalOrders, [], "")
);
console.log("=====SM=====");
console.log(getSMReport(bskyReport, orders, additionalOrders));
```

- [ ] **Step 5: 기준값을 뽑아 저장한다**

```bash
node <workspace>/snapshot.js > <workspace>/baseline.txt
cat -A <workspace>/baseline.txt | head -40
```

Expected: 1번 항목이 다음과 같다. 다르면 진행하지 말고 보고한다 (보고서 제목의 날짜는 실행일에 따라 달라지므로 예외다).

```
1. 점유비
  - 총 방문업소: 30개
  - 총 테이블 수: 32t

가. 무학: 20t (62.5%)
  - 좋은데이: 20t (62.5%)
  - 모히또: 0t (0%)
  - 톡시리즈: 0t (0%)
  - 부산갈매기: 0t (0%)

나. 하이트진로: 0t (0%)
  - 참이슬: 0t (0%)
  - 진로: 0t (0%)
  - 기타: 0t (0%)

다. 대선주조: 12t (37.5%)
  - 대선(C1포함): 12t (37.5%)
  - 기타: 0t (0%)

라. 롯데: 0t (0%)
  - 새로: 0t (0%)
  - 청하(별빛청하 포함): 0t (0%)

마. 기타: 0t (0%)

2. 전환 및 추가주문
```

그리고 `=====SM=====` 뒤의 2번 항목이 다음과 같다.

```
좋은데이 : 20T - 62.5%
모히또 : 0T - 0%
좋은데이 톡시리즈 : 0T - 0%
갈매기 : 0T - 0%
대선(C1포함) : 12T - 37.5%
진로 : 0T - 0%
참이슬 : 0T - 0%
새로: 0T - 0%
청하(별빛청하 포함): 0T - 0%
```

- [ ] **Step 6: 커밋할 것이 없음을 확인한다**

```bash
git status --short
```

Expected: 아무것도 없음. `.env.local`은 gitignore 대상이라 나타나지 않아야 한다. 워크스페이스 파일도 gitignore 대상이다. 뭔가 나타나면 잘못 만든 것이므로 보고한다.

---

## Task 2: 데이터 프레임 확장과 상권 보고문·화면 결과 반영

부산·기타 세 개를 데이터 프레임에 넣고, 하드코딩된 `마. 기타` 줄을 데이터 프레임의 회사로 대체하고, 소문자 `t`를 대문자로 바꾼다. 세 변경이 같은 출력(상권 보고문)을 건드리므로 한 태스크로 묶는다. R6 검증도 여기서 한다.

**Files:**
- Modify: `data/sale/report.ts` (전체)
- Modify: `utils/sale/report.ts:11-24` (`formatOccupancySection`), `utils/sale/report.ts:71-73` (템플릿)
- Modify: `components/sale/Result.tsx:130` (총 테이블 수 단위), `components/sale/Result.tsx:133-164` (회사 순회)

**Interfaces:**
- Consumes: Task 1의 `<workspace>/baseline.txt`, `<workspace>/snapshot.js`
- Produces: 데이터 프레임에 새 키 `bskyReport["가. 무학"]["기타"]`, `bskyReport["다. 대선주조"]["부산"]`, `bskyReport["라. 롯데"]["기타"]`, `bskyReport["마. 기타 주류회사"]["기타"]`. Task 4가 `bskyReport["다. 대선주조"]["부산"]`을 읽고, `"기타"` 키들을 배제한다.

- [ ] **Step 1: 데이터 프레임을 확장한다**

`data/sale/report.ts`를 아래 내용으로 만든다. 항목 순서가 그대로 보고문 순서이므로 순서를 정확히 지킨다.

```typescript
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
```

- [ ] **Step 2: `formatOccupancySection`에 단일 항목 분기와 대문자 T를 넣는다**

`utils/sale/report.ts:11-24`를 다음으로 교체한다.

```typescript
const formatOccupancySection = (bskyReport: BskyReport) =>
  Object.entries(bskyReport)
    .map(([company, drinks]) => {
      const header = `${company}: ${getTotalOccupancyNumByCompany(
        drinks,
        false
      )}T (${getTotalOccupancyNumByCompany(drinks, true)}%)`;
      // 주류가 하나면 회사 합계와 그 주류의 값이 언제나 같아 항목 줄이 중복이다.
      // 회사 이름이 아니라 개수로 판정하므로 나중에 주류가 늘면 저절로 맞는다.
      if (Object.keys(drinks).length === 1) return header;
      const lines = Object.entries(drinks).map(
        ([drink, result]) =>
          `  - ${drink}: ${result.tables}T (${result.percentage}%)`
      );
      return [header, ...lines].join("\n");
    })
    .join("\n\n");
```

- [ ] **Step 3: 템플릿에서 하드코딩된 `마. 기타` 줄을 지우고 총 테이블 수 단위를 바꾼다**

`utils/sale/report.ts:71-74`가 지금 이렇다.

```
  - 총 테이블 수: ${getTotalTableNum(bskyReport)}t\n
${formatOccupancySection(bskyReport)}\n
마. 기타: 0t (0%)\n
2. 전환 및 추가주문\n
```

다음으로 만든다. `마. 기타: 0t (0%)\n` 줄을 통째로 지우고 `t`를 `T`로 바꾼다.

```
  - 총 테이블 수: ${getTotalTableNum(bskyReport)}T\n
${formatOccupancySection(bskyReport)}\n
2. 전환 및 추가주문\n
```

빈 줄이 어긋나지 않는 이유: 템플릿 리터럴의 각 줄 끝 `\n` 뒤에 실제 줄바꿈이 하나 더 있어 빈 줄 하나를 만든다. 회사끼리는 `"\n\n"`으로 이어붙는다. 그래서 마가 순회 안으로 들어가면 마지막 회사와 마 사이에 빈 줄 하나, 마와 `2. 전환 및 추가주문` 사이에 빈 줄 하나가 그대로 유지된다. 이 절의 다른 `  `와 `\n` 배치는 절대 손대지 않는다.

- [ ] **Step 4: 화면 결과의 단위와 단일 항목 분기를 맞춘다**

`components/sale/Result.tsx:130`:

```tsx
<p>&nbsp;&nbsp;- 총 테이블 수: {totalTableNum}T</p>
```

`components/sale/Result.tsx:132-165`의 `<section>` 안을 다음으로 교체한다. 하드코딩된 `<p>마. 기타: 0t (0%)</p>` 줄은 삭제된다.

```tsx
<section>
  {Object.entries(bskyReport).map(([company, occupancyReslut]) => (
    <div key={company}>
      <div className="flex flex-row items-center">
        <h3>{company}:&nbsp;</h3>
        <span>
          {getTotalOccupancyNumByCompany(bskyReport[company], false)}
          T (
          {getTotalOccupancyNumByCompany(bskyReport[company], true)}
          %)
        </span>
      </div>
      {/* 주류가 하나면 회사 줄과 값이 같아 항목 줄을 생략한다. 상권 보고문과 같은 규칙이다. */}
      {Object.keys(occupancyReslut).length > 1 &&
        Object.entries(occupancyReslut).map(([drink, result]) => (
          <p key={drink}>
            &nbsp;&nbsp;- {drink}: {result.tables}T (
            {result.percentage}
            %)
          </p>
        ))}
      <br />
    </div>
  ))}
</section>
```

- [ ] **Step 5: 빌드를 통과시킨다**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 6: R6을 문자열 비교로 검증한다**

Task 1과 똑같은 절차로 다시 뽑아 diff를 본다.

```bash
rm -rf /tmp/snap
npx tsc utils/sale/report.ts utils/sale/calculation.ts utils/sale/order.ts \
        utils/sale/commonReports.ts utils/sale/smReport.ts \
        data/sale/report.ts data/sale/order.ts \
        --outDir /tmp/snap --target es2020 --module commonjs --skipLibCheck
mkdir -p /tmp/snap/node_modules && ln -sfn /tmp/snap /tmp/snap/node_modules/@
node <workspace>/snapshot.js > <workspace>/after-task2.txt
diff <workspace>/baseline.txt <workspace>/after-task2.txt
```

Expected: diff에 나타나는 차이가 **정확히** 다음 세 종류뿐이다.

1. 1번 항목의 소문자 `t`가 모두 `T`로 바뀜 (총 테이블 수 줄, 회사 줄, 항목 줄)
2. 항목 줄 세 개가 추가됨: `  - 기타: 0T (0%)`가 무학 마지막, `  - 부산: 0T (0%)`가 대선(C1포함) 다음, `  - 기타: 0T (0%)`가 롯데 마지막
3. `마. 기타: 0t (0%)` → `마. 기타 주류회사: 0T (0%)`

빈 줄의 추가·삭제, 항목 앞 공백 두 칸의 변화, `2. 전환 및 추가주문` 이후 어떤 줄의 변화도 나타나면 안 된다. `=====SM=====` 뒤의 담당자 보고문도 이 태스크에서는 변화가 없어야 한다 (부산 줄은 Task 4에서 추가된다). diff에 예상 밖의 줄이 하나라도 있으면 커밋하지 말고 원인을 찾는다.

- [ ] **Step 7: 커밋**

```bash
git add data/sale/report.ts utils/sale/report.ts components/sale/Result.tsx
git commit -m "feat: 부산·기타 항목 추가와 기타 주류회사 승격, 상권 보고 단위 대문자화"
```

---

## Task 3: 입력 폼에 새 항목 반영

새 항목의 입력 칸은 데이터 프레임 순회로 자동 생성되지만, 주류가 하나인 회사(`마. 기타 주류회사`)는 제목 오른쪽 같은 줄에 칸을 놓아야 한다. 단위 표시도 `T`로 바꾸고, 검증과 접근성을 위해 칸마다 `aria-label`을 붙인다.

**Files:**
- Modify: `components/sale/SaleCalculation.tsx:249-269`

**Interfaces:**
- Consumes: Task 2가 만든 `bskyReport["마. 기타 주류회사"]` (주류 하나). 기존 `handleDrink(company, drink, value)` 시그니처는 그대로 쓴다.
- Produces: 없음 (다른 태스크가 의존하지 않는다)

- [ ] **Step 1: 회사 순회에 단일 항목 분기를 넣는다**

`components/sale/SaleCalculation.tsx:249-269`을 다음으로 교체한다.

```tsx
{Object.entries(bskyReport).map(([company, drinks], index) => {
  const drinkNames = Object.keys(drinks);
  // 주류가 하나면 주류 이름이 회사 이름과 사실상 겹쳐, 제목 오른쪽에 칸을 바로 둔다.
  // min-w-0이 필요한 이유는 이 flex 컨테이너 안에서 input이 자기 고유 폭을
  // 줄이지 않아 좁은 화면에서 오른쪽이 잘리기 때문이다.
  if (drinkNames.length === 1) {
    return (
      <section
        key={`company-${index}`}
        className="mb-4 border border-gray-300 p-2 flex flex-row items-center"
      >
        <h1 className="text-lg pr-2">{company}:</h1>
        <input
          type="number"
          pattern="\d*"
          aria-label={company}
          className="border border-gray-300 rounded p-1 w-1/2 min-w-0 text-black"
          placeholder="0"
          onChange={(e) =>
            handleDrink(company, drinkNames[0], e.target.value)
          }
        />
        T
      </section>
    );
  }
  return (
    <section
      key={`company-${index}`}
      className="mb-4 border border-gray-300 p-2"
    >
      <h1 className="text-lg">{company}</h1>
      {drinkNames.map((drink, index) => (
        <div key={`drink-${index}`} className="mt-2">
          <span className="pr-1">{drink}:</span>
          <input
            type="number"
            pattern="\d*"
            aria-label={`${company} ${drink}`}
            className="border border-gray-300 rounded p-1 w-1/2 text-black"
            placeholder="0"
            onChange={(e) => handleDrink(company, drink, e.target.value)}
          />
          T
        </div>
      ))}
    </section>
  );
})}
```

- [ ] **Step 2: 빌드를 통과시킨다**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 3: 커밋**

```bash
git add components/sale/SaleCalculation.tsx
git commit -m "feat: 입력 폼에 단일 항목 회사 인라인 배치와 접근성 레이블 추가"
```

---

## Task 4: 담당자 보고문에 부산 줄 추가와 기타 배제

담당자 보고문은 주요 주류만 추려 싣는 큐레이션이다. 부산 줄을 대선 바로 다음에 넣고, 어느 회사의 기타도 들어가지 않게 한다. 무학은 데이터 프레임 전부를 순회하고 있었으므로 기타가 자동으로 끼어드는데, 그걸 걸러내야 한다.

**Files:**
- Modify: `utils/sale/smReport.ts:20-45`

**Interfaces:**
- Consumes: Task 2가 만든 `bskyReport["다. 대선주조"]["부산"]`, `bskyReport["가. 무학"]["기타"]`
- Produces: `getSMReportRows`의 반환 배열에 `{ label: "부산 : ", ... }` 한 줄 추가. `components/sale/SMReport.tsx`가 이 배열을 순회하므로 화면도 함께 바뀐다 (그 파일은 수정하지 않는다).

- [ ] **Step 1: 무학 순회에서 기타를 걸러내고 부산 줄을 넣는다**

`utils/sale/smReport.ts:20-45`를 다음으로 교체한다. `muhakLabels`와 `SMReportRow` 타입은 그대로 둔다.

```typescript
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
    { label: "새로: ", ...bskyReport["라. 롯데"]["새로"] },
    {
      label: "청하(별빛청하 포함): ",
      ...bskyReport["라. 롯데"]["청하(별빛청하 포함)"],
    },
  ];

  return [...muhak, ...others];
};
```

라벨의 콜론 앞 공백이 줄마다 다른 것(`"부산 : "` vs `"새로: "`)은 실수가 아니다. 지금 보고문의 표기를 그대로 유지하는 것이 PRD R5의 요구사항이며, 부산은 이웃한 대선 줄의 표기를 따른다.

- [ ] **Step 2: 빌드를 통과시킨다**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 3: 담당자 보고문을 스냅샷으로 확인한다**

```bash
rm -rf /tmp/snap
npx tsc utils/sale/report.ts utils/sale/calculation.ts utils/sale/order.ts \
        utils/sale/commonReports.ts utils/sale/smReport.ts \
        data/sale/report.ts data/sale/order.ts \
        --outDir /tmp/snap --target es2020 --module commonjs --skipLibCheck
mkdir -p /tmp/snap/node_modules && ln -sfn /tmp/snap /tmp/snap/node_modules/@
node <workspace>/snapshot.js | sed -n '/=====SM=====/,$p'
```

Expected: 2번 항목이 정확히 다음과 같다. 기타 줄이 하나도 없고, `마. 기타 주류회사`도 없고, `좋은데이 톡시리즈`와 `갈매기` 문구가 그대로다.

```
좋은데이 : 20T - 62.5%
모히또 : 0T - 0%
좋은데이 톡시리즈 : 0T - 0%
갈매기 : 0T - 0%
대선(C1포함) : 12T - 37.5%
부산 : 0T - 0%
진로 : 0T - 0%
참이슬 : 0T - 0%
새로: 0T - 0%
청하(별빛청하 포함): 0T - 0%
```

- [ ] **Step 4: 커밋**

```bash
git add utils/sale/smReport.ts
git commit -m "feat: 담당자 보고에 부산 줄 추가하고 기타 항목 배제"
```

---

## Task 5: 브라우저 자동화로 수용 기준 검증

화면에 보이는 것과 클립보드에 복사되는 것이 다를 수 있으므로, 실제로 복사되는 문자열을 읽는다. 이 태스크는 코드를 수정하지 않는다 — 검증만 한다. 검증에서 문제를 발견하면 고치고 어느 태스크의 결함이었는지 보고한다.

**Files:**
- Create: `<workspace>/verify.mjs` (git-ignored, 커밋하지 않는다)

**Interfaces:**
- Consumes: Task 2~4의 모든 변경
- Produces: 없음

- [ ] **Step 1: 개발 서버를 띄운다**

```bash
fuser -k 3003/tcp 2>/dev/null; npm run dev -- -p 3003 > /tmp/dev-3003.log 2>&1 &
until grep -q "Ready in" /tmp/dev-3003.log; do sleep 1; done; echo "서버 준비됨"
```

`pkill -f "next dev"`를 쓰면 Bash 툴 자신의 명령줄에 매칭되어 셸이 죽는다. 반드시 포트로 죽인다.

- [ ] **Step 2: 검증 스크립트를 쓴다**

`<workspace>/verify.mjs`에 저장한다.

```javascript
import { chromium } from "/home/siwoli/.nvm/versions/node/v24.14.1/lib/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath:
    "/home/siwoli/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox"],
});

const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
// 클립보드 API는 헤드리스에서 권한이 없으므로 가로채서 실제 복사 문자열을 읽는다
await page.addInitScript(() => {
  window.__copied = [];
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: (text) => {
        window.__copied.push(text);
        return Promise.resolve();
      },
    },
    configurable: true,
  });
});
page.on("dialog", (d) => d.accept());
await page.goto("http://localhost:3003/sale", { waitUntil: "networkidle" });

// 총 방문업소
await page.getByLabel("총 방문업소:").fill("30");

// 상권은 커스텀 드롭다운이다. 버튼을 눌러 목록을 열고 광안을 고른다.
await page.getByRole("button", { name: /상권을 선택해주세요|광안/ }).click();
await page.getByText("광안", { exact: true }).click();

// 점유비 입력. aria-label로 칸을 하나씩 집는다.
await page.getByLabel("가. 무학 좋은데이").fill("20");
await page.getByLabel("다. 대선주조 대선(C1포함)").fill("12");
await page.getByLabel("다. 대선주조 부산").fill("5");
await page.getByLabel("라. 롯데 기타").fill("2");
await page.getByLabel("마. 기타 주류회사").fill("3");

// 입력 칸 순서 확인 — 대선주조 섹션 안에서 부산이 대선 다음, 기타 앞이어야 한다
const daesunLabels = await page
  .locator("section", { has: page.getByText("다. 대선주조", { exact: true }) })
  .first()
  .locator("input[type=number]")
  .evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
console.log("대선주조 칸 순서:", JSON.stringify(daesunLabels));

// 마 섹션의 제목과 입력 칸이 같은 줄에 있는지 y좌표로 확인
const etcTitle = await page.getByText("마. 기타 주류회사:", { exact: true }).boundingBox();
const etcInput = await page.getByLabel("마. 기타 주류회사").boundingBox();
console.log(
  `마 제목 y=${etcTitle.y} 높이=${etcTitle.height}, 입력칸 y=${etcInput.y} 높이=${etcInput.height}`
);
console.log(
  "같은 줄:",
  etcInput.y < etcTitle.y + etcTitle.height && etcTitle.y < etcInput.y + etcInput.height
);
// 마 섹션에 주류 이름이 따로 표시되지 않아야 한다
console.log("마 섹션에 '기타:' 표시 개수:", await page.getByText("기타:", { exact: true }).count());

await page.getByRole("button", { name: "계산하기" }).click();
await page.getByRole("button", { name: "상권 톡방용 보고 복사하기" }).click();
await page.getByRole("button", { name: "담당자님용 보고 복사하기" }).click();

const copied = await page.evaluate(() => window.__copied);
console.log("\n===== 상권 보고문 (클립보드) =====\n" + copied[0]);
console.log("\n===== 담당자 보고문 (클립보드) =====\n" + copied[1]);

// 좌우 잘림 확인
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth
);
console.log("\n좌우 잘림:", overflow);

await page.screenshot({ path: "/tmp/verify-form.png", fullPage: true });
await browser.close();
```

- [ ] **Step 3: 실행하고 수용 기준을 하나씩 대조한다**

Run: `node <workspace>/verify.mjs`

Expected: 아래 전부가 만족된다. 하나라도 어긋나면 원인을 찾아 고치고, 어느 태스크의 결함이었는지 보고한다.

- 대선주조 칸 순서가 `["다. 대선주조 대선(C1포함)","다. 대선주조 부산","다. 대선주조 기타"]`
- 마 제목과 입력 칸이 같은 줄 (`같은 줄: true`)
- 마 섹션에 별도의 `기타:` 라벨이 표시되지 않는다
- 좌우 잘림이 `false`
- 상권 보고문의 총 테이블 수가 `42T` (20+12+5+2+3), 모든 테이블 단위가 대문자 `T`
- 상권 보고문에 `마. 기타 주류회사: 3T (7.1%)` 형태의 한 줄이 있고 그 아래 `  - 기타:` 줄이 없다
- 상권 보고문의 회사 백분율 다섯 개를 더하면 정확히 100
- 상권 보고문 2번 항목에 `0t(좋은데이)`처럼 소문자 `t`가 그대로 남아 있다 (범위 밖)
- 담당자 보고문에 `부산 : 5T - ...` 줄이 `대선(C1포함) : 12T - ...` 바로 다음에 있다
- 담당자 보고문에 기타 줄이 하나도 없고 `마. 기타 주류회사`도 없다
- 담당자 보고문에 `좋은데이 톡시리즈`와 `갈매기` 문구가 있다
- 담당자 보고문의 대선 백분율 + 부산 백분율이 상권 보고문의 `다. 대선주조` 합계에서 기타 백분율을 뺀 값과 같다

- [ ] **Step 4: 스크린샷을 확인한다**

`/tmp/verify-form.png`를 읽어 마 섹션이 다른 섹션과 어색하지 않게 배치되었는지 눈으로 본다.

- [ ] **Step 5: 서버를 정리한다**

```bash
fuser -k 3003/tcp 2>/dev/null; echo done
```

- [ ] **Step 6: 커밋할 것이 없음을 확인한다**

```bash
git status --short
```

Expected: 아무것도 없음. 이 태스크는 소스를 고치지 않는다. Step 3에서 결함을 고쳤다면 그 파일만 커밋한다.

---

## Self-Review

**1. PRD 요구사항 커버리지**

| 요구사항 | 태스크 |
| --- | --- |
| R1 부산을 대선(C1포함) 다음·기타 앞에 독립 항목으로 | Task 2 Step 1 (데이터), Task 5 Step 3 (순서 검증) |
| R2 무학·롯데에 기타를 마지막으로 | Task 2 Step 1 |
| R3 `마. 기타 주류회사` 승격, 하드코딩 두 줄 삭제, 단일 항목 한 줄, 개수로 판정, 입력 칸 인라인, 총합·보정 참여 | Task 2 Steps 1·2·3·4 (보고문·화면), Task 3 Step 1 (입력 폼), Task 5 Step 3 (총합 42T, 백분율 합 100) |
| R4 상권 보고문·화면·입력 폼 단위 대문자 T, 담당자 보고문 무변경 | Task 2 Steps 2·3·4, Task 3 Step 1, Task 5 Step 3 |
| R5 부산 줄 추가, 기타 전부 배제, 마 미노출, 기존 줄 동결, 재계산 금지 | Task 4 Step 1, Task 4 Step 3, Task 5 Step 3 |
| R6 세 가지 외 무변경 | Task 1 전체 (기준값), Task 2 Step 6 (diff) |
| R7 점유비 입력 칸 `aria-label` | Task 3 Step 1, Task 5 Step 2 (레이블로 칸 집기) |

빠진 요구사항 없음.

**2. 플레이스홀더 점검**

모든 코드 스텝에 실제 코드가 들어 있다. "적절히", "TBD", "Task N과 비슷하게"가 없다. `<workspace>`와 `<absolute path>`는 실행 시점에 결정되는 경로이므로 플레이스홀더가 아니라 파라미터이며, 각 태스크에 치환 지시가 붙어 있다.

**3. 타입·이름 일관성**

- `handleDrink(company: string, drink: string, value: string)` — Task 3이 기존 시그니처를 그대로 쓴다. 변경 없음.
- `getTotalOccupancyNumByCompany(reportCompany, isRatio)` — Task 2가 인자 순서를 기존대로 쓴다.
- `getSMReportRows(bskyReport): SMReportRow[]` — Task 4가 시그니처를 바꾸지 않으므로 `components/sale/SMReport.tsx`와 `utils/sale/report.ts:100`의 호출부가 그대로 동작한다.
- `SMReportRow.label`은 콜론과 공백까지 포함한 완성 접두사다. `"부산 : "`이 이 규약을 따른다. `SMReport.tsx`가 `key={row.label}`을 쓰는데 라벨이 모두 서로 다르므로 중복 키가 생기지 않는다.
- 데이터 프레임 키 `"마. 기타 주류회사"`는 Task 2가 만들고 Task 3·5가 같은 문자열로 참조한다. `"다. 대선주조"`의 `부산`은 Task 2가 만들고 Task 4·5가 참조한다.
- `Object.keys(drinks).length === 1` 판정이 세 곳(Task 2 Step 2, Task 2 Step 4, Task 3 Step 1)에 각각 인라인된다. 한 줄짜리 판정식이라 공용 함수로 빼지 않는다 — 새 export를 만들 만한 무게가 아니다.
