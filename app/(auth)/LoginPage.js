"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { saveData } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const { setData, setError, error } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 LOCAL loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // 🔄 REMOVE AUTO LOGIN CHECK (FIXED)
  // =========================
  useEffect(() => {
    // ✅ Just allow UI to render
    setChecking(false);
  }, []);

  // =========================
  // 🔐 LOGIN HANDLER
  // =========================
  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!email?.trim() || !password?.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let formattedEmail = email.trim().toLowerCase();

      if (!formattedEmail.includes("@")) {
        formattedEmail = `${formattedEmail}@srmist.edu.in`;
      }

      if (!formattedEmail.endsWith("@srmist.edu.in")) {
        formattedEmail =
          formattedEmail.split("@")[0] + "@srmist.edu.in";
      }

      const res = await loginUser({
        email: formattedEmail,
        password,
      });

      if (!res || !res.success) {
        throw new Error("Authentication failed");
      }

      setData(res.data);
      saveData(res.data);

      if (res.session_id) {
        localStorage.setItem("session_id", res.session_id);
      }

      // 🔥 allow animation to be visible
      setTimeout(() => {
        router.replace("/dashboard");
      }, 700);

    } catch (err) {
      setError(err.message || "Login failed");
      setIsSubmitting(false);
    }
  };

  // =========================
  // ⌨️ ENTER KEY
  // =========================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleLogin();
    }
  };

  // =========================
  // ⏳ LOADING SCREEN
  // =========================
  if (checking) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">
          Checking session...
        </div>
      </div>
    );
  }

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 bg-transparent">
      <div 
        className="w-full max-w-sm rounded-[24px] p-8 space-y-7 border backdrop-blur-xl transition-all duration-700"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.45)",
          borderColor: "var(--accent)",
          boxShadow: "0 0 30px color-mix(in srgb, var(--accent) 40%, transparent)",
        }}
      >

        {/* Premium Header */}
        <div className="flex justify-center mb-2">
          <h1 className="flex items-center text-[1.4rem] leading-none tracking-tight" style={{ color: "var(--text)" }}>
            <span
              className="w-10 h-10 flex items-center justify-center rounded-[12px] text-xl font-black shadow-md shadow-black/20"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            >
              A
            </span>
            <span className="font-medium ml-[2px]">cademia</span>
            <span className="font-bold ml-[2px]">DeX</span>
          </h1>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Sign in to your intelligent workspace
          </p>
        </div>

        {/* Email */}
        <input
          className="
            p-3.5 w-full rounded-xl outline-none transition-all
            focus:ring-2 placeholder:opacity-50
          "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "var(--text)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
          }}
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Password */}
        <div className="relative">
          <input
            className="
              p-3.5 w-full rounded-xl outline-none transition-all
              focus:ring-2 pr-12 placeholder:opacity-50
            "
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "var(--text)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
            }}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium transition"
            style={{ color: "var(--muted)" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* BUTTON WITH LOADER */}
        <button
          onClick={handleLogin}
          disabled={isSubmitting}
          className={`
            w-full py-3.5 rounded-xl font-bold text-[15px]
            flex items-center justify-center
            active:scale-[0.98] transition-all shadow-lg
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
          `}
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-fg)"
          }}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}