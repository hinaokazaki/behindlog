"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import Button from "./Button";
import { Menu, X, User, Mail, LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { session, isLoading } = useSupabaseSession();
  const path = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isTop = path === "/";
  const isLogin = path === "/login";
  const isSignup = path === "/signup";
  const isContact = path === "/contact";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("ログアウトしました");
    setIsMenuOpen(false);
    router.replace("/login");
  };

  return (
    <header className="fixed left-0 top-0 z-50 flex h-[85px] w-full items-center justify-between border-b bg-background px-4 py-4 md:px-8">
      <Logo />

      {!isLoading && (
        <>
          <div className="flex items-center gap-2 md:gap-5">
            {session ? (
              <>
                <Link
                  href="/admin/me"
                  aria-label="プロフィールへ移動"
                  className="md:hidden"
                >
                  <User className="h-8 w-8 text-primary" />
                </Link>

                <Link
                  href="/admin/dashboard"
                  aria-label="ダッシュボードへ移動"
                  className="hidden md:block"
                >
                  <User className="h-9 w-9 text-primary" />
                </Link>

                <div className="hidden md:block">
                  <Button onClick={handleLogout}>ログアウト</Button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  className="text-primary md:hidden"
                  aria-label="メニューを開く"
                >
                  <Menu className="h-8 w-8" />
                </button>
              </>
            ) : (
              <>
                {isTop && (
                  <>
                    <Link
                      href="/contact"
                      className="hidden text-center text-body text-primary hover:underline sm:block"
                    >
                      お問い合わせ
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-xl border-[2px] border-primary bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:px-4 md:text-form-text"
                    >
                      新規登録
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-xl border-[2px] border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:px-4 md:text-form-text"
                    >
                      ログイン
                    </Link>
                  </>
                )}

                {isSignup && (
                  <>
                    <Link
                      href="/contact"
                      className="hidden text-center text-body text-primary hover:underline sm:block"
                    >
                      お問い合わせ
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-xl border-[2px] border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:px-4 md:text-form-text"
                    >
                      ログイン
                    </Link>
                  </>
                )}

                {isLogin && (
                  <>
                    <Link
                      href="/contact"
                      className="hidden text-center text-body text-primary hover:underline sm:block"
                    >
                      お問い合わせ
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-xl border-[2px] border-primary bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:px-4 md:text-form-text"
                    >
                      新規登録
                    </Link>
                  </>
                )}

                {isContact && (
                  <>
                    <Link
                      href="/login"
                      className="rounded-xl border-[2px] border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:px-4 md:text-form-text"
                    >
                      ログイン
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-xl border-[2px] border-primary bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:px-4 md:text-form-text"
                    >
                      新規登録
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {session && isMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/30"
                aria-label="メニューを閉じる"
                onClick={() => setIsMenuOpen(false)}
              />

              <aside className="absolute right-0 top-0 h-full w-[260px] bg-white px-6 py-6 shadow-lg">
                <div className="mb-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="メニューを閉じる"
                    className="text-primary"
                  >
                    <X className="h-7 w-7" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-primary hover:bg-background"
                  >
                    <Mail className="h-6 w-6" />
                    <span className="font-bold">お問い合わせ</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-primary hover:bg-background"
                  >
                    <LogOut className="h-6 w-6" />
                    <span className="font-bold">ログアウト</span>
                  </button>
                </nav>
              </aside>
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
