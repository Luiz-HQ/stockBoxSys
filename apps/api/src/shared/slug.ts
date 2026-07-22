function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^a-z0-9\s-]/g, '') 
    .trim()
    .replace(/\s+/g, '-')
}

// Generate a random code "a8f3"
function randomCode(length = 4): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

// Generate a unique slug by combining a cleaned name and a random code
export function generateUniqueSlug(name: string): string {
  const base = slugify(name)
  const code = randomCode()
  return `${base}-${code}`
}