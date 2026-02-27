import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve frontend if you put index.html in /public

const API_KEY = 'qasim-dev';
const HISTORY_FILE = path.join(process.cwd(), 'history.json');

function saveHistory(entry) {
  let history = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : [];
  history.unshift(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 50), null, 2));
}

async function proxy(url, name, req, res) {
  try {
    const data = await (await fetch(url)).json();
    saveHistory({ endpoint: name, query: req.originalUrl, timestamp: new Date().toISOString() });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: `${name} failed` });
  }
}

// ───────────────────────────────────────
// YouTube
// ───────────────────────────────────────
app.get('/api/yts/searchAll', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/yts/searchAll?apiKey=\( {API_KEY}&query= \){req.query.query || req.query.q || ''}`,
  'YT searchAll', req, res
));

app.get('/api/yts/searchVideos', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/yts/searchVideos?apiKey=\( {API_KEY}&query= \){req.query.query || req.query.q || ''}`,
  'YT searchVideos', req, res
));

app.get('/api/yts/getVideo', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/yts/getVideo?apiKey=\( {API_KEY}&id= \){req.query.id || ''}`,
  'YT getVideo', req, res
));

app.get('/api/yts/getPlaylist', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/yts/getPlaylist?apiKey=\( {API_KEY}&id= \){req.query.id || ''}`,
  'YT getPlaylist', req, res
));

app.get('/api/yts/channelVideos', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/yts/channelVideos?apiKey=\( {API_KEY}&channel= \){req.query.channel || ''}`,
  'YT channelVideos', req, res
));

app.get('/api/youtube/video', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/youtube/video?apiKey=\( {API_KEY}&query= \){req.query.query || ''}`,
  'YouTube video', req, res
));

app.get('/api/youtube/play', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/youtube/play?apiKey=\( {API_KEY}&query= \){req.query.query || ''}`,
  'YouTube play', req, res
));

// ───────────────────────────────────────
// SoundCloud
// ───────────────────────────────────────
app.get('/api/soundcloud/search', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/soundcloud/search?q=\( {req.query.q || ''}&apiKey= \){API_KEY}`,
  'SoundCloud search', req, res
));

app.get('/api/soundcloud/download', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/soundcloud/download?url=\( {encodeURIComponent(req.query.url || '')}&apiKey= \){API_KEY}`,
  'SoundCloud download', req, res
));

// ───────────────────────────────────────
// Deezer
// ───────────────────────────────────────
app.get('/api/deezer/deezer', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/deezer/deezer?apiKey=\( {API_KEY}&path= \){req.query.path || ''}&resource=\( {req.query.resource || ''}&id= \){req.query.id || ''}&album=\( {req.query.album || ''}&artist= \){req.query.artist || ''}&track=\( {req.query.track || ''}&playlist= \){req.query.playlist || ''}`,
  'Deezer general', req, res
));

app.get('/api/deezer/track', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/deezer/track?id=\( {req.query.id || ''}&apiKey= \){API_KEY}`,
  'Deezer track', req, res
));

app.get('/api/deezer/search', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/deezer/search?apiKey=\( {API_KEY}&track= \){req.query.track || ''}&artist=\( {req.query.artist || ''}&album= \){req.query.album || ''}&label=\( {req.query.label || ''}&dur_min= \){req.query.dur_min || ''}&dur_max=\( {req.query.dur_max || ''}&bpm_min= \){req.query.bpm_min || ''}&bpm_max=${req.query.bpm_max || ''}`,
  'Deezer search', req, res
));

// ───────────────────────────────────────
// MusicBrainz
// ───────────────────────────────────────
app.get('/api/musicbrainz/albums', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/musicbrainz/albums?query=\( {req.query.query || req.query.q || ''}&apiKey= \){API_KEY}`,
  'MB albums', req, res
));

app.get('/api/musicbrainz/artist', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/musicbrainz/artist?artist_id=\( {req.query.artist_id || ''}&apiKey= \){API_KEY}`,
  'MB artist', req, res
));

// ───────────────────────────────────────
// Jamendo
// ───────────────────────────────────────
app.get('/api/jamendo/albumTracks', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/jamendo/albumTracks?artist_name=\( {req.query.artist_name || ''}&apiKey= \){API_KEY}`,
  'Jamendo albumTracks', req, res
));

// ───────────────────────────────────────
// Loaderto Download
// ───────────────────────────────────────
app.get('/api/loaderto/download', (req, res) => proxy(
  `https://api.qasimdev.dpdns.org/api/loaderto/download?apiKey=\( {API_KEY}&url= \){encodeURIComponent(req.query.url || '')}&format=${req.query.format || 'mp3'}`,
  'Loaderto download', req, res
));

// Health check
app.get('/', (req, res) => res.send('StreamMe backend is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));