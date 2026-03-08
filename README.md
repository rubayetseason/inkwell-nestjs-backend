```{=html}
<p align="center">
```
`<a href="http://nestjs.com/" target="blank">`{=html}
`<img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />`{=html}
`</a>`{=html}
```{=html}
</p>
```
```{=html}
<h1 align="center">
```
Inkwell Backend API
```{=html}
</h1>
```
```{=html}
<p align="center">
```
AI-powered backend for the `<b>`{=html}Inkwell`</b>`{=html} blogging
platform built with `<b>`{=html}NestJS`</b>`{=html},
`<b>`{=html}MongoDB`</b>`{=html}, and
`<b>`{=html}OpenRouter/OpenAI`</b>`{=html}.
```{=html}
</p>
```

------------------------------------------------------------------------

# ✨ Overview

The **Inkwell Backend** powers an AI‑enhanced social blogging platform
where writers and readers can explore ideas with AI assistance.

The backend provides:

-   Authentication & authorization
-   Blog management APIs
-   AI-powered content tools
-   User profiles and interactions
-   Agentic Kanban workflows

This service is built with **NestJS** and communicates with AI models
through **OpenRouter / OpenAI compatible APIs**.

------------------------------------------------------------------------

# 🚀 Features

### Authentication

-   JWT based authentication
-   Secure password hashing using **bcryptjs**
-   Login / Register endpoints
-   Protected routes with **Passport JWT**

### Blogs

-   Create blog posts
-   Edit & delete blogs
-   Fetch blog feed
-   Like & dislike posts

### Users

-   User profiles
-   Follow / unfollow users
-   User content retrieval

### AI Features

-   **TL;DR summarization** of blog posts
-   **AI explainer** for complex content
-   **AI expansion** to extend ideas
-   **Agentic Kanban workflows** powered by AI

### Search

-   Blog and content search support

------------------------------------------------------------------------

# 🧰 Tech Stack

  Technology            Purpose
  --------------------- --------------------
  NestJS                Backend framework
  MongoDB + Mongoose    Database
  JWT + Passport        Authentication
  OpenRouter / OpenAI   AI model access
  bcryptjs              Password hashing
  class-validator       Request validation
  TypeScript            Type safety

------------------------------------------------------------------------

# 📁 Project Structure

    src
    │
    ├── ai/           # AI services (TLDR, explain, expansion)
    ├── auth/         # Authentication module (JWT, guards)
    ├── blogs/        # Blog CRUD and interactions
    ├── kanban/       # AI-powered Kanban agents
    ├── search/       # Search functionality
    ├── users/        # User profiles and relationships
    │
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    └── main.ts

------------------------------------------------------------------------

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

    MONGODB_URI=
    JWT_SECRET=
    JWT_EXPIRES_IN=
    PORT=

    OPENROUTER_API_KEY=
    OPENROUTER_BASE_URL=
    OPENAI_GPT_MODEL=

    FRONTEND_URL=
    APP_TITLE=

------------------------------------------------------------------------

# 📦 Installation

Clone the repository:

``` bash
git clone <your-backend-repo-url>
```

Install dependencies:

``` bash
npm install
```

------------------------------------------------------------------------

# ▶️ Running the Application

### Development

``` bash
npm run start:dev
```

### Production

``` bash
npm run build
npm run start:prod
```

------------------------------------------------------------------------

# 🧪 Testing

Run unit tests:

``` bash
npm run test
```

Watch tests:

``` bash
npm run test:watch
```

Test coverage:

``` bash
npm run test:cov
```

Run e2e tests:

``` bash
npm run test:e2e
```

------------------------------------------------------------------------

# 🔗 Frontend

This backend serves the **Inkwell Next.js frontend** which includes:

-   Rich text blogging with **Tiptap**
-   AI TLDR & explain tools
-   AI Kanban workflow agents

Frontend communicates via REST APIs exposed by this service.

------------------------------------------------------------------------

# 🧠 AI Integration

AI functionality is powered by **OpenRouter** with OpenAI-compatible
models.

Capabilities include:

-   Summarizing blog posts
-   Explaining difficult concepts
-   Expanding ideas
-   Automating Kanban workflows

------------------------------------------------------------------------

# 📜 License

This project is licensed under the **MIT License**.
