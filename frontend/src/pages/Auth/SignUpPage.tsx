import { SignUp } from "@clerk/clerk-react";
import { useAuthShim } from "../../app/providers";

export default function SignUpPage() {
  const { hasClerk } = useAuthShim();
  return (
    <div className="flex justify-center py-8">
      {hasClerk ? (
        <SignUp signInUrl="/sign-in" />
      ) : (
        <div className="text-sm text-gray-600">
          Authentication is disabled in local dev (no Clerk key configured).
        </div>
      )}
    </div>
  );
}
