# planlog

개인용 데일리 타임박싱 플래너. 일론 머스크 시간관리법(Brain Dump → Big 3 → 시간 배정)을 기반으로 한다.

## 목적

이 저장소는 단순히 기능을 만드는 게 아니라, AI(Claude)와 실무처럼 협업하는 방식을 연습하는 프로젝트다. 코드를 먼저 짜지 않는다. 논의 → 합의 → 기록 → 구현 → PR 순서를 지킨다.

## 구조

- `frontend/` — React + TypeScript + Tailwind. 규칙은 `frontend/CLAUDE.md` 참고.
- `backend/` — Lambda + DynamoDB (필요해지면 추가 예정). 규칙은 `backend/CLAUDE.md` 참고.
- `docs/decisions/` — 아키텍처/설계 결정 기록(ADR). 방향을 바꾸는 결정은 코드보다 먼저 여기 남긴다.

각 폴더의 CLAUDE.md는 그 폴더에서 작업할 때 루트 CLAUDE.md와 함께 자동으로 로드된다. 다른 쪽 폴더 세부사항은 섞이지 않는다.

## 원칙

- MVP 우선: 지금 당장 필요한 것만 만든다. 나중에 필요할 것 같다는 이유로 미리 만들지 않는다.
- 코드는 최소한으로 짠다. 새 코드를 쓰기 전에 이 순서로 검토한다: 이미 코드베이스에 있나 → 표준 라이브러리/네이티브 기능으로 되나 → 이미 설치된 의존성으로 되나 → 한 줄로 되나 → 그래도 안 되면 최소 구현.
- 단, 유효성 검증·에러 처리·보안·접근성은 최소화 대상이 아니다. 절대 생략하지 않는다.
- 비용은 무료/최저 티어를 우선한다 (Vercel, AWS 프리티어 등).
- 요청 범위 밖 코드는 건드리지 않는다. 인접 코드를 "개선"하거나 무관한 리팩터링을 하지 않고, 기존 스타일을 그대로 따른다. 내 변경으로 생긴 미사용 코드(orphan)만 정리한다.

## 워크플로우

1. 새 기능/변경은 코드부터 짜지 않고 먼저 논의해서 합의한다. 애매한 부분은 질문한다.
2. 방향을 바꾸는 결정은 `docs/decisions/NNNN-제목.md`에 ADR로 남긴다.
3. 커밋 메시지는 `type(scope): 설명` 형식을 쓴다.
   - type: `feat`, `fix`, `chore`, `docs`, `refactor`
   - scope: `frontend`, `backend`, `docs` (특정 영역이 아니면 생략 가능)
   - 예: `feat(frontend): Big3 입력 컴포넌트 추가`, `fix(backend): DynamoDB 쿼리 조건 오류 수정`, `docs: ADR 0001 작성`
4. PR은 `.github/PULL_REQUEST_TEMPLATE.md` 양식을 따른다 (변경 이유, 영향 범위 명시). 이슈는 `.github/ISSUE_TEMPLATE/task.md` 양식을 따른다.
5. 브랜치는 `main`, `develop` 두 개만 쓴다. `develop → main` PR은 아래 조건을 모두 만족해야 병합한다.
   - `npm run build`, `npm run lint`, 타입체크가 모두 통과한 상태 (PR 본문에 결과 명시)
   - Vercel Preview 배포로 실제 화면 동작을 확인함
   - PR 작성자 본인이 diff 전체를 한 번 리뷰함 (`git diff main...develop`)
   - 병합은 Squash merge로, main에는 `type(scope): 설명` 한 줄만 남긴다
   - main에는 직접 push하지 않는다

## AI가 임의로 하면 안 되는 것

다음은 반드시 먼저 물어보고 진행한다.

- 실제 배포 실행 (Vercel, AWS 등)
- DB 스키마 변경
- 새 의존성 추가
- 기존 데이터 삭제/마이그레이션

## 참고

- 전체 명령어(설치/빌드/테스트)는 각 폴더의 CLAUDE.md에 있다.
