import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";
import { ClerkProvider } from "@clerk/clerk-react";

// Simple shim to allow the app to run without a Clerk key in local/dev
type AuthShim = { hasClerk: boolean };
const AuthShimContext = createContext<AuthShim>({ hasClerk: false });
export const useAuthShim = () => useContext(AuthShimContext);

const PUBLISHABLE_KEY: string | undefined = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AppProviders({ children }: PropsWithChildren) {
  const hasClerk = Boolean(PUBLISHABLE_KEY);
  const valueTrue = useMemo(() => ({ hasClerk: true }), []);
  const valueFalse = useMemo(() => ({ hasClerk: false }), []);
  if (hasClerk) {
    return (
      <AuthShimContext.Provider value={valueTrue}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY!}>{children}</ClerkProvider>
      </AuthShimContext.Provider>
    );
  }

  // No Clerk key: provide shim so components can render in dev
  return <AuthShimContext.Provider value={valueFalse}>{children}</AuthShimContext.Provider>;
}

export default AppProviders;
