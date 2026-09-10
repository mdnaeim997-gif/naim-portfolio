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

    // Fetch Behance RSS/Atom feed — this is publicly accessible
    const feedUrl = `https://www.behance.net/v2/users/${behanceUsername}/projects?api_key=undefined&format=json`;

    // Try the public RSS feed first
    const rssUrl = `https://feeds.behance.net/${behanceUsername}`;

    let behanceProjects: BehanceProject[] = [];

    try {
      const feedResponse = await fetch(rssUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; NaeimVisualBot/1.0)" },
        signal: AbortSignal.timeout(10000),
      });

      if (feedResponse.ok) {
        const feedText = await feedResponse.text();

        // Parse RSS XML feed — extract project items
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

          let imageUrl = imgMatch?.[1] || mediaImgMatch?.[1] || "";

          // If no media tag, try to extract from content:encoded
          if (!imageUrl && contentMatch) {
            const srcMatch = /<img[^>]+src="([^"]+)"/i.exec(contentMatch[1]);
            if (srcMatch) imageUrl = srcMatch[1];
          }

          // If still no image, try extracting from description
          if (!imageUrl && descMatch) {
            const srcMatch = /<img[^>]+src="([^"]+)"/i.exec(descMatch[1]);
            if (srcMatch) imageUrl = srcMatch[1];
          }

          const title = titleMatch?.[1]?.trim() || "Untitled Project";
          const link = linkMatch?.[1]?.trim() || behanceProfileUrl;
          const rawDesc = descMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "";

          // Only include if we have a valid image
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
      console.log("RSS feed fetch failed, falling back to profile scraping");
    }

    // If RSS didn't work, try fetching the Behance v2 projects page
    if (behanceProjects.length === 0) {
      try {
        const profileResponse = await fetch(`https://www.behance.net/${behanceUsername}`, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; NaeimVisualBot/1.0)" },
          signal: AbortSignal.timeout(10000),
        });

        if (profileResponse.ok) {
          const html = await profileResponse.text();

          // Extract project data from Behance's JSON-LD or meta tags
          const ogImageRegex = /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/gi;
          const titleRegex = /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/gi;

          // Try to find project cards in the HTML
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

          const linkArr = Array.from(links);
          for (let i = 0; i < linkArr.length && i < images.length; i++) {
            behanceProjects.push({
              title: `Behance Project ${i + 1}`,
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

    // Sync to database: upsert Behance projects (match on behance_url to avoid duplicates)
    let syncedCount = 0;
    if (behanceProjects.length > 0) {
      // Get existing Behance projects to check for duplicates
      const { data: existing } = await supabase
        .from("projects")
        .select("id, behance_url")
        .eq("source", "behance");

      const existingUrls = new Set((existing || []).map((p: any) => p.behance_url));

      const newProjects = behanceProjects.filter((p) => !existingUrls.has(p.behance_url));

      if (newProjects.length > 0) {
        const { data: inserted, error } = await supabase
          .from("projects")
          .insert(newProjects)
          .select("id");

        if (!error && inserted) {
          syncedCount = inserted.length;
        }
      }

      // Update existing projects with fresh cover images
      for (const proj of behanceProjects) {
        if (existingUrls.has(proj.behance_url)) {
          await supabase
            .from("projects")
            .update({ cover_url: proj.cover_url, title: proj.title })
            .eq("behance_url", proj.behance_url)
            .eq("source", "behance");
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: syncedCount,
        totalBehance: behanceProjects.length,
        message: syncedCount > 0
          ? `Synced ${syncedCount} new Behance projects`
          : behanceProjects.length > 0
            ? `All ${behanceProjects.length} Behance projects already up to date`
            : "No Behance projects found via RSS or scraping. Add Behance projects manually from Admin.",
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
