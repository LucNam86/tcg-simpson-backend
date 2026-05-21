import { Result, ok, err } from "@shared/Result";
import { UserModel, UserDocument } from "@database/models/user.model";

export const save = async (user: any): Promise<Result<string, string>> => {
  try {
    const doc = await UserModel.create(user);
    return ok(doc._id.toString());
  } catch (e) {
    console.error("saveUser error:", JSON.stringify(e, null, 2));
    return err("Erreur lors de la sauvegarde");
  }
};
