import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const findByEmail = async (
  email: string,
): Promise<Result<any, string>> => {
  try {
    const user = await UserModel.findOne({ email });
    return ok(user);
  } catch (e) {
    return err("Erreur lors de la recherche par email");
  }
};
