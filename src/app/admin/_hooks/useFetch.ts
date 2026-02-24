"use client";
import useSWR from "swr";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type SwrKey = [string, string]; // [url, token]

const useFetch = <T = any>(url: string | null) => {
  const { token, isLoading: sessionLoading } = useSupabaseSession();

  const fetcher = async ([reqUrl, reqToken]: SwrKey): Promise<T> => {
    if (!token) throw new Error("No token available");
    console.log("[useFetch] GET", reqUrl);
    console.trace("[useFetch trace]");

    const res = await fetch(url as string, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // 404/400 の中身も見たいので、まず text を取る
    const text = await res.text();

    if (!res.ok) {
      console.log("[useFetch] status", res.status, "body", text);
      throw new Error(`API fetch failed: ${res.status}`);
    }

    return JSON.parse(text) as T;
  };

  // SWRのキーをtoken確定後に限定して発火
  const shouldFetch = !sessionLoading && !!token && !!url;
  const { data, error, isLoading, mutate } = useSWR<T>(
    shouldFetch ? ([url as string, token as string] satisfies SwrKey) : null,
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
