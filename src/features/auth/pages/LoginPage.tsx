import { Link } from "react-router-dom";
import { GalleryMark } from "@/components/common/GalleryMark";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { LoginForm } from "@/features/auth/components/LoginForm";

export function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-primary/20 bg-background">
            <GalleryMark className="size-6" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Sign in
          </p>
          <CardTitle className="text-3xl">{APP_NAME}</CardTitle>
          <CardDescription>
            Sign in with your gallery account. Admin, Artist, and Visitor users
            are redirected to their own landing page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        New visitor or artist?{" "}
        <Link
          to={ROUTES.signup}
          className="text-foreground hover:underline"
        >
          Create an account
        </Link>
        {" · "}
        <Link
          to={ROUTES.root}
          className="hover:text-foreground hover:underline"
        >
          Home
        </Link>
      </p>
    </div>
  );
}
