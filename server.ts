import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In AI Studio, the frontend is usually served by Vite in dev, 
// but in production we serve the dist folder.
app.use(express.static(path.join(__dirname, 'dist')));

// Admin Allowlist (from env or hardcoded for bootstrap)
const ADMIN_ALLOWLIST = [
  process.env.ADMIN_EMAIL || 'hainguyenbtm.070589@gmail.com'
];

app.get('/api/admin-check', (req, res) => {
  const email = req.query.email as string;
  if (ADMIN_ALLOWLIST.includes(email)) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
});

// For any other request, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
