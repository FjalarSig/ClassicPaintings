# Painter Style Studio

A Next.js web application that transforms your photos using the artistic styles of iconic painters. Upload an image and let Nano Banana (Gemini Flash Image Preview) reinterpret it through the lens of Rembrandt, Dalí, Picasso, Van Gogh, Munch, or even an 8-year-old's creative chaos!

## Features

- 🎨 **Multiple Artistic Styles**: Six painter presets with tailored prompts
- 🖼️ **Image Upload**: Simple file selection with fast validation
- ☁️ **Cloud Rendering**: Delegates style transfer to Nano Banana (Gemini) for high-quality outputs
- 💾 **Cached Results**: Generated images stay cached until you upload something new
- 📥 **Download**: Save any generated artwork as a PNG file

## Available Styles

1. **Rembrandt** - Warm chiaroscuro tones with dramatic vignette
2. **Dalí** - Surreal hues with fluid, dreamlike streaks
3. **Picasso** - Cubist geometry with posterized color blocks
4. **Van Gogh** - Vibrant brush strokes with swirling motion
5. **Munch** - Moody contrasts with haunting gradients
6. **My 8 year old niece** - Chaotic neon scribbles with a bright finish

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FjalarSig/ClassicPaintings.git
cd ClassicPaintings
```

2. Install dependencies:
```bash
npm install
```

3. Configure your API key (Nano Banana / Gemini) in `.env.local`:
```bash
GOOGLE_API_KEY=your_api_key_here
# or use NANO_BANANA_API_KEY / NANOBANANA_API_KEY if you prefer those names
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js** 16.0.0 (canary)
- **React** 18.3.1
- **TypeScript** 5.4.5
- Nano Banana (Gemini Flash Image Preview) for style generation

## Project Structure

```
/
├── app/
│   ├── api/render/route.ts # Server route that calls Nano Banana
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application page
├── lib/painters.ts         # Shared painter metadata and prompts
└── package.json            # Dependencies and scripts
```

## How It Works

1. The user uploads an image which is read into a base64 data URL.
2. Selecting a painter posts the image + painter id to `/api/render`.
3. The server route builds a style-specific prompt and calls the Nano Banana API with exponential backoff.
4. The API returns a base64 PNG that is cached client-side for instant painter switching and downloads.

## License

This project is private and not licensed for public use.
