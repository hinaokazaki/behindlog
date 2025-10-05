export async function apiReq<T>(
  url: string,
  method: "PUT" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorisation: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error("API Error");
  return res.json() as Promise<T>;
}
