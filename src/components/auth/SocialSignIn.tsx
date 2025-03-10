
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const SocialSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully with Google!");
      navigate("/");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        Continue with Google
      </Button>
    </div>
  );
};

export default SocialSignIn;
