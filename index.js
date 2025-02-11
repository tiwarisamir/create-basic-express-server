#!/usr/bin/env node

import fs from "fs";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";

// Boilerplate code templates
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

const createFiles = (basePath, structure) => {
  Object.entries(structure).forEach(([filePath, content]) => {
    const fullPath = path.join(basePath, filePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
  });
};

const createFolder = (basePath, folderName) => {
  const folderPath = path.join(basePath, folderName);
  try {
    fs.mkdir(folderPath, { recursive: true });
    console.log("Folder created successfully");
  } catch (error) {
    console.error("Error creating folder:", error);
  }
};

(async () => {
  console.log(chalk.blue("Welcome to Create Express Server!"));

  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Enter the name of your project:",
      initial: "express-server",
    },
    {
      type: "select",
      name: "language",
      message: "Choose a language:",
      choices: [
        { title: "JavaScript", value: "js" },
        { title: "TypeScript", value: "ts" },
      ],
    },
  ]);

  const projectDir = path.resolve(process.cwd(), response.projectName);

  if (fs.existsSync(projectDir)) {
    console.log(chalk.red("Error: Directory already exists."));
    process.exit(1);
  }

  createFolder("/src", "controller");
  createFolder("/src", "model");
  createFolder("/src", "routes");

  const template = response.language === "ts" ? tsTemplate : jsTemplate;
  fs.mkdirSync(projectDir, { recursive: true });
  createFiles(projectDir, template);

  console.log(chalk.green(`Project created successfully at ${projectDir}`));
})();
