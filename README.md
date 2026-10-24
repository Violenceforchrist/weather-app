# Weather App — Meteor Weather Dashboard

A responsive weather dashboard with a modern dark interface, live city search, saved searches, and current weather data powered by the OpenWeatherMap API.

## Features

- Search for weather by city.
- View temperature, weather conditions, atmospheric pressure, humidity, visibility, sunrise, and sunset.
- Four-day weather forecast.
- Recent city searches saved in the browser.
- Responsive layout for desktop and mobile devices.
- Newsletter email validation.
- Secure backend API proxy for OpenWeatherMap.

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- OpenWeatherMap API

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Violenceforchrist/weather-app.git
cd weather-app
```

### 2. Configure the backend

```bash
cd backend
npm ci
cp .env.example .env
```

Open `backend/.env` and set your OpenWeatherMap API key:

```env
OPENWEATHERMAP_API_KEY=your_api_key_here
```

Keep your API key private. Do not commit the `.env` file to GitHub.

### 3. Start the application

From the `backend` directory, run:

```bash
npm start
```

Open the application at:

http://localhost:3000

## Deploy on Render

This project includes a `render.yaml` configuration for deploying a web service on Render.

1. Ensure the weather app is stored in its own GitHub repository.
2. Do not use the parent workspace's existing `todo-app` remote for this project.
3. In Render, create a Blueprint using the weather app repository.
4. Set `OPENWEATHERMAP_API_KEY` in Render's environment settings.
5. Deploy the application and open the public URL provided by Render.

Never put your API key in frontend JavaScript or commit it to Git.

**Note:** Render's free web services may sleep after 15 minutes without traffic. The first visit after sleeping can take about a minute to wake the service.