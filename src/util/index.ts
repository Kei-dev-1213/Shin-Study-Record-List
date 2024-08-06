function formatDateTime(dateString: string): string {
  // 日付文字列をDateオブジェクトに変換
  const date = new Date(dateString);

  // 年、月、日、時、分を取得
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // yyyy/mm/dd hh:mm形式にフォーマット
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export const Util = {
  formatDateTime,
};
