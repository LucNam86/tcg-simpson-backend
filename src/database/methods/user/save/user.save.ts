import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const save = async (user: any): Promise<Result<string, string>> => {
    console.log("SAVE USER CALLED", user);

  try {
    const doc = await UserModel.create(user);
    return ok(doc._id.toString());
  } catch (e) {
   if (e instanceof Error) {
    console.error("saveUser error:", e.message);
  } else {
    console.error("saveUser error unknown:", e);
  }
    return err("Erreur lors de la sauvegarde");
  }
};

