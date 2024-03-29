import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserContainer } from "./components/UserContainer";

export default async function Users() {
  const isAuthenticated = cookies().get("stock-userId");
  const role = cookies().get("stock-userRole");

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (role?.value !== "ADMIN") {
    redirect("/");
  }

  return <UserContainer isAuthenticated={isAuthenticated?.value} />;
}
