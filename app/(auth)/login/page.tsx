import AuthForm from "./AuthForm";
import { loginAction, signupAction } from "./actions";

interface Props {
  searchParams: Promise<{ mode?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { mode } = await searchParams;
  const isSignup = mode === "signup";
  return (
    <AuthForm
      mode={isSignup ? "signup" : "login"}
      action={isSignup ? signupAction : loginAction}
    />
  );
}
