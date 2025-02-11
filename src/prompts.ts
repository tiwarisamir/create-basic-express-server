import prompts from "prompts";

export async function getUserInput() {
  return await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Enter the project name:",
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
}
