# planlog

개인용 데일리 타임박싱 플래너. 일론 머스크 시간관리법(Brain Dump → Big 3 → 시간 배정)을 기반으로 한다.

이 저장소의 진짜 목적은 기능 구현이 아니라, AI 에이전트와 실무 수준으로 협업하는 방식(Agentic Engineering)을 연습하는 것이다. 사람은 의도·제약·판단 기준을 정의하고, 에이전트는 그 안에서 구현·검증·기록을 수행한다.

## 이 문서를 읽는 법 (Harness 원칙)

이 파일은 백과사전이 아니라 지도(map)다. 모든 규칙을 여기 담지 않는다.

- **역할 분리**: 이 파일은 저장소 전체에 항상 적용되는 것만 담는다. 프론트/백엔드별 규칙은 `frontend/CLAUDE.md`, `backend/CLAUDE.md`에 있고, 그 폴더에서 작업할 때 이 파일과 함께 자동으로 로드된다. 다른 쪽 폴더 내용은 섞이지 않는다.
- **Agent Legibility**: 중요한 설계 결정은 대화가 아니라 저장소 안(`docs/decisions/`)에 남긴다. 저장소에 없는 지식은 에이전트에게 없는 것과 같다.
- **기계적 강제 우선**: 규칙은 가능하면 문서보다 lint, 타입, 테스트로 강제한다. 문서로만 존재하는 규칙은 언젠가 깨진다.
- **피드백 루프**: "동작하는 것 같다"로 끝내지 않는다. 구현 후 빌드/린트/테스트를 실제로 실행하고 결과를 근거로 제시한다.

## 구조

- `frontend/` — Next.js (App Router). 규칙은 `frontend/CLAUDE.md` 참고.
- `backend/` — Fastify + MySQL + Drizzle. 규칙은 `backend/CLAUDE.md` 참고.
- `docs/decisions/` — 아키텍처/설계 결정 기록(ADR). 방향을 바꾸는 결정은 코드보다 먼저 여기 남긴다.
- `docs/`(그 외) — 아키텍처, 스펙, 계획 등 상세 문서. 필요할 때만 찾아본다.

## 원칙

- MVP 우선: 기능 범위는 지금 당장 필요한 것만 만든다. 스택이 무거워졌다고 기능까지 미리 만들지 않는다 (`docs/decisions/0001-tech-stack.md` 참고).
- 코드는 최소한으로 짠다. 새 코드를 쓰기 전에 이 순서로 검토한다: 이미 코드베이스에 있나 → 표준 라이브러리/네이티브 기능으로 되나 → 이미 설치된 의존성으로 되나 → 한 줄로 되나 → 그래도 안 되면 최소 구현.
- 단, 유효성 검증·에러 처리·보안·접근성은 최소화 대상이 아니다. 절대 생략하지 않는다.
- 요청 범위 밖 코드는 건드리지 않는다. 인접 코드를 "개선"하거나 무관한 리팩터링을 하지 않고, 기존 스타일을 그대로 따른다. 내 변경으로 생긴 미사용 코드(orphan)만 정리한다.
- 비용은 가능한 선에서 최소화한다. 완전 무료는 아닐 수 있다는 트레이드오프를 인지하고, 티어 한도를 넘을 것 같으면 먼저 논의한다.

## 워크플로우

1. 새 기능/변경은 코드부터 짜지 않고 먼저 논의해서 합의한다. 애매한 부분은 질문한다.
2. 방향을 바꾸는 결정은 `docs/decisions/NNNN-제목.md`에 ADR로 남긴다.
3. 커밋 메시지는 `type(scope): 설명` 형식을 쓴다.
   - type: `feat`, `fix`, `chore`, `docs`, `refactor`
   - scope: `frontend`, `backend`, `docs` (특정 영역이 아니면 생략 가능)
   - 예: `feat(frontend): Big3 입력 컴포넌트 추가`, `fix(backend): 플랜 조회 쿼리 조건 오류 수정`, `docs: ADR 0001 작성`
4. PR은 `.github/PULL_REQUEST_TEMPLATE.md` 양식을 따른다 (변경 이유, 영향 범위 명시. 제목은 커밋 컨벤션과 동일하게 `type(scope): 설명`). 이슈는 `.github/ISSUE_TEMPLATE/task.md` 양식을 따르고, 제목은 `[영역/타입] 설명` 형식을 쓴다 (예: `[Frontend/Feat] Big3 드래그 배치`, `[Backend/Fix] 플랜 조회 쿼리 오류`).
5. 브랜치는 `main`, `develop` 두 개만 쓴다. `develop → main` PR은 아래 조건을 모두 만족해야 병합한다.
   - `npm run build`, `npm run lint`, 타입체크가 모두 통과한 상태 (PR 본문에 결과 명시)
   - Vercel Preview 배포로 실제 화면 동작을 확인함
   - PR 작성자 본인이 diff 전체를 한 번 리뷰함 (`git diff main...develop`)
   - 병합은 Squash merge로, main에는 `type(scope): 설명` 한 줄만 남긴다
   - main에는 직접 push하지 않는다

## AI가 임의로 하면 안 되는 것

다음은 반드시 먼저 물어보고 진행한다.

- 실제 배포 실행 (Vercel, Railway, Docker 등)
- DB 스키마 변경, 마이그레이션 실행
- 새 의존성 추가
- 기존 데이터 삭제/마이그레이션

## 참고

- 전체 명령어(설치/빌드/테스트)는 각 폴더의 CLAUDE.md에 있다.
- 기술스택 전환 배경: `docs/decisions/0001-tech-stack.md`
