import { FC, memo, useCallback, useEffect, useState } from "react";
import { DB } from "./supabase";
import * as UI from "@chakra-ui/react";
import { Record } from "./domain/record";
import { Modal } from "./components/Modal";
import { RecordsTable } from "./components/RecordsTable";
import { DeleteDialog } from "./components/DeleteDialog";
import { LoadingSpinner } from "./components/LoadingSpinner";
const App: FC = memo(() => {
  // hooks
  const modal = UI.useDisclosure();
  const dialog = UI.useDisclosure();

  // state
  const [records, setRecords] = useState<Array<Record>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState("");

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
  const regist = useCallback(async (title: string, time: string) => {
    setIsLoading(true);

    // 登録
    await DB.insertRecord(title, time);
    await fetchAllRecords();

    // 初期化
    setIsLoading(false);
  }, []);

  // 更新
  const update = useCallback(async (record: Record) => {
    setIsLoading(true);

    // 更新
    await DB.updateRecord(record);
    await fetchAllRecords();

    // 初期化
    setIsLoading(false);
  }, []);

  // 削除
  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    await DB.deleteRecord(id);
    await fetchAllRecords();
    setIsLoading(false);
  }, []);

  // モーダル
  const onOpenModal = useCallback(
    (isEditMode: boolean, selectedId?: string) => {
      isEditMode && setSelectedRecordId(selectedId!);

      setIsEditMode(isEditMode);
      modal.onOpen();
    },
    [modal]
  );
  const onOpenDialog = useCallback((id: string) => {
    setSelectedRecordId(id);
    dialog.onOpen();
  }, []);

  return (
    <>
      <UI.Heading style={{ textAlign: "center" }} pt={10}>
        シン・学習記録一覧
      </UI.Heading>
      <UI.Box w="1024px" mx="auto">
        <UI.Box style={{ textAlign: "right" }}>
          <UI.Button onClick={() => onOpenModal(false)} colorScheme="teal">
            新規登録
          </UI.Button>
        </UI.Box>

        {isLoading ? (
          <UI.Center my={20}>
            <LoadingSpinner />
          </UI.Center>
        ) : (
          <RecordsTable
            records={records}
            onOpenModal={onOpenModal}
            onOpenDialog={onOpenDialog}
          />
        )}
      </UI.Box>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        isEditMode={isEditMode}
        regist={regist}
        update={update}
        selectedRecord={
          records.find((record) => selectedRecordId === record.id)!
        }
      />
      <DeleteDialog
        isOpen={dialog.isOpen}
        selectedRecordId={selectedRecordId}
        remove={remove}
        onClose={dialog.onClose}
      />
    </>
  );
});

export default App;
