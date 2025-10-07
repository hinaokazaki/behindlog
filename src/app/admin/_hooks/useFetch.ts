"use client";
import useSWR from "swr";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const useFetch = <T = any>(url: string) => {
  const { token } = useSupabaseSession();

  const fetcher = async (): Promise<T> => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("API fetch failed");
    return res.json();
  };

  const { data, error, isLoading } = useSWR<T>(token ? url : null, fetcher);
  return {
    data: data as T | undefined,
    error,
    isLoading,
  };
};

export default useFetch;
