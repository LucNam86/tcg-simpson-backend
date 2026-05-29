import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.put";
import * as updateService from "@services/profile";

jest.mock("@services/profile");
jest.mock("@middleware/jwt.middleware", () => ({
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

const mockUpdatedUser = {
  pseudo: "UpdatedUser",
  money: 100,
};

beforeEach(() => {
  jest.clearAllMocks();
  const { jwtMiddleware } = require("@middleware/jwt.middleware");
  jest.mocked(jwtMiddleware).mockImplementation((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  });
});

describe("PUT /users/me/profile", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec les données mises à jour", async () => {
      jest.mocked(updateService.updateUser).mockResolvedValue({
        ok: true,
        value: mockUpdatedUser,
      });

      const res = await request(app)
        .put("/users/me/profile")
        .send({ pseudo: "UpdatedUser" });

      expect(res.status).toBe(200);
      expect(res.body.pseudo).toBe("UpdatedUser");
    });

    it("devrait accepter une mise à jour du mot de passe", async () => {
      jest.mocked(updateService.updateUser).mockResolvedValue({
        ok: true,
        value: mockUpdatedUser,
      });

      const res = await request(app)
        .put("/users/me/profile")
        .send({ password: "newpassword123" });

      expect(res.status).toBe(200);
    });

    it("devrait accepter une mise à jour de l'avatar", async () => {
      jest.mocked(updateService.updateUser).mockResolvedValue({
        ok: true,
        value: mockUpdatedUser,
      });

      const res = await request(app)
        .put("/users/me/profile")
        .send({ avatar: "/avatars/avatar-2.webp" });

      expect(res.status).toBe(200);
    });
  });

  describe("authentification", () => {
    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const { jwtMiddleware } = require("@middleware/jwt.middleware");
      jest.mocked(jwtMiddleware).mockImplementationOnce((req: any, res: any, next: any) => {
        req.user = undefined;
        next();
      });

      const res = await request(app)
        .put("/users/me/profile")
        .send({ pseudo: "UpdatedUser" });

      expect(res.status).toBe(401);
    });
  });

  describe("validation Zod", () => {
    it("devrait retourner 400 si le body est vide", async () => {
      const res = await request(app).put("/users/me/profile").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("No fields to update provided.");
    });

    it("devrait retourner 400 si le pseudo est trop court", async () => {
      const res = await request(app)
        .put("/users/me/profile")
        .send({ pseudo: "ab" });

      expect(res.status).toBe(400);
    });

    it("devrait retourner 400 si le mot de passe est trop court", async () => {
      const res = await request(app)
        .put("/users/me/profile")
        .send({ password: "short" });

      expect(res.status).toBe(400);
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jest.mocked(updateService.updateUser).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app)
        .put("/users/me/profile")
        .send({ pseudo: "UpdatedUser" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 400 si le pseudo est déjà utilisé", async () => {
      jest.mocked(updateService.updateUser).mockResolvedValue({
        ok: false,
        error: "PSEUDO_ALREADY_USED",
      });

      const res = await request(app)
        .put("/users/me/profile")
        .send({ pseudo: "ExistingUser" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("PSEUDO_ALREADY_USED");
    });

    it("devrait retourner 400 pour les autres erreurs", async () => {
      jest.mocked(updateService.updateUser).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app)
        .put("/users/me/profile")
        .send({ pseudo: "UpdatedUser" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});