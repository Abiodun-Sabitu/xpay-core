export const accountCreationMail = (walletNumber, currency) => {
  const message = `
	<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wallet Creation Confirmation</title>
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
      background-color: #4CAF50; /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }
    .link {
      color: #7b2cbf;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 style="color: #7b2cbf;">Congratulations!</h1>
    <p><strong>Your x-Pay Wallet has been successfully created!</strong></p>
    <p>Your ${currency} account is all set to go. You can now start managing your finances with ease and security.</p>
    <h3 class='otp'> ${walletNumber} - ${currency}</h3>
    <p>Should you have any questions or require any assistance, please don't hesitate to reach out to our support team.</p>
    <p>Thank you for choosing x-Pay,<br>The x-Pay Team</p>
  </div>
</body>
</html>
`;
  return message;
};
