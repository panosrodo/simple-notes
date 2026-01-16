import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type LoginFields, loginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      await loginUser(data);
      toast.success("Login successful");
      navigate("/notes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm">
            </Label>
            <Input
              id="username"
              placeholder="Username"
              className="h-11"
              {...register("username")}
            />
            {errors.username && (
              <div className="text-red-600 text-sm">{errors.username.message}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
            </Label>

            <div className="relative">
              <Input
                id="password"
                placeholder="Password"
                className="h-11 pr-10"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {errors.password && (
              <div className="text-red-600 text-sm">{errors.password.message}</div>
            )}
          </div>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Not registered yet?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}