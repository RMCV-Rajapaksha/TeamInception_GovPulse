import { SignIn } from "@clerk/clerk-react";
import { useAuthShim } from "../../app/providers";

export default function SignInPage() {
  const { hasClerk } = useAuthShim();
  return (
    <div className="flex justify-center py-8">
      {hasClerk ? (
        <SignIn signUpUrl="/sign-up" />
      ) : (
        <div className="text-sm text-gray-600">
          Authentication is disabled in local dev (no Clerk key configured).
        </div>
      )}
    </div>
  );
}
