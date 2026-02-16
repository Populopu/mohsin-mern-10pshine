import { render, screen, fireEvent, waitFor } from "../../test-utils";
import Notes from "../../pages/notes";

let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
});
afterAll(() => {
  global.fetch = originalFetch;
});

test("deletes note", async () => {

  global.fetch = jest.fn((url, opts) => {
    if (url.endsWith('/api/notes') && (!opts || opts.method === 'GET')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: '1', title: 'Delete Me' }]) });
    }
    if (url.endsWith('/api/notes/1') && opts && opts.method === 'DELETE') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });

  render(<Notes />);

  await screen.findByText("Delete Me");

  fireEvent.click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
