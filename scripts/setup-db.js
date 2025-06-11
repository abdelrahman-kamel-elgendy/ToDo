const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('PostgreSQL Database Setup Script');
console.log('==============================\n');

// Function to check if PostgreSQL is installed
function checkPostgresInstallation() {
  try {
    execSync('psql --version');
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check if PostgreSQL service is running
function checkPostgresService() {
  try {
    if (process.platform === 'win32') {
      execSync('sc query postgresql');
    } else {
      execSync('pg_isready');
    }
    return true;
  } catch (error) {
    return false;
  }
}

// Function to create database
function createDatabase(username, password, dbname) {
  try {
    const command = `PGPASSWORD=${password} createdb -U ${username} ${dbname}`;
    execSync(command);
    return true;
  } catch (error) {
    return false;
  }
}

// Main setup process
async function setup() {
  // Check PostgreSQL installation
  if (!checkPostgresInstallation()) {
    console.error('PostgreSQL is not installed. Please install PostgreSQL first.');
    console.log('\nInstallation instructions:');
    console.log('Windows: Download from https://www.postgresql.org/download/windows/');
    console.log('macOS: brew install postgresql');
    console.log('Linux: sudo apt-get install postgresql\n');
    process.exit(1);
  }

  // Check if PostgreSQL service is running
  if (!checkPostgresService()) {
    console.error('PostgreSQL service is not running. Please start the service.');
    console.log('\nStart service instructions:');
    console.log('Windows: Start PostgreSQL service from Services');
    console.log('macOS: brew services start postgresql');
    console.log('Linux: sudo service postgresql start\n');
    process.exit(1);
  }

  // Get database credentials
  const username = await new Promise(resolve => {
    rl.question('Enter PostgreSQL username (default: postgres): ', (answer) => {
      resolve(answer || 'postgres');
    });
  });

  const password = await new Promise(resolve => {
    rl.question('Enter PostgreSQL password: ', (answer) => {
      resolve(answer);
    });
  });

  const dbname = await new Promise(resolve => {
    rl.question('Enter database name (default: todo_app): ', (answer) => {
      resolve(answer || 'todo_app');
    });
  });

  // Create database
  console.log('\nCreating database...');
  if (createDatabase(username, password, dbname)) {
    console.log('Database created successfully!');
    
    // Create .env file
    const envContent = `DATABASE_URL="postgresql://${username}:${password}@localhost:5432/${dbname}?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000`;

    require('fs').writeFileSync('.env', envContent);
    console.log('\n.env file created with database configuration.');
    
    console.log('\nSetup completed successfully!');
    console.log('You can now run:');
    console.log('1. npm run db:setup');
    console.log('2. npm run dev');
  } else {
    console.error('Failed to create database. Please check your credentials and try again.');
  }

  rl.close();
}

setup(); 