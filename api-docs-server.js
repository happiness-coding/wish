// api-docs-server.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());

// Read and parse the YAML file
const apiSpec = yaml.load(fs.readFileSync(join(__dirname, 'api-spec/task-api.yaml'), 'utf8'));

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

// Root route to redirect to docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`API Documentation server running at http://localhost:${PORT}/api-docs`);
});
