# Maa Tara Freedom Trust

Website and admin CMS for Maa Tara Freedom Trust. The application uses Laravel 13, Inertia, React, TypeScript, Tailwind CSS, and Wayfinder.

## Requirements

- PHP 8.3 or newer with the extensions required by Laravel
- Composer
- Node.js and npm
- SQLite for the default local database, or MySQL/PostgreSQL if configured below

## First-time setup

From the project directory, install dependencies and create your local environment file:

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

### Database

The default `.env.example` is configured for SQLite. Create the database file if it does not already exist, then run the migrations and demo seed data:

```bash
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate --seed
```

To use MySQL instead, create an empty database (for example, `maa_tara`) and update the database section of `.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_name
DB_USERNAME=root
DB_PASSWORD=your_password
```

Then run `php artisan migrate --seed`. Keep `.env` local; do not commit database credentials.

## Run locally

Open two terminals in the project directory. Start Laravel in one:

```bash
php artisan serve
```

Start Vite in the other:

```bash
npm run dev
```

Or Better 


```bash
composer run dev
```

Open the URL printed by `php artisan serve` (usually `http://127.0.0.1:8000`). Vite serves frontend assets and rebuilds them as you edit.

## Wayfinder routes and forms

Wayfinder generates typed JavaScript/TypeScript helpers from the Laravel routes and controller actions. The Vite Wayfinder plugin in `vite.config.ts` runs as part of the frontend dev/build workflow and writes generated files under `resources/js/actions` and `resources/js/routes` (both are generated/ignored files).

After adding or changing routes or controller actions, restart `npm run dev` if needed so the generated helpers refresh. To generate them directly, run:

```bash
php artisan wayfinder:generate --with-form
```

Use the generated helpers in frontend code instead of hard-coding route URLs where practical.

## Useful commands

```bash
php artisan migrate                 # Apply pending migrations
php artisan migrate:status          # Show migration status
php artisan migrate:fresh --seed    # Recreate local schema and reload demo data (deletes existing data)
php artisan db:seed                 # Reload demo seed data
php artisan route:list              # List registered Laravel routes
npm run build                       # Build production frontend assets
npm run check                       # Run frontend lint/format checks
npm run types:check                 # Check TypeScript types
composer test                       # Run the project's test and PHP quality checks
```

The demo seeder creates an admin account: `admin@maatarafreedomtrust.org` with password `password123`. Change or remove these demo credentials before deploying the application.

## Production build

```bash
npm run build
```

Configure production environment values in the deployment environment, then run Laravel's production deployment steps (including migrations with `php artisan migrate --force`).
