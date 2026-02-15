import { expect } from "chai";
import sinon from "sinon";
import { createNote, getNotes, updateNote, deleteNote } from "../../controllers/notesControllers.js";
import Note from "../../models/notes.js";

describe("Notes Controller CRUD", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createNote", () => {
    it("should create a note with valid data", async () => {
      const createdNote = {
        _id: "note123",
        title: "Test Note",
        content: "Test content",
        user: "user123",
        tags: [],
        pinned: false
      };

      sinon.stub(Note, "create").resolves(createdNote);

      const req = {
        user: { id: "user123" },
        body: {
          title: "Test Note",
          content: "Test content",
          tags: [],
          pinned: false
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await createNote(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdNote)).to.be.true;
    });

    it("should reject note without title", async () => {
      const req = {
        user: { id: "user123" },
        body: {
          content: "Test content"
          // Missing title
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await createNote(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.args[0][0].message).to.include("required");
    });

    it("should reject note without content", async () => {
      const req = {
        user: { id: "user123" },
        body: {
          title: "Test Note"
          // Missing content
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await createNote(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it("should handle database errors", async () => {
      sinon.stub(Note, "create").rejects(new Error("DB Error"));

      const req = {
        user: { id: "user123" },
        body: {
          title: "Test Note",
          content: "Test content"
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await createNote(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("getNotes", () => {
    it("should fetch all user notes sorted by pin and date", async () => {
      const mockNotes = [
        { _id: "1", title: "Pinned", pinned: true },
        { _id: "2", title: "Recent", pinned: false }
      ];

      sinon.stub(Note, "find").returns({
        sort: sinon.stub().resolves(mockNotes)
      });

      const req = { user: { id: "user123" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await getNotes(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockNotes)).to.be.true;
    });

    it("should handle database errors gracefully", async () => {
      sinon.stub(Note, "find").throws(new Error("DB Error"));

      const req = { user: { id: "user123" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await getNotes(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("updateNote", () => {
    it("should update note successfully", async () => {
      const fakeNote = {
        _id: "note123",
        title: "Old Title",
        content: "Old content",
        save: sinon.stub().resolves({
          _id: "note123",
          title: "New Title",
          content: "New content"
        })
      };

      sinon.stub(Note, "findOne").resolves(fakeNote);

      const req = {
        user: { id: "user123" },
        params: { id: "note123" },
        body: {
          title: "New Title",
          content: "New content"
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await updateNote(req, res);

      expect(Note.findOne.called).to.be.true;
      expect(fakeNote.save.called).to.be.true;
    });

    it("should return 404 if note not found", async () => {
      sinon.stub(Note, "findOne").resolves(null);

      const req = {
        user: { id: "user123" },
        params: { id: "nonexistent" },
        body: { title: "Updated" }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await updateNote(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe("deleteNote", () => {
    it("should delete note successfully", async () => {
      sinon.stub(Note, "findOneAndDelete").resolves({
        _id: "note123"
      });

      const req = {
        user: { id: "user123" },
        params: { id: "note123" }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await deleteNote(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should return 404 if note not found", async () => {
      sinon.stub(Note, "findOneAndDelete").resolves(null);

      const req = {
        user: { id: "user123" },
        params: { id: "nonexistent" }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await deleteNote(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
