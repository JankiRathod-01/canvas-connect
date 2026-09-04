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
            Administration
          </p>
          <CardTitle className="text-3xl">{APP_NAME}</CardTitle>
          <CardDescription>
            Sign in to manage the gallery collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link
          to={ROUTES.root}
          className="hover:text-foreground hover:underline"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}
