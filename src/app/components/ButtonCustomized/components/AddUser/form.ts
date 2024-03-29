import { User } from "@/dtos";
import { UseFormSetValue } from "react-hook-form";
import * as yup from "yup";

export type UserFormType = {
  name: string;
  login: string;
  role: string;
  password: string;
};

export const UserFormSchema = yup.object({
  name: yup.string().required("O Nome é obrigatório"),
  login: yup.string().required("O Login é obrigatório"),
  role: yup.string().required("O Cargo é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

export const setUser = (
  user: User,
  setValue: UseFormSetValue<UserFormType>
) => {
  setValue("name", user.name);
  setValue("login", user.login);
  setValue("password", user.password);
  setValue("role", user.role);
};
