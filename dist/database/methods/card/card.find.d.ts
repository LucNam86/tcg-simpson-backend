import { Result } from "../../../shared/Result";
import type { PopulatedCardDocument } from "../../interfaces/card.interface";
export declare const findAllCards: () => Promise<Result<PopulatedCardDocument[], string>>;
