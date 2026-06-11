"use client";
import Link from "next/link";
import React from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import Button from "./Button";
import { User } from "lucide-react";

const Header: React.FC = () => {
  const { session, isLoading } = useSupabaseSession();
  const path = usePathname();
  const router = useRouter();

  const isTop = path === "/";
  const isLogin = path === "/login";
  const isSignup = path === "/signup";
  const isContact = path === "/contact";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("ログアウトしました");
    router.replace("/login");
  };

  return (
    <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b bg-background px-8 py-4">
      <Logo />
      {!isLoading && (
        <div className="flex items-center gap-5">
          {session ? (
            <>
              <Link href="/admin/dashboard">
                <User className="h-9 w-9 text-primary" />
              </Link>
              <Button children="ログアウト" onClick={handleLogout} />
            </>
          ) : (
            <>
              {isTop && (
                <>
                  <Link
                    href="/contact"
                    className="text-center text-body text-primary hover:underline"
                  >
                    お問い合わせ
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl border-[2px] border-primary bg-primary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:text-form-text"
                  >
                    新規登録
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border-[2px] border-secondary bg-secondary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:text-form-text"
                  >
                    ログイン
                  </Link>
                </>
              )}
              {isSignup && (
                <>
                  <Link
                    href="/contact"
                    className="text-center text-body text-primary hover:underline"
                  >
                    お問い合わせ
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border-[2px] border-secondary bg-secondary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:text-form-text"
                  >
                    ログイン
                  </Link>
                </>
              )}
              {isLogin && (
                <>
                  <Link
                    href="/contact"
                    className="text-center text-body text-primary hover:underline"
                  >
                    お問い合わせ
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl border-[2px] border-primary bg-primary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:text-form-text"
                  >
                    新規登録
                  </Link>
                </>
              )}
              {isContact && (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl border-[2px] border-secondary bg-secondary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:text-form-text"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl border-[2px] border-primary bg-primary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:text-form-text"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
