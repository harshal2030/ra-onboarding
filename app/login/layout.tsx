import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = (await cookies()).get("token")?.value;
    const decoded = token ? (await verifyToken(token)) : null;

    if (decoded) redirect("/verification");
    return <section>{children}</section>;
}
