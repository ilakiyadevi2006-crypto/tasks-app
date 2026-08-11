import { Suspense } from "react";
import LoginPage from "./page.client";

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center text-sm text-slate-400">Loading...</div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
