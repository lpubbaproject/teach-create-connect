import thumbVideo from "@/assets/thumb-video.jpg";
import thumbAnimated from "@/assets/thumb-animated.jpg";
import thumbInfographic from "@/assets/thumb-infographic.jpg";
import thumbShort from "@/assets/thumb-short.jpg";
import thumbPresentation from "@/assets/thumb-presentation.jpg";
import thumbStudy from "@/assets/thumb-study.jpg";

export const CATEGORIES = [
  "Educational Video",
  "Animated Explainer",
  "Infographic & Visuals",
  "Short Learning Content",
  "Educational Presentation",
  "Study Material Design",
] as const;

export type Category = (typeof CATEGORIES)[number];

const THUMBS: Record<Category, string> = {
  "Educational Video": thumbVideo,
  "Animated Explainer": thumbAnimated,
  "Infographic & Visuals": thumbInfographic,
  "Short Learning Content": thumbShort,
  "Educational Presentation": thumbPresentation,
  "Study Material Design": thumbStudy,
};

export function thumbnailFor(category: string): string {
  return THUMBS[category as Category] ?? thumbVideo;
}
