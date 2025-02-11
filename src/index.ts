#!/usr/bin/env node

import { getUserInput } from "./prompts";
import { createProjectStructure } from "./createFiles";
import chalk from "chalk";

async function main() {
  console.log(chalk.blue("Welcome to Create Express Server!"));

  const { projectName, language } = await getUserInput();
  createProjectStructure(projectName, language);

  console.log(
    chalk.green(`\nProject '${projectName}' created successfully! 🚀`)
  );
}

main();
