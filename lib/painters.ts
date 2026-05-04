export type PainterId = "rembrandt" | "dali" | "picasso" | "van-gogh" | "munch" | "niece";

export interface PainterPreset {
  id: PainterId;
  label: string;
  description: string;
  loadingMessage: string;
  successMessage: string;
  prompt: string;
}

export const painterPresets: PainterPreset[] = [
  {
    id: "rembrandt",
    label: "Rembrandt",
    description: "Warm chiaroscuro mastery with dramatic lighting.",
    loadingMessage: "Blending dramatic light and shadow…",
    successMessage: "Rendered with Rembrandt's rich chiaroscuro lighting.",
    prompt:
      "You are Rembrandt van Rijn. Transform the supplied photo into a masterful Baroque oil painting. Keep realistic proportions, dramatic lighting, deep shadows, and rich earth-toned palette with golden highlights. Preserve the subject's identity while enhancing texture and painterly brushwork."
  },
  {
    id: "dali",
    label: "Dalí",
    description: "Surreal dreamscapes with fluid colors and distortions.",
    loadingMessage: "Melting the colors into a dreamscape…",
    successMessage: "Rendered with Dalí's surreal palette.",
    prompt:
      "You are Salvador Dalí. Reimagine the supplied image with surreal, dreamlike qualities, flowing forms, unexpected juxtapositions, and vibrant cosmic colors. Maintain recognisable subject details but infuse melting edges, soft reflections, and imaginative atmospherics."
  },
  {
    id: "picasso",
    label: "Picasso",
    description: "Cubist geometry and bold facets.",
    loadingMessage: "Reducing the world into bold facets…",
    successMessage: "Rendered with Picasso's cubist impression.",
    prompt:
      "You are Pablo Picasso in the Synthetic Cubist period. Deconstruct the provided image into angular planes, overlapped perspectives, and bold geometric color blocks. Use harmonious blues, ochres, teal, and brick reds. Keep recognizable features while fragmenting forms artistically."
  },
  {
    id: "van-gogh",
    label: "Van Gogh",
    description: "Expressive brushwork with swirling motion.",
    loadingMessage: "Layering luminous brush strokes…",
    successMessage: "Rendered with Van Gogh's expressive motion.",
    prompt:
      "You are Vincent van Gogh. Paint the provided image with expressive impasto brush strokes, swirling motion, and vibrant complementary colors. Preserve subject likeness while emphasizing rhythmic strokes, energetic outlines, and luminous textures."
  },
  {
    id: "munch",
    label: "Munch",
    description: "Emotional expressionism with haunting gradients.",
    loadingMessage: "Summoning haunting emotional tones…",
    successMessage: "Rendered with Munch's dramatic atmosphere.",
    prompt:
      "You are Edvard Munch. Render the supplied photo with moody expressionist energy, emphasizing emotional impact through contrasting warm and cool gradients, elongated forms, and atmospheric textures. Maintain subject recognizability with an eerie, introspective aura."
  },
  {
    id: "niece",
    label: "My 8 year old niece",
    description: "Playful neon chaos with crayon scribbles.",
    loadingMessage: "Unleashing pure creative chaos…",
    successMessage: "Rendered with the uninhibited joy of an eight-year-old.",
    prompt:
      "You are an actual eight-year-old child with limited artistic skills. Draw the provided photo using simple crayons, markers, or colored pencils. Make it naive, rough, and genuinely childlike: wobbly lines, proportions that are slightly off, simple shapes, basic colors used roughly, maybe some stray marks outside the lines. Don't try to make it perfect or realistic - make it look like a real kid drew it. The subject should be vaguely recognizable but clearly drawn by a child, not a professional artist. Keep it simple, fun, and authentically imperfect."
  }
];

export const painterPresetMap = painterPresets.reduce<Record<PainterId, PainterPreset>>(
  (accumulator, preset) => {
    accumulator[preset.id] = preset;
    return accumulator;
  },
  {} as Record<PainterId, PainterPreset>
);
