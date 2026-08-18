import { existsSync } from "node:fs";
import { resolve } from "node:path";

// 로컬 개발 환경에서는 .env.local을 읽는다. 배포 환경(Railway 등)에서는
// 플랫폼이 환경변수를 직접 주입하므로 파일이 없어도 정상 동작한다.
const envLocalPath = resolve(process.cwd(), ".env.local");
if (existsSync(envLocalPath)) {
  process.loadEnvFile(envLocalPath);
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  google: {
    clientId: required("GOOGLE_CLIENT_ID"),
    clientSecret: required("GOOGLE_CLIENT_SECRET"),
    redirectUri: required("GOOGLE_REDIRECT_URI"),
  },
  kakao: {
    clientId: required("KAKAO_CLIENT_ID"),
    clientSecret: required("KAKAO_CLIENT_SECRET"),
    redirectUri: required("KAKAO_REDIRECT_URI"),
  },
};
