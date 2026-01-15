import { useEffect, useState } from "react";
import type { LoginFields } from "@/schemas/login";
import { login } from "@/services/api.login";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";
import { AuthContext } from "@/context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null); // μένει null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("access_token");
    setAccessToken(token ?? null);
    setTenantId(null); // δεν έχουμε tenant στο backend
    setLoading(false);
  }, []);

  const loginUser = async (fields: LoginFields) => {
    const res = await login(fields); // επιστρέφει { token }

    setCookie("access_token", res.token, {
      expires: 1,
      sameSite: "Lax",
      secure: false, // production → true
      path: "/",
    });

    setAccessToken(res.token);
    setTenantId(null);
  };

  const logoutUser = () => {
    deleteCookie("access_token");
    setAccessToken(null);
    setTenantId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        tenantId,        // 👈 υπάρχει αλλά απλά δεν χρησιμοποιείται
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};