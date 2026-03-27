"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { LockKeyhole, UserLock } from "lucide-react";
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
import { useState } from "react";
import { PasswordInput } from "@/components/custom/password-input";
import { Spinner } from "@/components/ui/spinner";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/lib/form-schema";
import {  useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { safeZodResolver } from "@/lib/zod";
import { admin } from "@/lib/auth-client";

export default function ResetPasswordUser({ id }: { id: string }) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<ResetPasswordFormValues>({
    resolver: safeZodResolver(resetPasswordSchema),
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    setError(undefined);
    const { data: status, error } = await admin.setUserPassword({
      newPassword: data.password, 
      userId: id, 
    });
    if(status){
      queryClient.invalidateQueries(trpc.user.get.queryFilter());
      setDialogOpen(false);
      setError(undefined);
      setLoading(false);
    }
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserLock size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>ID: {id}</DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LockKeyhole className="inline" size={15} />
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      {...{ showRules: true, showStrength: true }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LockKeyhole className="inline" size={15} />
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Confirm your password"
                      required
                      disabled={loading}
                    />
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
                  loading ? <Spinner /> : <UserLock />
                }
                className={`${
                  loading || !form.formState.isValid
                    ? "cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                disabled={
                  loading || !form.formState.isValid
                }
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </ButtonWithIcon>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
