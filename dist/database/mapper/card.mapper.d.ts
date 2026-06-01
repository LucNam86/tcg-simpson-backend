import type { PopulatedCardDocument } from "../interfaces/card.interface";
export declare const mapCard: (card: PopulatedCardDocument) => {
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
};
