import { LoginButton, LogoutButton } from "@/auth/components/user-auth";
import { options } from "@/auth/options";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(options);

  const username = session?.token.user?.username;

  return (
    <div>
      {session ? <LogoutButton /> : <LoginButton />}
      User: {username}
    </div>
  );
}
