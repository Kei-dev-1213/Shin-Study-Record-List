import React, { FC } from "react";
import * as UI from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils";

type Props = {
  isOpen: boolean;
  selectedRecordId: string;
  onClickDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

export const DeleteDialog: FC<Props> = ({ isOpen, onClickDelete, selectedRecordId, onClose }) => {
  const cancelRef = React.useRef<FocusableElement | null>(null);

  return (
    <UI.AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} motionPreset="slideInBottom">
      <UI.AlertDialogOverlay>
        <UI.AlertDialogContent>
          <UI.AlertDialogHeader data-testid="modal-title" fontSize="lg" fontWeight="bold">
            学習記録削除
          </UI.AlertDialogHeader>

          <UI.AlertDialogBody>選択した学習記録を削除します。よろしいですか？</UI.AlertDialogBody>

          <UI.AlertDialogFooter>
            <UI.Button colorScheme="red" onClick={onClickDelete.bind(null, selectedRecordId)}>
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
