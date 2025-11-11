
---

# 🚀 Full-Stack Deployment Guide (Render + Aiven)

## 1. Project Setup

Your repo has a `server/` (backend) and `client/` (frontend) folder.
Make sure both are working locally before deploying.

---

## 2. Deploying the Server on Render

1. Go to [Render.com](https://render.com) → **New → Web Service**.
2. Connect your **GitHub repo**.
3. Set the **root directory** to `server/`.
4. Build command: `npm install`
   Start command: `npm start` (or include `npm run initdb` if seeding data).
5. Add environment variables from your `.env` file (database credentials, client URL, etc.).
6. Deploy and note the **server URL** (e.g. `https://chatly-server.onrender.com`).

---

## 3. Setting Up the Database (Aiven)

1. Go to [Aiven.io](https://aiven.io) and create a **PostgreSQL** service (free plan).
2. Copy the connection details (host, port, database, user, password).
3. Download the **CA certificate** and make sure SSL is enabled.
4. Add these values to your server `.env` file and in Render’s environment variables.

---

## 4. Deploying the Client on Render

1. Go to **New → Static Site**.
2. Choose the same repo, but set the **root directory** to `client/`.
3. Build command: `npm install && npm run build`.
   Publish directory: `dist`.
4. Add the environment variable for your API URL (e.g. `VITE_API_URL=https://chatly-server.onrender.com`).
5. Deploy — your frontend will get its own Render domain.

---

## 5. Final Steps

* In your server, allow CORS for your client’s domain.
* In your client (React/Vite), make sure the API URL points to your deployed server.
* Add/update any environment variables in Render, not in GitHub.
* Redeploy both services after making changes.

---

✅ Done!

* **Server:** `https://your-server.onrender.com`
* **Client:** `https://your-client.onrender.com`
* **Database:** Hosted on **Aiven PostgreSQL**

---

