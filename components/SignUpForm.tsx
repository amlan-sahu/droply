"use client"

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

// zod custom schema for form validation
import { signUpSchema } from "@/schema/signUpSchema";

export default function SignUpForm() {
    const [verifying, setVerifying] = useState(false);
    const { signUp, isLoaded, setActive } = useSignUp();
    const onSubmit = async () => {}
    
    const handleVerificationSubmit = async () => {}


}
