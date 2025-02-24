export interface IdentificationParams {
  isPersonal: boolean;
  userInfo?: {
    firstName: string | undefined;
    username: string;
    id: string;
  };
}
