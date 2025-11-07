// const otp = Math.floor(100000 + Math.random() * 900000);
// console.log(otp)

// import crypto from "crypto";

// function generateSecurePassword(length = 12) {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?";
//   const randomBytes = crypto.randomBytes(length);
//   let password = "";
//   for (let i = 0; i < length; i++) {
//     password += chars[randomBytes[i] % chars.length];
//   }
//   return password;
// }

// // Example usage:
// console.log(generateSecurePassword()); // e.g., "h#FzP1@r8K&d"

// console.log("gemerated auto password = " , generateSecurePassword())


import readline from "readline";
import crypto from "crypto";

// ✅ Function to generate a secure password
function generateSecurePassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?";
  const randomBytes = crypto.randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  return password;
}

// ✅ Function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Step 1: Ask user for password or auto-generate
rl.question("Do you want to enter your own password? (yes/no): ", (answer) => {
  let password = "";

  if (answer.toLowerCase() === "yes") {
    rl.question("Enter your password: ", (userPass) => {
      password = userPass;
      console.log(`✅ Password set successfully: ${password}`);

      startOTPVerification();
    });
  } else {
    password = generateSecurePassword();
    console.log(`🔐 Auto-generated password: ${password}`);
    startOTPVerification();
  }

  // Step 2: Generate OTP and verify
  function startOTPVerification() {
    const otp = generateOTP();
    console.log(`📱 Your OTP is: ${otp}`);

    rl.question("Enter the OTP to verify: ", (userOTP) => {
      if (userOTP === otp) {
        console.log("✅ OTP verified successfully!");
      } else {
        console.log("❌ Invalid OTP. Please try again.");
      }
      rl.close();
    });
  }
});
