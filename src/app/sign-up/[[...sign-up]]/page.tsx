import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Registracija | Burnout Tracker",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
