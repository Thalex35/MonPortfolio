import { portfolioMediaBucket, supabase } from "./supabase";

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxImageBytes = 5 * 1024 * 1024;

export async function uploadPortfolioImage(file, folder) {
  if (!acceptedImageTypes.has(file.type)) {
    throw new Error("Choose a JPG, PNG, WebP, or AVIF image.");
  }
  if (file.size > maxImageBytes) {
    throw new Error("Images must be 5 MB or smaller.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "image";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(portfolioMediaBucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;
  const { data } = supabase.storage.from(portfolioMediaBucket).getPublicUrl(path);
  return data.publicUrl;
}

export function validateProject(project) {
  if (!project.title.trim()) return "Project title is required.";
  if (!project.category.trim()) return "Category is required.";
  if (!project.description.trim()) return "Short description is required.";
  if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
    return "Add at least one technology or skill.";
  }

  for (const field of ["github_url", "live_demo_url", "image_url"]) {
    if (project[field] && !isValidHttpUrl(project[field])) {
      return `${field.replaceAll("_", " ")} must be a valid HTTP or HTTPS URL.`;
    }
  }
  return "";
}

export function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateContactLink(link) {
  if (!link.label.trim()) return "A link label is required.";
  if (!link.value.trim()) return "A link value is required.";
  if (link.kind === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link.value.trim())
      ? ""
      : "Enter a valid email address.";
  }
  return isValidHttpUrl(link.value.trim())
    ? ""
    : "Enter a valid HTTP or HTTPS URL.";
}
