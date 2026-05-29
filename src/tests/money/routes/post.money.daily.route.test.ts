import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.post";
import * as profileService from "@services/profile";

jest.mock("@services/profile");
jest.mock("@middleware/jwt.middleware", () => ({
  signToken: jest.fn().mockReturnValue("mock-token"),
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

const mockCountdownEnds = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

beforeEach(() => {
  jest.clearAllMocks();
  const { jwtMiddleware } = require("@middleware/jwt.middleware");
  jest.mocked(jwtMiddleware).mockImplementation((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  });
});

describe("POST /users/me/money/daily", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec le nouveau solde et countdownEnds", async () => {
      jest.mocked(profileService.updateDailyMoney).mockResolvedValue({
        ok: true,
        value: { money: 200, countdownEnds: mockCountdownEnds },
      });

      const res = await request(app).post("/users/me/money/daily");

      expect(res.status).toBe(200);
      expect(res.body.money).toBe(200);
      expect(res.body.countdownEnds).toBe(mockCountdownEnds);
    });

    it("devrait appeler updateDailyMoney avec le bon userId", async () => {
      jest.mocked(profileService.updateDailyMoney).mockResolvedValue({
        ok: true,
        value: { money: 200, countdownEnds: mockCountdownEnds },
      });

      await request(app).post("/users/me/money/daily");

      expect(profileService.updateDailyMoney).toHaveBeenCalledWith("user-id-123");
    });
  });

  describe("authentification", () => {
    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const { jwtMiddleware } = require("@middleware/jwt.middleware");
      jest.mocked(jwtMiddleware).mockImplementationOnce((req: any, res: any, next: any) => {
        req.user = undefined;
        next();
      });

      const res = await request(app).post("/users/me/money/daily");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jest.mocked(profileService.updateDailyMoney).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app).post("/users/me/money/daily");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 400 si le cooldown n'est pas terminé", async () => {
      jest.mocked(profileService.updateDailyMoney).mockResolvedValue({
        ok: false,
        error: "NOT_READY",
      });

      const res = await request(app).post("/users/me/money/daily");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("NOT_READY");
    });

    it("devrait retourner 500 pour DATABASE_ERROR", async () => {
      jest.mocked(profileService.updateDailyMoney).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app).post("/users/me/money/daily");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});