export const creditAlertMail = (transactionDetails, firstName) => {
  const message = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; }
    .header { background-color: #5cb85c; color: white; padding: 10px 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { text-align: center; padding: 10px 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
<div class="container">
  <div class="header">CREDIT ALERT - x-PAY WALLET</div>
  <div class="content">
    <p>Hello <strong>${firstName}</strong>,</p>
    <p>Your wallet with Account No: <strong>${transactionDetails.receiver.walletId}</strong> was credited on <strong>${transactionDetails.date}</strong>.</p>
    <p><strong>Details:</strong></p>
    <ul>
      <li><strong>Amount Credited:</strong> ${transactionDetails.amount}</li>
      <li><strong>Description:</strong> ${transactionDetails.description}</li>
      <li><strong>Transaction ID:</strong> ${transactionDetails.transactionId}</li>
			  <li><strong>Sender:</strong> ${transactionDetails.sender.name}</li>
      
    </ul>
    <p>We hope this transaction aligns with your expectations!</p>
  </div>
  <div class="footer">Thank you for trusting x-PAY Wallet!</div>
</div>
</body>
</html>
`;

  return message;
};
