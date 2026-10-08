'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '../../actions';

const input = 'w-full rounded-xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 outline-none transition placeholder:text-white/30 focus:ring-white/30';

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-black/30 p-6 ring-1 ring-white/10 backdrop-blur-lg">
      <label className="block">
        <span className="mb-2 block text-sm text-white/50">Email</span>
        <input name="email" type="email" required autoComplete="username" autoFocus className={input} />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-white/50">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="w-full rounded-full bg-white px-4 py-3 text-sm font-medium text-black/80 transition hover:bg-white/80 active:scale-95 disabled:opacity-50">
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
