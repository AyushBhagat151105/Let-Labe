import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, User } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Current password too short"),
  newPassword: z.string().min(6, "New password too short"),
});

export function ProfileSettingsForm() {
  const {
    authUser,
    updateUser,
    resetPassword,
    isUpdatingProfile,
    isResettingPassword,
  } = useAuthStore();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (authUser) {
      resetProfileForm({
        name: authUser.name,
        email: authUser.email,
      });
    }
  }, [authUser, resetProfileForm]);

  const onUpdateProfile = async (data) => {
    try {
      await updateUser(data);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onResetPassword = async (data) => {
    try {
      await resetPassword(data);
      resetPasswordForm();
    } catch {
      toast.error("Password reset failed");
    }
  };

  return (
    <div className="space-y-10 max-w-md mx-auto mb-3">
      {/* Profile Update */}
      <form
        onSubmit={handleProfileSubmit(onUpdateProfile)}
        className="space-y-5"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          Update Profile
        </h2>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <span className="absolute left-3 inset-y-0 flex items-center text-muted-foreground">
              <User className="h-5 w-5" />
            </span>
            <Input
              id="name"
              placeholder="Your Name"
              {...profileRegister("name")}
              className="pl-10"
            />
          </div>
          {profileErrors.name && (
            <p className="text-sm text-red-500">{profileErrors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <span className="absolute left-3 inset-y-0 flex items-center text-muted-foreground">
              <Mail className="h-5 w-5" />
            </span>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...profileRegister("email")}
              className="pl-10"
            />
          </div>
          {profileErrors.email && (
            <p className="text-sm text-red-500">
              {profileErrors.email.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isUpdatingProfile}>
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </Button>
      </form>

      {/* Password Reset */}
      <form
        onSubmit={handlePasswordSubmit(onResetPassword)}
        className="space-y-5"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h2>

        {/* Old Password */}
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter current password"
              {...passwordRegister("oldPassword")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 inset-y-0 flex items-center text-muted-foreground"
            >
              {showOldPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {passwordErrors.oldPassword && (
            <p className="text-sm text-red-500">
              {passwordErrors.oldPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...passwordRegister("newPassword")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 inset-y-0 flex items-center text-muted-foreground"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {passwordErrors.newPassword && (
            <p className="text-sm text-red-500">
              {passwordErrors.newPassword.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isResettingPassword}>
          {isResettingPassword ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
