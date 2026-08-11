import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { render } from "@testing-library/react";
import { useEffect } from "react";

function AuthSeeder({ user, children }: { user: string; children: React.ReactNode }) {
    const { login } = useAuth();

    useEffect(() => {
        login(user);
    }, [user])

    return <>{children}</>;
}

export function renderWithAuth(ui: React.ReactElement, initialUser?: string) {
    if (!initialUser) {
        return render(ui, { wrapper: AuthProvider });
    }

    return render(
        <AuthProvider>
            <AuthSeeder user={initialUser}>{ui}</AuthSeeder>
        </AuthProvider>
    );
}