import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex justify-center py-8">
      <SignUp signInUrl="/sign-in" />
    </div>
  );
}
