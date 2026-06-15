import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Prijava | Burnout Tracker",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
