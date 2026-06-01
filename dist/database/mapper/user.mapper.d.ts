import { UserDocument } from "../models/user.model";
export declare const mapUser: (user: any) => {
    id: any;
    pseudo: any;
    email: any;
    avatar: any;
    money: any;
    countdownEnds: any;
    myCollection: any;
    boosters: {
        booster: {
            id: string;
            name: string;
            price: number;
            slug: string;
            quantity: number;
            cards: {
                id: string;
                name: string;
                ATK: number;
                PV: number;
                description: string;
                slug: string;
                rarity: string;
                type: "Personnage" | "Objet" | "Terrain";
                serie: {
                    id_serie: {
                        id: string;
                        name: string;
                        total: number;
                    };
                    position: number;
                };
                family: {
                    id: string;
                    name: string;
                    description: string;
                    bonus: import("../models/family.model").IBonus;
                };
                affinity: {
                    id: string;
                    name: string;
                    description: string;
                    bonus: import("../models/affinity.model").IBonus;
                };
            }[];
            serie: {
                id: string;
                name: string;
            };
            probabilities: {
                rarity: "Common" | "Rare" | "Legendary";
                value: number;
            }[];
        };
        number: any;
    }[];
    decks: any;
    friends: any;
    darkMode: any;
};
export declare function mapUserPublic(user: UserDocument): {
    id: string;
    pseudo: string;
    email: string;
    avatar: string;
    money: number;
    countdownEnds: Date;
    darkMode: boolean;
};
export declare const mapFriend: (friend: any) => {
    pseudo: any;
    avatar: any;
    uniqueCardsCount: number;
};
