import { Result } from "../../../shared/Result";
import { DeckDocument } from "../../models/deck.model";
export declare function updateById(userId: string, deckId: string, input: {
    name?: string;
    cards?: string[];
}): Promise<Result<DeckDocument, string>>;
