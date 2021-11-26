import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  let testAccount = await nodemailer.createTestAccount();

  console.log({ testAccount });

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "xxcgvlsrmi5nuhan@ethereal.email",
      pass: "NN9uV8SanTJQCTsvdP",
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: "Change password ✔",
    html,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
