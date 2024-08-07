import { FC } from "react";
import { Record } from "../domain/Record";
import * as UI from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Util } from "../util";

type Props = {
  records: Array<Record>;
  onOpenModal: (isEditMode: boolean, selectedId: string) => void;
  onOpenDialog: (id: string) => void;
};

export const RecordsTable: FC<Props> = ({
  records,
  onOpenModal,
  onOpenDialog,
}) => {
  return (
    <>
      <UI.TableContainer>
        <UI.Table variant="striped" colorScheme="teal">
          <UI.Thead>
            <UI.Tr>
              <UI.Th w="35%" fontSize={15}>
                学習記録
              </UI.Th>
              <UI.Th w="15%" fontSize={15} textAlign="right">
                学習時間
              </UI.Th>
              <UI.Th w="30%" fontSize={15} textAlign="right">
                更新日時
              </UI.Th>
              <UI.Th w="25%"></UI.Th>
            </UI.Tr>
          </UI.Thead>
          <UI.Tbody>
            {records.map(({ id, title, time, created_at }) => (
              <UI.Tr key={id}>
                <UI.Td>{title}</UI.Td>
                <UI.Td isNumeric>{time}</UI.Td>
                <UI.Td textAlign="right">
                  {Util.formatDateTime(created_at)}
                </UI.Td>
                <UI.Td>
                  <UI.Flex justifyContent="center" gap="50px">
                    <EditIcon
                      boxSize={5}
                      _hover={{ opacity: 0.7, cursor: "pointer" }}
                      onClick={onOpenModal.bind(null, true, id)}
                    />
                    <DeleteIcon
                      boxSize={5}
                      color="red"
                      _hover={{ opacity: 0.7, cursor: "pointer" }}
                      onClick={onOpenDialog.bind(null, id)}
                    />
                  </UI.Flex>
                </UI.Td>
              </UI.Tr>
            ))}
          </UI.Tbody>
          <UI.Tfoot>
            <UI.Tr>
              <UI.Th fontSize={15}>合計時間</UI.Th>
              <UI.Th fontSize={15} isNumeric>
                {records.reduce((accu, { time }) => accu + parseInt(time), 0)}
              </UI.Th>
              <UI.Th fontSize={15}>-</UI.Th>
              <UI.Th></UI.Th>
            </UI.Tr>
          </UI.Tfoot>
        </UI.Table>
      </UI.TableContainer>
    </>
  );
};
