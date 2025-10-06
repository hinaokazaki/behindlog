import { useState } from "react";
import { useSupabaseSession } from "./useSupabaseSession";
import { apiReq } from "../_lib/api";

export const useApi = () => {
  const { token } = useSupabaseSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callApi = async <T>(
    url: string,
    method: "PUT" | "POST" | "PATCH" | "DELETE",
    body?: unknown,
  ): Promise<T> => {
    if (!token) throw new Error("No token available");

    try {
      setLoading(true);
      const result = await apiReq<T>(url, method, body, token);
      return result;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
};
