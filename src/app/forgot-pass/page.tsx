"use client";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Link from "next/link";

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        field
        message
      }
    }
  }
`;

const PageForgotPass = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data } = await requestPasswordReset({
        variables: {
          email,
          redirectUrl: `${window.location.origin}/reset-password`,
        },
      });

      if (data.requestPasswordReset.errors.length > 0) {
        setErrorMessage(data.requestPasswordReset.errors[0].message);
      } else {
        setSuccessMessage("✅ If your email exists, a reset link has been sent.");
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mb-24 lg:mb-32">
      <header className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 lg:mb-20">
        <h2 className="mt-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%]  text-neutral-900 dark:text-neutral-100 justify-center">
          Forgot password
        </h2>
        <span className="block text-sm mt-4 text-neutral-700 sm:text-base dark:text-neutral-200">
          Enter your email to receive a password reset link.
        </span>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        {/* FORM */}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleForgotPassword}>
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">Email address</span>
            <Input
              type="email"
              placeholder="example@example.com"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </ButtonPrimary>
        </form>

        {/* ==== */}
        <span className="block text-center text-neutral-700 dark:text-neutral-300">
          Go back for{" "}
          <Link href="/login" className="text-green-600">
            Sign in
          </Link>{" "}
          /{" "}
          <Link href="/signup" className="text-green-600">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default PageForgotPass;
