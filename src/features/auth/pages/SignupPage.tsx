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
import { SignupForm } from "@/features/auth/components/SignupForm";

export function SignupPage() {
  return (
    <div className="w-full">
      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto overflow-hidden rounded-full shadow-sm ring-1 ring-border/70">
            <GalleryMark className="size-14" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Create account
          </p>
          <CardTitle className="text-3xl">{APP_NAME}</CardTitle>
          <CardDescription>
            Create a Visitor or Artist account. Your details are saved through
            the gallery API. Admin accounts are created from the backend only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to={ROUTES.login}
          className="text-foreground hover:underline"
        >
          Sign in
        </Link>
        {" · "}
        <Link
          to={ROUTES.explore}
          className="hover:text-foreground hover:underline"
        >
          Explore artworks
        </Link>
      </p>
    </div>
  );
}
