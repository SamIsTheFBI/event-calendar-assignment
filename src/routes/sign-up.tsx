import { SignupForm } from "@/components/auth/sign-up";

export default function SignupRoute() {
    return (
        <main className="flex justify-center flex-col items-center w-full space-y-4">
            <SignupForm />
        </main>
    )
}