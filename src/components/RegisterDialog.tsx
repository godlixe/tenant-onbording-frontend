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
import { register } from "module";

const RegisterDialog: React.FC = () => {
    const { userInfo, login, logout, register } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit() {
        register({ email, username, name, password })
    }

    return (
        <div className="flex items-center justify-center">

            <Card className="w-[350px] items-center">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Register to SaaS Tenant Onboarding.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Name</Label>
                                <Input id="name" placeholder="Name" onChange={(e) => { setName(e.target.value) }} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Username</Label>
                                <Input id="name" placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} />
                            </div>
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
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSubmit}>Register</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterDialog;
