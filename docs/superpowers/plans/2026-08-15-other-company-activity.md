# 타사 활동·특이사항 항목 개편 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**PRD:** `/home/siwoli/work/abt/.claude/worktrees/other-company-activity/docs/agents/0002-other-company-activity.md`

**Goal:** 상권 보고문의 3번을 회사별 대판팀·행사팀 인원 집계로, 4번을 한 줄 특이사항으로 바꾸고, 두 항목이 상권과 무관하게 항상 나오게 한다.

**Architecture:** 3번과 4번은 각각 데이터 모델 → 초기값 상수 → 입력 컴포넌트 → 상태(`SaleCalculation`) → 보고문 생성 함수(`getBSKYReport`) → 화면 표시(`Result`)로 이어지는 한 줄기다. Task 1이 3번 줄기를 통째로 교체하고, Task 2가 4번 줄기를 교체하면서 자사 판촉물 재고량 관련 코드와 상권 분기 상수를 지운다. Task 3은 모바일 폭에서 실측한다. 보고문의 1, 2번을 만드는 템플릿 리터럴은 어느 태스크에서도 건드리지 않는다.

**Tech Stack:** Next.js 14.2.11 App Router, React 18, TypeScript strict, Tailwind CSS

**Spec:** `/home/siwoli/work/abt/.claude/worktrees/other-company-activity/docs/agents/0002-other-company-activity.md`

## Global Constraints

- 작업 디렉터리는 `/home/siwoli/work/abt/.claude/worktrees/other-company-activity`다. 이 밖의 경로를 수정하지 않는다. 특히 `/home/siwoli/work/abt/.claude/worktrees/muhak-mojito`는 다른 브랜치의 워크트리이니 손대지 않는다.
- `git push`, `git merge`, `git checkout`, `git stash`, 브랜치 생성을 하지 않는다. 커밋만 한다.
- `git add`는 해당 태스크가 건드린 파일만 지정한다. `git add -A`와 `git add .`는 금지다.
- 서브에이전트나 리뷰어를 띄우지 않는다.
- `.env.local`은 이미 더미 값으로 있다. 실제 Supabase 자격증명을 찾거나 만들지 않는다.
- `npm run lint`를 실행하지 않는다. 이 워크트리에서는 ESLint 플러그인 중복 로드로 환경적으로 실패한다. 검증은 `npm run build`로 한다.
- 보고문의 1번과 2번 출력은 변경 전후로 글자 단위로 동일해야 한다. `getBSKYReport`의 `let reportContent = \`...\`` 템플릿 리터럴 안을 수정하지 않는다.
- 타입은 `OtherCompanyActivity`, 필드는 `name`, `daepanTeam`, `haengsaTeam`이며 인원 필드 타입은 `number | undefined`다.
- 3번 회사 순서는 하이트진로, 대선주조, 롯데주류다.
- 3번 보고문 줄은 들여쓰기 없이 `- `로 시작한다.
- 특이사항은 한 줄짜리 텍스트 입력 칸 하나이고, `trim()` 결과가 비면 `없음`을 출력한다.

## File Structure

**Task 1에서 만드는 파일**
- `utils/sale/otherCompanyActivity.ts` — 3번의 초기값 상수 하나만 담는다.
- `components/sale/otherCompanyActivity/OtherCompanyActivityInput.tsx` — 회사 한 줄의 입력 UI. 부모가 값을 쥐는 제어 컴포넌트다.
- `components/sale/otherCompanyActivity/OtherCompanyActivity.tsx` — 세 줄을 감싸는 섹션.
- `components/sale/report/OtherCompanyActivityReport.tsx` — 화면 결과의 3번 표시.

**Task 1에서 지우는 파일**
- `utils/sale/otherCompanyPromotion.ts`
- `components/sale/otherCompanyPromotion/OtherCompanyPromotion.tsx`
- `components/sale/otherCompanyPromotion/OtherCompanyPromotionInput.tsx`
- `components/sale/report/OtherCompanyPromotionReport.tsx`

**Task 2에서 지우는 파일**
- `utils/sale/promotionStock.ts`
- `components/sale/promotionStock/PromotionStockInput.tsx`
- `components/sale/report/PromotionStockReport.tsx`

