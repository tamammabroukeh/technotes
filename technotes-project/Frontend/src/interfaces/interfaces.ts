export interface IProps {
  company: string;
  aboutTxt: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (type: boolean) => void;
}
export interface IUser {
  userName: string;
  email: string;
  address: string;
  password: string;
  phone: string;
}
export interface IUserDetails {
  setUserData: (user: IUser) => void;
  user: IUser;
}
export interface IFormInputDetails {
  label: string;
  id: string;
  name: keyof IUser;
  type: string;
}
