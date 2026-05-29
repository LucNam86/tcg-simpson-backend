import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { connectUser } from "@services/authentication/user.connect";
import * as userMethods from "@database/methods/user";
import * as userMapper from "@database/mapper/user.mapper";
import { ok, err } from "@shared/Result";
import bcrypt from "bcrypt";

jest.mock("@database/methods/user");
jest.mock("@database/mapper/user.mapper");
jest.mock("bcrypt");

const mockUserDocument = {
    _id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    passwordHash: "hashed-password",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    darkMode: false,
    countdownEnds: new Date(),
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

beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(userMapper.mapUserPublic).mockReturnValue(mockPublicUser);
});

describe("connectUser", () => {
    describe("succès", () => {
        it("devrait retourner les données publiques de l'utilisateur", async () => {
            jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(mockUserDocument as any));
            jest.mocked(bcrypt.compareSync).mockReturnValue(true as never);

            const result = await connectUser({
                email: "test@example.com",
                password: "password123",
            });

            expect(result.ok).toBe(true);
            if (result.ok) expect(result.value).toEqual(mockPublicUser);
        });

        it("devrait appeler mapUserPublic avec le document utilisateur", async () => {
            jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(mockUserDocument as any));
            jest.mocked(bcrypt.compareSync).mockReturnValue(true as never);

            await connectUser({ email: "test@example.com", password: "password123" });

            expect(userMapper.mapUserPublic).toHaveBeenCalledWith(
                expect.objectContaining({
                    pseudo: "TestUser",
                    email: "test@example.com",
                    passwordHash: "hashed-password",
                })
            );
        });

        it("devrait vérifier le mot de passe avec le hash stocké", async () => {
            jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(mockUserDocument as any));
            jest.mocked(bcrypt.compareSync).mockReturnValue(true as never);

            await connectUser({ email: "test@example.com", password: "password123" });

            expect(bcrypt.compareSync).toHaveBeenCalledWith("password123", "hashed-password");
        });
    });

    describe("erreurs métier", () => {
        it("devrait retourner CREDENTIALS_UNKNOWN si l'email n'existe pas", async () => {
            jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(null as any));

            const result = await connectUser({
                email: "unknown@example.com",
                password: "password123",
            });

            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.error).toBe("CREDENTIALS_UNKNOWN");
        });

        it("devrait retourner CREDENTIALS_UNKNOWN si findByEmail échoue", async () => {
            jest.mocked(userMethods.findByEmail).mockResolvedValue(err("DB_ERROR"));

            const result = await connectUser({
                email: "test@example.com",
                password: "password123",
            });

            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.error).toBe("CREDENTIALS_UNKNOWN");
        });

        it("devrait retourner WRONG_CREDENTIALS si le mot de passe est incorrect", async () => {
            jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(mockUserDocument as any));
            jest.mocked(bcrypt.compareSync).mockReturnValue(false as never);

            const result = await connectUser({
                email: "test@example.com",
                password: "wrong-password",
            });

            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.error).toBe("WRONG_CREDENTIALS");
        });

        it("ne devrait pas appeler mapUserPublic si le mot de passe est incorrect", async () => {
            jest.mocked(userMethods.findByEmail).mockResolvedValue(ok(mockUserDocument as any));
            jest.mocked(bcrypt.compareSync).mockReturnValue(false as never);

            await connectUser({ email: "test@example.com", password: "wrong-password" });

            expect(userMapper.mapUserPublic).not.toHaveBeenCalled();
        });
    });
});