**두 태스크가 함께 고치는 파일**
- `utils/sale/types.ts` — Task 1이 `OtherCompanyPromotionResult`를 `OtherCompanyActivity`로 교체하고, Task 2가 `PromotionStock`을 지운다.
- `utils/sale/report.ts` — Task 1이 3번을, Task 2가 4번을 담당한다.
- `components/sale/SaleCalculation.tsx` — 상태와 입력 UI 배치.
- `components/sale/Result.tsx` — 보고문 함수 호출과 화면 표시.

**Task 2에서만 고치는 파일**
- `utils/sale/businessZones.ts` — `additionalInfoBusinessZones` 삭제.

---

### Task 1: 3번 항목을 타사 활동으로 교체

**Files:**
- Modify: `utils/sale/types.ts:17-21`
- Create: `utils/sale/otherCompanyActivity.ts`
- Delete: `utils/sale/otherCompanyPromotion.ts`
- Create: `components/sale/otherCompanyActivity/OtherCompanyActivityInput.tsx`
- Create: `components/sale/otherCompanyActivity/OtherCompanyActivity.tsx`
- Delete: `components/sale/otherCompanyPromotion/OtherCompanyPromotionInput.tsx`
- Delete: `components/sale/otherCompanyPromotion/OtherCompanyPromotion.tsx`
- Create: `components/sale/report/OtherCompanyActivityReport.tsx`
- Delete: `components/sale/report/OtherCompanyPromotionReport.tsx`
- Modify: `utils/sale/report.ts`
- Modify: `components/sale/SaleCalculation.tsx`
- Modify: `components/sale/Result.tsx`
- Test: 없음. 이 레포에는 테스트가 없다. 검증은 `npm run build`와 보고문 문자열 눈 비교다.

**Interfaces:**
- Produces (Task 2가 그대로 쓴다):
  - `OtherCompanyActivity = { name: string; daepanTeam: number | undefined; haengsaTeam: number | undefined }`
  - `initOtherCompanyActivities: OtherCompanyActivity[]`
  - `getBSKYReport(bskyReport, totalBisness, selectedBusinessZone, orders, additionalOrders, otherCompanyActivities: OtherCompanyActivity[], promotionStocks: PromotionStock[])` — 여섯 번째 인자만 타입이 바뀌고 일곱 번째는 Task 2까지 그대로다.
  - `SaleCalculation`의 상태 `otherCompanyActivities`와 핸들러 `handleOtherCompanyActivity(name: string, team: "daepanTeam" | "haengsaTeam", value: string)`

- [ ] **Step 1: 타입 교체**

`utils/sale/types.ts`의 17-21행을 아래로 바꾼다. `PromotionStock`(23-26행)은 이 태스크에서 건드리지 않는다.

```ts
export type OtherCompanyActivity = {
  name: string;
  daepanTeam: number | undefined;
  haengsaTeam: number | undefined;
};
```

- [ ] **Step 2: 초기값 상수 파일 생성**

`utils/sale/otherCompanyActivity.ts`를 만든다.

```ts
import { OtherCompanyActivity } from "./types";

export const initOtherCompanyActivities: OtherCompanyActivity[] = [
  { name: "하이트진로", daepanTeam: undefined, haengsaTeam: undefined },
  { name: "대선주조", daepanTeam: undefined, haengsaTeam: undefined },
  { name: "롯데주류", daepanTeam: undefined, haengsaTeam: undefined },
];
```

- [ ] **Step 3: 옛 초기값 파일 삭제**

```bash
git rm utils/sale/otherCompanyPromotion.ts
```

- [ ] **Step 4: 입력 컴포넌트 생성**

`components/sale/otherCompanyActivity/OtherCompanyActivityInput.tsx`를 만든다.

`flex-wrap`과 각 입력의 `min-w-0`이 이 파일의 핵심이다. `<input>`은 브라우저 기본값 때문에 고유 최소 폭이 약 187px이라, `min-w-0` 없이는 `w-[48px]`을 줘도 좁은 화면에서 행이 밖으로 밀린다.

