import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EmailVerificationManagement from "./EmailVerificationManagement";

const verifyEmailSingleMock = vi.fn();

vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "ops@example.com" },
    permissions: ["email_verification:read", "email_verification:write"],
    hasPermission: (permission: string) => permission === "email_verification:read" || permission === "email_verification:write",
  }),
}));

vi.mock("@/services/bankingService", () => ({
  bankingService: {
    verifyEmailSingle: (...args: unknown[]) => verifyEmailSingleMock(...args),
  },
  getBankingErrorMessage: (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback),
}));

describe("EmailVerificationManagement", () => {
  beforeEach(() => {
    verifyEmailSingleMock.mockReset();
  });

  it("renders enterprise email verification title", () => {
    render(<EmailVerificationManagement />);
    expect(screen.getByText("Email Verification Management")).toBeInTheDocument();
  });

  it("submits single verification when form is valid", async () => {
    verifyEmailSingleMock.mockResolvedValue({ verificationId: "evf_1", status: "pending" });
    render(<EmailVerificationManagement />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit single email verification" }));

    await waitFor(() => {
      expect(verifyEmailSingleMock).toHaveBeenCalledTimes(1);
    });
  });
});

