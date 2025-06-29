"use client";

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { gql, useMutation } from "@apollo/client";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Link from "next/link";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import authSync from "@/utils/authSync";

// GraphQL Mutations
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

const REGISTER_MUTATION = gql`
  mutation AccountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user {
        id
        email
      }
      errors {
        field
        message
      }
    }
  }
`;

const FORGOT_PASSWORD_MUTATION = gql`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        field
        message
      }
    }
  }
`;

const AuthModal = ({ isOpen, onClose, defaultTab = "login", onSuccess }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { signIn } = useSaleorAuthContext();
  const [loginUser] = useMutation(LOGIN_MUTATION);
  const [registerUser] = useMutation(REGISTER_MUTATION);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setErrors({});
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (activeTab !== "forgot") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (activeTab === "signup") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await loginUser({
        variables: { email: formData.email, password: formData.password }
      });

      if (response.data.tokenCreate.errors.length > 0) {
        const errorMessage = response.data.tokenCreate.errors[0].message;
        setErrors({ form: errorMessage });
        return;
      }

      const { token, refreshToken } = response.data.tokenCreate;

      if (token) {
        await signIn({ email: formData.email, password: formData.password });
        
        // Use authSync to set token and broadcast to all tabs
        authSync.setToken(refreshToken);

        toast.success("🎉 Login successful! Welcome!");
        
        if (onSuccess) onSuccess();
        handleClose();
      }
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await registerUser({
        variables: {
          input: {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          }
        }
      });

      if (response.data.accountRegister.errors.length > 0) {
        const errorMessage = response.data.accountRegister.errors[0].message;
        setErrors({ form: errorMessage });
        return;
      }

      toast.success("🎉 Account created successfully! Please log in.");
      setActiveTab("login");
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "", firstName: "", lastName: "" }));
    } catch (err) {
      console.error("Signup failed:", err);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword({
        variables: {
          email: formData.email,
          redirectUrl: `${window.location.origin}/reset-password`
        }
      });

      if (response.data.requestPasswordReset.errors.length > 0) {
        const errorMessage = response.data.requestPasswordReset.errors[0].message;
        setErrors({ form: errorMessage });
        return;
      }

      toast.success("Password reset email sent! Check your inbox.");
      handleClose();
    } catch (err) {
      console.error("Forgot password failed:", err);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch (activeTab) {
      case "login":
        handleLogin();
        break;
      case "signup":
        handleSignup();
        break;
      case "forgot":
        handleForgotPassword();
        break;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {activeTab === "login" && "Sign In"}
                    {activeTab === "signup" && "Create Account"}
                    {activeTab === "forgot" && "Reset Password"}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Tab Navigation */}
                {activeTab !== "forgot" && (
                  <div className="flex space-x-1 bg-gray-100 p-1 mb-6">
                    <button
                      onClick={() => handleTabChange("login")}
                      className={`w-full py-2.5 text-sm font-medium leading-5 transition-all ${
                        activeTab === "login"
                          ? "bg-white shadow"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                      style={activeTab === "login" ? { color: "rgb(6, 59, 103)" } : {}}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleTabChange("signup")}
                      className={`w-full py-2.5 text-sm font-medium leading-5 transition-all ${
                        activeTab === "signup"
                          ? "bg-white shadow"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                      style={activeTab === "signup" ? { color: "rgb(6, 59, 103)" } : {}}
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {errors.form && (
                    <div className="p-3 text-sm text-red-600 bg-red-50">
                      {errors.form}
                    </div>
                  )}

                  {/* First Name - Signup only */}
                  {activeTab === "signup" && (
                    <div>
                      <Input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                  )}

                  {/* Last Name - Signup only */}
                  {activeTab === "signup" && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Password - Not for forgot password */}
                  {activeTab !== "forgot" && (
                    <div>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>
                  )}

                  {/* Confirm Password - Signup only */}
                  {activeTab === "signup" && (
                    <div>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <ButtonPrimary
                    type="submit"
                    className="w-full"
                    loading={loading}
                    disabled={loading}
                  >
                    {activeTab === "login" && "Sign In"}
                    {activeTab === "signup" && "Create Account"}
                    {activeTab === "forgot" && "Send Reset Email"}
                  </ButtonPrimary>

                  {/* Links */}
                  <div className="text-center space-y-2">
                    {activeTab === "login" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleTabChange("forgot")}
                          className="text-sm hover:opacity-80"
                          style={{ color: "rgb(6, 59, 103)" }}
                        >
                          Forgot your password?
                        </button>
                        <p className="text-sm text-gray-600">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={() => handleTabChange("signup")}
                            className="hover:opacity-80"
                            style={{ color: "rgb(6, 59, 103)" }}
                          >
                            Sign up
                          </button>
                        </p>
                      </>
                    )}

                    {activeTab === "signup" && (
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => handleTabChange("login")}
                          className="hover:opacity-80"
                          style={{ color: "rgb(6, 59, 103)" }}
                        >
                          Sign in
                        </button>
                      </p>
                    )}

                    {activeTab === "forgot" && (
                      <button
                        type="button"
                        onClick={() => handleTabChange("login")}
                        className="text-sm hover:opacity-80"
                        style={{ color: "rgb(6, 59, 103)" }}
                      >
                        Back to sign in
                      </button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal; 