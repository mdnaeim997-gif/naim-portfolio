import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BehanceProject {
  title: string;
  cover_url: string;
  behance_url: string;
  description: string;
  source: "behance";
  category: "graphic_design" | "video_editing" | "digital_marketing";
}

interface BehanceProjectImage {
  project_id: string;
  image_url: string;
  sort_order: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const behanceUsername = "mdnaeim26";
    const behanceProfileUrl = `https://www.behance.net/${behanceUsername}`;

    let behanceProjects: BehanceProject[] = [];

    // Strategy 1: Try RSS feed
    const rssUrl = `https://feeds.behance.net/${behanceUsername}`;
    try {
      const feedResponse = await fetch(rssUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; NaeimVisualBot/1.0)" },
        signal: AbortSignal.timeout(15000),
      });

      if (feedResponse.ok) {
        const feedText = await feedResponse.text();
        const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
        const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i;
        const linkRegex = /<link>([\s\S]*?)<\/link>/i;
        const descRegex = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i;
        const imgRegex = /<media:content[^>]*url="([^"]+)"[^>]*>/i;
        const mediaImgRegex = /<media:thumbnail[^>]*url="([^"]+)"[^>]*>/i;
        const contentImgRegex = /<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i;

        let match;
        while ((match = itemRegex.exec(feedText)) !== null) {
          const item = match[1];
          const titleMatch = titleRegex.exec(item);
          const linkMatch = linkRegex.exec(item);
          const descMatch = descRegex.exec(item);
          const imgMatch = imgRegex.exec(item);
          const mediaImgMatch = mediaImgRegex.exec(item);
          const contentMatch = contentImgRegex.exec(item);

          let imageUrl = imgMatch?.[1] || mediaImgRegex?.[1] || "";
          if (!imageUrl && contentMatch) {
            const srcMatch = /<img[^>]+src="([^"]+)"/i.exec(contentMatch[1]);
            if (srcMatch) imageUrl = srcMatch[1];
          }
          if (!imageUrl && descMatch) {
            const srcMatch = /<img[^>]+src="([^"]+)"/i.exec(descMatch[1]);
            if (srcMatch) imageUrl = srcMatch[1];
          }

          const title = titleMatch?.[1]?.trim() || "Untitled Project";
          const link = linkMatch?.[1]?.trim() || behanceProfileUrl;
          const rawDesc = descMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "";

          if (imageUrl) {
            behanceProjects.push({
              title,
              cover_url: imageUrl,
              behance_url: link,
              description: rawDesc.substring(0, 500),
              source: "behance",
              category: "graphic_design",
            });
          }
        }
      }
    } catch (feedErr) {
      console.log("RSS feed fetch failed");
    }

    // Strategy 2: Scrape profile page HTML if RSS returned nothing
    if (behanceProjects.length === 0) {
      try {
        const profileResponse = await fetch(`https://www.behance.net/${behanceUsername}`, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; NaeimVisualBot/1.0)" },
          signal: AbortSignal.timeout(15000),
        });

        if (profileResponse.ok) {
          const html = await profileResponse.text();

          // Extract project links and cover images from Behance's CDN
          const projectLinkRegex = /href="(https:\/\/www\.behance\.net\/gallery\/[^"]+)"/gi;
          const projectImgRegex = /src="(https:\/\/[^"]*mir-s3-cdn-cf\.behance\.net\/[^"]+)"/gi;

          const links = new Set<string>();
          let linkMatch;
          while ((linkMatch = projectLinkRegex.exec(html)) !== null) {
            links.add(linkMatch[1]);
          }

          const images: string[] = [];
          let imgMatch;
          while ((imgMatch = projectImgRegex.exec(html)) !== null) {
            images.push(imgMatch[1]);
          }

          // Also try to extract titles from gallery cards
          const titleRegex = /class="[^"]*Title[^"]*"[^>]*>([^<]+)</gi;
          const titles: string[] = [];
          let titleMatch;
          while ((titleMatch = titleRegex.exec(html)) !== null) {
            titles.push(titleMatch[1].trim());
          }

          const linkArr = Array.from(links);
          for (let i = 0; i < linkArr.length && i < images.length; i++) {
            behanceProjects.push({
              title: titles[i] || `Behance Project ${i + 1}`,
              cover_url: images[i],
              behance_url: linkArr[i],
              description: "",
              source: "behance",
              category: "graphic_design",
            });
          }
        }
      } catch (scrapeErr) {
        console.log("Profile scraping also failed");
      }
    }

    // Sync projects to database
    let syncedCount = 0;
    let allImages: { projectId: string; url: string; behanceUrl: string }[] = [];

    if (behanceProjects.length > 0) {
      const { data: existing } = await supabase
        .from("projects")
        .select("id, behance_url")
        .eq("source", "behance");

      const existingMap = new Map((existing || []).map((p: any) => [p.behance_url, p.id]));
      const newProjects = behanceProjects.filter((p) => !existingMap.has(p.behance_url));

      // Insert new projects
      if (newProjects.length > 0) {
        const { data: inserted, error } = await supabase
          .from("projects")
          .insert(newProjects)
          .select("id, behance_url");

        if (!error && inserted) {
          syncedCount = inserted.length;
          for (const proj of inserted) {
            existingMap.set(proj.behance_url, proj.id);
            allImages.push({ projectId: proj.id, url: proj.behance_url, behanceUrl: proj.behance_url });
          }
        }
      }

      // Update existing projects with fresh data
      for (const proj of behanceProjects) {
        const existingId = existingMap.get(proj.behance_url);
        if (existingId) {
          await supabase
            .from("projects")
            .update({ cover_url: proj.cover_url, title: proj.title })
            .eq("id", existingId);

          // Collect for inner image fetching (only if no images yet)
          const { data: existingImgs } = await supabase
            .from("project_images")
            .select("id")
            .eq("project_id", existingId)
            .limit(1);
          if (!existingImgs || existingImgs.length === 0) {
            allImages.push({ projectId: existingId, url: proj.behance_url, behanceUrl: proj.behance_url });
          }
        }
      }

      // Fetch inner images for each project (limit to first 8 projects to avoid timeout)
      const projectsToFetch = allImages.slice(0, 8);
      for (const projInfo of projectsToFetch) {
        try {
          const projectResponse = await fetch(projInfo.behanceUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; NaeimVisualBot/1.0)" },
            signal: AbortSignal.timeout(8000),
          });

          if (projectResponse.ok) {
            const projectHtml = await projectResponse.text();

            // Extract full-resolution inner images from Behance project pages
            const innerImgRegex = /src="(https:\/\/[^"]*mir-s3-cdn-cf\.behance\.net\/[^"]+)"/gi;
            const innerImages: string[] = [];
            let innerMatch;
            while ((innerMatch = innerImgRegex.exec(projectHtml)) !== null) {
              const imgUrl = innerMatch[1];
              // Filter for larger resolution images (not tiny thumbnails)
              if (imgUrl.includes("render") || imgUrl.includes("fs") || imgUrl.includes("disp")) {
                innerImages.push(imgUrl);
              }
            }

            // Also grab any high-res images from og:image meta tags or JSON-LD
            const ogImageRegex = /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/gi;
            let ogMatch;
            while ((ogMatch = ogImageRegex.exec(projectHtml)) !== null) {
              if (!innerImages.includes(ogMatch[1])) {
                innerImages.push(ogMatch[1]);
              }
            }

            // Deduplicate and limit to 12 images per project
            const uniqueImages = [...new Set(innerImages)].slice(0, 12);

            if (uniqueImages.length > 0) {
              const imageRecords: BehanceProjectImage[] = uniqueImages.map((url, i) => ({
                project_id: projInfo.projectId,
                image_url: url,
                sort_order: i,
              }));

              await supabase.from("project_images").insert(imageRecords);
            }
          }
        } catch (projErr) {
          console.log(`Failed to fetch inner images for ${projInfo.behanceUrl}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: syncedCount,
        totalBehance: behanceProjects.length,
        message: syncedCount > 0
          ? `Synced ${syncedCount} new Behance projects with inner images`
          : behanceProjects.length > 0
            ? `All ${behanceProjects.length} Behance projects up to date`
            : "No Behance projects found via RSS or scraping. Add projects manually from Admin.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
