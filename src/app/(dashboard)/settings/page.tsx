"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
      }
    }
    loadProfile();
  }, [supabase]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType(null);

    const trimmed = fullName.trim();

    // Persist to auth user metadata (drives the server-rendered header)...
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: trimmed },
    });
    // ...and to the public.profiles row so app queries stay in sync.
    const { error: profileError } = userId
      ? await supabase
          .from("profiles")
          .update({ full_name: trimmed })
          .eq("id", userId)
      : { error: null };

    const error = authError ?? profileError;
    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
      setMessage("Profile updated successfully");
      setMessageType("success");
      // Re-render the server layout so the header avatar/name refresh.
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            {message && (
              <div
                className={
                  messageType === "error"
                    ? "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                    : "rounded-md border border-emerald-600/30 bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                }
              >
                {message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
