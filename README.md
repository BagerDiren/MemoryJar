# MemoryJar 🫙

A cozy little corner of the web for capturing the small good moments — and shaking the jar when you need a smile.

**Author:** Bager Diren Karakoyun · Altınbaş University, Software Engineering · Student no. 210513250
**Course:** Internet Programming · Instructor: F. Kuzey Edes Huyal
**GitHub:** [github.com/BagerDiren](https://github.com/BagerDiren)

---

## What it does

MemoryJar lets you write down small everyday moments — a good coffee, a late conversation, a small win — and drop them as folded paper notes into a glass jar. When you feel like it, you can shake the jar and pull a random memory back out.

Memories are stored locally in the browser through the **localStorage** Web API, so the application works offline and never sends anything to a server.

## Pages

- **Home** — hero section, live stats, recent memories.
- **Add** — form with title, body, mood picker, category, paper colour and date.
- **My Jar** — interactive glass jar; click any paper or shake the jar.
- **Wall** — full grid with live search, category chips, summary stats and a category bar chart.
- **About** — project background and tech stack.

## Tech stack

- **HTML5** — semantic, multi-page structure (no SPA, no router).
- **CSS3** — custom properties, Flexbox, Grid, keyframe animations, glassmorphism.
- **JavaScript (ES Modules)** — vanilla, no framework, no build step.
- **localStorage Web API** — client-side persistence.
- **Google Fonts** — Playfair Display (serif), Quicksand (sans), Caveat (handwriting).
- **crypto.randomUUID** — unique IDs for each memory.

## Project structure

```
MemoryJar/
├── index.html           # Home page
├── add.html             # Add memory form
├── jar.html             # Interactive jar
├── wall.html            # Memory wall grid
├── about.html           # About page
├── css/
│   └── style.css        # Main stylesheet (~700 lines)
├── js/
│   ├── storage.js       # localStorage data layer
│   ├── nav.js           # Shared navigation + toast helpers
│   ├── main.js          # Home page logic
│   ├── add.js           # Add page form logic
│   ├── jar.js           # Jar page (shake + modal)
│   └── wall.js          # Wall page (filter + chart)
└── screenshots/         # Captured screenshots used in the report
```

## How to run

The site is fully static — no build step is needed.

```bash
# Option 1: serve with Node
npx serve .

# Option 2: any other static server, e.g. Python
python -m http.server 5174
```

Then open `http://localhost:5174` in any modern browser.

## License

Personal academic project.
