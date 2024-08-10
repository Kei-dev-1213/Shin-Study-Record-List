/**
 * @jest-environment jsdom
 */
import App from "../App";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DB } from "../supabase";
import userEvent from "@testing-library/user-event";

const initialRecords = [
  {
    id: "1",
    title: "Reactの勉強",
    time: "1",
    created_at: "2024-01-01T00:00:00.000000",
  },
  {
    id: "2",
    title: "TypeScriptの勉強",
    time: "2",
    created_at: "2024-01-02T00:00:00.000000",
  },
  {
    id: "3",
    title: "Jestの勉強",
    time: "3",
    created_at: "2024-01-03T00:00:00.000000",
  },
];

const registRecord = {
  id: "4",
  title: "追加の勉強",
  time: "4",
  created_at: "2024-01-04T00:00:00.000000",
};

const updateRecord = {
  id: "4",
  title: "変更の勉強",
  time: "5",
  created_at: "2024-01-05T00:00:00.000000",
};

// モック化
jest.mock("../supabase", () => ({
  DB: {
    fetchAllRecords: jest.fn(),
    insertRecord: jest.fn(),
    updateRecord: jest.fn(),
    deleteRecord: jest.fn(),
  },
}));

describe("初期表示のテスト", () => {
  test("[正常系]タイトルが画面上に表示されること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValue([]);
    await act(async () => {
      render(<App />);
    });

    // 検証
    const headElement = screen.getByRole("heading", {
      name: "シン・学習記録一覧",
    });
    await waitFor(() => {
      expect(headElement).toBeInTheDocument();
    });
  });

  test("[正常系]ローディング中のスピナーが画面上に表示されること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValue([]);
    render(<App />);

    // 検証
    const loadingSpinner = screen.getByTestId("loading-spinner");
    expect(loadingSpinner).toBeInTheDocument();

    // データ取得後はスピナーが表示されなくなること
    await waitFor(() => {
      expect(loadingSpinner).not.toBeInTheDocument();
    });
  });

  test("[正常系]新規登録ボタンが画面上に表示されていること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValue([]);
    await act(async () => {
      render(<App />);
    });

    // 検証
    const registButton = screen.getByRole("button", { name: "新規登録" });
    expect(registButton).toBeInTheDocument();
  });

  test("[正常系]学習記録一覧が画面上に表示されていること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValue({ data: initialRecords });
    await act(async () => {
      render(<App />);
    });

    // 検証
    await waitFor(() => {
      // 1行目
      expect(screen.getByText("Reactの勉強")).toBeInTheDocument();
      expect(screen.getByText("1時間")).toBeInTheDocument();
      expect(screen.getByText("2024/01/01 00:00")).toBeInTheDocument();
      // 2行目
      expect(screen.getByText("TypeScriptの勉強")).toBeInTheDocument();
      expect(screen.getByText("2時間")).toBeInTheDocument();
      expect(screen.getByText("2024/01/02 00:00")).toBeInTheDocument();
      // 3行目
      expect(screen.getByText("Jestの勉強")).toBeInTheDocument();
      expect(screen.getByText("3時間")).toBeInTheDocument();
      expect(screen.getByText("2024/01/03 00:00")).toBeInTheDocument();
      // 合計時間
      expect(screen.getByTestId("sum-time").innerHTML).toEqual("6時間");
    });
  });
});

describe("学習記録登録のテスト", () => {
  test("[正常系]モーダル初期表示テスト", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValue([]);
    await act(async () => {
      render(<App />);
    });
    // モーダルを開く
    const registButton = screen.getByRole("button", { name: "新規登録" });
    fireEvent.click(registButton);

    // 検証
    const modalTitle = screen.getByTestId("modal-title").innerHTML;
    const registModalButton = screen.getByRole("button", { name: "登録" });
    const titleInput = screen.getByTestId("input-title");
    const timeInput = screen.getByTestId("input-time");
    expect(modalTitle).toEqual("新規登録");
    expect(registModalButton).toBeInTheDocument();
    expect(titleInput).toHaveValue("");
    expect(timeInput).toHaveValue(null);
  });

  test("[正常系]登録テスト", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock)
      .mockResolvedValueOnce({ data: initialRecords })
      .mockResolvedValueOnce({ data: [...initialRecords, registRecord] });
    await act(async () => {
      render(<App />);
    });

    // 事前検証
    await waitFor(() => {
      // 登録する記録が画面上に表示されていないこと
      expect(screen.queryByText("追加の勉強")).not.toBeInTheDocument();
      expect(screen.queryByText("4時間")).not.toBeInTheDocument();
      expect(screen.queryByText("2024/01/04 00:00")).not.toBeInTheDocument();
      // 合計時間
      expect(screen.getByTestId("sum-time").innerHTML).toEqual("6時間");
    });

    // モーダルを開く
    const registButton = screen.getByRole("button", { name: "新規登録" });
    fireEvent.click(registButton);
    // 値の入力
    const registModalButton = screen.getByRole("button", { name: "登録" });
    const titleInput = screen.getByTestId("input-title");
    const timeInput = screen.getByTestId("input-time");
    await userEvent.type(titleInput, "新規登録テスト");
    await userEvent.type(timeInput, "4");
    fireEvent.click(registModalButton);

    // 検証
    await waitFor(() => {
      // 登録対象の記録が画面上に表示されていること
      expect(screen.getByText("追加の勉強")).toBeInTheDocument();
      expect(screen.getByText("4時間")).toBeInTheDocument();
      expect(screen.getByText("2024/01/04 00:00")).toBeInTheDocument();
      // 合計時間
      expect(screen.getByTestId("sum-time").innerHTML).toEqual("10時間");
    });

    // 再度モーダルを開く
    fireEvent.click(registButton);
    // 項目に値が入っていないこと
    expect(titleInput).toHaveValue("");
    expect(timeInput).toHaveValue(null);
  });

  test("[異常系]学習記録、学習時間の未入力エラーが発生すること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValueOnce([]);
    await act(async () => {
      render(<App />);
    });

    // モーダルを開く
    const registButton = screen.getByRole("button", { name: "新規登録" });
    fireEvent.click(registButton);
    // 値の入力をせず登録
    const registModalButton = screen.getByRole("button", { name: "登録" });
    fireEvent.click(registModalButton);

    // 検証
    await waitFor(() => {
      expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
      expect(screen.getByText("時間の入力は必須です")).toBeInTheDocument();
    });
  });

  test("[異常系]学習時間がマイナスのエラーが発生すること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValueOnce([]);
    await act(async () => {
      render(<App />);
    });

    // モーダルを開く
    const registButton = screen.getByRole("button", { name: "新規登録" });
    fireEvent.click(registButton);
    // 値の入力
    const registModalButton = screen.getByRole("button", { name: "登録" });
    const timeInput = screen.getByTestId("input-time");
    await userEvent.type(timeInput, "-1");
    fireEvent.click(registModalButton);

    // 検証
    await waitFor(() => {
      expect(screen.getByText("時間は0以上である必要があります")).toBeInTheDocument();
    });
  });
});

