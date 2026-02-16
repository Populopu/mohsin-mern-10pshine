import request from "supertest";
import { expect } from "chai";
import sinon from "sinon";
import app from "../../index.js";
import User from "../../models/User.js";

describe("Auth Routes", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /api/auth/signup", () => {
    it("should register a new user with valid credentials", async () => {
      const testEmail = `test${Date.now()}@mail.com`;
      
      // Stub the database call to prevent actual DB operations
      sinon.stub(User, "findOne").resolves(null); // No existing user
      sinon.stub(User, "create").resolves({
        _id: "123",
        name: "Test User",
        email: testEmail,
        password: "hashedPassword"
      });

      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: testEmail,
          password: "TestPassword123"
        });

      expect(res.status).to.equal(201);
      expect(res.body.message).to.include("created successfully");
    });

    it("should reject signup with invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: "invalid-email",
          password: "TestPassword123"
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.include("Invalid email");
    });

    it("should reject signup with weak password", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: `test${Date.now()}@mail.com`,
          password: "weak"
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.include("Password must be");
    });

    it("should reject signup with missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: "test@mail.com"
          // Missing password
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.include("required");
    });

    it("should reject signup if user already exists", async () => {
      const testEmail = `test${Date.now()}@mail.com`;
      
      sinon.stub(User, "findOne").resolves({
        _id: "123",
        email: testEmail
      }); // User exists

      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: testEmail,
          password: "TestPassword123"
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.include("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should reject login with invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "invalid-email",
          password: "password123"
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.include("Invalid email");
    });

    it("should reject login with missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@mail.com"
          // Missing password
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.include("required");
    });
  });
});
