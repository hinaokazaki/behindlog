"use client";
import Link from "next/link";
import { useRouteGuard } from "./_hooks/useRouteGuard";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { toYmdLocal } from "@/lib/date";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();
  const router = useRouter();
  const today = toYmdLocal(new Date());
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
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image
              src="/Profile.png"
              width={30}
              height={30}
              alt="ユーザーアイコン"
            />
            <span className="font-bold">プロフィール</span>
          </Link>
          <Link
            href=""
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image
              src="/dashboard.png"
              width={30}
              height={30}
              alt="ダッシュボードアイコン"
            />
            <span className="font-bold">ダッシュボード</span>
          </Link>
          <Link
            href={`/admin/records/${today}`}
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image
              src="/record.png"
              width={30}
              height={30}
              alt="今日の記録アイコン"
            />
            <span className="font-bold">今日の記録</span>
          </Link>
          <Link
            href=""
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image
              src="/calendar.png"
              width={30}
              height={30}
              alt="カレンダーアイコン"
            />
            <span className="font-bold">カレンダー</span>
          </Link>
          <Link
            href="/admin/community"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image
              src="/users.png"
              width={30}
              height={30}
              alt="コミュニティアイコン"
            />
            <span className="font-bold">コミュニティ</span>
          </Link>
          <Link
            href="/admin/edit"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image src="/edit.png" width={30} height={30} alt="編集アイコン" />
            <span className="font-bold">編集</span>
          </Link>
        </div>
        <div className="fixed bottom-0 mb-12 w-[280px]">
          <Link
            href="/contact"
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image
              src="/contact.png"
              width={30}
              height={30}
              alt="お問い合わせアイコン"
            />
            <span className="font-bold">お問い合わせ</span>
          </Link>
          <Link
            href=""
            onClick={handleLogout}
            className={`flex items-center gap-2 px-14 py-3 text-body text-primary hover:bg-background ${isSelected("/admin/me") && "bg-background}"}`}
          >
            <Image
              src="/logout.png"
              width={30}
              height={30}
              alt="ログアウトアイコン"
            />
            <span className="font-bold">ログアウト</span>
          </Link>
        </div>
      </aside>
      <div className="ml-[280px] p-4">{children}</div>
    </div>
  );
}
