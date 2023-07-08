
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "../../app/routes/login";

test("renders form fields and buttons", async () => {
  render(<Login />);

  // Check that the email input field is rendered
  const emailInput = screen.getByLabelText(/email address/i);
  expect(emailInput).not.toBeNull();

  // Check that the password input field is rendered
  const passwordInput = screen.getByLabelText(/password/i);
  expect(passwordInput).not.toBeNull();

  // Check that the login button is rendered
  const loginButton = screen.getByText(/log in/i);
  expect(loginButton).not.toBeNull();

  // Check that the signup button is rendered
  const signupButton = screen.getByText(/sign up/i);
  expect(signupButton).not.toBeNull();
});

// test("updates form field values when they are changed", async () => {
//   render(<Login />);

//   const emailInput = screen.getByLabelText(
//     /email address/i
//   ) as HTMLInputElement;
//   const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

//   // Change the value of the email input field
//   fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
//   expect(emailInput.value).toBe("testuser@example.com");

//   // Change the value of the password input field
//   fireEvent.change(passwordInput, { target: { value: "testpassword" } });
//   expect(passwordInput.value).toBe("testpassword");
// });