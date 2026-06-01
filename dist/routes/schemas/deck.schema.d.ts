import { z } from "zod";
export declare const PublicDeckBasicSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    isActive: z.ZodBoolean;
    cards: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const CreateDeckSchema: z.ZodObject<{
    name: z.ZodString;
    cards: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateDeckSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    cards: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type PublicDeckBasic = z.infer<typeof PublicDeckBasicSchema>;
export type CreateDeckInput = z.infer<typeof CreateDeckSchema>;
export type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;