```tsx
"use client";

import { OtherCompanyActivity } from "@/utils/sale/types";

type OtherCompanyActivityInputProps = {
  activity: OtherCompanyActivity;
  handleOtherCompanyActivity: (
    name: string,
    team: "daepanTeam" | "haengsaTeam",
    value: string
  ) => void;
};

export default function OtherCompanyActivityInput({
  activity,
  handleOtherCompanyActivity,
}: OtherCompanyActivityInputProps) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-x-1 gap-y-1 py-1.5">
      <span className="whitespace-nowrap">{activity.name}:</span>
      <span className="whitespace-nowrap">대판팀</span>
      <input
        type="number"
        pattern="\d*"
        className="border border-gray-300 rounded p-1 w-[48px] min-w-0 text-black"
        value={activity.daepanTeam !== undefined ? activity.daepanTeam : ""}
        placeholder="0"
        onChange={(e) =>
          handleOtherCompanyActivity(activity.name, "daepanTeam", e.target.value)
        }
      />
      <span className="whitespace-nowrap">명 /</span>
      <span className="whitespace-nowrap">행사팀</span>
      <input
        type="number"
        pattern="\d*"
        className="border border-gray-300 rounded p-1 w-[48px] min-w-0 text-black"
        value={activity.haengsaTeam !== undefined ? activity.haengsaTeam : ""}
        placeholder="0"
        onChange={(e) =>
          handleOtherCompanyActivity(
            activity.name,
            "haengsaTeam",
            e.target.value
          )
        }
      />
      <span className="whitespace-nowrap">명</span>
    </div>
  );
}
```

- [ ] **Step 5: 섹션 컴포넌트 생성**

`components/sale/otherCompanyActivity/OtherCompanyActivity.tsx`를 만든다. 파일명과 달리 함수 이름을 `OtherCompanyActivitySection`으로 두는 이유는 같은 이름의 타입과 부딪히지 않게 하기 위함이다.

```tsx
import OtherCompanyActivityInput from "./OtherCompanyActivityInput";
import { OtherCompanyActivity } from "@/utils/sale/types";

type OtherCompanyActivitySectionProps = {
  otherCompanyActivities: OtherCompanyActivity[];
  handleOtherCompanyActivity: (
    name: string,
    team: "daepanTeam" | "haengsaTeam",
    value: string
  ) => void;
};

export default function OtherCompanyActivitySection({
  otherCompanyActivities,
  handleOtherCompanyActivity,
}: OtherCompanyActivitySectionProps) {
  return (
    <section className="border border-gray-300 rounded p-4 w-full text-black mt-4">
      <h1 className="text-lg font-bold">타사 활동</h1>
      {otherCompanyActivities.map((activity) => (
        <OtherCompanyActivityInput
          key={activity.name}
          activity={activity}
          handleOtherCompanyActivity={handleOtherCompanyActivity}
        />
      ))}
    </section>
  );
}
```

- [ ] **Step 6: 옛 입력 컴포넌트 삭제**

```bash
git rm -r components/sale/otherCompanyPromotion
```

- [ ] **Step 7: 화면 표시 컴포넌트 생성**

`components/sale/report/OtherCompanyActivityReport.tsx`를 만든다.

```tsx
import { OtherCompanyActivity } from "@/utils/sale/types";

type OtherCompanyActivityReportProps = {
  otherCompanyActivities: OtherCompanyActivity[];
};

export default function OtherCompanyActivityReport({
  otherCompanyActivities,
}: OtherCompanyActivityReportProps) {
  return (
    <section>
      <h1>3. 타사 활동</h1>
      <div>
        {otherCompanyActivities.map((activity) => (
          <p key={activity.name}>
            - {activity.name}: 대판팀 {activity.daepanTeam || 0}명 / 행사팀{" "}
            {activity.haengsaTeam || 0}명
          </p>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: 옛 화면 표시 컴포넌트 삭제**

```bash
git rm components/sale/report/OtherCompanyPromotionReport.tsx
```

- [ ] **Step 9: 보고문 생성 함수의 3번 교체**

`utils/sale/report.ts`를 고친다. 네 군데다.

첫째, 4행의 `OtherCompanyPromotionResult`를 `OtherCompanyActivity`로 바꾼다. `PromotionStock`(5행)과 `additionalInfoBusinessZones` import(14행)는 그대로 둔다.

둘째, 38행의 인자 타입을 바꾼다.

```ts
  otherCompanyActivities: OtherCompanyActivity[],
  promotionStocks: PromotionStock[]
