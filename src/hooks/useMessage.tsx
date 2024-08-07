import { useToast } from "@chakra-ui/react";

type Props = {
  title: string;
  status: "success" | "error" | "warning" | "info";
};

export const useMessage = () => {
  const toast = useToast();

  const displayMessage = ({ title, status }: Props) => {
    toast({
      title,
      status,
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  return {
    displayMessage,
  };
};
