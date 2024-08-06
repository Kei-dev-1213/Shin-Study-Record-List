import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DB } from "./supabase";
import * as UI from "@chakra-ui/react";
import { Record } from "./domain/record";
import { Modal } from "./components/Modal";
import { RecordsTable } from "./components/RecordsTable";
import { DeleteDialog } from "./components/DeleteDialog";
const App: FC = memo(() => {
  // hooks
  const modal = UI.useDisclosure();
  const dialog = UI.useDisclosure();

  // state
  // const [titleText, setTitleText] = useState("");
  // const [timeText, setTimeText] = useState("");
  const [records, setRecords] = useState<Array<Record>>([]);
  // const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

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
  // const onClickRegist = useCallback(async (e: FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // チェック
  //   if (!titleText.trim() || !timeText.trim()) {
  //     setError("入力されていない項目があります。");
  //     setIsLoading(false);
  //     return;
  //   }

  //   // 登録
  //   await DB.insertRecord({ title: titleText, time: timeText });
  //   await fetchAllRecords();

  //   // 初期化
  //   setTitleText("");
  //   setTimeText("");
  //   setError("");
  //   setIsLoading(false);
  // }, []);

  // 更新
  // const onClickUpdate = useCallback(async (record: Record) => {
  //   setIsLoading(true);
  //   // チェック
  //   if (!titleText.trim() || !timeText.trim()) {
  //     setError("入力されていない項目があります。");
  //     setIsLoading(false);
  //     return;
  //   }

  //   // 登録
  //   await DB.updateRecord(record);
  //   await fetchAllRecords();

  //   // 初期化
  //   setTitleText("");
  //   setTimeText("");
  //   setError("");
  //   setIsLoading(false);
  // }, []);

  // 削除
  // const onClickDelete = useCallback(async (id: string) => {
  //   setIsLoading(true);
  //   await DB.deleteRecord(id);
  //   await fetchAllRecords();
  //   setIsLoading(false);
  // }, []);

  // モーダル
  const onOpenModal = useCallback((isEditMode: boolean) => {
    setIsEditMode(isEditMode);
    modal.onOpen();
  }, [modal]);

  return (
    <>
      <UI.Heading style={{ textAlign: "center" }} pt={10}>
        シン・学習記録一覧
      </UI.Heading>
      <UI.Box w="1024px" mx="auto">
        <UI.Box style={{ textAlign: "right" }}>
          <UI.Button onClick={onOpenModal.bind(null, false)} colorScheme="teal">
            新規登録
          </UI.Button>
        </UI.Box>

        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <RecordsTable
            records={records}
            onOpenModal={onOpenModal}
            onOpenDialog={dialog.onOpen}
          />
        )}
      </UI.Box>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        isEditMode={isEditMode}
      />
      <DeleteDialog isOpen={dialog.isOpen} onClose={dialog.onClose} />
    </>
  );
});

export default App;
