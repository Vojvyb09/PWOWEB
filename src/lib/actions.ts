import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    server?: string[];
  };
  message?: string | null;
};

export function validateLogin(formData: FormData): LoginState {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to login.",
    };
  }

  const { email, password } = validatedFields.data;

  // Simple client-side validation for demo
  if (email !== 'Vojtech.Vybiral@pwo-group.com' || password !== 'password123') {
    return { errors: { server: ["Invalid username or password."] }, message: "Login failed." };
  }

  return { message: "Login successful" };
}

export function generateDescriptionAction(
  input: { codebase: string; instructions: string }
): { description: string } {
  // Simple mock response for static export
  return { 
    description: `This script appears to handle ${input.codebase.includes('automation') ? 'automation tasks' : 'general operations'}. ${input.instructions ? `Additional context: ${input.instructions}` : ''}` 
  };
}
