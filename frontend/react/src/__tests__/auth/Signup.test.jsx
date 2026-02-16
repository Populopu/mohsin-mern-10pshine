import { render, screen, fireEvent, waitFor } from "../../test-utils";
import Signup from "../../pages/signup";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

describe("Signup Page", () => {

  test("registers user", async () => {

    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({}) }));

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Test User" }
    });

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
