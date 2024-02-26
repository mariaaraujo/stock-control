"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { UserFormSchema, UserFormType, setUser } from "./form";
import { Loading } from "../../../Loading";
import axios from "axios";
import { RoleType } from "@/enum/roleType";

interface NormalizedValues {
  name: string;
  login: string;
  password: string;
  role: string;
}

interface AddUserProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  refresh(): Promise<void>;
  setUserId?: Dispatch<SetStateAction<string>>;
  userId?: string;
}
export function AddUser({
  openModal,
  setOpenModal,
  refresh,
  userId,
  setUserId,
}: AddUserProps) {
  const [showLoading, setShowLoading] = useState(false);

  const roleType = RoleType;

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<UserFormType>({
    resolver: yupResolver(UserFormSchema),
  });

  async function getUserById() {
    setShowLoading(true);
    try {
      const { data, status } = await axios.get(
        `/api/user/getById?userId=${userId}`
      );
      if (status == 200) {
        setUser(data, setValue);
      }
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      console.error(error);
    }
  }

  async function createUser(values: NormalizedValues) {
    try {
      const { status } = await axios.post("/api/user/create", {
        ...values,
        password: values.password == "" ? "Mudar123" : values?.password,
      });

      if (status == 200) {
        refresh();
        setOpenModal(false);
        reset();
      }

      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      console.error(error);
    }
  }

  async function updateUser(values: NormalizedValues) {
    setShowLoading(true);
    try {
      const { status } = await axios.patch(
        `/api/user/update?userId=${userId}`,
        values
      );
      if (status == 200) {
        reset();
        refresh();
        setUserId && setUserId("");
        setOpenModal(false);
      }

      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      console.error(error);
    }
  }

  async function onSubmit(values: UserFormType) {
    setShowLoading(true);
    try {
      if (userId) {
        await updateUser(values);
      } else {
        await createUser(values);
      }
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    if (userId) {
      (async () => {
        getUserById();
      })();
    }
  }, [userId]);

  return (
    <>
      {showLoading && <Loading />}

      <Dialog placeholder="" open={openModal} handler={setOpenModal}>
        <DialogHeader placeholder="">
          {userId ? "Editar" : "Adicionar"} Usuário
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="flex flex-col gap-4" placeholder="">
            <Input
              crossOrigin=""
              color="gray"
              label="Nome"
              {...register("name")}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.name?.message ?? ""}
            </div>
            <Input
              crossOrigin=""
              color="gray"
              label="Login"
              {...register("login")}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.login?.message ?? ""}
            </div>
            <Input
              crossOrigin=""
              color="gray"
              label="Senha"
              {...register("password")}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.password?.message ?? ""}
            </div>

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select placeholder="" label="Selecione um cargo" {...field}>
                  {Object.entries(roleType).map(([key, value]) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.role?.message ?? ""}
            </div>
          </DialogBody>
          <DialogFooter placeholder="">
            <Button
              placeholder=""
              variant="text"
              color="red"
              onClick={() => {
                reset();
                setOpenModal(false);
              }}
              className="mr-1"
            >
              <span>Cancelar</span>
            </Button>
            <Button
              type="submit"
              placeholder=""
              variant="gradient"
              color="green"
            >
              <span>{userId ? "Editar" : "Adicionar"}</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
