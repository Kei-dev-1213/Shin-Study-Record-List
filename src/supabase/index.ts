import { createClient } from "@supabase/supabase-js";
import { Record } from "../domain/record";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 取得
const fetchAllRecords = async () => {
  const records = await supabase
    .from("study-record")
    .select("*")
    .order("created_at", { ascending: true });
  return records;
};

// 登録
const insertRecord = async (title: string, time: string) => {
  await supabase.from("study-record").insert({ title, time });
};

// 更新
const updateRecord = async ({ id, title, time }: Record) => {
  await supabase
    .from("study-record")
    .update({ title, time, created_at: new Date() })
    .eq("id", id);
};

// 削除
const deleteRecord = async (id: string) => {
  await supabase.from("study-record").delete().eq("id", id);
};

export const DB = {
  fetchAllRecords,
  insertRecord,
  updateRecord,
  deleteRecord,
};
