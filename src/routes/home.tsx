import { SigninForm } from "@/components/auth/sign-in";

export default function HomeRoute() {
  return (
    <main className="flex justify-center flex-col items-center w-full space-y-4">
      <h1 className="text-4xl tracking-tighter font-bold mt-16">Event Calendar App</h1>
      <SigninForm />
    </main>
  )
}
