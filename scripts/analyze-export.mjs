import { readFileSync } from 'node:fs';

const summaryOnly = process.argv.includes('--summary');
const files = process.argv.slice(2).filter((argument) => argument !== '--summary');

function decode(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function clean(value) {
  return decode(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function unique(values) {
  return [...new Set(values)].filter(Boolean);
}

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const title = clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? '';
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] ?? '';
  const headings = unique([...html.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => `h${match[1]}: ${clean(match[2])}`));
  const hrefs = unique([...html.matchAll(/\bhref=["']([^"'#][^"']*)["']/gi)].map((match) => decode(match[1])));
  const linkedText = unique([...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: decode(match[1]), text: clean(match[2]) }))
    .filter((link) => link.text));
  const paragraphs = unique([...html.matchAll(/<(?:p|li)\b[^>]*>([\s\S]*?)<\/(?:p|li)>/gi)]
    .map((match) => clean(match[1]))
    .filter((text) => text.length >= 20 && text.length <= 500));
  const imageSources = unique([...html.matchAll(/(?:\bsrc|\bsrcset)=["']([^"']+)["']/gi)].flatMap((match) => decode(match[1]).split(',').map((part) => part.trim().split(/\s+/)[0])));
  const hostCounts = {};
  for (const href of hrefs) {
    try {
      const url = new URL(href, canonical || 'https://example.invalid');
      hostCounts[url.host] = (hostCounts[url.host] ?? 0) + 1;
    } catch {
      hostCounts.invalid = (hostCounts.invalid ?? 0) + 1;
    }
  }
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const nextData = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  const report = {
    file,
    bytes: Buffer.byteLength(html),
    title,
    canonical,
    description: clean(description),
    headings,
    hrefCount: hrefs.length,
    hrefs,
    imageSourceCount: imageSources.length,
    imageSources,
    hostCounts,
    scriptCount: scripts.length,
    nextDataBytes: nextData?.length ?? 0,
    hasRscPayload: html.includes('self.__next_f.push'),
    textCharacters: clean(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')).length
  };
  if (summaryOnly) {
    console.log(JSON.stringify({
      file,
      bytes: report.bytes,
      title,
      canonical,
      description: report.description,
      headings,
      linkedText,
      paragraphs,
      hrefCount: report.hrefCount,
      imageSourceCount: report.imageSourceCount,
      scriptCount: report.scriptCount,
      textCharacters: report.textCharacters
    }, null, 2));
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}
