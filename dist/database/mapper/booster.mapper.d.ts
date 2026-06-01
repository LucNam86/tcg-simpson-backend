import { PopulatedBoosterDocument } from "../interfaces/booster.interface";
export declare const mapBooster: (booster: PopulatedBoosterDocument) => {
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
export declare const mapUserBoosters: (boosters: any[]) => {
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
export declare const mapBoostersFromFind: (boosters: PopulatedBoosterDocument[]) => {
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
    number: number;
}[];
