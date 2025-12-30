export type UserRole = "Super Admin" | "Admin";

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

