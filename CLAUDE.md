# tools_for_you

좋은데이 판촉 근무자를 위한 음용비 자동 계산 및 보고서 생성 도구입니다. Next.js 14 + Supabase.

도메인 용어는 [CONTEXT.md](./CONTEXT.md)를 따릅니다.

## 문서 규약

- **PRD**: `docs/agents/`에 둡니다. 형식은 배경 / 용어 / 요구사항(MUST·SHOULD·근거) / 범위 밖 / 수용 기준 / 검증입니다.
- **ADR**: `docs/adr/`에 둡니다.
- **글로서리**: 루트 `CONTEXT.md` 하나입니다. 구현 세부는 넣지 않습니다.

## 검증

테스트가 없습니다. 변경 후에는 `npm run build`를 통과시키세요. `utils/getSupabaseClient.ts`가 모듈 로드 시점에 환경변수를 읽으므로, 값이 없으면 빌드가 코드와 무관하게 실패합니다. 로컬 검증에는 더미 값이 든 `.env.local`이면 충분합니다 (gitignore 대상).
