import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { session, isLoading } = useSupabaseSession();

  useEffect(() => {
    if (isLoading) return;
    if (session === null) router.replace("/login");
  }, [router, session, pathName, isLoading]);
};
