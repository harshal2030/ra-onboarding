"use client";
import  Link from "next/link";

export default function Home() {
    return <>
        <Link href="/login" >Login</Link>
        <br/>
        <Link href="/verification">Verification</Link>
    </>
}
