import { createContext } from "react"
import type { LoginFields } from "@/schemas/login"
import type { RegisterFields } from "@/schemas/register"

export type AuthContextProps = {
  isAuthenticated: boolean
  accessToken: string | null
  tenantId: string | null
  loginUser: (fields: LoginFields) => Promise<void>
  registerUser: (fields: RegisterFields) => Promise<void>
  logoutUser: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
)