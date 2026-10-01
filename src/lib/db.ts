import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'users.json');

// Initialize DB file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

export const getUsers = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

export const saveUsers = (users: any[]) => {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};
