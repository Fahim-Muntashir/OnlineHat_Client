// lib/suggestions-data.ts

export const suggestionMap: Record<string, string[]> = {
  web: ["Web Development", "Web Design", "Frontend Development", "Full Stack Developer", "WordPress Site"],
  design: ["Graphic Design", "UI/UX Design", "Logo Design", "Illustration", "Brand Identity"],
  marketing: ["Social Media Marketing", "Digital Marketing", "SEO Optimization", "Email Marketing", "Content Strategy"],
  app: ["Mobile App Development", "Android App", "iOS Development", "React Native", "Flutter App"],
  write: ["Content Writing", "Copywriting", "Blog Writing", "Technical Writing", "Ghostwriting"],
  logo: ["Modern Logo Design", "Minimalist Logo", "3D Logo", "Vintage Logo", "Signature Logo"],
  seo: ["SEO Audit", "On-page SEO", "Off-page SEO", "Keyword Research", "Backlink Building"],
  video: ["Video Editing", "Animation", "Motion Graphics", "Video Production", "Explainer Videos"],
  photo: ["Photo Editing", "Photography", "Product Photography", "Retouching", "Background Removal"],
  code: ["Python Programming", "JavaScript Debugging", "Java Backend", "C++ Programming", "Smart Contracts"],
  data: ["Data Entry", "Data Analysis", "Data Visualization", "Database Design", "Machine Learning"],
};

export const popularKeywords = [
  "Web Design",
  "Logo Design",
  "SEO",
  "Writing",
  "Video Editing",
  "Digital Marketing",
  "App Development",
];

export async function getAiSuggestions(query: string): Promise<string[]> {
  // Simulate AI delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  if (!query) return popularKeywords.slice(0, 5);
  
  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Find matches in keys
  Object.keys(suggestionMap).forEach((key) => {
    if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
      suggestionMap[key].forEach((s) => suggestions.add(s));
    }
  });
  
  // Basic fuzzy match from popular keywords
  popularKeywords.forEach((k) => {
    if (k.toLowerCase().includes(lowerQuery)) {
      suggestions.add(k);
    }
  });
  
  return Array.from(suggestions).slice(0, 8);
}
