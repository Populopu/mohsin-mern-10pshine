import { render, screen, waitFor, fireEvent } from "../../test-utils";
import Profile from "../../components/profile";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

test("loads profile data", async () => {

  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ name: "Mohsin", email: "test@mail.com" }) }));

  render(<Profile />);

  fireEvent.click(screen.getByText(/👤/));

  // the component displays the user's email rather than an editable name
  await waitFor(() => expect(screen.getByText("test@mail.com")).toBeInTheDocument());
});
