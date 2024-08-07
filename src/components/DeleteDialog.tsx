import React, { FC } from "react";
import * as UI from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils";
import { useMessage } from "../hooks/useMessage";

type Props = {
  isOpen: boolean;
  selectedRecordId: string;
  remove: (id: string) => Promise<void>;
  onClose: () => void;
};

export const DeleteDialog: FC<Props> = ({
  isOpen,
  selectedRecordId,
  remove,
  onClose,
}) => {

  const cancelRef = React.useRef<FocusableElement | null>(null);

  const { displayMessage } = useMessage();

  const onClickDelete = () => {
    remove(selectedRecordId);
    displayMessage({
      title: "学習記録を削除しました。",
      status: "error",
    });
    onClose();
  };

  return (
    <UI.AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <UI.AlertDialogOverlay>
        <UI.AlertDialogContent>
          <UI.AlertDialogHeader fontSize="lg" fontWeight="bold">
            学習記録削除
          </UI.AlertDialogHeader>

          <UI.AlertDialogBody>
            選択した学習記録を削除します。よろしいですか？
          </UI.AlertDialogBody>

          <UI.AlertDialogFooter>
            <UI.Button colorScheme="red" onClick={onClickDelete}>
              削除
            </UI.Button>
            <UI.Button onClick={onClose} ml={3}>
              キャンセル
            </UI.Button>
          </UI.AlertDialogFooter>
        </UI.AlertDialogContent>
      </UI.AlertDialogOverlay>
    </UI.AlertDialog>
  );
};
