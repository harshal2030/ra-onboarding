import  Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
    redirect("/verification")

    return <>
        <Link href="/login" >Login</Link>
        <br/>
        <Link href="/verification">Verification</Link>
    </>
}
