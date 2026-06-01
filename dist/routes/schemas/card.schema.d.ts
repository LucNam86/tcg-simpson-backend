import { z } from 'zod';
export declare const PublicFamilySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    bonus: z.ZodObject<{
        ATK: z.ZodNumber;
        PV: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const PublicAffinitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    bonus: z.ZodObject<{
        ATK: z.ZodNumber;
        PV: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const PublicSerieSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const PublicCardSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    ATK: z.ZodNumber;
    PV: z.ZodNumber;
    description: z.ZodString;
    slug: z.ZodString;
    rarity: z.ZodString;
    type: z.ZodEnum<{
        Personnage: "Personnage";
        Objet: "Objet";
        Terrain: "Terrain";
    }>;
    serie: z.ZodObject<{
        id_serie: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>;
        position: z.ZodNumber;
    }, z.core.$strip>;
    family: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        bonus: z.ZodObject<{
            ATK: z.ZodNumber;
            PV: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    affinity: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        bonus: z.ZodObject<{
            ATK: z.ZodNumber;
            PV: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PublicCard = z.infer<typeof PublicCardSchema>;
export declare const PublicCardArraySchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    ATK: z.ZodNumber;
    PV: z.ZodNumber;
    description: z.ZodString;
    slug: z.ZodString;
    rarity: z.ZodString;
    type: z.ZodEnum<{
        Personnage: "Personnage";
        Objet: "Objet";
        Terrain: "Terrain";
    }>;
    serie: z.ZodObject<{
        id_serie: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>;
        position: z.ZodNumber;
    }, z.core.$strip>;
    family: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        bonus: z.ZodObject<{
            ATK: z.ZodNumber;
            PV: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    affinity: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        bonus: z.ZodObject<{
            ATK: z.ZodNumber;
            PV: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>>;
export type PublicCardArray = z.infer<typeof PublicCardArraySchema>;