```

셋째, 65-70행의 `formattedPromotions`를 아래로 바꾼다.

```ts
  const formattedActivities = otherCompanyActivities
    .map(
      (activity) =>
        `- ${activity.name}: 대판팀 ${activity.daepanTeam || 0}명 / 행사팀 ${
          activity.haengsaTeam || 0
        }명`
    )
    .join("\n");
```

넷째, 91-96행의 조건 블록을 아래로 바꾼다. 3번은 조건 밖으로 나오고 4번만 조건 안에 남는다. `\n` 다음의 줄바꿈이 3번과 4번 사이 빈 줄을 만든다.

```ts
  reportContent += `3. 타사 활동
${formattedActivities}`;
  if (additionalInfoBusinessZones.includes(selectedBusinessZone)) {
    reportContent += `\n
4. ★자사 판촉물 재고량★ (박스로 기입해서 올려주세요)
${formattedPromotionStocks}`;
  }
  return reportContent;
```

76-90행의 `let reportContent = \`...\`` 템플릿 안은 한 글자도 바꾸지 않는다.

- [ ] **Step 10: 상태와 입력 배치 교체**

`components/sale/SaleCalculation.tsx`를 고친다.

import 부분에서 `OtherCompanyPromotionResult`를 `OtherCompanyActivity`로, `initOtherCompanyPromotions`를 `initOtherCompanyActivities`로(경로도 `@/utils/sale/otherCompanyActivity`로), `OtherCompanyPromotion` 컴포넌트를 `OtherCompanyActivitySection`으로(경로는 `./otherCompanyActivity/OtherCompanyActivity`) 바꾼다.

52-54행의 상태를 아래로 바꾼다.

```tsx
  const [otherCompanyActivities, setOtherCompanyActivities] = useState<
    OtherCompanyActivity[]
  >(initOtherCompanyActivities);
```

206-222행의 `handleOtherCompanyPromotion`을 아래로 바꾼다. 이름으로 찾아 넣던 upsert가 필요 없어진다. 회사 목록이 고정이고 부모가 값을 쥐기 때문이다.

```tsx
  const handleOtherCompanyActivity = (
    name: string,
    team: "daepanTeam" | "haengsaTeam",
    value: string
  ) => {
    const parsed = parseInt(value);
    setOtherCompanyActivities((prev) =>
      prev.map((activity) =>
        activity.name === name
          ? { ...activity, [team]: Number.isNaN(parsed) ? undefined : parsed }
          : activity
      )
    );
  };
```

297-308행의 조건 블록을 아래로 바꾼다. 3번은 항상 보이고 판촉물 재고 입력만 조건 안에 남는다.

```tsx
        <OtherCompanyActivitySection
          otherCompanyActivities={otherCompanyActivities}
          handleOtherCompanyActivity={handleOtherCompanyActivity}
        />
        {additionalInfoBusinessZones.includes(selectedBusinessZone) && (
          <PromotionStockInput
            promotionStocks={promotionStocks}
            handlePromotionStockChange={handlePromotionStockChange}
          />
        )}
```

329행의 `Result`에 넘기는 prop 이름도 `otherCompanyActivities={otherCompanyActivities}`로 바꾼다.

- [ ] **Step 11: 화면 결과 교체**

`components/sale/Result.tsx`를 고친다.

import에서 `OtherCompanyPromotionResult`를 `OtherCompanyActivity`로, `OtherCompanyPromotionReport`를 `OtherCompanyActivityReport`로(경로는 `./report/OtherCompanyActivityReport`) 바꾼다.

43행의 prop 타입과 55행의 구조분해, 66행·75행의 `getBSKYReport` 인자와 `useMemo` 의존성 배열의 이름을 `otherCompanyActivities`로 맞춘다.

189-198행의 조건 블록을 아래로 바꾼다.

