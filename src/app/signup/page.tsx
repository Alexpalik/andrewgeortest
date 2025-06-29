"use client";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import { useRouter } from "next/navigation";

const SIGNUP_MUTATION = gql`
  mutation RegisterUser(
    $email: String!, 
    $password: String!, 
    $firstName: String!, 
    $lastName: String!, 
    $languageCode: LanguageCodeEnum!, 
    $redirectUrl: String!
  ) {
    accountRegister(input: { 
      email: $email, 
      password: $password, 
      firstName: $firstName, 
      lastName: $lastName, 
      languageCode: $languageCode, 
      redirectUrl: $redirectUrl 
    }) {
      user {
        id
        email
        firstName
        lastName
        languageCode
      }
      errors {
        field
        message
      }
    }
  }
`;


const loginSocials = [
  { name: "Continue with Facebook", href: "#", icon: facebookSvg },
  { name: "Continue with Twitter", href: "#", icon: twitterSvg },
  { name: "Continue with Google", href: "#", icon: googleSvg },
];

const PageSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [languageCode, setLanguageCode] = useState("EN");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [registerUser, { data, loading }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
  
    const redirectUrl = `${window.location.origin}/account-confirmation`;
  
    const response = await registerUser({ 
      variables: { 
        email, 
        password, 
        firstName, 
        lastName, 
        languageCode: languageCode as any, 
        redirectUrl 
      } 
    });
  
    if (response.data.accountRegister.errors.length > 0) {
      setError(response.data.accountRegister.errors[0].message);
    } else {
      router.push("/login"); 
    }
  };
  

  return (
    <div className="nc-PageSignUp" data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl md:text-5xl  text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>

        <div className="max-w-md mx-auto space-y-6">
          {/* Social Login Buttons */}
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full  bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image
                  sizes="40px"
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>

          {/* OR Divider */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>

          {/* Signup Form */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSignup}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  First Name
                </span>
                <Input
                  type="text"
                  placeholder="John"
                  className="mt-1"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Last Name
                </span>
                <Input
                  type="text"
                  placeholder="Doe"
                  className="mt-1"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
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
              <span className="text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input
                type="password"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Language
              </span>
              <select
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                required
              >
                <option value="EN">English</option>
                <option value="EL">Greek (Ελληνικά)</option>
              </select>
            </label>

            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Continue"}
            </ButtonPrimary>
          </form>

          {/* Already have an account? */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account?{" "}
            <Link className="text-green-600" href="/login">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
