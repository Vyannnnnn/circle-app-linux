import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { registerUser, clearError } from "../redux/slices/authSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import type { RegisterForm } from "@/types/auth.types";
import type { ValidationErrors } from "@/types/ValidationError.types";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    full_Name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field when user starts typing
    const fieldName = name as keyof typeof validationErrors;
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: ValidationErrors = {};

    // Validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.full_Name.trim()) {
      newErrors.full_Name = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    try {
      await dispatch(
        registerUser({
          username: formData.username,
          full_Name: formData.full_Name,
          email: formData.email,
          password: formData.password,
        }),
      ).unwrap();
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="bg-black">
        <div className="flex flex-col items-center justify-center px-6  py-8 mx-auto">
          <Link
            to="/"
            className="flex items-center mb-6 text-2xl font-semibold text-white rounded-full"
          >
            <img
              className="w-10 h-10 mr-2 rounded-full object-cover"
              src={logo}
              alt="logo"
            />
            Triple
          </Link>
          <div className="w-full bg-[#202327] rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                Create an account
              </h1>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    className={`bg-gray-50 border ${
                      validationErrors.username
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="Joko"
                  />
                  {validationErrors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="full_Name"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Your full name
                  </label>
                  <input
                    type="text"
                    name="full_Name"
                    id="full_Name"
                    value={formData.full_Name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`bg-gray-50 border ${
                      validationErrors.full_Name
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="Joko"
                  />
                  {validationErrors.full_Name && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.full_Name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`bg-gray-50 border ${
                      validationErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="joko@example.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="••••••••"
                    className={`bg-gray-50 border ${
                      validationErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  />
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirm-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="••••••••"
                    className={`bg-gray-50 border ${
                      validationErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full cursor-pointer text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#1d9bf0] hover:bg-[#1a8cd8]"
                  } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Creating account...
                    </>
                  ) : (
                    "Create an account"
                  )}
                </Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
