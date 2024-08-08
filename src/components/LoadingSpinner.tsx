import { Spinner } from "@chakra-ui/react";
import { FC, memo } from "react";

export const LoadingSpinner: FC = memo(() => {
  return (
    <Spinner
      data-testid="loading-spinner"
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="teal.500"
      size="xl"
    />
  );
});
