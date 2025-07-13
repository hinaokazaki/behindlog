import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState(true);
  const pathName = usePathname();

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
      setIsloading(false);
    };

    fetcher();
  }, [pathName]);

  return { session, isLoading, token };
};
