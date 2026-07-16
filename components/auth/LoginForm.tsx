"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type SessionResponse = {
  user?: {
    role?: "candidate" | "company" | "admin";
  };
};

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      const email = formData
        .get("email")
        ?.toString()
        .trim()
        .toLowerCase();

      const password = formData
        .get("password")
        ?.toString();

      if (!email || !password) {
        setErrorMessage(
          "Bitte geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein."
        );
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setErrorMessage(
          "E-Mail-Adresse oder Passwort ist nicht korrekt."
        );
        return;
      }

      const sessionResponse = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      if (!sessionResponse.ok) {
        throw new Error("Session konnte nicht geladen werden.");
      }

      const session =
        (await sessionResponse.json()) as SessionResponse;

      const redirectUrl =
        session.user?.role === "admin"
          ? "/admin/dashboard"
          : session.user?.role === "company"
            ? "/company/dashboard"
            : session.user?.role === "candidate"
              ? "/candidate/dashboard"
              : null;

      if (!redirectUrl) {
        throw new Error("Benutzerrolle fehlt.");
      }

      window.location.assign(redirectUrl);
    } catch (error) {
      console.error("Login fehlgeschlagen:", error);

      setErrorMessage(
        "Die Anmeldung konnte momentan nicht durchgeführt werden."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      <Input
        name="email"
        type="email"
        placeholder="E-Mail"
        autoComplete="email"
        required
      />

      <Input
        name="password"
        type="password"
        placeholder="Passwort"
        autoComplete="current-password"
        required
      />

      <div className="text-right text-sm">
        <a
          href="/forgot-password"
          className="text-teal-600 hover:text-teal-700 hover:underline"
        >
          Passwort vergessen?
        </a>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Anmeldung läuft …" : "Einloggen"}
      </Button>
    </form>
  );
}