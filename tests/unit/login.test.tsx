import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import Login from "../../src/components/Login";
import * as api from "../../src/api";

jest.mock("../../src/api.ts");
const mockLogin = api.loginUser as jest.MockedFunction<typeof api.loginUser>;
describe("Login", () => {
  it("allows user to login successfully", async () => {
    function createMockJwt(userId: string) {
      const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" })
      ).toString("base64");

      const payload = Buffer.from(JSON.stringify({ id: userId })).toString(
        "base64"
      );

      const signature = "mock_signature";

      return `${header}.${payload}.${signature}`;
    }

    const mockJwt = createMockJwt("test_user_id");

    mockLogin.mockResolvedValueOnce({
      token: mockJwt,
      userId: "test_user_id",
    });

    const { getByLabelText, getByRole } = render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(getByLabelText(/Email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText(/Password/i), {
      target: { value: "test_password" },
    });

    fireEvent.click(getByRole("button", { name: /Sign In/i }));

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "test_password",
      })
    );
  });
});
