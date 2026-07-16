"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);

    try {
      await signOut({
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Logout fehlgeschlagen:", error);
      setIsSigningOut(false);
    }
  }

  return (
    <button
      className="btn"
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
    >
      {isSigningOut ? "Abmeldung läuft …" : "Logout"}
    </button>
  );
}