const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('YouTube Downloader API is live!');
});

app.get('/api/download', async (req, res) => {
  try {
    const videoURL = req.query.url;
    if (!videoURL || !ytdl.validateURL(videoURL)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing YouTube URL',
      });
    }

    const info = await ytdl.getInfo(videoURL, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 Chrome/113.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }
    });

    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

    res.json({
      success: true,
      title: info.videoDetails.title,
      formats: formats.map(format => ({
        quality: format.qualityLabel,
        itag: format.itag,
        mimeType: format.mimeType,
        url: format.url
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Download failed'
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
