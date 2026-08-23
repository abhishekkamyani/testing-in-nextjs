import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function UserProfileHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header>
      <p>Current Path: {pathname}</p>
      {user ? (
        <div>
          <span>Welcome, {user}</span>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <button onClick={() => router.push("/login")}>Log In</button>
      )}
    </header>
  );
}