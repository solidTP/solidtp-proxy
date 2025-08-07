import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/api/stats', async (req, res) => {
  try {
    const steamId = '76561198980015831';
    const response = await fetch(`https://csstats.gg/player/${steamId}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const stats = {
      kills: $('[data-label="Kills"] .value').text().trim(),
      matches: $('[data-label="Matches"] .value').text().trim(),
      headshot: $('[data-label="Headshot %"] .value').text().trim(),
      rating: $('.player-header .rating span').text().trim()
    };

    res.json(stats);
  } catch (err) {
    console.error('Ошибка при парсинге:', err.message);
    res.status(500).json({ error: 'Ошибка получения данных с csstats.gg' });
  }
});

app.listen(PORT, () => {
  console.log(`Прокси сервер запущен на http://localhost:${PORT}`);
});
