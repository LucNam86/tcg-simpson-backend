import { Result } from "../../../shared/Result";
import { DeckDocument } from "../../models/deck.model";
import { SaveDeckInput } from "../../interfaces/deck.interface";
export declare function saveDeck(input: SaveDeckInput): Promise<Result<DeckDocument, string>>;
