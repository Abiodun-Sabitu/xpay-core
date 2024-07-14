export const otpVerificationMail = (otp) => {
  const message = `
	<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f7ff;
      text-align: center;
      padding: 60px;
    }
    .container {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 20px;
      display: inline-block;
    }
    .btn {
      background-color: #7b2cbf;
      color: #ffffff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    .link {
      color: #7b2cbf;
      text-decoration: none;
    }

		.otp{
		font-weight: Bolder;
		}
  </style>
</head>
<body>
  <div class="container">
    <h1 style="color: #7b2cbf;">x-Pay Login Verification</h1>
    <p>Your OTP code is:</p>
    <h2 class="otp">${otp}</h2>
    <p>Please use this OTP to complete your login process. This One Time Password is valid for 2 minutes.</p>
    <p>If you didn't request this, please ignore this email or contact us.</p>
    <p>Thank you,<br>The x-Pay Team</p>
  </div>
</body>
</html>
`;
  return message;
};
