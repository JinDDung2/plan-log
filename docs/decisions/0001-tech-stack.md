# 0001. 기술스택 전환: Vite → Next.js, Lambda/DynamoDB → Fastify/MySQL/Drizzle

## 상태

승인됨 (2026-08-13)

## 배경

초기 MVP는 비용 최소화를 위해 프론트엔드는 Vite+React(localStorage 저장), 백엔드는 필요 시 AWS Lambda + DynamoDB(서버리스)로 계획했다.

이후 이 프로젝트의 목적이 재정의됐다: 단순히 개인용 플래너를 만드는 것을 넘어, AI 에이전트와 실무 수준으로 협업하는 방식(Agentic Engineering)을 연습하는 것이 핵심 목표다. 이를 위해 프론트/백엔드 각각에 실무 시니어 엔지니어 수준의 기술스택과 엔지니어링 원칙을 부여하기로 했다.

## 결정

- 프론트엔드: Vite → **Next.js (App Router)**, Turborepo, Yarn Berry(PnP), shadcn/ui 기반. TDS(Toss Design System)는 실제로는 앱인토스(App-in-Toss) React Native SDK로 배포되는 시스템이라 이 프로젝트(일반 웹)에 패키지로 설치할 수 없다. "TDS 패턴"은 컴포넌트 설계 철학 참고 대상으로만 취급하고, 실제 구현은 shadcn/ui로 한다.
- 백엔드: AWS Lambda/DynamoDB → **Fastify 5 + MySQL + Drizzle ORM**, Pino 로깅, Docker. 배포 대상(Railway 등)은 지금 단계에서는 결정하지 않는다.
- 이미 구현된 `frontend/timebox-planner`(Vite 버전)는 참고용으로만 남기고, 새 Next.js 프로젝트로 다시 만든다.

## 트레이드오프

- 비용: DynamoDB(서버리스, 사실상 무료)보다 MySQL + 상시 실행 서버(Docker)가 비용이 더 든다. Railway 같은 무료 티어를 우선 사용하되, 한도를 넘으면 별도로 논의한다.
- 복잡도: Turborepo/Yarn PnP/Fastify 플러그인 구조는 개인 프로젝트치고 무거운 구성이다. 이는 "MVP로 빨리"보다 "실무처럼 연습"을 우선한 의도적 선택이다.
- 기능 범위(MVP)는 그대로 유지한다 — 스택이 무거워진다고 새 기능을 미리 만들지는 않는다.

## 참고

- 루트 `CLAUDE.md`, `frontend/CLAUDE.md`, `backend/CLAUDE.md`에 상세 규칙 기록.
