'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import type { loginAction, signupAction } from './actions';

type Action = typeof loginAction | typeof signupAction;

interface Props {
  mode: 'login' | 'signup';
  action: Action;
}

export default function AuthForm({ mode, action }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const isSignup = mode === 'signup';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">
          magmag
        </h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => router.replace('/login')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                !isSignup
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => router.replace('/login?mode=signup')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                isSignup
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-3/4 block mx-auto my-8 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending
                ? isSignup
                  ? 'Creating account...'
                  : 'Logging in...'
                : isSignup
                  ? 'Create account'
                  : 'Log in'}
            </button>
          </form>

          {/* Alt link */}
          <p className="mt-5 text-center text-sm text-gray-500">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.replace('/login')}
                  className="text-gray-900 font-medium hover:underline"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.replace('/login?mode=signup')}
                  className="text-gray-900 font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
