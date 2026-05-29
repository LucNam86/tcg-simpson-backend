import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.delete";
import * as friendsService from "@services/friends";

jest.mock("@services/friends");
jest.mock("@middleware/jwt.middleware", () => ({
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

beforeEach(() => {
  jest.clearAllMocks();
  const { jwtMiddleware } = require("@middleware/jwt.middleware");
  jest.mocked(jwtMiddleware).mockImplementation((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  });
});

describe("DELETE /users/me/friends/:pseudo", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec success true", async () => {
      jest.mocked(friendsService.removeUserFriendByPseudo).mockResolvedValue({
        ok: true,
        value: true,
      });

      const res = await request(app).delete("/users/me/friends/TestFriend");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("authentification", () => {
    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const { jwtMiddleware } = require("@middleware/jwt.middleware");
      jest.mocked(jwtMiddleware).mockImplementationOnce((req: any, res: any, next: any) => {
        req.user = undefined;
        next();
      });

      const res = await request(app).delete("/users/me/friends/TestFriend");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si l'ami n'est pas trouvé", async () => {
      jest.mocked(friendsService.removeUserFriendByPseudo).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app).delete("/users/me/friends/UnknownFriend");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 500 pour les autres erreurs", async () => {
      jest.mocked(friendsService.removeUserFriendByPseudo).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app).delete("/users/me/friends/TestFriend");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});