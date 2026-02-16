import { expect } from "chai";
import sinon from "sinon";
import { updateProfilePic } from "../../controllers/userControllers.js";
import User from "../../models/User.js";

describe("Avatar Upload Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should update profile picture successfully", async () => {
    const fakeUser = {
      _id: "user123",
      email: "test@test.com",
      profilePic: "",
      save: sinon.stub().resolves({
        _id: "user123",
        email: "test@test.com",
        profilePic: "avatar.png"
      })
    };

    sinon.stub(User, "findById").resolves(fakeUser);

    const req = {
      user: { id: "user123" },
      file: { filename: "avatar.png" }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    const next = sinon.stub();

    await updateProfilePic(req, res, next);

    expect(User.findById.calledWith("user123")).to.be.true;
    expect(fakeUser.save.called).to.be.true;
    expect(res.json.called).to.be.true;
  });

  it("should handle missing file", async () => {
    const fakeUser = {
      _id: "user123",
      save: sinon.stub().resolves()
    };

    sinon.stub(User, "findById").resolves(fakeUser);

    const req = {
      user: { id: "user123" },
      file: undefined // No file
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    const next = sinon.stub();

    await updateProfilePic(req, res, next);

    // This will throw an error because file is undefined
    // The controller should handle this but currently doesn't
    // This test shows the issue
  });

  it("should handle database errors", async () => {
    sinon.stub(User, "findById").rejects(new Error("Database error"));

    const req = {
      user: { id: "user123" },
      file: { filename: "avatar.png" }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    const next = sinon.stub();

    await updateProfilePic(req, res, next);

    expect(next.called).to.be.true;
  });
});
