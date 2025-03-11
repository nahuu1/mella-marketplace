import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { currentUser, login, signup, isLoading } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoginLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setSignupLoading(true);
    
    try {
      await signup(signupData.email, signupData.password, signupData.name);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setSignupLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

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
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="login-email"
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button variant="link" size="sm" className="px-0 h-auto">
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="login-password"
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6" disabled={loginLoading}>
                    {loginLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name"
                        placeholder="John Doe" 
                        className="pl-10"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-email"
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-password"
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirm-password"
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6" disabled={signupLoading}>
                    {signupLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center">
              <div className="w-full">
                <div className="w-full flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={() => toast.info("Google Sign In will be implemented soon!")}
                >
                  Continue with Google
                </Button>
              </div>
            </CardFooter>
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
