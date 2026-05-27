import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export async function updateCountdownEndsById(
  userId: string,
  countdownEnds: Date,
): Promise<Result<Date, string>> {
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { countdownEnds: countdownEnds },
      { new: true },
    );

    if (!user) return err("USER_NOT_FOUND");

    return ok(user.countdownEnds);
  } catch (e) {
    console.error("updateCountdownEndsById error:", e);
    return err("DATABASE_ERROR");
  }
}