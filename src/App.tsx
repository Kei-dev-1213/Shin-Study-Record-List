import { FC, memo, useCallback, useEffect, useState } from "react";
import { DB } from "./supabase";
import * as UI from "@chakra-ui/react";
import { Record } from "./domain/record";
import { Modal } from "./components/Modal";
import { RecordsTable } from "./components/RecordsTable";
import { DeleteDialog } from "./components/DeleteDialog";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useMessage } from "./hooks/useMessage";

const App: FC = memo(() => {
  // hooks
  const modal = UI.useDisclosure();
  const dialog = UI.useDisclosure();
  const { displayMessage } = useMessage();

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

  // 登録、更新、削除共通処理
  const commonRecordHandler = async (action: () => Promise<void>) => {
    setIsLoading(true);
    await action();
    await fetchAllRecords();
    setIsLoading(false);
  };

  // 登録
  const onClickRegist = useCallback(async (title: string, time: string) => {
    await commonRecordHandler(() => DB.insertRecord(title, time));
    displayMessage({
      title: "学習記録を登録しました。",
      status: "success",
    });
  }, []);

  // 更新
  const onClickUpdate = useCallback(async (record: Record) => {
    await commonRecordHandler(() => DB.updateRecord(record));
    displayMessage({
      title: "学習記録を更新しました。",
      status: "info",
    });
  }, []);

  // 削除
  const onClickDelete = useCallback(async (id: string) => {
    dialog.onClose();
    await commonRecordHandler(() => DB.deleteRecord(id));
    displayMessage({
      title: "学習記録を削除しました。",
      status: "error",
    });
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
      <UI.Heading textAlign="center" pt={10}>
        シン・学習記録一覧
      </UI.Heading>
      <UI.Box w="1024px" mx="auto">
        <UI.Box textAlign="right">
          <UI.Button onClick={() => onOpenModal(false)} colorScheme="teal">
            新規登録
          </UI.Button>
        </UI.Box>

        {isLoading ? (
          <UI.Center my={20}>
            <LoadingSpinner />
          </UI.Center>
        ) : (
          <RecordsTable records={records} onOpenModal={onOpenModal} onOpenDialog={onOpenDialog} />
        )}
      </UI.Box>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        isEditMode={isEditMode}
        onClickRegist={onClickRegist}
        onClickUpdate={onClickUpdate}
        selectedRecord={records.find((record) => selectedRecordId === record.id)!}
      />
      <DeleteDialog
        isOpen={dialog.isOpen}
        selectedRecordId={selectedRecordId}
        onClickDelete={onClickDelete}
        onClose={dialog.onClose}
      />
    </>
  );
});

export default App;
