# `create-basic-express-server`

_A CLI tool to generate a basic Express.js project with TypeScript or JavaScript._

---

## 🚀 Installation

You can run this tool using

```sh
npm create basic-express-server my-app
```

Or install it globally:

```sh
npm install -g create-basic-express-server
create-basic-express-server my-app
```

---

## 📂 Project Structure

This tool generates an Express.js project with the following structure:

```
my-app
│── package.json
│── .gitignore
│── .env
│── tsconfig.json (for typescript)
└── src
    ├── controllers
    ├── middlewares
    ├── models
    ├── types (for typescript)
    ├── utils
    └── server.ts (for typescript) or server.js (for javascript)
```

---

## 🔧 Usage

Run the following command to generate a new project:

```sh
npm create basic-express-server my-app
```

### 🏃‍♂️ Running the Project

### For JavaScript:

```sh
cd my-app
npm install
```

**In Development**

```
npm run dev
```

**In Production**

```
npm run start
```

### For TypeScript:

```sh
cd my-app
npm install

```

**For Development**
Run in two Terminal

```
npm run watch
```

```
npm run dev
```

**For Production**

```
npm run build
npm run start
```

## 📜 Features

✅ Generate an Express.js project in seconds  
✅ Supports both **JavaScript** and **TypeScript**  
✅ Pre-configured folder structure  
✅ Adds essential dependencies (`express`, `dotenv`, etc.)  
✅ Automatically sets the latest package versions in `package.json`

---

## 🤝 Contributing

Feel free to submit issues and pull requests on [GitHub](https://github.com/tiwarisamir/create-basic-express-server).

---

## 📝 License

This project is licensed under the **MIT License**.
