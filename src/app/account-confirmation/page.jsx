"use client";

import { useEffect, useState, Suspense } from "react";
import { gql, useMutation } from "@apollo/client";
import { useSearchParams, useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

const CONFIRM_ACCOUNT_MUTATION = gql`
  mutation ConfirmAccount($email: String!, $token: String!) {
    confirmAccount(email: $email, token: $token) {
      errors {
        field
        message
      }
    }
  }
`;

const AccountConfirmationContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [confirmAccount, { loading }] = useMutation(CONFIRM_ACCOUNT_MUTATION);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email || !token) {
      setError("Invalid confirmation link. Please check your email.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await confirmAccount({ variables: { email, token } });

        if (response.data.confirmAccount.errors.length > 0) {
          setError(response.data.confirmAccount.errors[0].message);
        } else {
          setMessage("Your account has been confirmed successfully! Redirecting...");
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, [email, token, confirmAccount, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="p-6 max-w-md bg-white dark:bg-neutral-800  shadow-md">
        <h2 className="text-2xl  text-center text-neutral-900 dark:text-neutral-100">
          Account Confirmation
        </h2>

        {loading && <p className="text-sm text-center mt-4">Verifying...</p>}
        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="mt-6 text-center">
          <ButtonPrimary onClick={() => router.push("/login")} disabled={loading}>
            Go to Login
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

const AccountConfirmationPage = () => {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <AccountConfirmationContent />
    </Suspense>
  );
};

export default AccountConfirmationPage;
