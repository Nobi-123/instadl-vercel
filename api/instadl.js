export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ status: "error", message: "Missing ?url=InstagramPostURL" });

    const resp = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
        "accept-language": "en-US,en;q=0.9"
      }
    });

    if (!resp.ok) {
      return res.status(502).json({ status: "error", message: `Fetch failed: ${resp.status}` });
    }

    const html = await resp.text();

    // Find video URL
    let m = html.match(/"video_url"\s*:\s*"([^"]+)"/i);
    if (m && m[1]) {
      const urlRaw = m[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
      return res.json({ status: "success", content_url: urlRaw });
    }

    // Fallback to og:image
    m = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (m && m[1]) {
      return res.json({ status: "success", content_url: m[1] });
    }

    return res.status(404).json({ status: "error", message: "No media found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: String(err) });
  }
}
