#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import latestVersion from "latest-version";

async function initProject() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input: string) => {
        if (!input) return "Project name cannot be empty";
        return /^[a-z0-9\-]+$/.test(input)
          ? true
          : "Use only lowercase letters, numbers, and hyphens";
      },
    },
    {
      type: "list",
      name: "language",
      message: "Choose server language:",
      choices: ["JavaScript", "TypeScript"],
    },
  ]);

  const { projectName, language } = answers;
  const projectDir = path.join(process.cwd(), projectName);

  // Create the project main folder
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
    console.log(`Created project folder: ${projectName}`);
  } else {
    console.log(
      `Folder ${projectName} already exists. Files may be overwritten.`
    );
  }

  // fetch version
  let expressVersion = "4.18.2";
  let dotenvVersion = "16.4.7";
  let nodemonVersion = "3.1.9";

  try {
    expressVersion = await latestVersion("express");
    console.log(`Latest express version: ${expressVersion}`);
  } catch (error) {
    console.log(
      "Failed to fetch latest express version, using default ^4.18.2"
    );
  }
  try {
    dotenvVersion = await latestVersion("dotenv");
    console.log(`Latest dotenv version: ${dotenvVersion}`);
  } catch (error) {
    console.log("Failed to fetch latest dotenv version, using default ^16.4.7");
  }
  try {
    nodemonVersion = await latestVersion("nodemon");
    console.log(`Latest nodemon version: ${nodemonVersion}`);
  } catch (error) {
    console.log(
      "Failed to fetch latest nodemonVersion version, using default ^16.4.7"
    );
  }

  //  package.json
  const packageJsonContent = {
    name: projectName,
    version: "1.0.0",
    description:
      "A basic Express server generated by create-basic-express-server",
    main: "server.js",
    type: "module",
    scripts:
      language === "TypeScript"
        ? {
            start: "node dist/app.js",
            build: "tsc",
            watch: "tsc -w",
            dev: "nodemon dist/app.js",
          }
        : { start: "node src/server.js", dev: "nodemon app.js" },
    author: "",
    license: "ISC",
    dependencies: {
      express: `^${expressVersion}`,
      dotenv: `^${dotenvVersion}`,
    },
    devDependencies: {
      nodemon: `^${nodemonVersion}`,
    },
  };
  const packageJsonPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJsonContent, null, 2)
    );
    console.log("Created package.json");
  } else {
    console.log("package.json already exists, skipping creation");
  }

  // 2. .gitignore
  const gitignoreContent = `node_modules
.env
dist
`;
  const gitignorePath = path.join(projectDir, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log("Created .gitignore");
  } else {
    console.log(".gitignore already exists, skipping creation");
  }

  // 3. .env
  const envCOntent = `PORT=3000`;
  const envPath = path.join(projectDir, ".env");
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envCOntent);
    console.log("Created .env");
  } else {
    console.log(".env already exists, skipping creation");
  }

  // 4. tsconfig.json
  if (language === "TypeScript") {
    const tsconfigContent = {
      compilerOptions: {
        target: "ES2020",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        rootDir: "src",
        outDir: "dist",
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        skipLibCheck: true,
      },
    };
    const tsconfigPath = path.join(projectDir, "tsconfig.json");
    if (!fs.existsSync(tsconfigPath)) {
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfigContent, null, 2));
      console.log("Created tsconfig.json");
    } else {
      console.log("tsconfig.json already exists, skipping creation");
    }
  }

  //  src
  const srcPath = path.join(projectDir, "src");
  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath);
    console.log("Created src folder");
  } else {
    console.log("src folder already exists, skipping creation");
  }

  //  subfolders
  const subfolders =
    language === "TypeScript"
      ? ["controllers", "middlewares", "models", "types", "utils"]
      : ["controllers", "middlewares", "models", "utils"];

  subfolders.forEach((folder) => {
    const folderPath = path.join(srcPath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Created src/${folder} folder`);
    } else {
      console.log(`src/${folder} folder already exists, skipping creation`);
    }
  });

  // main file
  const serverFileName = language === "TypeScript" ? "server.ts" : "server.js";
  const serverFilePath = path.join(srcPath, serverFileName);
  let serverCode = "";

  if (language === "TypeScript") {
    serverCode = `import express, { Request, Response } from 'express';
import { config } from "dotenv";

    config({
      path: "./.env",
    });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// You might need to give cors permission


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from your TypeScript Express Server!');
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`;
  } else {
    serverCode = `import express from "express";
    import { config } from "dotenv";

    config({
      path: "./.env",
    });

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
// You might need to give cors permission


app.get('/', (req, res) => {
  res.send('Hello from your JavaScript Express Server!');
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`;
  }

  if (!fs.existsSync(serverFilePath)) {
    fs.writeFileSync(serverFilePath, serverCode);
    console.log(`Created src/${serverFileName} with basic server code.`);
  } else {
    console.log(`src/${serverFileName} already exists, skipping creation`);
  }
}

initProject().catch((error) => {
  console.error("Error initializing project:", error);
});
