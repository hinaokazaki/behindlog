import { useState } from "react";
import { useSupabaseSession } from "./useSupabaseSession";

export const useApi = () => {
  const { token } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callApi = async <T>(
    url: string,
    method: "PUT" | "POST" | "PATCH" | "DELETE",
    body?: unknown,
  ): Promise<T> => {
    if (!token) throw new Error("No token available");

    try {
      setIsLoading(true);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) throw new Error("API Error");
      return (await res.json()) as T;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { callApi, isLoading, error };
};
