/* eslint-disable react/no-children-prop */
"use client";

import { AuthContext } from "@/providers/AuthProvider";
import { parseJwt } from "@/lib/parseJwt";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import Spinner from "@/components/ui/spinner";
import { icons, Loader2 } from "lucide-react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { AppList } from "./components/Product";
import LoginDialog from "@/components/LoginDialog";
import { redirect, usePathname, useRouter } from "next/navigation";
import checkIntegratedMode from "@/lib/framework";
import App from "next/app";
import { OwnedAppList } from "./components/OwnedProduct";

export default function Home() {

  const [apps, setApps] = useState<App[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const { organizations, selectedOrganization } = useContext(OrganizationContext);
  const router = useRouter();

  type App = {
    id: number;
    name: string;
    icon: string;
    frontend_url: string;
  }

  type Product = {
    id: string;
    app_id: string;
    app: App;
    tier_name: string;
    price: number;
  }

  type Tenant = {
    id: string;
    product_id: string;
    product: Product;
    name: string;
    status: string;
    resource_information: JSON;
  }

  type BillingAppsResponse = {
    id: number;
    name: string;
    image_url: string;
  }

  useEffect(() => {
    if (selectedOrganization == null) return;

    const fetchApps =
      async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_ONBOARDING_HOST}/tenant?organization_id=${selectedOrganization?.organizationId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
          );
          const data = await response.json();

          setTenants(data.data);
        } catch (error) {
          console.error("error fetching tenants: ", error);
        }
      };


    fetchApps();
  }, [selectedOrganization]);

  useEffect(() => {
    const fetchApps = checkIntegratedMode() == false ?
      async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_ONBOARDING_HOST}/app`
          );
          const data = await response.json();

          setApps(data.data);
        } catch (error) {
          console.error("error fetching apps: ", error);
        }
      } :
      async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BILLING_HOST}/api/v1/apps`
          );
          const data = await response.json();

          let billingApps: App[] = []

          data.data.forEach((billingApp: BillingAppsResponse) => {
            let resApp: App = {
              id: billingApp.id,
              name: billingApp.name,
              icon: billingApp.image_url,
              frontend_url: ""
            }

            billingApps.push(resApp)
          });

          setApps(billingApps);
        } catch (error) {
          console.error("error fetching apps: ", error);
        }
      };


    fetchApps();
  }, [selectedOrganization]);

  const { userInfo } = useContext(AuthContext);

  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      identifier: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/organization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")} `,
        },
        body: JSON.stringify(value),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            console.log(data);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
          setShowNewOrgDialog(false);
        });
    },
  });

  if (!userInfo) {
    return (
      router.push('/login')
    );
  }

  // if (organizations.length > 0) {
  //   return (
  //     <div className="flex flex-col min-h-[80vh] items-center justify-center gap-6">
  //       <p className="text-4xl font-medium">Hi, {userInfo.name}</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div>
        <p className="p-5 pb-0 font-bold">
          Bought Products
        </p>
        <div className="p-5 grid grid-cols-3 lg:grid-cols-4 gap-5">
          {tenants && tenants?.map((tenant: Tenant) => (
            <OwnedAppList
              tenant={tenant}
              app={tenant.product.app}
              key={tenant.product.app.name}
              aspectRatio="square"
              width={150}
              height={150}
            />
          ))}
          {(tenants.length == 0) &&
            <p>You have not bought any products yet...</p>
          }
        </div>
      </div>
      <div>
        <p className="p-5 pb-0 font-bold">
          Products
        </p>
        <div className="p-5 grid grid-cols-3 lg:grid-cols-4 gap-5 w-4/7">
          {apps.map((app: App) => (
            <AppList
              app={app}
              key={app.id}
              className=""
              aspectRatio="square"
              width={150}
              height={150}
            />
          ))}
        </div>
      </div>
      {/* <div className="flex flex-col min-h-[80vh] items-center justify-center gap-6">

        <p className="font-medium text-xl px-4 text-center">
          It looks like you are not affiliated with any organization :/
        </p>
        <Button onClick={() => setShowNewOrgDialog(true)}>
          Create organization
        </Button>

        <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription>
                  Create organization to manage your team and projects.
                </DialogDescription>
              </DialogHeader>

              <div>
                <div className="space-y-4 py-2 pb-4">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Organization name is required" : undefined,
                    }}
                    children={(field) => {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor="name">Organization name</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="My Org."
                          />
                          <FieldInfo field={field} />
                        </div>
                      );
                    }}
                  />

                  <form.Field
                    name="identifier"
                    validators={{
                      onChange: ({ value }) =>
                        !value
                          ? "Organization identifier is required"
                          : !/^[a-z_]+$/.test(value)
                            ? "Organization identifier must be in snake_case"
                            : undefined,
                    }}
                    children={(field) => {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>
                            Organization identifier
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="my_org"
                          />
                          <FieldInfo field={field} />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewOrgDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div> */}
    </div >
  );
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <div className="text-xs space-y-2 h-2">
      {field.state.meta.touchedErrors ? (
        <em className="text-red-700">{field.state.meta.touchedErrors}</em>
      ) : null}
    </div>
  );
}
