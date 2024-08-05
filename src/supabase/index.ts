import { createClient } from "@supabase/supabase-js";
import { Record } from "../domain/record";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 取得
const fetchAllRecords = async () => {
  const records = await supabase.from("study-record").select("*");
  return records;
};

// 登録
const insertRecord = async ({ title, time }: Omit<Record, "id">) => {
  const { error } = await supabase.from("study-record").insert({ title, time });
  return error;
};

// 削除
const deleteRecord = async (id: string) => {
  const response = await supabase.from("study-record").delete().eq("id", id);
  return response;
};

export const DB = {
  fetchAllRecords,
  insertRecord,
  deleteRecord,
};
