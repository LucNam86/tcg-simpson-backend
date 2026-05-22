import request from "supertest";
import express from "express";
import { fetchUserById, fetchUserCollection } from "@services/user";

jest.mock("@services/user");
jest.mock("@middleware/jwt.middleware", () => ({
  jwtMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  },
}));

import router from "@routes/user/user.get";

const app = express();
app.use(express.json());
app.use(router);

describe("GET /me/profile", () => {
  it("retourne le profil de l'utilisateur", async () => {
    (fetchUserById as jest.Mock).mockResolvedValue({
      ok: true,
      value: {
        id: "user-123",
        pseudo: "LucYop",
        email: "luc@test.com",
        avatar: "",
        money: 100,
        myCollection: [],
        boosters: [],
        deck: [],
        darkMode: false,
      },
    });

    const res = await request(app).get("/me/profile");

    expect(res.status).toBe(200);
    expect(res.body.pseudo).toBe("LucYop");
  });

  it("retourne 404 si l'utilisateur n'est pas trouvé", async () => {
    (fetchUserById as jest.Mock).mockResolvedValue({
      ok: false,
      error: "USER_NOT_FOUND",
    });

    const res = await request(app).get("/me/profile");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("USER_NOT_FOUND");
  });

  it("retourne 404 sur DATABASE_ERROR", async () => {
    (fetchUserById as jest.Mock).mockResolvedValue({
      ok: false,
      error: "DATABASE_ERROR",
    });

    const res = await request(app).get("/me/profile");

    expect(res.status).toBe(404);
  });
});

describe("GET /me/collection", () => {
  it("retourne la collection de l'utilisateur", async () => {
    (fetchUserCollection as jest.Mock).mockResolvedValue({
      ok: true,
      value: [{ id: "card-1", name: "Marge futuriste" }],
    });

    const res = await request(app).get("/me/collection");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Marge futuriste");
  });

  it("retourne 404 si la collection est introuvable", async () => {
    (fetchUserCollection as jest.Mock).mockResolvedValue({
      ok: false,
      error: "USER_NOT_FOUND",
    });

    const res = await request(app).get("/me/collection");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("USER_NOT_FOUND");
  });
});
