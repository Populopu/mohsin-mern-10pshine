import { render, screen, waitFor } from "../../test-utils";
import Notes from "../../pages/notes";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

test("loads notes", async () => {

  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: "1", title: "Test Note" }]) }));

  render(<Notes />);

  await waitFor(() => expect(screen.getByText("Test Note")).toBeInTheDocument());
});
