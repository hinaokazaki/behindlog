import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setToken(data.session?.access_token || null);
      setIsLoading(false);
    })();
  }, []);

  return { session, token, isLoading };
};