```tsx
                <div>
                  <br />
                  <OtherCompanyActivityReport
                    otherCompanyActivities={otherCompanyActivities}
                  />
                  {additionalInfoBusinessZones.includes(
                    selectedBusinessZone
                  ) && (
                    <>
                      <br />
                      <PromotionStockReport promotionStocks={promotionStocks} />
                    </>
                  )}
                </div>
```

- [ ] **Step 12: 빌드 통과 확인**

```bash
npm run build
```

Expected: 성공. 실패하면 남은 옛 이름 참조를 찾아 고친다.

```bash
grep -rn "otherCompanyPromotion\|OtherCompanyPromotion" --include=*.ts --include=*.tsx utils components app data action
```

Expected: 출력 없음.

동작 확인은 Task 3에서 브라우저 자동화로 한다. 이 태스크에서는 서버를 띄우지 않는다.

- [ ] **Step 13: 커밋**

```bash
git add utils/sale/types.ts utils/sale/otherCompanyActivity.ts utils/sale/report.ts \
  components/sale/otherCompanyActivity components/sale/report/OtherCompanyActivityReport.tsx \
  components/sale/SaleCalculation.tsx components/sale/Result.tsx
git commit -m "feat: 상권 보고 3번을 회사별 대판팀·행사팀 집계로 교체"
```

`git rm`으로 지운 파일은 이미 스테이징되어 있다.

---

### Task 2: 4번 항목을 특이사항으로 교체하고 판촉물 재고와 상권 분기 삭제

**Files:**
- Modify: `utils/sale/types.ts` — `PromotionStock` 삭제
- Delete: `utils/sale/promotionStock.ts`
- Delete: `components/sale/promotionStock/PromotionStockInput.tsx`
- Delete: `components/sale/report/PromotionStockReport.tsx`
- Modify: `utils/sale/businessZones.ts:18`
- Modify: `utils/sale/report.ts`
- Modify: `components/sale/SaleCalculation.tsx`
- Modify: `components/sale/Result.tsx`
- Test: 없음. 검증은 `npm run build`와 보고문 문자열 눈 비교다.

**Interfaces:**
- Consumes (Task 1이 만든 것): `OtherCompanyActivity`, `initOtherCompanyActivities`, `handleOtherCompanyActivity`, `OtherCompanyActivitySection`, `OtherCompanyActivityReport`
- Produces: `getBSKYReport(bskyReport, totalBisness, selectedBusinessZone, orders, additionalOrders, otherCompanyActivities: OtherCompanyActivity[], remarks: string)` — 일곱 번째 인자가 `PromotionStock[]`에서 `string`으로 바뀐 최종 형태다.

- [ ] **Step 1: 판촉물 재고 파일 삭제**

```bash
git rm utils/sale/promotionStock.ts
git rm -r components/sale/promotionStock
git rm components/sale/report/PromotionStockReport.tsx
```

- [ ] **Step 2: 타입 삭제**

`utils/sale/types.ts`에서 아래 블록을 지운다.

```ts
export type PromotionStock = {
  name: string;
  quantity: number | undefined;
};
```

- [ ] **Step 3: 상권 분기 상수 삭제**

`utils/sale/businessZones.ts`의 마지막 줄을 지운다. `businessZones` 배열은 그대로 둔다.

```ts
export const additionalInfoBusinessZones = ["수영", "부산대"];
```

- [ ] **Step 4: 보고문 생성 함수의 4번 교체**

`utils/sale/report.ts`를 고친다. 다섯 군데다.

첫째, import에서 `PromotionStock`을 지운다.

둘째, `import { additionalInfoBusinessZones } from "@/utils/sale/businessZones";` 줄을 통째로 지운다.

셋째, 일곱 번째 인자를 바꾼다.

```ts
  otherCompanyActivities: OtherCompanyActivity[],
  remarks: string
```

넷째, `formattedPromotionStocks` 상수를 지운다.

다섯째, Task 1이 만든 3번 추가 부분과 4번 조건 블록을 아래 한 덩어리로 바꾼다.

```ts
  reportContent += `3. 타사 활동
${formattedActivities}

4. 특이사항
- ${remarks.trim() || "없음"}`;
  return reportContent;
```

