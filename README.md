# VibeTravels

## Project Description

VibeTravels is a travel planning app that turns simple notes about destinations or trip ideas into detailed, personalized itineraries using artificial intelligence. The application allows users to manage their travel notes, set personalized travel preferences, and generate comprehensive travel plans tailored to their individual needs.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind CSS 4, and Shadcn/ui.
- **Backend:** Supabase (PostgreSQL, Authentication, and logging).
- **AI Integration:** Openrouter.ai for accessing a variety of AI models to generate travel plans.
- **CI/CD & Hosting:** GitHub Actions for continuous integration/deployment and DigitalOcean for hosting via Docker.

## Getting Started Locally

1. Ensure you have [Node.js](https://nodejs.org/) version 22.14.0 as specified in the `.nvmrc` file.
2. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
3. Navigate to the project directory:
   ```bash
   cd vibe-travels
   ```
4. Install the dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000` to view the application.

## Available Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Build the project for production.
- `npm run preview` - Preview the production build.
- `npm run astro` - Run Astro CLI commands.
- `npm run lint` - Lint the codebase.
- `npm run lint:fix` - Automatically fix linting errors.
- `npm run format` - Format the code using Prettier.

## Project Scope

- **User Management:** Provides user registration, login, and profile management for personalized travel planning.
- **Notes Management:** Allows users to create, edit, view, and delete travel notes.
- **AI-Driven Planning:** Integrates AI to generate travel plans based on user notes and preferences.

## Project Status

The project is currently in the MVP stage and under active development.

## License

This project is licensed under the MIT License. 
