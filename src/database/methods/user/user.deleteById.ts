import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const deleteById = async (
  userId: string,
): Promise<Result<void, string>> => {
  try {
    const result = await UserModel.findByIdAndDelete(userId);

    if (!result) {
      return err("USER_NOT_FOUND");
    }

    return ok(undefined);
  } catch (error) {
    if (error instanceof Error) {
      console.error("deleteByIdUser error:", error.message);
    } else {
      console.error("deleteByIdUser error unknown:", error);
    }
    return err("USER_DELETE_ERROR");
  }
};