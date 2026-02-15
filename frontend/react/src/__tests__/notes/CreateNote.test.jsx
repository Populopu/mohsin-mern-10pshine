import { render, screen, fireEvent, waitFor } from "../../test-utils";
import Notes from "../../pages/notes";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

test("creates note", async () => {

  global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({}) }));

  render(<Notes />);

  fireEvent.change(screen.getByPlaceholderText(/title/i), {
    target: { value: "New Note" }
  });

  fireEvent.click(screen.getByText(/add/i));

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
