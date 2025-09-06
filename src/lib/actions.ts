'use server';

import { generateScriptDescription } from "@/ai/flows/generate-script-description";
import type { GenerateScriptDescriptionInput, GenerateScriptDescriptionOutput } from "@/ai/flows/generate-script-description";
import { z } from "zod";
import { redirect } from "next/navigation";
// import sql from "mssql";

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

export async function loginAction(prevState: LoginState, formData: FormData) {
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

  try {
    console.log("Attempting to log in with user:", email);

    // TODO: Replace this with your actual database authentication logic
    // const pool = await sql.connect({
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   server: process.env.DB_SERVER!,
    //   database: process.env.DB_DATABASE,
    //   options: {
    //       encrypt: true, // Use this if you're on Azure
    //       trustServerCertificate: true // Change to false for production with a valid certificate
    //   }
    // });
    // const result = await pool.request()
    //     .input('email', sql.NVarChar, email)
    //     .input('password', sql.NVarChar, password) // Note: Passwords should be hashed!
    //     .query('SELECT * FROM Users WHERE Email = @email AND Password = @password');
    // if (result.recordset.length === 0) {
    //     return { errors: { server: ["Invalid username or password."] }, message: "Login failed." };
    // }

    // --- Start of placeholder logic ---
    if (email !== 'Vojtech.Vybiral@pwo-group.com' || password !== 'password123') {
        return { errors: { server: ["Invalid username or password."] }, message: "Login failed." };
    }
    // --- End of placeholder logic ---


  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: { server: ["Database error. Please try again later."] },
      message: "Something went wrong.",
    };
  }

  // If authentication is successful, redirect to the dashboard.
  redirect('/dashboard');
}


export async function generateDescriptionAction(
  input: GenerateScriptDescriptionInput
): Promise<GenerateScriptDescriptionOutput> {
  try {
    const result = await generateScriptDescription(input);
    return result;
  } catch (error) {
    console.error("AI description generation failed:", error);
    // In a real app, you'd want more robust error handling and logging.
    return { description: "Sorry, we couldn't generate a description at this time. Please try again later." };
  }
}
