import fs from "fs-extra";
import path from "path";

const jsTemplate = {
  "src/server.js": `const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
  ".env": `PORT=3000`,
  "package.json": JSON.stringify(
    {
      name: "express-server",
      version: "1.0.0",
      scripts: {
        start: "node src/server.js",
      },
      dependencies: {
        express: "^4.18.2",
        dotenv: "^16.0.3",
      },
    },
    null,
    2
  ),
};

const tsTemplate = {
  ...jsTemplate,
  "src/server.ts": jsTemplate["src/server.js"].replace(
    "const express = require('express');",
    "import express from 'express';"
  ),
  "tsconfig.json": JSON.stringify(
    {
      compilerOptions: {
        target: "ES6",
        module: "CommonJS",
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
      },
      exclude: ["node_modules"],
    },
    null,
    2
  ),
};

// create folders
function createFolders(basePath: string, language: string) {
  const folders = ["controllers", "middlewares", "models", "routes"];
  if (language === "ts") folders.push("types"); // Add 'types' folder for TS projects

  folders.forEach((folder) => {
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });
}

//  create project files
export function createProjectStructure(projectName: string, language: string) {
  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log("Error: Directory already exists.");
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });
  createFolders(projectPath, language);

  const template = language === "ts" ? tsTemplate : jsTemplate;
  Object.entries(template).forEach(([filePath, content]) => {
    const fullPath = path.join(projectPath, filePath);
    fs.outputFileSync(fullPath, content);
  });

  console.log(`Project created at: ${projectPath}`);
}
