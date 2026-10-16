# Weather App

A small Express server that serves the frontend and proxies weather searches to OpenWeatherMap.

## Run locally

```bash
cd backend
npm ci
cp .env.example .env
```

Set `OPENWEATHERMAP_API_KEY` in `backend/.env`, then start the app:

```bash
npm start
```

Open `http://localhost:3000`.

## Deploy on Render

This project includes `render.yaml` for a free Render web service. Put this `weather-app` folder in its own GitHub repository; do not use the parent workspace's existing `todo-app` remote. In Render, create a Blueprint from that repository and enter `OPENWEATHERMAP_API_KEY` when prompted. The key belongs in Render's environment settings, never in Git or the frontend.

Render's free web services sleep after 15 minutes without traffic. The first visit after sleep can take about a minute to wake the service.
