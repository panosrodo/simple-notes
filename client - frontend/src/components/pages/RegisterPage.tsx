import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type RegisterFields, registerSchema } from "@/schemas/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser, loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    try {
      // 1) create user
      await registerUser(data);

      // 2) auto login to get token
      await loginUser({ username: data.name, password: data.password });

      toast.success("Account created");
      navigate("/notes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">SignUp</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm"></Label>
            <Input id="name" placeholder="Name" className="h-11" {...register("name")} />
            {errors.name && <div className="text-red-600 text-sm">{errors.name.message}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm"></Label>
            <Input
              id="email"
              placeholder="Email"
              className="h-11"
              inputMode="email"
              {...register("email")}
            />
            {errors.email && <div className="text-red-600 text-sm">{errors.email.message}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm"></Label>

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
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}