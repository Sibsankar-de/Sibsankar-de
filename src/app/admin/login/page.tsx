import { loginAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-5">
      <form
        action={loginAction}
        className="w-full max-w-md border-2 border-line bg-surface p-6 shadow-[6px_6px_0_var(--line)]"
      >
        <p className="font-mono text-xs uppercase text-secondary">Owner access only</p>
        <h1 className="mt-3 text-4xl font-bold">Admin login</h1>
        <Label className="mt-7">
          Email
          <Input className="mt-2 p-3" name="email" required type="email" />
        </Label>
        <Label className="mt-4">
          Password
          <Input className="mt-2 p-3" name="password" required type="password" />
        </Label>
        <Button className="mt-6" type="submit">
          Sign in
        </Button>
      </form>
    </main>
  );
}
