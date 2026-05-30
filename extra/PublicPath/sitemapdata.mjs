import feed from "../../model/feeds.mjs"
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const sitemap = async (req, res) => {
   try {
    const posts = await feed.find({}, '_id updatedAt');

    const links = [
      { url: '/', priority: 1.0 },
      { url: '/user/RenderFeed', priority: 0.8 },
      ...posts.map(post => ({
        url: `/post/${post._id}`,
        lastmod: new Date(post.updatedAt).toISOString(),
        priority: 0.7
      }))
    ];

    const stream = new SitemapStream({ 
      hostname: 'https://downzilla.buzz' 
    });

    const data = await streamToPromise(
      Readable.from(links).pipe(stream)
    );

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(data.toString());

  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).end();
  }
}

const robotstxt = (req, res) => {
   res.setHeader('Content-Type', 'text/plain');
   res.send(
   `User-agent: *
    Allow: /

    Sitemap: https://downzilla.buzz/sitemap.xml`
    )
}

export {sitemap, robotstxt}