"use client";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Link from "next/link";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import authSync from "@/utils/authSync";

const LOGIN_MUTATION = gql`
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      errors {
        field
        message
      }
      user {
        id
        email
        firstName
      }
    }
  }
`;

const PageLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✅ Success message state
  const { signIn } = useSaleorAuthContext(); // Saleor Auth Hook

  const [loginUser, { loading }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
  
    try {
      const response = await loginUser({ variables: { email, password } });
  
      if (response.data.tokenCreate.errors.length > 0) {
        setError(response.data.tokenCreate.errors[0].message);
        return;
      }
  
      const { token, refreshToken, user } = response.data.tokenCreate;
  
      if (token) {
        await signIn({ email, password });
  
        // Use authSync to set token and broadcast to all tabs
        authSync.setToken(refreshToken);
  
        setSuccessMessage("🎉 Login successful! Welcome!");
  
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="nc-PageLogin" data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl md:text-5xl  text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>} {/* ✅ Success message */}

          {/* Login Form */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleLogin}>
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
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link href="/forgot-pass" className="text-sm text-green-600">
                  Forgot password?
                </Link>
              </span>
              <Input
                type="password"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Continue"}
            </ButtonPrimary>
          </form>

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? <Link className="text-green-600" href="/signup">Create an account</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
