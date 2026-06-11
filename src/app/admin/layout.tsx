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
    <div className="flex min-h-screen justify-center bg-background pt-[85px]">
      <aside
        aria-label="サイドメニュー"
        className="fixed bottom-0 left-0 top-[85px] w-[280px] bg-white"
      >
        <div>
          <Link
            href="/admin/me"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background"}`}
          >
            <User className="h-7 w-7 text-primary" />
            <span className="font-bold">プロフィール</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/dashboard") && "bg-background"}`}
          >
            <LayoutDashboard className="h-7 w-7 text-primary" />
            <span className="font-bold">ダッシュボード</span>
          </Link>
          <Link
            href={`/admin/records/${today}`}
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected(`/admin/records`) && "bg-background"}`}
          >
            <FileText className="h-7 w-7 text-primary" />
            <span className="font-bold">今日の記録</span>
          </Link>
          <Link
            href={`/admin/calendar?month=${thisMonth}`}
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/calendar") && "bg-background"}`}
          >
            <Calendar className="h-7 w-7 text-primary" />
            <span className="font-bold">カレンダー</span>
          </Link>
          <Link
            href="/admin/community"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/community") && "bg-background"}`}
          >
            <Users className="h-7 w-7 text-primary" />
            <span className="font-bold">コミュニティ</span>
          </Link>
          <Link
            href="/admin/edit"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/edit") && "bg-background"}`}
          >
            <Pencil className="h-7 w-7 text-primary" />
            <span className="font-bold">編集</span>
          </Link>
        </div>
        <div className="fixed bottom-0 mb-12 w-[280px]">
          <Link
            href="/contact"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/contact") && "bg-background"}`}
          >
            <Mail className="h-7 w-7 text-primary" />
            <span className="font-bold">お問い合わせ</span>
          </Link>
          <Link
            href=""
            onClick={handleLogout}
            className={
              "flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background"
            }
          >
            <LogOut className="h-7 w-7 text-primary" />
            <span className="font-bold">ログアウト</span>
          </Link>
        </div>
      </aside>
      <div className="ml-[280px] p-4">{children}</div>
    </div>
  );
}
