import { ERole } from "auth/enums/roles.enum";

export interface DecodedUser {
  userId: number;
  role: ERole;
}
