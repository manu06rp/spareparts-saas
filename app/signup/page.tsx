'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase'

export default function SignupPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Signup successful')
      router.push('/login')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h1 className="text-3xl font-bold text-blue-600 text-center">
          Create Account
        </h1>

        <div className="space-y-4 mt-6">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Sign Up
          </button>

          <p className="text-center">

            Already have an account?{' '}

            <Link
              href="/login"
              className="text-blue-600"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </main>
  )
}