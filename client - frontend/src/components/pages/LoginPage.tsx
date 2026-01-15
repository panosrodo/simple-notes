import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type LoginFields, loginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/services/api.login";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { setCookie } from "@/utils/cookies";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      const res = await login(data); // { token }

      // σώζουμε token σε cookie για να το διαβάζει το api.note.ts
      setCookie("access_token", res.token);

      toast.success("Login successful");
      navigate("/notes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto mt-12 p-8 border rounded-md space-y-4"
      autoComplete="off"
    >
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} />
        {errors.username && (
          <div className="text-red-600 text-sm">{errors.username.message}</div>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" {...register("password")} />
        {errors.password && (
          <div className="text-red-600 text-sm">{errors.password.message}</div>
        )}
      </div>

      <Button disabled={isSubmitting} className="w-full" type="submit">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}