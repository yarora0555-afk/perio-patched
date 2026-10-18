# Vercel deployment notes

## Required setup

1. In Vercel, set **Framework Preset** to Next.js, **Root Directory** to the folder containing this `package.json`, and leave the build command as `npm run build` (or Vercel's default Next.js build).
2. In Vercel **Project → Settings → Environment Variables**, add `DATABASE_URL` for Production and any Preview/Development environments you use. Use the pooled connection string from the correct Neon project, with SSL enabled (`sslmode=require`). Keep it server-only: do not prefix it with `NEXT_PUBLIC_`.
3. Create the schema in Neon once. With this project directory as the working directory and `DATABASE_URL` set to the Neon URL, run `npm run db:push`. For local development, put the URL in `.env.local` (copy `.env.example` and replace the placeholder). Do not commit `.env.local` or real credentials.
4. Redeploy after changing Vercel environment variables; existing deployments do not receive updated values.

`AI_MODEL_URL` and `AI_MODEL_KEY` are optional. If unset or unreachable, assessments use the built-in TypeScript engine.

## What to check when it still fails

- Open `https://<your-domain>/api/health`. A successful result has `ok: true`. If it says `DATABASE_URL is not configured`, check that the variable is set for the environment serving that deployment and redeploy. If it reports a database query failure, verify the Neon project/branch is active, the URL is for that database, SSL is enabled, and the schema push completed.
- In Vercel **Deployments → [deployment] → Build Logs**, check the first error around dependency installation, TypeScript, or `next build`. This is a build failure and will not be fixed by changing Neon data.
- For a deployed 500, open **Runtime Logs** (or **Functions → Logs** for the deployment) and filter to the failing path. Check the route and exception. Database errors such as missing relations usually mean `npm run db:push` was not run against the same Neon database used by `DATABASE_URL`.
- Confirm the deployment's **Source** is the expected GitHub branch/commit. If the repository contains the app in a subfolder, set that subfolder as Vercel's Root Directory.

The health endpoint intentionally avoids returning database provider details to public callers. Vercel Runtime Logs contain the server-side exception for diagnosis; never paste or publish `DATABASE_URL` or `AI_MODEL_KEY`.
