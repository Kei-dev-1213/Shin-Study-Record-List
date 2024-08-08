/**
 * @jest-environment jsdom
 */
import App from "../App";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { DB } from "../supabase";

const initialRecords = [{}];

// モック化
jest.mock("../supabase", () => ({
  DB: {
    fetchAllRecords: jest.fn(),
    insertRecord: jest.fn(),
    deleteRecord: jest.fn(),
  },
}));

describe("初期表示のテスト", () => {
  test("タイトルが画面上に表示されること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValue([]);
    render(<App />);

    // 検証
    const headElement = screen.getByRole("heading", {
      name: "シン・学習記録一覧",
    });
    await waitFor(() => {
      expect(headElement).toBeInTheDocument();
    });
  });

  test("ローディング中のスピナーが画面上に表示されること", async () => {
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

  test("学習記録一覧が画面上に表示されていること", async () => {
    // 準備
    (DB.fetchAllRecords as jest.Mock).mockResolvedValue(initialRecords);
    render(<App />);

    // 検証
    await waitFor(() => {
      // expect(loadingSpinner).not.toBeInTheDocument();
    });
  });
});
