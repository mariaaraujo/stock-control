"use client";

import { useEffect, useState } from "react";

import { Loading } from "@/app/components";
import { Table } from "@/app/components/Table";
import { ButtonCustomized } from "@/app/components/ButtonCustomized";
import axios from "axios";
import { UserResponse } from "@/dtos";
import { RoleType } from "@/enum/roleType";

interface UserContainerProps {
  isAuthenticated: string;
}

export function UserContainer({ isAuthenticated }: UserContainerProps) {
  const usersHeader = ["ID", "Nome", "Login", "Cargo"];
  const [showLoading, setShowLoading] = useState(true);
  const [users, setUsers] = useState<UserResponse[]>([]);

  async function getUsers() {
    try {
      const { data, status } = await axios.get("/api/user/get");
      if (status === 200) {
        setUsers(
          data?.message?.users?.map((item: UserResponse) => {
            return {
              ID: item.id,
              Nome: item.name,
              Login: item.login,
              Cargo: RoleType[item.role as keyof typeof RoleType] ?? item.role,
            };
          })
        );
        setShowLoading(false);
      }
    } catch (error) {
      setShowLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {showLoading && <Loading />}
      <div className="w-full flex pt-10 pl-8 lg:pt-5 lg:pl-10 justify-between">
        <h1 className="text-2xl">Lista de Usuário</h1>
        <ButtonCustomized
          userId={isAuthenticated}
          title="Adicionar Usuário"
          type="user"
          refresh={getUsers}
        />
      </div>

      <Table
        headers={usersHeader}
        rows={users}
        api="user"
        userId={isAuthenticated}
        refresh={getUsers}
      />
    </>
  );
}