`let reportContent = \`...\`` 템플릿 안은 여전히 한 글자도 바꾸지 않는다.

- [ ] **Step 5: 특이사항 상태와 입력 칸 추가**

`components/sale/SaleCalculation.tsx`를 고친다.

import에서 `PromotionStock`, `initPromotionStocks`, `PromotionStockInput`, `additionalInfoBusinessZones`를 지운다. `businessZones` import는 남긴다.

`promotionStocks` 상태와 `handlePromotionStockChange` 핸들러를 지우고, 대신 특이사항 상태를 넣는다.

```tsx
  const [remarks, setRemarks] = useState<string>("");
```

Task 1이 남긴 `PromotionStockInput` 조건 블록을 지우고 그 자리에 특이사항 입력 섹션을 넣는다. `OtherCompanyActivitySection` 바로 다음이다.

```tsx
        <section className="border border-gray-300 rounded p-4 w-full text-black mt-4">
          <h1 className="text-lg font-bold">특이사항</h1>
          <input
            type="text"
            className="border border-gray-300 rounded p-1 mt-2 w-full min-w-0 text-black"
            placeholder="없으면 비워두세요"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </section>
```

`Result`에 넘기던 `promotionStocks={promotionStocks}`를 `remarks={remarks}`로 바꾼다.

- [ ] **Step 6: 화면 결과의 4번 교체**

`components/sale/Result.tsx`를 고친다.

import에서 `PromotionStock`, `PromotionStockReport`, `additionalInfoBusinessZones`를 지운다.

prop 타입의 `promotionStocks: PromotionStock[]`를 `remarks: string`으로 바꾸고, 구조분해와 `getBSKYReport` 인자와 `useMemo` 의존성 배열도 함께 바꾼다.

Task 1이 남긴 블록을 아래로 바꾼다. 조건이 사라지고 4번이 인라인으로 들어간다.

```tsx
                <div>
                  <br />
                  <OtherCompanyActivityReport
                    otherCompanyActivities={otherCompanyActivities}
                  />
                  <br />
                  <section>
                    <h1>4. 특이사항</h1>
                    <p>- {remarks.trim() || "없음"}</p>
                  </section>
                </div>
```

- [ ] **Step 7: 빌드 통과와 죽은 코드 확인**

```bash
npm run build
```

Expected: 성공.

```bash
grep -rn "promotionStock\|PromotionStock\|additionalInfoBusinessZones" --include=*.ts --include=*.tsx utils components app data action
```

Expected: 출력 없음.

동작 확인은 Task 3에서 브라우저 자동화로 한다. 이 태스크에서는 서버를 띄우지 않는다.

- [ ] **Step 8: 커밋**

```bash
git add utils/sale/types.ts utils/sale/businessZones.ts utils/sale/report.ts \
  components/sale/SaleCalculation.tsx components/sale/Result.tsx
git commit -m "feat: 상권 보고 4번을 특이사항으로 교체하고 판촉물 재고·상권 분기 삭제"
```

---

### Task 3: 브라우저 자동화로 수용 기준 검증

**Files:**
- Create: `/tmp/oca-verify.mjs` (스크래치. 레포에 커밋하지 않는다)
- Modify (검증이 실패했을 때만): `components/sale/otherCompanyActivity/OtherCompanyActivityInput.tsx`
- Test: 없음. Playwright로 직접 잰다.

**Interfaces:**
- Consumes: Task 2까지 끝난 화면 전체, 그리고 변경 전 `main`에서 미리 떠 둔 기준 보고문 `/home/siwoli/work/abt/.superpowers/sdd/2026-08-15-other-company-activity/baseline-report.txt`

- [ ] **Step 1: 개발 서버 띄우기**

`npm run dev -- -p 3002`를 백그라운드로 띄운다. 포그라운드 `sleep`으로 기다리지 말고, 아래 `curl`의 재시도로 준비를 기다린다.

```bash
curl -sS -o /dev/null --retry 30 --retry-delay 1 --retry-all-errors http://localhost:3002/sale && echo "server up"
```

- [ ] **Step 2: 검증 스크립트 작성**

