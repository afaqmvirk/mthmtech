import { Resend } from "resend";

// Initialize Resend with the API key from environment variables
// It's crucial to only use this on the server side to avoid exposing your API key
export const resend = new Resend(process.env.RESEND_API_KEY);
