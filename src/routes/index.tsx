import { createFileRoute } from "@tanstack/react-router";
import { BirthdayAdventure } from "@/components/birthday/BirthdayAdventure";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alex's Birthday Adventure" },
      { name: "description", content: "A magical interactive birthday present made especially for Kriti." },
      { property: "og:title", content: "Alex's Birthday Adventure" },
      { property: "og:description", content: "A magical interactive birthday present made especially for Kriti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayAdventure,
});