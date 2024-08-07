import { createClient } from "@supabase/supabase-js";
import { Record } from "../domain/Record";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 取得
const fetchAllRecords = async () => {
  const records = await supabase
    .from("study-record")
    .select("*")
    .order("id", { ascending: false });
  return records;
};

// 登録
const insertRecord = async (title: string, time: string) => {
  const { error } = await supabase.from("study-record").insert({ title, time });
  console.log(error);
  return error;
};

// 更新
const updateRecord = async ({ id, title, time }: Record) => {
  const { error } = await supabase
    .from("study-record")
    .update({ title, time })
    .eq("id", id);
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
  updateRecord,
  deleteRecord,
};
