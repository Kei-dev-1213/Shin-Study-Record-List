import * as UI from "@chakra-ui/react";
import { FC, FormEvent } from "react";

type Props = {
  onClickRegist: (e: FormEvent) => void;
  titleText: string;
  setTitleText: React.Dispatch<React.SetStateAction<string>>;
  timeText: string;
  setTimeText: React.Dispatch<React.SetStateAction<string>>;
  error: string;
};

export const Form: FC<Props> = ({
  onClickRegist,
  titleText,
  setTitleText,
  timeText,
  setTimeText,
  error,
}) => {
  return (
    <form onSubmit={onClickRegist}>
      学習内容
      <UI.Input
        type="input"
        aria-label="title"
        value={titleText}
        onChange={(e) => setTitleText(e.target.value)}
      />
      <br />
      学習時間
      <UI.Input
        type="number"
        aria-label="time"
        value={timeText}
        onChange={(e) => setTimeText(e.target.value)}
      />
      時間
      <br />
      <UI.Button type="submit">登録</UI.Button>
      <UI.Box style={{ color: "red" }}>{error}</UI.Box>
    </form>
  );
};
