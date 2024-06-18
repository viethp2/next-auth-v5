"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
  const role = useCurrentRole();

  const onServerActionClick = () => {
    admin()
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error((error as Error).message);
      });
  };

  const onApiRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allowed API Route");
      } else {
        toast.error("Forbidden API Route");
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message={`Welcome, ${role}!`} />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-API Route</p>
          <Button onClick={onApiRouteClick}>Click</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-Server Action</p>
          <Button onClick={onServerActionClick}>Click</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
