const request = require("supertest");

const app = require("../src/app");

describe("ServerPulse API", () => {
  describe("GET /", () => {
    it("returns the application status", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        application: "ServerPulse",
        message: "ServerPulse API is running",
      });
    });
  });

  describe("GET /health", () => {
    it("returns a healthy status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("healthy");
      expect(response.body.service).toBe("serverpulse-backend");
      expect(response.body.timestamp).toBeDefined();

      expect(
        Number.isNaN(Date.parse(response.body.timestamp))
      ).toBe(false);
    });
  });

  describe("Unknown route", () => {
    it("returns 404", async () => {
      const response = await request(app).get("/route-that-does-not-exist");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Route not found",
      });
    });
  });
});
