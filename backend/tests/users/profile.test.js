import { expect } from "chai";
import sinon from "sinon";
import { getProfile, changePassword } from "../../controllers/userControllers.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

describe("User Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getProfile", () => {
    it("should return user profile without password", async () => {
      const fakeUser = {
        _id: "user123",
        name: "Test User",
        email: "test@mail.com",
        profilePic: "avatar.png"
      };

      const selectStub = sinon.stub().resolves(fakeUser);
      sinon.stub(User, "findById").returns({ select: selectStub });

      const req = { user: { id: "user123" } };
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();

      await getProfile(req, res, next);

      expect(User.findById.calledWith("user123")).to.be.true;
      expect(selectStub.calledWith("-password")).to.be.true;
      expect(res.json.calledWith(fakeUser)).to.be.true;
    });

    it("should call next on database error", async () => {
      sinon.stub(User, "findById").throws(new Error("DB Error"));

      const req = { user: { id: "user123" } };
      const res = { json: sinon.stub() };
      const next = sinon.stub();

      await getProfile(req, res, next);

      expect(next.called).to.be.true;
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      const fakeUser = {
        _id: "user123",
        password: "$2a$10$hashedPassword",
        save: sinon.stub().resolves({ _id: "user123" })
      };

      sinon.stub(User, "findById").resolves(fakeUser);
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(bcrypt, "genSalt").resolves("salt");
      sinon.stub(bcrypt, "hash").resolves("newHashedPassword");

      const req = {
        user: { id: "user123" },
        body: {
          currentPassword: "oldPassword123",
          newPassword: "newPassword123"
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await changePassword(req, res);

      expect(User.findById.calledWith("user123")).to.be.true;
      expect(bcrypt.compare.called).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should reject if current password is wrong", async () => {
      const fakeUser = {
        _id: "user123",
        password: "$2a$10$hashedPassword"
      };

      sinon.stub(User, "findById").resolves(fakeUser);
      sinon.stub(bcrypt, "compare").resolves(false); // Wrong password

      const req = {
        user: { id: "user123" },
        body: {
          currentPassword: "wrongPassword",
          newPassword: "newPassword123"
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await changePassword(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.args[0][0].message).to.include("incorrect");
    });

    it("should reject if new password is too short", async () => {
      const fakeUser = {
        _id: "user123",
        password: "$2a$10$hashedPassword"
      };

      sinon.stub(User, "findById").resolves(fakeUser);
      sinon.stub(bcrypt, "compare").resolves(true);

      const req = {
        user: { id: "user123" },
        body: {
          currentPassword: "oldPassword123",
          newPassword: "short"
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await changePassword(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.args[0][0].message).to.include("6 characters");
    });

    it("should reject if fields are missing", async () => {
      const req = {
        user: { id: "user123" },
        body: {
          currentPassword: "oldPassword123"
          // Missing newPassword
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await changePassword(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.args[0][0].message).to.include("required");
    });

    it("should handle user not found", async () => {
      sinon.stub(User, "findById").resolves(null);
      sinon.stub(bcrypt, "compare").resolves(true);

      const req = {
        user: { id: "user123" },
        body: {
          currentPassword: "oldPassword123",
          newPassword: "newPassword123"
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await changePassword(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
