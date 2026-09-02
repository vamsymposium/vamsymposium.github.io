# VAM Symposium website

Static site for the Volumetric Additive Manufacturing Symposium at UC Berkeley.
No build step, no dependencies — plain HTML, one stylesheet, two small scripts.

```
index.html      Home — hero, organizers strip, important dates, about, themes, program at a
                glance, speakers, venue, organizing committee, sponsors
program.html    Program overview table, Day 1 schedule, Day 2 build workshop, speakers, FAQ
attend.html     Pre-registration + fee table, important dates, call for posters, workshop
                application, venue & travel (incl. accessibility), suggestions, sponsorship, contact
archive.html    Past symposia — full 2025 program and speaker lineup
assets/         css, js, favicon, and the 2025 schedule PDF
_private/       Internal planning notes. Git-ignored — do not publish.
```

## Running it locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Any static server works; there is nothing to compile.

## Deploying to GitHub Pages

1. Push this folder to a repository (its own repo, or a `docs/` folder in an existing one).
2. Settings → Pages → deploy from branch → `main` / root (or `/docs`).
3. `.nojekyll` is already present so `assets/` is served verbatim.

For a `vamsymposium.org`-style domain, add a `CNAME` file containing the bare domain
and point a DNS `CNAME` record at `<user>.github.io`.

## Wiring up the interest form

The form on `attend.html` works out of the box: with no endpoint configured it opens a
pre-filled email to the organisers, so it is never a dead end. To collect submissions
properly, edit the inline config block near the bottom of `attend.html`:

```js
window.VAM_FORM_ENDPOINT = "https://formspree.io/f/XXXXXXXX";
window.VAM_FORM_EMAIL    = "vamsymposium@berkeley.edu";
```

It POSTs JSON with `name`, `email`, `affiliation`, `interest`, `notes` — compatible with
Formspree, Netlify Forms, or a Google Apps Script web app. If you would rather use a
Google Form (as in 2025), replace the `<form>` block with a link to it.

## Before this goes live — things only you can confirm

These were inferred from the planning documents and need a real decision:

- **Dates.** Thursday 4 – Friday 5 February 2027 throughout, from the `VAM27@Berkeley`
  brainstorm. Confirm against the final SPIE Photonics West 2027 dates.
- **Venue.** Listed as "on the UC Berkeley campus, room to be confirmed". The candidate
  rooms in the brainstorm are deliberately not published.
- **Contact address.** Currently `twaddell@berkeley.edu` in the footer and mailto links.
  A group alias would age better — one find-and-replace across the four HTML files.
- **Organizing committee.** The home page lists Hayden Taylor, X Sun and Taylor Waddell
  (Berkeley) and Maxim Shusteff and Dominique Porcincula (LLNL), from the 2025 invite.
  Titles are minimal — add roles, and remove or add people as the 2027 committee firms up.
- **Important dates.** Everything except Feb 4–5 is provisional and labelled as such on the
  site. Replace with real deadlines when registration opens.
- **Accessibility statement.** The venue card says "wheelchair accessible" — confirm once the
  room is chosen.
- **Speaker names.** No prospective speaker from the internal brainstorm appears on the
  site. Add people only once they have accepted.
- **Workshop cost.** Described as "seeking funding to subsidise ~10 kits at ~$1,500 each".
  Replace with real pricing once funding is settled.
- **Speakers.** Every 2027 speaker slot currently shows Hayden Taylor, with his headshot from
  me.berkeley.edu (`assets/img/speakers/hayden-taylor.jpg`), and the page says so in a
  red notice. To add a real speaker: drop a square headshot into `assets/img/speakers/`,
  add an entry to `SLOTS`/`PEOPLE` in `_private/speakers.py`, and rerun the two generators
  (below). Remove the "Placeholder lineup" notice once the lineup is real.
- **Topic areas and reading list.** `program.html#topics` defines eight topic areas
  distilled from ~45 papers (2024–2026); `#reading` lists them by topic with a 2026 badge,
  and the same eight topics are the poster categories on the Attend page. All of this is
  data in `_private/speakers.py` (`TOPICS`). Links go to Consensus; swap for DOIs if preferred.
- **2025 speaker tiles** (archive page) still render initials on a flat colour. Add photos
  the same way if you have them.

## Design

Warm cream paper, full-bleed flat colour bands, chunky type and hard offset shadows —
in the spirit of the FAB conference sites rather than a corporate university template.

| Token | Value | Used for |
|---|---|---|
| `--ink` | `#16243F` | Text, dark bands, every border |
| `--cream` / `--cream-2` | `#FBF3E4` / `#F4E9D3` | Page ground, alternating sections |
| `--coral` | `#E8493B` | Primary buttons, eyebrows, schedule times |
| `--amber` | `#F5B437` | Highlights, notices, nav hover |
| `--cyan` | `#17BDD4` | Projected light — callouts, the hero vial |
| `--dusty` / `--plum` | `#A9C4D4` / `#7C5CBF` | Fourth and fifth accents |

Type is **Archivo Black** for banner words, **Poppins** for everything else, and
**Space Mono** for letterspaced uppercase labels.

There is deliberately **no dark mode** — the cream ground is the identity, and a dark
variant would fight it. Every colour is painted explicitly rather than inherited.

The hero canvas draws a rotating sinogram: parallel light sheets sweeping a vial from
every angle, which is literally how a VAM printer works. It pauses when scrolled
off-screen or the tab is hidden, and holds a single static frame under
`prefers-reduced-motion`.

## Editing

The four HTML files are plain, self-contained pages — editable by anyone without a
toolchain. Header and footer are duplicated in each; change one, change all four.

If you would rather regenerate than hand-edit, the scripts that produced the pages are in
`_private/` (git-ignored): `build_pages.py` writes all four pages from templates, and
`speakers.py` then injects the speaker grid, the home-page teaser, and the reading list.
Run them in that order from the site root:

```bash
python _private/build_pages.py && python _private/speakers.py
```
Copy is American English throughout; times are written `9:00 AM` and dates `February 4, 2027`.
Design tokens (colours, type, spacing) all live at the top of `assets/css/site.css`.
