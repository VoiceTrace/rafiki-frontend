import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LoginPage() {
  // Already signed in — middleware handles protection, but this avoids
  // showing the login form to an authenticated user.
  const session = await auth()
  if (session?.user) {
    redirect(
      session.user.role === "teacher"
        ? "/en/teacher/today"
        : "/en/student/today"
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Rafiqi</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              "use server"
              // signIn with redirectTo — NextAuth sets the session cookie then
              // redirects. Role-based destination is handled by middleware.
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/en/auth/redirect",
              })
            }}
            className="space-y-4"
          >
            <Input name="email" type="email" placeholder="Email" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
