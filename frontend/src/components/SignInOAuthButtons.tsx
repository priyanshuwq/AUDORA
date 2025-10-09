import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

type Props = {
	compact?: boolean;
};

const SignInOAuthButtons = ({ compact = false }: Props) => {
	const { signIn, isLoaded } = useSignIn();

	if (!isLoaded) {
		return null;
	}

	const signInWithGoogle = () => {
		signIn.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	if (compact) {
		return (
			<Button
				onClick={signInWithGoogle}
				variant="ghost"
				className="h-9 w-9 p-0 flex items-center justify-center"
				title="Sign in with Google"
			>
				<img src="/google.png" alt="Google" className="w-5 h-5" />
			</Button>
		);
	}

	return (
		<Button onClick={signInWithGoogle} variant={"secondary"} className="w-full text-white border-zinc-200 h-11">
			<img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
			Continue with Google
		</Button>
	);
};

export default SignInOAuthButtons;
