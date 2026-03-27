"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { User, UserKey, Mail, Pencil, UserPenIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { safeZodResolver } from "@/lib/zod";
import { roleList, RoleUser } from "@/modules/admin/ui/config/auth/role.user";
import {
  EditUserFormValues,
  editUserSchema,
} from "@/lib/query-schema/user-schema-api";
import { appToast } from "@/components/custom/app-toast";
export default function EditUser({
  data,
}: {
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<EditUserFormValues>({
    resolver: safeZodResolver(editUserSchema),
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      id: data.id,
      name: data.name ?? undefined,
      email: data.email ?? undefined,
      role: data.role as RoleUser,
    },
  });
  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as RoleUser,
      });
    }
  }, [dialogOpen, data, form]);
  const trpc = useTRPC();

  const editUserMutation = useMutation(trpc.user.edit.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.get.queryFilter());
      form.reset();
      setDialogOpen(false);
      setError(undefined);
      appToast.success("User edited successfully!");
    },
    onError: (err) => {
      setError(err.message);
      appToast.error("Something went wrong!");
    },
  }));

  const onSubmit = async (data: EditUserFormValues) => {
    setError(undefined);
    editUserMutation.mutate(data);
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil color="blue" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>ID: {data.id}</DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <User className="inline" size={15} />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      {...field}
                      disabled={editUserMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Mail className="inline" size={15} />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email address"
                      {...field}
                      disabled={editUserMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* roles selection dropdown */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <UserKey className="inline" size={15} />
                    Role
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={editUserMutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleList.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="select-none cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <ButtonWithIcon
                type="submit"
                startIcon={
                  editUserMutation.isPending ? <Spinner /> : <UserPenIcon />
                }
                className={`${
                  editUserMutation.isPending || !form.formState.isValid
                    ? "cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                disabled={editUserMutation.isPending || !form.formState.isValid}
              >
                {editUserMutation.isPending ? "Editing..." : "Edit User"}
              </ButtonWithIcon>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
