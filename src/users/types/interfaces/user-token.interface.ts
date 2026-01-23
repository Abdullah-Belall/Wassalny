import { UserTypeEnum } from "../enums/user-type.enum";

export interface UserTokenInterface {
  id: string;
  index: number;
  phone: string;
  type: UserTypeEnum;
}
