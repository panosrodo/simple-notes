import { useAuth } from "@/hooks/useAuth";

export function AuthButton() {
  const { isAuthenticated, logoutUser, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logoutUser}
      className="
        text-sm 
        text-muted-foreground 
        underline 
        underline-offset-4
        hover:text-black
      "
    >
      Logout
    </button>
  );
}