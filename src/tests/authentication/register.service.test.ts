import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { registerUser } from "@services/authentication/user.register";
import * as userMethods from "@database/methods/user";
import * as boosterMethods from "@database/methods/booster";
import * as userMapper from "@database/mapper/user.mapper";
import { ok, err } from "@shared/Result";
import bcrypt from "bcrypt";

jest.mock("@database/methods/user");
jest.mock("@database/methods/booster");
jest.mock("@database/mapper/user.mapper");
jest.mock("bcrypt");

const mockInput = {
  pseudo: "TestUser",
  email: "test@example.com",
  password: "password123",
};

const mockPublicUser = {
  id: "user-id-123",
  pseudo: "TestUser",
  email: "test@example.com",
  avatar: "/avatars/avatar-1.webp",
  money: 100,
  darkMode: false,
  countdownEnds: new Date(),
};

const mockBooster = { _id: "booster-id-1" };

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);
  jest.mocked(userMapper.mapUserPublic).mockReturnValue(mockPublicUser);
});

describe("registerUser", () => {
  describe("succès", () => {
    it("devrait créer un utilisateur et retourner les données publiques", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([mockBooster] as any));
      jest.mocked(userMethods.save).mockResolvedValue(ok("user-id-123"));
      jest.mocked(userMethods.findById).mockResolvedValue(ok({ _id: "user-id-123" } as any));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toEqual(mockPublicUser);
    });

    it("devrait hasher le mot de passe", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([mockBooster] as any));
      jest.mocked(userMethods.save).mockResolvedValue(ok("user-id-123"));
      jest.mocked(userMethods.findById).mockResolvedValue(ok({ _id: "user-id-123" } as any));

      await registerUser(mockInput);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockInput.password, expect.any(Number));
    });

    it("devrait mettre l'email en minuscules", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([mockBooster] as any));
      jest.mocked(userMethods.save).mockResolvedValue(ok("user-id-123"));
      jest.mocked(userMethods.findById).mockResolvedValue(ok({ _id: "user-id-123" } as any));

      await registerUser({ ...mockInput, email: "TEST@EXAMPLE.COM" });

      expect(userMethods.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: "test@example.com" })
      );
    });

    it("devrait assigner un avatar aléatoire valide", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([mockBooster] as any));
      jest.mocked(userMethods.save).mockResolvedValue(ok("user-id-123"));
      jest.mocked(userMethods.findById).mockResolvedValue(ok({ _id: "user-id-123" } as any));

      await registerUser(mockInput);

      const saveCall = jest.mocked(userMethods.save).mock.calls[0][0];
      expect((saveCall as any).avatar).toMatch(/^\/avatars\/avatar-([1-9]|1[0-3])\.webp$/);
    });

    it("devrait assigner 100 donuts au départ", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([mockBooster] as any));
      jest.mocked(userMethods.save).mockResolvedValue(ok("user-id-123"));
      jest.mocked(userMethods.findById).mockResolvedValue(ok({ _id: "user-id-123" } as any));

      await registerUser(mockInput);

      expect(userMethods.save).toHaveBeenCalledWith(
        expect.objectContaining({ money: 100 })
      );
    });

    it("devrait assigner tous les boosters disponibles", async () => {
      const mockBoosters = [{ _id: "booster-1" }, { _id: "booster-2" }];
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok(mockBoosters as any));
      jest.mocked(userMethods.save).mockResolvedValue(ok("user-id-123"));
      jest.mocked(userMethods.findById).mockResolvedValue(ok({ _id: "user-id-123" } as any));

      await registerUser(mockInput);

      expect(userMethods.save).toHaveBeenCalledWith(
        expect.objectContaining({
          boosters: [
            { booster: "booster-1", number: 1 },
            { booster: "booster-2", number: 1 },
          ],
        })
      );
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner EMAIL_TAKEN si l'email existe déjà", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok({ _id: "existing" } as any));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("EMAIL_TAKEN");
    });

    it("devrait retourner PSEUDO_TAKEN si le pseudo existe déjà", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok({ _id: "existing" } as any));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("PSEUDO_TAKEN");
    });
  });

  describe("erreurs base de données", () => {
    it("devrait retourner DATABASE_ERROR si findByEmail échoue", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(err("DB_ERROR"));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si findByPseudo échoue", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(err("DB_ERROR"));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si find boosters échoue", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(err("DB_ERROR"));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner USER_CREATION_FAILED si save échoue", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([mockBooster] as any));
      jest.mocked(userMethods.save).mockResolvedValue(err("DB_ERROR"));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_CREATION_FAILED");
    });

    it("devrait retourner USER_CREATION_FAILED si findById après save échoue", async () => {
      jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null));
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null));
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([mockBooster] as any));
      jest.mocked(userMethods.save).mockResolvedValue(ok("user-id-123"));
      jest.mocked(userMethods.findById).mockResolvedValue(err("DB_ERROR"));

      const result = await registerUser(mockInput);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_CREATION_FAILED");
    });
  });
});