# ✨ Editable Portfolio – Personal Portfolio Website

A customizable personal portfolio website built with React, TypeScript, and Vite, featuring a built-in visual editor that allows you to manage and update portfolio content directly through the browser without modifying source code.

🌐 **Live Demo:** [Portfolio Editor](https://soorajstudio.github.io/Portfolio-Editor/)

## 🚀 Features

### Visual Portfolio Editor
- Click and edit text directly on the website.
- Automatically save content changes.
- Add, remove, hide, and reorder portfolio sections.
- Customize navigation labels.
- Add, edit, delete, and reorder projects and other content items.
- Upload, replace, and remove images.

### Content Management
- Manage Hero, About, Skills, Timeline, Projects, Education, and Contact sections.
- Add custom sections.
- Undo previous changes.
- Preview the portfolio as visitors see it.
- Export and import portfolio content using JSON.

### Authentication & Storage
- Admin login for editing access.
- Local browser storage mode.
- Supabase integration for persistent content.
- Image storage using Supabase Storage.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build |
| CSS3 | Styling and animations |
| Supabase | Authentication and database |
| PostgreSQL | Content storage |
| GitHub Pages | Deployment |

## 📸 Screenshots

Add screenshots of:
- Portfolio homepage
- Visual editing interface
- Section management
- Admin login
- Preview mode

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/soorajstudio/Portfolio-Editor.git
```

Navigate to the project directory:

```bash
cd Portfolio-Editor
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL displayed in your terminal.

## 🔐 Supabase Configuration

To enable persistent editing across visitors:

1. Create a Supabase project.
2. Run the SQL script from `supabase/schema.sql`.
3. Create an admin user.
4. Disable public user registration.
5. Configure your environment variables.

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The application can also run in local mode without Supabase configuration.

## 📦 Production Build

Build the application:

```bash
npm run build
```

The production files will be generated inside the `dist/` directory.

## 🌍 Live Deployment

[View Live Portfolio](https://soorajstudio.github.io/Portfolio-Editor/)

## 👨‍💻 Developer

**Sooraj MS**

- GitHub: [@soorajstudio](https://github.com/soorajstudio)

---

⭐ If you find this project interesting, consider giving it a star!
