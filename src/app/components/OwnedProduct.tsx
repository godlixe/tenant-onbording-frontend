import Image from "next/image"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useState } from "react"
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { AuthContext } from "@/providers/AuthProvider"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"

interface App {
    id: number;
    name: string;
    icon: string;
    frontend_url: string;
}

interface AppProps extends React.HTMLAttributes<HTMLDivElement> {
    app: App
    aspectRatio?: "portrait" | "square"
    width?: number
    height?: number
}


export function OwnedAppList({
    app,
    aspectRatio = "square",
    width,
    height,
    className,
    ...props
}: AppProps) {
    const { selectedOrganization, organizations } = useContext(OrganizationContext);
    const { userInfo } = useContext(AuthContext);
    const [isDialogOpen, setisDialogOpen] = useState<boolean>(false);

    const router = useRouter();

    const handleChange = (open: boolean) => {
        setisDialogOpen(open)
    }

    return (
        <>
            <Dialog onOpenChange={handleChange} open={isDialogOpen}>
                <DialogTrigger asChild>
                    <div className={cn("flex items-center space-x-4 h-50 hover:bg-gray-200 rounded-lg", className)} {...props}>
                        <div className="space-x-4 overflow-hidden rounded-sm">
                            <Image
                                src={app.icon}
                                alt={app.name}
                                width={width}
                                height={height}
                                className={cn(
                                    "w-20 h-20 p-2 rounded-lg object-cover transition-all hover:scale-105",
                                    aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                                )}
                            />
                        </div>
                        <div className="text-sm">
                            <h3 className="font-medium leading-none">{app.name}</h3>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <div className="flex items-center">
                        <DialogHeader>
                            <DialogTitle>
                                <div className="flex items-center justify-between">
                                    <Image
                                        src={app.icon}
                                        alt={app.name}
                                        width={width}
                                        height={height}
                                        className={cn(
                                            "w-12 h-12 p-2 rounded-lg object-cover transition-all hover:scale-105",
                                            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                                        )}
                                    />
                                    <div>
                                        <p>{app.name}</p>
                                        <DialogDescription>
                                            Redirect to your {app.name}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    <p>To redirect, press the confirm button below</p>
                    <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={() => { router.push(app.frontend_url) }}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}