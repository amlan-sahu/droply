"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { set, z } from "zod";

// zod custom schema for form validation
import { signUpSchema } from "@/schema/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
    const router = useRouter();
    const [verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const { signUp, isLoaded, setActive } = useSignUp();

    const { register,
        handelSubmit,
        formatState: {errors}
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwwordConfirmation: "",
            
        },
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if(!isLoaded){
            return;
        }
        setIsSubmitting(true);
        setAuthError(null);

        try{
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });
            setVerifying(true);
        } catch (error: any) {
            console.error("Error signing up:", error);
            setAuthError(
                error.errors[0]?.message || "An error occurred during sign up . please try again."
            );
        }finally{
            setIsSubmitting(false);
        }
    }
    
    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!isLoaded || !signUp){
            return;
        }
        setIsSubmitting(true);
        setAuthError(null);
        try {
            const result =await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            }else{
                console.error("Verification failed:", result);
                setVerificationError(
                   "Verification failed. Please check your code and try again."
                );
            }
            
        } catch (error: any) {
            console.error("Error verifying email:", error);
            setVerificationError(
                error.errors[0]?.message || "An error occurred during Signup . please try again."
            );
        }finally{
            setIsSubmitting(false);
        }
    }


        if (verifying){
            return(
                <h1>This is otp entering field</h1>
            )
        }

        return(
            <h1>sign up form </h1>
        )
    
        

}
