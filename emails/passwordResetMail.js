export const passwordResetMail = (resetLink, firstName) => {
  const message = `
	<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset Request</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
  }
  .container {
    background-color: #ffffff;
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  }
  .button {
    display: inline-block;
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #7b2cbf;
    color: #ffffff;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
  }
  .footer {
    text-align: center;
    margin-top: 20px;
    font-size: 0.8em;
    color: #777;
  }
</style>
</head>
<body>
<div class="container">
  <h2>Password Reset Request</h2>
  <p>Hello ${firstName},</p>
  <p>You are receiving this email because we received a password reset request for your account. If you did not request a password reset, no further action is required.</p>
  <p>To reset your password, please click the button below:</p>
  <a href="${resetLink}" class="button" style="color: white;">Reset Password</a>
  
    <p>If you have any questions, please do not hesitate to contact us at <a href="mailto:support@x-pay.com">support@x-pay.ng</a>.</p>
    <p>Thank you,<br>The x-PAY Team</p>
  </div>
</div>
</body>
</html>

`;
  return message;
};
