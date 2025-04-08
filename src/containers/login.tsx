"use client";

import { useState } from "react";
import { loginUser } from "@/actions/user";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await loginUser(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="mb-4 flex flex-col gap-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Email@naver.com"
            required
          />
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="flex items-center justify-center mb-4 gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded cursor-pointer`}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </form>
    </div>
  );
}
