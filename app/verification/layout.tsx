import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VerificationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = (await cookies()).get("token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) redirect("/login");

    return <section>{children}</section>;
}
