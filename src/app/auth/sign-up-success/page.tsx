import Link from "next/link";
import { Zap, Mail, ArrowRight } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <Zap className="text-primary-foreground" size={20} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-foreground">
            Token<span className="text-primary">Lens</span>
          </span>
        </Link>

        <div className="p-8 bg-card border border-border rounded-2xl space-y-6">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="text-primary" size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              Check your email
            </h1>
            <p className="text-muted-foreground font-medium">
              We sent you a confirmation link. Please check your email to verify
              your account and complete the sign-up process.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <Link
              href="/auth/login"
              className="w-full py-3 bg-primary text-primary-foreground font-black uppercase rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight size={18} />
            </Link>

            <p className="text-xs text-muted-foreground">
              {"Didn't receive the email?"}{" "}
              <Link
                href="/auth/sign-up"
                className="font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
