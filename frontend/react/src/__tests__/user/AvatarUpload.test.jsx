import { render, screen, fireEvent, waitFor } from "../../test-utils";
import Profile from "../../components/profile";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

test("uploads avatar", async () => {

  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

  const { container } = render(<Profile />);

  fireEvent.click(screen.getByText(/👤/));

  const file = new File(["avatar"], "avatar.png", {
    type: "image/png"
  });

  await waitFor(() => expect(container.querySelector('input[type="file"]')).toBeTruthy());

  const input = container.querySelector('input[type="file"]');

  fireEvent.change(input, {
    target: { files: [file] }
  });

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
