const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('YouTube Downloader API is running');
});

app.get('/video-info', async (req, res) => {
  try {
    console.log('Video info request received');
    const videoURL = req.query.url;
    if (!videoURL) {
      console.log('Error: No video URL provided');
      return res.status(400).json({ error: 'Video URL is required' });
    }

    console.log('Fetching video info for:', videoURL);
    const info = await ytdl.getInfo(videoURL);
    const formats = info.formats.map(format => ({
      quality: format.qualityLabel || 'Audio Only',
      itag: format.itag,
      hasAudio: format.hasAudio,
      container: format.container,
      mimeType: format.mimeType,
      audioQuality: format.audioQuality,
      bitrate: format.bitrate,
      size: format.contentLength ? `${(parseInt(format.contentLength) / 1024 / 1024).toFixed(2)} MB` : 'Unknown'
    }));

    // Sort formats by quality (highest first)
    const qualities = formats.sort((a, b) => {
      if (!a.quality || !b.quality) return 0;
      const aNum = parseInt(a.quality);
      const bNum = parseInt(b.quality);
      return isNaN(aNum) || isNaN(bNum) ? 0 : bNum - aNum;
    });

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: info.videoDetails.lengthSeconds,
      qualities: qualities
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/download', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL required' 
      });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid YouTube URL'
      });
    }

    const info = await ytdl.getInfo(url);
    const formats = info.formats.filter(format => format.hasAudio && format.hasVideo);
    
    if (formats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No suitable format found'
      });
    }

    // Choose the first available format
    const format = formats[0];

    res.json({
      success: true,
      title: info.videoDetails.title,
      formats: formats.map(f => ({
        url: f.url,
        quality: f.qualityLabel,
        container: f.container
      }))
    });

  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Download failed'
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
