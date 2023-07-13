

import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Login from "../../src/components/Login";

const server = setupServer(
  rest.post(
    "https://w14-new-production.up.railway.app/auth/login",
    (_, res, ctx) => {
      return res(
        ctx.json({
          token: createMockJwt("mock_user_id"),
          userId: "mock_user_id",
        })
      );
    }
  )
);

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

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Login Integration", () => {
  it("logs in and updates the context and local storage", async () => {
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
      expect(localStorage.getItem("token")).toEqual(
        createMockJwt("mock_user_id")
      )
    );
    await waitFor(() =>
      expect(localStorage.getItem("userId")).toEqual("mock_user_id")
    );
  });
});