`/tmp/oca-verify.mjs`를 만든다. 이 앱은 `navigator.clipboard.writeText`로 보고문을 복사하므로, 그 함수를 가로채 `window.__copied`에 담아 실제 보고문 문자열을 그대로 읽는다. 화면 표시가 아니라 복사되는 문자열이 검증 대상이다.

```js
import { chromium } from "/home/siwoli/.nvm/versions/node/v24.14.1/lib/node_modules/playwright-core/index.mjs";
import { readFileSync } from "node:fs";

const BASE =
  "/home/siwoli/work/abt/.superpowers/sdd/2026-08-15-other-company-activity/baseline-report.txt";
// 첫 줄은 날짜가 들어간 제목이라 실행일에 따라 달라진다. 2번째 줄부터 비교한다.
const baselineBody = readFileSync(BASE, "utf8").split("\n").slice(1).join("\n");

const EXPECTED_SECTION3 = `3. 타사 활동
- 하이트진로: 대판팀 0명 / 행사팀 0명
- 대선주조: 대판팀 0명 / 행사팀 0명
- 롯데주류: 대판팀 0명 / 행사팀 0명`;

const browser = await chromium.launch({
  executablePath:
    "/home/siwoli/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox"],
});

const fails = [];
const check = (name, ok, detail = "") => {
  console.log((ok ? "PASS  " : "FAIL  ") + name + (ok ? "" : "\n      " + detail));
  if (!ok) fails.push(name);
};

async function openPage(width) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    isMobile: true,
    hasTouch: true,
  });
  page.on("dialog", (d) => d.accept());
  await page.addInitScript(() => {
    window.__copied = "";
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (t) => {
          window.__copied = t;
          return Promise.resolve();
        },
      },
      configurable: true,
    });
  });
  await page.goto("http://localhost:3002/sale", { waitUntil: "networkidle" });
  return page;
}

const activityInputs = (page) =>
  page
    .locator("section", { has: page.locator("h1", { hasText: "타사 활동" }) })
    .locator("input[type=number]");

const remarksInput = (page) =>
  page
    .locator("section", { has: page.locator("h1", { hasText: "특이사항" }) })
    .locator("input[type=text]");

async function copyReport(page) {
  await page.locator("input[type=number]").first().fill("1");
  await page.getByRole("button", { name: "계산하기" }).click();
  const copyBtn = page.getByRole("button", { name: "상권 톡방용 보고 복사하기" });
  await copyBtn.waitFor();
  await copyBtn.click();
  await page.waitForFunction(() => window.__copied.length > 0);
  return page.evaluate(() => window.__copied);
}

// 1) 레이아웃: 세 폭에서 화면 밖으로 나간 요소가 없어야 한다
for (const width of [360, 390, 430]) {
  const page = await openPage(width);
  const over = await page.evaluate(() => {
    const de = document.documentElement;
    return [...document.querySelectorAll("*")]
      .filter((el) => {
        const b = el.getBoundingClientRect();
        return b.right > de.clientWidth + 0.5 || b.left < -0.5;
      })
      .map(
        (el) =>
          el.tagName +
          "." +
          (typeof el.className === "string" ? el.className : "")
      );
  });
  const hScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  check(`레이아웃 ${width}px: 화면 밖 요소 0개`, over.length === 0, JSON.stringify(over.slice(0, 5)));
  check(`레이아웃 ${width}px: 가로 스크롤 없음`, hScroll === false);
  if (width === 390) await page.screenshot({ path: "/tmp/oca-390.png", fullPage: true });
  await page.close();
}

// 2) 기본 상권(광안)에서 3, 4번이 나오고 1, 2번이 그대로다
{
  const page = await openPage(390);
  check("광안: 3번 입력 UI가 보인다", await activityInputs(page).count() === 6);
  check("광안: 4번 입력 칸이 하나다", await remarksInput(page).count() === 1);
  const report = await copyReport(page);
  const body = report.split("\n").slice(1).join("\n");
  check("광안: 1, 2번이 변경 전과 글자 단위로 같다", body.startsWith(baselineBody), JSON.stringify(body.slice(0, baselineBody.length)));
  check("광안: 3번이 예시와 정확히 같다", report.includes(EXPECTED_SECTION3), JSON.stringify(report.slice(baselineBody.length)));
  check("광안: 4번이 '- 없음'으로 끝난다", report.endsWith("4. 특이사항\n- 없음"), JSON.stringify(report.slice(-40)));
  await page.close();
}

// 3) 수영으로 바꿔도 같은 3, 4번이 나온다
{
  const page = await openPage(390);
  await page.getByRole("button", { name: "광안" }).click();
  await page.getByText("수영", { exact: true }).click();
  const report = await copyReport(page);
  check("수영: 3번이 예시와 정확히 같다", report.includes(EXPECTED_SECTION3));
  check("수영: 4번이 '- 없음'으로 끝난다", report.endsWith("4. 특이사항\n- 없음"));
  check("수영: 판촉물 재고량 항목이 없다", !report.includes("재고량"));
  await page.close();
}

// 4) 인원 입력이 보고문에 반영된다
{
  const page = await openPage(390);
  await activityInputs(page).nth(0).fill("2");
  await activityInputs(page).nth(1).fill("3");
  const report = await copyReport(page);
  check(
    "인원 입력: 하이트진로 줄에 2명/3명이 반영된다",
    report.includes("- 하이트진로: 대판팀 2명 / 행사팀 3명"),
    JSON.stringify(report.slice(report.indexOf("3. 타사 활동")))
  );
  check("인원 입력: 나머지 두 회사는 0명이다", report.includes("- 대선주조: 대판팀 0명 / 행사팀 0명"));
  await page.close();
}

// 5) 특이사항이 보고문에 반영된다
{
  const page = await openPage(390);
  await remarksInput(page).fill("   ");
  let report = await copyReport(page);
  check("특이사항 공백만: '- 없음'이 나온다", report.endsWith("4. 특이사항\n- 없음"), JSON.stringify(report.slice(-40)));
  await page.close();
}
{
  const page = await openPage(390);
  await remarksInput(page).fill("테라 행사 있었음");
  const report = await copyReport(page);
  check("특이사항 입력: 그 내용이 그대로 나온다", report.endsWith("4. 특이사항\n- 테라 행사 있었음"), JSON.stringify(report.slice(-40)));
  await page.close();
}

await browser.close();

if (fails.length > 0) {
  console.log(`\n실패 ${fails.length}건: ${fails.join(", ")}`);
  process.exit(1);
}
console.log("\n전부 통과");
```

