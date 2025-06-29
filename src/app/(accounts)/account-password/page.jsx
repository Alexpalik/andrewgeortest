"use client";

import React, { useState, useEffect } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import Label from "@/components/Label/Label";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { refreshAccessToken } from "@/app/lib/refreshToken";

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    passwordChange(oldPassword: $oldPassword, newPassword: $newPassword) {
      errors {
        field
        message
      }
      user {
        id
        email
      }
    }
  }
`;

const AccountPass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const client = useApolloClient();

  const [changePasswordMutation, { loading }] = useMutation(CHANGE_PASSWORD);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    let token = localStorage.getItem(
      process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_token"
    );

    if (!token) {
      token = await refreshAccessToken(client);
      if (!token) {
        setErrorMessage("Session expired. Please log in again.");
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const { data } = await changePasswordMutation({
        variables: { oldPassword, newPassword },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (data.passwordChange.errors.length > 0) {
        setErrorMessage(data.passwordChange.errors[0].message);
      } else {
        setSuccessMessage("✅ Password updated successfully!");
      }
    } catch (error) {
      console.error("Password update failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      <h2 className="text-2xl sm:text-3xl ">
        Update your password
      </h2>

      <div className="max-w-xl space-y-6">
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <Label>Current password</Label>
            <Input
              type="password"
              className="mt-1.5"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>New password</Label>
            <Input
              type="password"
              className="mt-1.5"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Confirm password</Label>
            <Input
              type="password"
              className="mt-1.5"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="pt-2">
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPass;
