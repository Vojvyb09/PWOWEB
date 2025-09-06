
'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginAction } from '@/lib/actions';
import type { LoginState } from '@/lib/actions';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

const PwoLogo = () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
        <rect width="24" height="24" rx="4" fill="hsl(var(--primary))"/>
        <path d="M8 8V16H10V12H12C14.2091 12 16 10.2091 16 8H8Z" fill="white"/>
    </svg>
  );

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const initialState: LoginState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(loginAction, initialState);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/login-background.jpg"
          alt="Industrial automation"
          fill
          priority
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="industrial automation"
        />
        <div className="absolute bottom-8 left-8 right-8 rounded-lg bg-background/80 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold">PWO Automation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Automate your processes with ease and efficiency. Our system helps you optimize workflows and focus on what truly matters.
            </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-8 p-4">
          <div className="grid gap-2 text-center">
            <div className="mx-auto">
              <PwoLogo />
            </div>
            <h1 className="text-3xl font-bold">PWO Automation</h1>
            <p className="text-balance text-muted-foreground">Login to the automation system</p>
          </div>
          <form action={dispatch} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                defaultValue="Vojtech.Vybiral@pwo-group.com"
              />
               {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="text-sm font-medium text-destructive" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  required
                  defaultValue="password123"
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{passwordVisible ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>
              {state.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className="text-sm font-medium text-destructive" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
            </div>

            {state.errors?.server && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{state.errors.server}</p>
              </div>
            )}
            
            <LoginButton />
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Secure access to the PWO Automation system.
            <br />© {new Date().getFullYear()} PWO Automation. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
