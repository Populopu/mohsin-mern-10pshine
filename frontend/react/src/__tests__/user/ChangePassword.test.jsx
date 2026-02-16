import { render, screen, fireEvent, waitFor } from "../../test-utils";
import Profile from "../../components/profile";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

test("changes password", async () => {

  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

  const { container } = render(<Profile />);

  fireEvent.click(screen.getByText(/👤/));

  await screen.findByPlaceholderText(/current password/i);

  fireEvent.change(screen.getByPlaceholderText(/current password/i), {
    target: { value: "123456" }
  });

  // target the exact placeholder for the new password field to avoid
  // matching the "Confirm new password" input
  fireEvent.change(screen.getByPlaceholderText("New password"), {
    target: { value: "abcdef" }
  });

  // click the submit button (there's also an H3 with the same text)
  fireEvent.click(screen.getByRole("button", { name: /change password/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
