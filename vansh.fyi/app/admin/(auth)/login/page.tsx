import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-8 text-3xl font-light tracking-tighter font-geist text-white">Sign in</h1>
      <LoginForm />
    </main>
  );
}
