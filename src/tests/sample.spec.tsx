/**
 * @jest-environment jsdom
 */
import App from "../App";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

// createClient関数をモック
jest.mock("../supabase", () => ({
  DB: {
    fetchAllRecords: jest.fn().mockResolvedValue({}),
    insertRecord: jest.fn().mockResolvedValue({}),
    deleteRecord: jest.fn().mockResolvedValue({}),
  },
}));

describe("初期表示のテスト", () => {
  test("タイトルが画面上に表示されること", async () => {
    render(<App />);
    const headElement = screen.getByRole("heading", {
      name: "シン・学習記録一覧",
    });

    // 検証
    await waitFor(() => {
      expect(headElement).toBeInTheDocument();
    });
  });
});
