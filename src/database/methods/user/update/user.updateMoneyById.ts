import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export async function updateMoneyById(
  userId: string,
  amount: number,
): Promise<Result<number, string>> {
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { money: amount },
      { new: true },
    );

    if (!user) return err("USER_NOT_FOUND");

    return ok(user.money);
  } catch (e) {
    console.error("updateMoneyById error:", e);
    return err("DATABASE_ERROR");
  }
}