describe("学習記録削除のテスト", () => {
  test("[正常系]削除テスト", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock)
      .mockResolvedValueOnce({ data: [...initialRecords, registRecord] })
      .mockResolvedValueOnce({ data: initialRecords });
    await act(async () => {
      render(<App />);
    });

    // 事前検証
    await waitFor(() => {
      // 削除する記録が画面上に表示されていること
      expect(screen.getByText("追加の勉強")).toBeInTheDocument();
      expect(screen.getByText("4時間")).toBeInTheDocument();
      expect(screen.getByText("2024/01/04 00:00")).toBeInTheDocument();
      // 合計時間
      expect(screen.getByTestId("sum-time").innerHTML).toEqual("10時間");
    });

    // モーダルを開く
    const deleteButton = screen.getAllByRole("delete")[3];
    fireEvent.click(deleteButton);
    // 削除
    const deleteModalButton = screen.getByRole("button", { name: "削除" });
    fireEvent.click(deleteModalButton);

    // 検証
    await waitFor(() => {
      // 登録対象の記録が画面上に表示されていないこと
      expect(screen.queryByText("追加の勉強")).not.toBeInTheDocument();
      expect(screen.queryByText("4時間")).not.toBeInTheDocument();
      expect(screen.queryByText("2024/01/04 00:00")).not.toBeInTheDocument();
      // 合計時間
      expect(screen.getByTestId("sum-time").innerHTML).toEqual("6時間");
    });
  });
});

describe("学習記録編集のテスト", () => {
  test("[正常系]モーダル初期表示テスト", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValueOnce({ data: [...initialRecords, registRecord] });
    await act(async () => {
      render(<App />);
    });
    // モーダルを開く
    const editButton = screen.getAllByRole("edit")[3];
    fireEvent.click(editButton);

    // 検証
    const modalTitle = screen.getByTestId("modal-title").innerHTML;
    const editModalButton = screen.getByRole("button", { name: "保存" });
    const titleInput = screen.getByTestId("input-title");
    const timeInput = screen.getByTestId("input-time");
    expect(modalTitle).toEqual("記録編集");
    expect(editModalButton).toBeInTheDocument();
    expect(titleInput).toHaveValue("追加の勉強");
    expect(timeInput).toHaveValue(4);
  });

  test("[正常系]保存テスト", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock)
      .mockResolvedValueOnce({ data: [...initialRecords, registRecord] })
      .mockResolvedValueOnce({ data: [...initialRecords, updateRecord] });
    await act(async () => {
      render(<App />);
    });

    // 事前検証
    await waitFor(() => {
      // 編集前の記録が画面上に表示されていること
      expect(screen.getByText("追加の勉強")).toBeInTheDocument();
      expect(screen.getByText("4時間")).toBeInTheDocument();
      expect(screen.getByText("2024/01/04 00:00")).toBeInTheDocument();
      // 合計時間
      expect(screen.getByTestId("sum-time").innerHTML).toEqual("10時間");
    });

    // モーダルを開く
    const editButton = screen.getAllByRole("edit")[3];
    fireEvent.click(editButton);
    // 値の入力
    const editModalButton = screen.getByRole("button", { name: "保存" });
    const titleInput = screen.getByTestId("input-title");
    const timeInput = screen.getByTestId("input-time");
    await userEvent.type(titleInput, "変更の勉強");
    await userEvent.type(timeInput, "5");
    fireEvent.click(editModalButton);

    // 検証
    await waitFor(() => {
      // 変更後の記録が画面上に表示されていること
      expect(screen.getByText("変更の勉強")).toBeInTheDocument();
      expect(screen.getByText("5時間")).toBeInTheDocument();
      expect(screen.getByText("2024/01/05 00:00")).toBeInTheDocument();
      // 合計時間
      expect(screen.getByTestId("sum-time").innerHTML).toEqual("11時間");
    });

    // 再度モーダルを開く
    fireEvent.click(editButton);
    // 変更後の記録が項目に入っていること
    expect(titleInput).toHaveValue("変更の勉強");
    expect(timeInput).toHaveValue(5);
  });
});
