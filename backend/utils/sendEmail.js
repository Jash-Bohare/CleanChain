const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email after claiming a cleanup location
async function sendClaimNotification(email, name = "Cleaner", locationName = "a location") {
  try {
    const mailOptions = {
      from: `"CleanChain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🧹 You’ve Successfully Claimed a Cleanup Spot!",
      html: `
        <h2>Hey ${name}!</h2>
        <p>Thank you for stepping up 🙌</p>
        <p>You’ve successfully claimed the spot: <strong>${locationName}</strong>.</p>
        <p>Now go clean it, upload your proof, and earn those sweet tokens 💰</p>
        <br/>
        <p>— The CleanChain Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[📧 Sent] Claim email to ${email}`);
  } catch (error) {
    console.error(`[❌ Email Error - Claim] Failed to send email to ${email}:`, error.message);
  }
}

// Email after successful reward/token transfer
async function sendRewardNotification(email, name = "Eco Hero", locationName = "your cleanup location", tokens = "ECO") {
  try {
    const mailOptions = {
      from: `"CleanChain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Tokens Rewarded for Cleaning!",
      html: `
        <h2>Hey ${name}!</h2>
        <p>Your cleanup of <strong>${locationName}</strong> has been verified by the community.</p>
        <p>We’ve just sent <strong>${tokens} ECO</strong> tokens to your wallet as a reward 💸</p>
        <p>Keep making the world cleaner, one spot at a time 🌱</p>
        <br/>
        <p>— The CleanChain Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[📧 Sent] Reward email to ${email}`);
  } catch (error) {
    console.error(`[❌ Email Error - Reward] Failed to send email to ${email}:`, error.message);
  }
}

module.exports = {
  sendClaimNotification,
  sendRewardNotification,
};
