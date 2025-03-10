
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import SocialSignIn from "@/components/auth/SocialSignIn";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Welcome to Mella</h1>
                <p className="text-muted-foreground">Login or create an account to continue</p>
              </div>
              <TabsList className="grid grid-cols-2 w-full mt-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="py-4">
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center">
              <SocialSignIn />
            </CardFooter>
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