- [ ] **Step 3: 검증 실행**

```bash
node /tmp/oca-verify.mjs
```

Expected: 마지막 줄에 `전부 통과`, 종료 코드 0.

- [ ] **Step 4: 실패했을 때만 고친다**

레이아웃 항목이 실패하면 출력된 요소 이름으로 범인을 찾는다. 3번 행이 원인이면 `OtherCompanyActivityInput.tsx` 바깥 `div`의 `flex-row flex-wrap`을 `flex-col items-start`로 바꿔 회사 이름과 두 팀을 세로로 쌓는다.

보고문 항목이 실패하면 출력된 실제 문자열과 기대값을 비교해 원인이 되는 파일을 고친다. `1, 2번이 변경 전과 같다`가 실패했다면 `utils/sale/report.ts`의 `let reportContent = \`...\`` 템플릿이 잘못 수정된 것이다.

고친 뒤 `npm run build`를 통과시키고 Step 3을 다시 돌린다. `전부 통과`가 나올 때까지 반복한다.

- [ ] **Step 5: 서버 내리기**

`pkill` 패턴이 자기 자신의 명령줄과 일치해 셸을 죽이는 일이 있으므로 포트로 찾아 죽인다.

```bash
fuser -k 3002/tcp 2>/dev/null; ss -ltn | grep -E ':3002' || echo "3002 free"
```

- [ ] **Step 6: 커밋**

Step 4에서 레포 파일을 고쳤을 때만 커밋한다. 고치지 않았다면 커밋할 것이 없으니 넘어간다. `/tmp/oca-verify.mjs`는 스크래치이므로 커밋하지 않는다.

```bash
git add components/sale/otherCompanyActivity/OtherCompanyActivityInput.tsx
git commit -m "fix: 좁은 화면에서 타사 활동 입력 행이 넘치지 않도록 조정"
```
