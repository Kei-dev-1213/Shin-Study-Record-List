import { FC, FormEvent, memo, useEffect, useState } from "react";
import { DB } from "./supabase";
import { Form } from "./components/Form";
import { RecordsList } from "./components/RecordsList";
import * as UI from "@chakra-ui/react";
import { Record } from "./domain/record";

const App: FC = memo(() => {
  // state
  const [titleText, setTitleText] = useState("");
  const [timeText, setTimeText] = useState("");
  const [records, setRecords] = useState<Array<Record>>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 初期処理
  useEffect(() => {
    (async () => {
      await fetchAllRecords();
      setIsLoading(false);
    })();
  }, []);

  // 取得
  const fetchAllRecords = async () => {
    setRecords((await DB.fetchAllRecords()).data ?? []);
  };

  // 登録
  const onClickRegist = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // チェック
    if (!titleText.trim() || !timeText.trim()) {
      setError("入力されていない項目があります。");
      setIsLoading(false);
      return;
    }

    // 登録
    await DB.insertRecord({ title: titleText, time: timeText });
    await fetchAllRecords();

    // 初期化
    setTitleText("");
    setTimeText("");
    setError("");
    setIsLoading(false);
  };

  // 削除
  const onClickDelete = async (id: string) => {
    setIsLoading(true);
    await DB.deleteRecord(id);
    await fetchAllRecords();
    setIsLoading(false);
  };

  return (
    <>
      <UI.Heading style={{textAlign:"center"}} pt={10}>シン・学習記録一覧</UI.Heading>
      <Form
        titleText={titleText}
        timeText={timeText}
        setTitleText={setTitleText}
        setTimeText={setTimeText}
        onClickRegist={onClickRegist}
        error={error}
      />

      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <RecordsList records={records} onClickDelete={onClickDelete} />
      )}
    </>
  );
});

export default App;
