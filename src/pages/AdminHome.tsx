import { APP_NAME } from "@/constants/app";

export function AdminHomePage() {
  return (
    <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Welcome to {APP_NAME}
      </h1>
    </section>
  );
}
