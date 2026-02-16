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

  fireEvent.change(screen.getByPlaceholderText(/new password/i), {
    target: { value: "abcdef" }
  });

  fireEvent.click(screen.getByText(/change password/i));

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
