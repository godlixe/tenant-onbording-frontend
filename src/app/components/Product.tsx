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
interface App {
  id: number;
  name: string;
  icon: string;
}

interface AppProps extends React.HTMLAttributes<HTMLDivElement> {
  app: App
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function AppList({
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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean | null>(null);

  type Price = {
    id: string | null;
    price_value: number;
    recurrence: string | null;
  }

  type Product = {
    id: string;
    app_id: number;
    app: App | null;
    tier_name: string;
    prices: Price[];
  }

  type OnboardingProductResponse = {
    id: string;
    app_id: number;
    app: App | null;
    tier_name: string;
    price: number;
  }

  useEffect(() => {
    const fetchProducts = process.env.INTEGRATED_MODE == "false" ?
      async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_ONBOARDING_HOST}/products?app_id=${app.id}`);
          const data = await response.json();

          let products: Product[] = []
          console.log("PRICE")
          data.data.forEach((resProduct: OnboardingProductResponse) => {
            let price: Price = {
              id: resProduct.id,
              price_value: resProduct.price,
              recurrence: "monthly"
            }

            let product: Product = {
              id: resProduct.id,
              app_id: resProduct.app_id,
              app: null,
              tier_name: resProduct.tier_name,
              prices: [price],
            }

            products.push(product)
          });

          setProducts(products);

        } catch (error) {
          console.error("error fetching products: ", error);
        }
      } : async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BILLING_HOST}/api/v1/products/${app.id}`);
          const data = await response.json();

          let products: Product[] = []
          console.log("PRICE")
          data.data.forEach((resProduct: OnboardingProductResponse) => {
            let price: Price = {
              id: resProduct.id,
              price_value: resProduct.price,
              recurrence: "monthly"
            }

            let product: Product = {
              id: resProduct.id,
              app_id: resProduct.app_id,
              app: null,
              tier_name: resProduct.tier_name,
              prices: [price],
            }

            products.push(product)
          });

          setProducts(products);

        } catch (error) {
          console.error("error fetching products: ", error);
        }
      }

    if (isDialogOpen) fetchProducts();
  }, [isDialogOpen]);

  const handleChange = (open: boolean) => {
    if (!open) setSelectedProduct(null)
    setisDialogOpen(open)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ONBOARDING_HOST}/tenant/create`, {
        method: "POST", // Changed to POST for creation
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          product_id: selectedProduct?.id,
          organization_id: selectedOrganization?.organizationId,
          name: userInfo?.name,
        })
      });
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        setDialogOpen(null)
        setisDialogOpen(false)
        setTimeout(() => setAlert(null), 3000); // Hide alert after 3 seconds
      }
    } catch (error) {
      console.error("Error during tenant creation:", error);
    }
    toast.success("Product successfully bought", {
      description: "Deployment on process, please wait up to 10 minutes."
    })
  }

  return (
    <>
      {alert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <Alert>
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Please wait for up to 10 minutes for the tenant onboarding.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
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
                      Buy {app.name}, choose from available tiers and price below
                    </DialogDescription>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            {/* {selectedProduct && (
              <div className="ml-auto text-lg font-semibold">
                <p>${selectedProduct.price.price_value}</p>
              </div>
            )} */}
          </div>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tier" className="pb-2">Tiers</Label>
                <Select onValueChange={(value) => {
                  const product = products.find(p => p.id === value);
                  setSelectedProduct(product ?? null);
                  console.log(product);
                }}>
                  <SelectTrigger id="tier">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {products.map((product: Product) => (
                      <SelectItem key={product.id} value={product.id}>{product.tier_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedProduct && <div className="flex flex-col space-y-1.5">
                <Label htmlFor="price" className="pb-2">Prices</Label>
                <Select onValueChange={(value) => {
                  const price = selectedProduct.prices.find(p => p.id === value);
                  setSelectedPrice(price ?? null);
                  console.log(price);
                }}>
                  <SelectTrigger id="price">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {selectedProduct.prices?.map((price: Price) => (
                      <SelectItem key={price.id} value={price.id || ""}>{price.price_value} - {price.recurrence}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>}
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}