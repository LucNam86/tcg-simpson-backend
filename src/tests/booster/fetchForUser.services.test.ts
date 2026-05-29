import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fetchUserBoosters } from "@services/booster/booster.fetchForUser"
import * as userMethods from "@database/methods/user";
import * as userMapper from "@database/mapper";
import { ok, err } from "@shared/Result";

// Mock des dépendances externes
jest.mock("@database/methods/user");
jest.mock("@database/mapper");

describe("fetchUserBoosters", () => {
  const userId = "user-id-999";

  // Simulation des boosters bruts stockés en BDD
  const mockRawBoosters = [
    { id_serie: "serie-1", count: 3 },
    { id_serie: "serie-2", count: 1 }
  ];

  const mockUserWithBoosters = {
    _id: userId,
    boosters: mockRawBoosters,
  };

  // Résultat attendu après le passage dans le mapper
  const mockMappedBoosters = [
    { serieName: "Set de Base", remainingOpenings: 3 },
    { serieName: "L'extension", remainingOpenings: 1 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // On force le comportement du mapper pour les tests de succès
    jest.mocked(userMapper.mapUserBoosters).mockReturnValue(mockMappedBoosters as any);
  });

  describe("succès", () => {
    it("devrait retourner les boosters de l'utilisateur correctement formatés par le mapper", async () => {
      // Simulation d'une réponse positive de la BDD
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(mockUserWithBoosters as any)
      );

      const result = await fetchUserBoosters(userId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockMappedBoosters);
      }

      // Vérifications des appels de fonctions
      expect(userMethods.findByIdWithBoosters).toHaveBeenCalledWith(userId);
      expect(userMapper.mapUserBoosters).toHaveBeenCalledWith(mockRawBoosters);
    });

    it("devrait retourner un résultat vide valide si l'utilisateur possède un tableau de boosters vide", async () => {
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok({ _id: userId, boosters: [] } as any)
      );
      jest.mocked(userMapper.mapUserBoosters).mockReturnValue([] as any);

      const result = await fetchUserBoosters(userId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual([]);
      }
      expect(userMapper.mapUserBoosters).toHaveBeenCalledWith([]);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner USER_NOT_FOUND si la méthode BDD renvoie ok(null)", async () => {
      // Cas où la requête fonctionne mais l'utilisateur n'existe pas en BDD
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(null as any)
      );

      const result = await fetchUserBoosters(userId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("USER_NOT_FOUND");
      }
      // Le mapper ne doit pas être appelé si l'utilisateur est introuvable
      expect(userMapper.mapUserBoosters).not.toHaveBeenCalled();
    });

    it("devrait retourner DATABASE_ERROR si la méthode BDD renvoie un échec (result.ok === false)", async () => {
      // Cas d'une erreur de connexion ou crash BDD
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        err("MONGO_DISCONNECTED" as any)
      );

      const result = await fetchUserBoosters(userId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
      expect(userMapper.mapUserBoosters).not.toHaveBeenCalled();
    });
  });
});