/**
 * Script to create an admin user
 * Run with: node scripts/create-admin.js
 */

const readline = require("readline");
const { AuthService } = require("../lib/services/authService");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  console.log("=== Create Admin User ===\n");

  try {
    const name = await question("Enter admin name: ");
    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password (min. 6 chars): ");

    if (!name || !email || !password) {
      console.error("❌ All fields are required");
      process.exit(1);
    }

    if (password.length < 6) {
      console.error("❌ Password must be at least 6 characters");
      process.exit(1);
    }

    console.log("\nCreating admin user...");
    const admin = await AuthService.createAdmin(name, email, password);

    console.log("\n✅ Admin user created successfully!");
    console.log("\nAdmin Details:");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("\nYou can now login at: http://localhost:3000/auth/login\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
