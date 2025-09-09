import { getCollection } from "astro:content";

// Load resume JSON (assumes default locale 'en')
export async function loadResumeSummary(): Promise<string> {
  try {
    const all = await getCollection("resume");
    const pick =
      all.find((e) => (e as any).id?.startsWith?.("en/")) ||
      all.find((e) => (e as any).slug?.startsWith?.("en/")) ||
      all[0];

    if (!pick?.data) return "";
    const r = pick.data as any;

    const certs = r.certifications?.map((c: any) => `${c.title} (${c.year})`).join(", ");
    const exp = r.experience
      ?.map(
        (e: any) => `- ${e.title} @ ${e.company} (${e.dates}, ${e.location})\n  Key points: ${e.responsibilities.slice(0, 3).join("; ")}`,
      )
      .join("\n");
    const hard = r.hardSkills?.map((s: any) => s.skill).join(", ");

    return [
      `Resume:`,
      certs ? `Certifications: ${certs}` : undefined,
      exp ? `Experience:\n${exp}` : undefined,
      hard ? `Hard skills: ${hard}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");
  } catch {
    return "";
  }
}

// Load concise blog post summaries
export async function loadBlogSummaries(limit = 8): Promise<string> {
  const posts = await getCollection("blog", (e) => !e.data.draft);
  // Sort by pubDate desc
  posts.sort((a, b) => +new Date(b.data.pubDate) - +new Date(a.data.pubDate));
  const top = posts.slice(0, limit);
  const items = top.map((p) => {
    const cats = (p.data.categories || []).filter(Boolean).join(", ");
    const desc = String(p.data.description || "").replace(/<[^>]+>/g, "").slice(0, 220);
    return `- ${p.data.title} (${cats}) — ${desc}`;
  });
  return items.length ? `Blog posts (latest ${items.length}):\n${items.join("\n")}` : "";
}

// Load concise project summaries
export async function loadProjectSummaries(limit = 12): Promise<string> {
  const projects = await getCollection("projects", (e) => !e.data.draft);
  // Order by optional 'order' desc, then completionDate desc
  projects.sort((a, b) => {
    const ao = (a.data as any).order ?? -Infinity;
    const bo = (b.data as any).order ?? -Infinity;
    if (ao !== bo) return bo - ao;
    return +new Date(b.data.completionDate as any) - +new Date(a.data.completionDate as any);
  });
  const top = projects.slice(0, limit);
  const items = top.map((p) => {
    const tech = (p.data.technologies || []).slice(0, 6).join(", ");
    const kf = (p.data.keyFeatures || []).slice(0, 3).join("; ");
    const desc = String(p.data.description || "").slice(0, 240);
    return `- ${p.data.title} — ${desc}\n  Tech: ${tech}\n  Highlights: ${kf}`;
  });
  return items.length ? `Projects (${items.length}):\n${items.join("\n")}` : "";
}

export async function loadPortfolioContext(): Promise<string> {
  const [resume, posts, projects] = await Promise.all([
    loadResumeSummary(),
    loadBlogSummaries(),
    loadProjectSummaries(),
  ]);

  const parts = [resume, projects, posts].filter(Boolean);
  return parts.length ? parts.join("\n\n") : "";
}
