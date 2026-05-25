// database/methods/user.methods.ts
import { Result, ok, err } from "@shared/Result";
import { UserModel, UserDocument } from "@database/models/user.model";

export const updateById = async (
  id: string,
  updateData: Partial<UserDocument>,
): Promise<Result<UserDocument | null, string>> => {
  try {
    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });
    return ok(user);
  } catch (e: any) {
    console.error("updateUserById error:", JSON.stringify(e, null, 2));
    return err("Erreur lors de la mise à jour de l'utilisateur");
  }
};
