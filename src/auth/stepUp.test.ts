import { describe, expect, it, vi } from "vitest";
import { runWithStepUpRetryUsing } from "@/auth/stepUp";

describe("runWithStepUpRetryUsing", () => {
  it("retries exactly once after a 403 for high-risk operations", async () => {
    const op = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce({ status: 403 })
      .mockResolvedValueOnce("ok");
    const stepUp = vi.fn<() => Promise<void>>().mockResolvedValue();

    const result = await runWithStepUpRetryUsing(op, true, stepUp);

    expect(result).toBe("ok");
    expect(stepUp).toHaveBeenCalledTimes(1);
    expect(op).toHaveBeenCalledTimes(2);
  });

  it("does not trigger step-up for non-high-risk operations", async () => {
    const error = { status: 403 };
    const op = vi.fn<() => Promise<string>>().mockRejectedValue(error);
    const stepUp = vi.fn<() => Promise<void>>().mockResolvedValue();

    await expect(runWithStepUpRetryUsing(op, false, stepUp)).rejects.toBe(error);
    expect(stepUp).not.toHaveBeenCalled();
    expect(op).toHaveBeenCalledTimes(1);
  });
});

