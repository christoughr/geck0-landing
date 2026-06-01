export function chunkText(content: string, maxLen = 600): string[] {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let buf = "";

  for (const p of paragraphs) {
    if (`${buf}\n\n${p}`.length <= maxLen) {
      buf = buf ? `${buf}\n\n${p}` : p;
    } else {
      if (buf) chunks.push(buf);
      if (p.length <= maxLen) {
        buf = p;
      } else {
        for (let i = 0; i < p.length; i += maxLen) {
          chunks.push(p.slice(i, i + maxLen));
        }
        buf = "";
      }
    }
  }
  if (buf) chunks.push(buf);
  return chunks.length ? chunks : [content.slice(0, maxLen)];
}
