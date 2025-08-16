import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useAutoUserCreation = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const hasAttemptedCreation = useRef(false);

  useEffect(() => {
    const createUserInBackend = async () => {
      // Only proceed if user is signed in, user object exists, and we haven't attempted creation yet
      if (!isSignedIn || !user || hasAttemptedCreation.current) {
        return;
      }

      try {
        // Mark that we've attempted creation to avoid multiple calls
        hasAttemptedCreation.current = true;

        // Get the Clerk token
        const token = await getToken();

        if (!token) {
          console.error("No token available for user creation");
          return;
        }

        // Call your backend endpoint to create the user
        const response = await fetch(
          `${BACKEND_URL}/users/signup-via-clerk-token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("User created successfully in backend:", data.message);
        } else if (response.status === 400) {
          // User already exists - this is fine
          console.log("User already exists in backend database");
        } else {
          console.error(
            "Failed to create user in backend:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error creating user in backend:", error);
        // Reset the flag so we can try again later if needed
        hasAttemptedCreation.current = false;
      }
    };

    createUserInBackend();
  }, [isSignedIn, user, getToken]);

  // Reset the flag when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      hasAttemptedCreation.current = false;
    }
  }, [isSignedIn]);
};
