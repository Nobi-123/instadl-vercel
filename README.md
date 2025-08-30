# InstaDL Vercel API

Deployable Instagram downloader API for public Reels/Posts.

## Usage
```
GET /api/instadl?url=https://www.instagram.com/reel/XXXXXXXX/
```
Response:
```json
{
  "status": "success",
  "content_url": "https://video-cdn-url.mp4"
}
```
