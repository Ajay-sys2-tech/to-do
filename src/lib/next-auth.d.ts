import { type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Make the id optional
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    id?: string; // Make the id optional
  }
}
