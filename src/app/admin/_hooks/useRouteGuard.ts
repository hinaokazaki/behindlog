import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { session } = useSupabaseSession();

  useEffect(() => {
    if (session === undefined) return;

    const fetcher = async () => {
      if (session === null) {
        router.replace("/login");
      }
    };

    fetcher();
  }, [router, session, pathName]);
};
