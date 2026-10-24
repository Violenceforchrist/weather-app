'use strict';

const path = require('path');
const express = require('express');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');
const CITY_PATTERN = /^[\p{L}\p{M}\p{N} .,'’\-]+$/u;

app.use(express.static(FRONTEND_DIR));

app.get('/api/weather', async (req, res) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
  const latitude = typeof req.query.lat === 'string' ? Number(req.query.lat) : NaN;
  const longitude = typeof req.query.lon === 'string' ? Number(req.query.lon) : NaN;
  const requestedLocation = 'lat' in req.query || 'lon' in req.query;

  if (requestedLocation && (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180)) {
    return res.status(400).json({ error: 'The supplied location is invalid.' });
  }
  if (!requestedLocation && !city) {
    return res.status(400).json({ error: 'Enter a city name to search.' });
  }
  if (!requestedLocation && (city.length > 80 || !CITY_PATTERN.test(city) || !/[\p{L}\p{N}]/u.test(city))) {
    return res.status(400).json({ error: 'Enter a valid city name (up to 80 characters).' });
  }
  if (!API_KEY) {
    console.error('OPENWEATHERMAP_API_KEY is not configured.');
    return res.status(500).json({ error: 'Weather service is not configured. Add an API key to backend/.env.' });
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  if (requestedLocation) {
    url.searchParams.set('lat', String(latitude));
    url.searchParams.set('lon', String(longitude));
  } else {
    url.searchParams.set('q', city);
  }
  url.searchParams.set('appid', API_KEY);
  url.searchParams.set('units', 'metric');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const upstream = await fetch(url, { signal: controller.signal });
    if (upstream.status === 404) {
      return res.status(404).json({ error: requestedLocation ? 'Weather is unavailable for this location.' : 'City not found. Check the spelling and try again.' });
    }
    if (upstream.status === 401) {
      console.error('OpenWeatherMap rejected the configured API key.');
      return res.status(502).json({ error: 'The weather service rejected its API key. Check backend/.env.' });
    }
    if (upstream.status === 429) {
      return res.status(503).json({ error: 'The weather service is busy. Please try again shortly.' });
    }
    if (!upstream.ok) {
      console.error(`OpenWeatherMap returned HTTP ${upstream.status}.`);
      return res.status(502).json({ error: 'The weather service is temporarily unavailable.' });
    }

    const data = await upstream.json();
    if (!data.main || !data.sys || !Array.isArray(data.weather) || !data.weather[0]) {
      return res.status(502).json({ error: 'The weather service returned an invalid response.' });
    }
    return res.json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Weather request timed out. Please try again.' });
    }
    console.error('Weather request failed:', error.message);
    return res.status(502).json({ error: 'Could not reach the weather service. Check your connection and try again.' });
  } finally {
    clearTimeout(timeout);
  }
});

app.get('*', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'index.html')));

app.listen(PORT, () => {
  console.log(`Weather app available at http://localhost:${PORT}`);
});
