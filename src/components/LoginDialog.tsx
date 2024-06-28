"use client";

import Link from "next/link";
import Image from "next/image"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const LoginDialog: React.FC = () => {
    const { userInfo, login, logout } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    function handleSubmit() {
        login({ email, password })
    }

    function handleRegister() {
        router.push('/register')
    }

    return (
        <div className="flex items-center justify-center">

            <Card className="w-[350px] items-center">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Login to SaaS Tenant Onboarding.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Email</Label>
                                <Input id="name" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="name" placeholder="Password" type={"password"} onChange={(e) => { setPassword(e.target.value) }} />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleRegister} variant="outline">Register</Button>
                    <Button onClick={handleSubmit}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginDialog;
