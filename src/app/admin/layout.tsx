"use client";
import Link from "next/link";
import { useRouteGuard } from "./_hooks/useRouteGuard";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toYmdLocal, toYmLocal } from "@/lib/date";
import {
  User,
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Pencil,
  LogOut,
  Mail,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();

  const router = useRouter();
  const today = toYmdLocal(new Date());
  const thisMonth = toYmLocal(new Date());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("ログアウトしました");
    router.replace("/login");
  };

  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <div className="min-h-screen bg-background pt-[85px]">
      {/* desktop sidebar */}
      <aside
        aria-label="サイドメニュー"
        className="fixed bottom-0 left-0 top-[85px] hidden w-[280px] bg-white md:block"
      >
        <div>
          <Link
            href="/admin/me"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${
              isSelected("/admin/me") && "bg-background"
            }`}
          >
            <User className="h-7 w-7 text-primary" />
            <span className="font-bold">プロフィール</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${
              isSelected("/admin/dashboard") && "bg-background"
            }`}
          >
            <LayoutDashboard className="h-7 w-7 text-primary" />
            <span className="font-bold">ダッシュボード</span>
          </Link>

          <Link
            href={`/admin/records/${today}`}
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${
              isSelected("/admin/records") && "bg-background"
            }`}
          >
            <FileText className="h-7 w-7 text-primary" />
            <span className="font-bold">今日の記録</span>
          </Link>

          <Link
            href={`/admin/calendar?month=${thisMonth}`}
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${
              isSelected("/admin/calendar") && "bg-background"
            }`}
          >
            <Calendar className="h-7 w-7 text-primary" />
            <span className="font-bold">カレンダー</span>
          </Link>

          <Link
            href="/admin/community"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${
              isSelected("/admin/community") && "bg-background"
            }`}
          >
            <Users className="h-7 w-7 text-primary" />
            <span className="font-bold">コミュニティ</span>
          </Link>

          <Link
            href="/admin/edit"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${
              isSelected("/admin/edit") && "bg-background"
            }`}
          >
            <Pencil className="h-7 w-7 text-primary" />
            <span className="font-bold">編集</span>
          </Link>
        </div>

        <div className="fixed bottom-0 mb-12 w-[280px]">
          <Link
            href="/contact"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${
              isSelected("/contact") && "bg-background"
            }`}
          >
            <Mail className="h-7 w-7 text-primary" />
            <span className="font-bold">お問い合わせ</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background"
          >
            <LogOut className="h-7 w-7 text-primary" />
            <span className="font-bold">ログアウト</span>
          </button>
        </div>
      </aside>

      {/* main content */}
      <main className="w-full px-4 pb-24 pt-4 md:ml-[280px] md:w-auto md:p-4">
        {children}
      </main>

      {/* mobile bottom nav */}
      <nav
        aria-label="モバイルメニュー"
        className="border-primary/20 fixed bottom-0 left-0 z-50 grid w-full grid-cols-5 border-t bg-white px-2 py-2 md:hidden"
      >
        <Link
          href="/admin/dashboard"
          className={`flex flex-col items-center gap-1 text-primary ${
            isSelected("/admin/dashboard") && "font-bold"
          }`}
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[10px]">Dashboard</span>
        </Link>

        <Link
          href={`/admin/records/${today}`}
          className={`flex flex-col items-center gap-1 text-primary ${
            isSelected("/admin/records") && "font-bold"
          }`}
        >
          <FileText className="h-6 w-6" />
          <span className="text-[10px]">Record</span>
        </Link>

        <Link
          href={`/admin/calendar?month=${thisMonth}`}
          className={`flex flex-col items-center gap-1 text-primary ${
            isSelected("/admin/calendar") && "font-bold"
          }`}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-[10px]">Calendar</span>
        </Link>

        <Link
          href="/admin/community"
          className={`flex flex-col items-center gap-1 text-primary ${
            isSelected("/admin/community") && "font-bold"
          }`}
        >
          <Users className="h-6 w-6" />
          <span className="text-[10px]">Community</span>
        </Link>

        <Link
          href="/admin/edit"
          className={`flex flex-col items-center gap-1 text-primary ${
            isSelected("/admin/edit") && "font-bold"
          }`}
        >
          <Pencil className="h-6 w-6" />
          <span className="text-[10px]">Edit</span>
        </Link>
      </nav>
    </div>
  );
}
