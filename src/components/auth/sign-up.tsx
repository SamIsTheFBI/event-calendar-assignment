import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Credentials } from "./types"
import { useState } from "react"

export function SignupForm() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confPassword, setConfPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const navigate = useNavigate()

  const handleSignUp = async () => {
    if (confPassword !== password) {
      setError('Passwords must match!')
      return
    }
    const credentials: Credentials = {
      username: username,
      password: password,
    }

    const res = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    // console.log(res)

    if (res.ok) {
      setError('')
      navigate('/')
    } else {
      setError(res.statusText)
      console.error('Sign up failed', res.statusText)
    }
  }

  return (
    <Card className="w-full max-w-sm max-sm:border-0 max-sm:shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your credentials below to sign up.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input id="username" name="username" type="text" placeholder="John Doe" required onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Confirm password</Label>
            <Input className={confPassword !== password && 'text-red-500 border-red-500 outline-red-500' || ''} id="password-conf" name="password-conf" type="password" required onChange={(e) => setConfPassword(e.target.value)} />
          </div>
          <Button
            onClick={handleSignUp} className="w-full">Sign up</Button>
          <div className={error === '' && 'hidden' || 'text-red-500'}>{error}</div>
        </div>
      </CardContent>
      <CardFooter className="grid gap-2">
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={"/sign-up"} className="underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
