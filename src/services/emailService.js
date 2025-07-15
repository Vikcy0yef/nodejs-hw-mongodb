import { Resend } from "resend";

export const sendResetPasswordEmail = async (email, token) => {
  console.log("RESEND_API_KEY in sendResetPasswordEmail:", process.env.RESEND_API_KEY);

  const resend = new Resend(process.env.RESEND_API_KEY);

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: "viktoria.sergievna15@gmail.com",
    subject: "Password Reset Request",
    html: `
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 5 minutes.</p>
    `,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log("Email sent:", data);
};