// web/src/lib/parseTags.ts
export function parseTags(tagsString) {
  if (!tagsString) return []
  if (tagsString.trim().startsWith('[') && tagsString.trim().endsWith(']')) {
    try {
      const arr = JSON.parse(tagsString)
      if (Array.isArray(arr)) return arr.map((t) => t.trim()).filter(Boolean)
    } catch (e) {}
  }
  return tagsString
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}
