import { render, screen, fireEvent, waitFor } from "../../test-utils";
import Login from "../../pages/login";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

describe("Login Page", () => {

  test("renders login form", () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  test("successful login", async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ token: "fake-token" }) })
    );

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@mail.com" }
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

});
