"use client";

import { buttonVariants } from "@/components/ui/button";
import { loginUrl } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

interface Props {
  user: AuthUser | null;
  loading: boolean;
  onLogout: () => void;
}

export default function AuthHeader({ user, loading, onLogout }: Props) {
  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <a href={loginUrl("google")} className={buttonVariants({ variant: "ghost" })}>
          Google로 로그인
        </a>
        <a href={loginUrl("kakao")} className={buttonVariants({ variant: "ghost" })}>
          카카오로 로그인
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{user.name}</span>
      <button type="button" className={buttonVariants({ variant: "ghost" })} onClick={onLogout}>
        로그아웃
      </button>
    </div>
  );
}
