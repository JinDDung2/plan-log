import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";

export interface OAuthProfile {
  provider: "google" | "kakao";
  providerId: string;
  email: string;
  name: string;
  picture?: string | null;
}

// (provider, providerId) 기준으로 사용자를 찾아 없으면 생성하고, 있으면 최신
// 프로필(이메일/이름/사진)로 갱신한다. upsert 후 별도 조회로 id를 확보한다.
export async function findOrCreateUser(profile: OAuthProfile) {
  await db
    .insert(users)
    .values({
      provider: profile.provider,
      providerId: profile.providerId,
      email: profile.email,
      name: profile.name,
      picture: profile.picture ?? null,
    })
    .onDuplicateKeyUpdate({
      set: {
        email: profile.email,
        name: profile.name,
        picture: profile.picture ?? null,
      },
    });

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(eq(users.provider, profile.provider), eq(users.providerId, profile.providerId))
    )
    .limit(1);

  if (!user) {
    throw new Error("Failed to upsert user");
  }

  return user;
}
