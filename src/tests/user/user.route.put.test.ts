import request from "supertest";
import express from "express";
import { updateUser } from "@services/profile/index";

jest.mock("@services/user");
jest.mock("@middleware/jwt.middleware", () => ({
  jwtMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  },
}));

import router from "@routes/user/user.put";

const app = express();
app.use(express.json());
app.use(router);

describe("PUT /me/profile", () => {
  it("met à jour le profil avec succès", async () => {
    (updateUser as jest.Mock).mockResolvedValue({
      ok: true,
      value: {
        id: "user-123",
        pseudo: "NouveauPseudo",
        email: "luc@test.com",
        avatar: "",
        money: 100,
        myCollection: [],
        boosters: [],
        deck: [],
        darkMode: false,
      },
    });

    const res = await request(app)
      .put("/me/profile")
      .send({ pseudo: "NouveauPseudo" });

    expect(res.status).toBe(200);
    expect(res.body.pseudo).toBe("NouveauPseudo");
  });

  it("retourne 400 si aucun champ à mettre à jour", async () => {
    const res = await request(app)
      .put("/me/profile")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No fields to update provided.");
  });

  it("retourne 400 si le body contient un champ invalide", async () => {
    const res = await request(app)
      .put("/me/profile")
      .send({ champInvalide: "test" });

    expect(res.status).toBe(400);
  });

  it("retourne 404 si l'utilisateur n'est pas trouvé", async () => {
    (updateUser as jest.Mock).mockResolvedValue({
      ok: false,
      error: "USER_NOT_FOUND",
    });

    const res = await request(app)
      .put("/me/profile")
      .send({ pseudo: "Test" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("USER_NOT_FOUND");
  });

  it("retourne 400 sur une autre erreur de service", async () => {
    (updateUser as jest.Mock).mockResolvedValue({
      ok: false,
      error: "DATABASE_ERROR",
    });

    const res = await request(app)
      .put("/me/profile")
      .send({ pseudo: "Test" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("DATABASE_ERROR");
  });
});
