import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_KEY = 'qasim-dev';
const HISTORY_FILE = path.join('./', 'history.json');

// Utilities
function saveHistory(entry) {
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE));
  }
  history.unshift(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 50), null, 2));
}

async function fetchAPI(url, endpointName) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    saveHistory({ endpoint: endpointName, query: url, timestamp: new Date().toISOString() });
    return data;
  } catch (err) {
    return { error: `${endpointName} failed` };
  }
}

// Routes

// YouTube
app.get('/api/yts/searchAll', async (req, res) => {
  const query = req.query.q || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/yts/searchAll?apiKey=\( {API_KEY}&query= \){query}`, 'YouTube Search All');
  res.json(data);
});

app.get('/api/yts/getVideo', async (req, res) => {
  const id = req.query.id || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/yts/getVideo?apiKey=\( {API_KEY}&id= \){id}`, 'YouTube Get Video');
  res.json(data);
});

app.get('/api/yts/searchPlaylists', async (req, res) => {
  const query = req.query.q || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/yts/searchPlaylists?apiKey=\( {API_KEY}&query= \){query}`, 'YouTube Playlists');
  res.json(data);
});

// Spotify
app.get('/api/spotify/search', async (req, res) => {
  const query = req.query.q || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/spotify/search?q=\( {query}&apiKey= \){API_KEY}`, 'Spotify Search');
  res.json(data);
});

app.get('/api/spotify/trackInfo', async (req, res) => {
  const url = req.query.url || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/spotify/trackInfo?url=\( {url}&apiKey= \){API_KEY}`, 'Spotify Track Info');
  res.json(data);
});

app.get('/api/spotify/download', async (req, res) => {
  const url = req.query.url || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/spotify/download?url=\( {url}&apiKey= \){API_KEY}`, 'Spotify Download');
  res.json(data);
});

// MusicBrainz
app.get('/api/musicbrainz/search', async (req, res) => {
  const query = req.query.q || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/search?query=\( {query}&apiKey= \){API_KEY}`, 'MusicBrainz Search');
  res.json(data);
});

app.get('/api/musicbrainz/artists', async (req, res) => {
  const query = req.query.q || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/artists?query=\( {query}&apiKey= \){API_KEY}`, 'MusicBrainz Artists');
  res.json(data);
});

app.get('/api/musicbrainz/albums', async (req, res) => {
  const query = req.query.q || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/albums?query=\( {query}&apiKey= \){API_KEY}`, 'MusicBrainz Albums');
  res.json(data);
});

app.get('/api/musicbrainz/tracks', async (req, res) => {
  const query = req.query.q || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/tracks?query=\( {query}&apiKey= \){API_KEY}`, 'MusicBrainz Tracks');
  res.json(data);
});

app.get('/api/musicbrainz/artist', async (req, res) => {
  const artist_id = req.query.artist_id || '';
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/artist?artist_id=\( {artist_id}&apiKey= \){API_KEY}`, 'MusicBrainz Artist');
  res.json(data);
});

// Loader Download
app.get('/api/loaderto/download', async (req, res) => {
  const { url, format } = req.query;
  const data = await fetchAPI(`https://api.qasimdev.dpdns.org/api/loaderto/download?apiKey=\( {API_KEY}&url= \){url}&format=${format}`, 'Loader Download');
  res.json(data);
});

// History
app.get('/api/history', (req, res) => {
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE));
  }
  res.json(history);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
