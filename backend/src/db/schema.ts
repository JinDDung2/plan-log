import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// 소셜 로그인 사용자. provider + providerId 조합으로 유일하게 식별한다.
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    provider: mysqlEnum("provider", ["google", "kakao"]).notNull(),
    providerId: varchar("provider_id", { length: 191 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    picture: varchar("picture", { length: 512 }),
    startHour: int("start_hour").notNull().default(5), // 타임그리드 시작 시(0-23)
    endHour: int("end_hour").notNull().default(23), // 타임그리드 종료 시(0-23)
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_provider_provider_id_unique").on(
      table.provider,
      table.providerId
    ),
  ]
);

// 사용자별 하루 플랜. 프론트의 DailyPlan(브레인덤프/Big3/타임블록/감사일기)을
// 그대로 저장한다. 날짜당 하나만 존재하도록 (user_id, date) 유니크 제약.
export const dailyPlans = mysqlTable(
  "daily_plans",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
    bigThree: json("big_three").notNull().$type<[string, string, string]>(),
    brainDumpItems: json("brain_dump_items")
      .notNull()
      .$type<{ id: string; text: string }[]>(),
    blocks: json("blocks")
      .notNull()
      .$type<
        { id: string; hour: number; half: 0 | 30; span: number; content: string }[]
      >(),
    gratitude: text("gratitude"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    uniqueIndex("daily_plans_user_id_date_unique").on(table.userId, table.date),
  ]
);

// 우리 서버가 자체 발급하는 refresh token. 원문은 저장하지 않고 해시만 저장한다.
// 로그아웃/탈취 의심 시 revokedAt을 채워 즉시 무효화한다.
export const refreshTokens = mysqlTable("refresh_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 64 }).notNull(), // sha256 hex
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  revokedAt: timestamp("revoked_at"),
});
