import { SignupForm } from "@/components/auth/sign-up";

export default function SignupRoute() {
  return (
    <main className="flex justify-center flex-col items-center w-full space-y-4">
      <h1 className="text-4xl tracking-tighter font-bold mt-16">Event Calendar App</h1>
      <SignupForm />
    </main>
  )
}
