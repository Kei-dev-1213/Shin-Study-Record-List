import { FC } from "react";
import * as UI from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
};

export const Modal: FC<Props> = ({ isOpen, onClose, isEditMode }) => {
  return (
    <UI.Modal isOpen={isOpen} onClose={onClose}>
      <UI.ModalOverlay />
      <UI.ModalContent>
        <UI.ModalHeader>{isEditMode ? "記録編集" : "新規登録"}</UI.ModalHeader>
        <UI.ModalCloseButton />
        <UI.ModalBody pb={6}>
          <UI.FormControl>
            <UI.FormLabel>学習記録</UI.FormLabel>
            <UI.Input placeholder="学習記録を入力してください" />
          </UI.FormControl>

          <UI.FormControl mt={4}>
            <UI.FormLabel>学習時間</UI.FormLabel>
            <UI.Input placeholder="学習時間を入力してください" />
          </UI.FormControl>
        </UI.ModalBody>

        <UI.ModalFooter>
          <UI.Button colorScheme="teal" mr={3}>
            {isEditMode ? "保存" : "登録"}
          </UI.Button>
          <UI.Button onClick={onClose}>キャンセル</UI.Button>
        </UI.ModalFooter>
      </UI.ModalContent>
    </UI.Modal>
  );
};
