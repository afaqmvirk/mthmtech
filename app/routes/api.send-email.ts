import type { ActionFunctionArgs } from "react-router";
import { resend } from "~/lib/resend.server";
import WelcomeEmail from "~/emails/WelcomeEmail";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  // In a real app, you might validate the user session here
  // or parse the body for whom to send the email to.
  // For this demo, we'll hardcode or use a dummy email if provided in body.
  
  const formData = await request.formData();
  const to = formData.get("to") as string;
  const username = formData.get("username") as string || "User";

  if (!to) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "MathemaTech <hello@news.mathematech.ca>",
      to: [to],
      subject: "Welcome to our Platform!",
      react: WelcomeEmail({ username }), // Pass props to the template
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ data, success: true });
  } catch (error) {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
};
