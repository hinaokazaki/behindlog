"use client";
import useSWR from "swr";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const useFetch = <T = any>(url: string | null) => {
  const { token, isLoading: sessionLoading } = useSupabaseSession();

  const fetcher = async (): Promise<T> => {
    if (!token) throw new Error("No token available");
    const res = await fetch(url as string, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("API fetch failed");
    return res.json();
  };

  // SWRのキーをtoken確定後に限定して発火
  const shouldFetch = !sessionLoading && !!token && !!url;
  const { data, error, isLoading, mutate } = useSWR<T>(
    shouldFetch ? [url, token] : null,
    fetcher,
  );
  return {
    data: data as T | undefined,
    error,
    isLoading: sessionLoading || isLoading,
    mutate,
  };
};

export default useFetch;
