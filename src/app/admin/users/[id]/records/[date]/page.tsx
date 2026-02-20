"use client";

import useFetch from "@/app/admin/_hooks/useFetch";
import { UserRecord } from "@/schemas/userRecord";

export default function FriendRecordsPage({
  params,
}: {
  params: { id: string; date: string };
}) {
  const id = params.id;
  const date = params.date;

  const friendRecord = useFetch<{ dailyRecord: UserRecord }>(
    `/api/users/${id}/records/${date}`,
  );
}
