import { FC, useEffect } from "react";
import * as UI from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs } from "../domain/Inputs";
import { Record } from "../domain/record";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  onClickRegist: (title: string, time: string) => Promise<void>;
  onClickUpdate: (record: Record) => Promise<void>;
  selectedRecord: Record;
};

export const Modal: FC<Props> = ({ isOpen, onClose, isEditMode, onClickRegist, onClickUpdate, selectedRecord }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  // 初期処理
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        reset({
          title: selectedRecord.title,
          time: selectedRecord.time,
        });
      } else {
        reset({
          title: "",
          time: "",
        });
      }
    }
  }, [isOpen, isEditMode, reset, selectedRecord]);

  // 実行
  const onclickAction: SubmitHandler<Inputs> = async ({ title, time }) => {
    if (title && time) {
      onClose();
      // 編集
      if (isEditMode) {
        const newRecord = {
          id: selectedRecord.id,
          title,
          time,
          created_at: selectedRecord.created_at,
        };
        await onClickUpdate(newRecord);
      }
      // 登録
      else {
        await onClickRegist(title, time);
      }
    }
  };

  return (
    <UI.Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <UI.ModalOverlay />
      <UI.ModalContent>
        <form onSubmit={handleSubmit(onclickAction)}>
          <UI.ModalHeader data-testid="modal-title">{isEditMode ? "記録編集" : "新規登録"}</UI.ModalHeader>
          <UI.ModalCloseButton />
          <UI.ModalBody pb={6}>
            <UI.FormControl>
              <UI.FormLabel>学習記録</UI.FormLabel>
              <UI.Input
                data-testid="input-title"
                placeholder="学習記録を入力してください"
                {...register("title", { required: "内容の入力は必須です" })}
              />
              {errors.title && <UI.Box color="red">{errors.title.message}</UI.Box>}
            </UI.FormControl>

            <UI.FormControl mt={4}>
              <UI.FormLabel>学習時間</UI.FormLabel>
              <UI.Input
                data-testid="input-time"
                type="number"
                placeholder="学習時間を入力してください"
                {...register("time", {
                  required: "時間の入力は必須です",
                  validate: (_time) => {
                    if (parseInt(_time) < 0) {
                      return "時間は0以上である必要があります";
                    }
                    return true;
                  },
                })}
              />
              {errors.time && <UI.Box color="red">{errors.time.message}</UI.Box>}
            </UI.FormControl>
          </UI.ModalBody>

          <UI.ModalFooter>
            <UI.Button type="submit" colorScheme="teal" mr={3}>
              {isEditMode ? "保存" : "登録"}
            </UI.Button>
            <UI.Button onClick={onClose}>キャンセル</UI.Button>
          </UI.ModalFooter>
        </form>
      </UI.ModalContent>
    </UI.Modal>
  );
};
