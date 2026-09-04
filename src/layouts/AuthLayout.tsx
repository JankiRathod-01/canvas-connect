import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[linear-gradient(180deg,oklch(0.94_0.02_80)_0%,oklch(0.97_0.01_85)_48%,oklch(0.93_0.02_70)_100%)] px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,oklch(0.42_0.1_18_/_0.08),transparent)]" />
      <div className="relative z-10 w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
}
