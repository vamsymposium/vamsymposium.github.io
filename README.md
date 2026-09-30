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

## Deployment

**Live:** <https://twaddellberkeley.github.io/vam-symposium/>
**Repo:** <https://github.com/twaddellberkeley/vam-symposium> (owner `twaddellberkeley`,
twaddell@berkeley.edu). GitHub Pages serves `main` from the repo root; `.nojekyll` keeps
`assets/` verbatim. Every push to `main` redeploys in about a minute.

```bash
git add -A && git commit -m "Update program" && git push
```

This folder is its own git repo (nested inside the `claude` workspace, which ignores it).
Its `credential.helper` is pinned to the `twaddellberkeley` gh login so pushes route to the
right account even though `taylorDrover` is the machine's active gh account.

For a custom domain (e.g. `vamsymposium.org`): add a `CNAME` file containing the bare domain,
point a DNS `CNAME` record at `twaddellberkeley.github.io`, then enable "Enforce HTTPS" in
Settings → Pages. A `berkeley.edu` subdomain would instead go through campus IT.

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
- **Code of conduct.** `attend.html#conduct` is a standard short code with reporting to the
  contact address. Confirm the reporting contact (a second, non-organizer contact is good
  practice) and check it against campus event policy.
- **Student travel support** is described as "being sought" with priority for poster
  presenters. Change to firm terms or remove once funding is known.
- **Invitation letters, confirmation letters, no hotel block** are stated as offered on
  request. Make sure someone actually owns those requests.
- **Photography notice** says sessions may be photographed and recorded with speaker
  permission. Adjust if Berkeley requires a specific consent form.
- **Speakers.** Every 2027 speaker slot currently shows Hayden Taylor, with his headshot from
  me.berkeley.edu (`assets/img/speakers/hayden-taylor.jpg`), and the page says so in a
  red notice. To add a real speaker: drop a square headshot into `assets/img/speakers/`,
  add an entry to `SLOTS`/`PEOPLE` in `_private/speakers.py`, and rerun the two generators
  (below). Remove the "Placeholder lineup" notice once the lineup is real.
- **Topic areas and reading list.** `program.html#topics` defines eight topic areas
  distilled from ~45 papers (2024–2026); `#reading` lists them by topic with a 2026 badge,
  and the same eight topics are the poster categories on the Attend page. All of this is
  data in `_private/speakers.py` (`TOPICS`). Links go to Consensus; swap for DOIs if preferred.
- **2025 speakers** (archive page) are a text roster grouped by session; no photos.

## Design

White ground, institutional navy (`#0B2A4A`) with a restrained gold accent (`#F2B632`),
Inter for all type, thin rules and soft shadows. The home page opens on a full-bleed
photograph of an OpenCAL printer with a navy gradient overlay, then follows the standard
conference-site order: organizers, important dates, about, gallery, topics, program at a
glance, speakers, venue, committee, sponsors.

| Token | Value | Used for |
|---|---|---|
| `--navy` / `--navy-3` | `#0B2A4A` / `#1F4E82` | Headings, dark bands, links |
| `--gold` / `--gold-2` | `#F2B632` / `#C98F0F` | Primary button, section rules, eyebrows |
| `--teal` | `#1B8FA8` | Secondary accent (moderators, topic 2) |
| `--bg-alt` | `#F4F6F9` | Alternating sections |

Light only; every colour is painted explicitly.

## Photography and credits

`assets/img/photos/` — sources and licences (also captioned on the page):

| File | Source | Licence |
|---|---|---|
| `hero-opencal.jpg`, `workshop-vial.jpg`, `gallery-opencal-part.jpg` | OpenCAL project documentation, UC Berkeley (github.com/computed-axial-lithography/OpenCAL-documentation) | Project photos |
| `gallery-raft-thinker.jpg` | Krumins et al., *Nat. Commun.* 2026, Fig. 4 (crop) | CC BY 4.0 |
| `gallery-holovam-benchy.jpg` | Álvarez-Castaño et al., *Nat. Commun.* 2025, Fig. 6 (crop) | CC BY 4.0 |
| `gallery-emvp-lattice.jpg` | Tisato et al., *Nat. Commun.* 2025, Fig. 2 (crop) | CC BY 4.0 |
| `venue-berkeley.jpg` | Memorial Glade, Wikimedia Commons (Firstcultural) | CC0 |
| `2025-group.jpg`, `2025-panel-industrial.jpg`, `2025-plenary-device.jpg` | VAM Symposium 2025, Helen Diller Anchor House (organizers' photos; brightened and color-balanced for the web) | Symposium |
| `speakers/hayden-taylor.jpg` | me.berkeley.edu faculty page | Berkeley ME |

The 2025 group photo is on the home page (About) and the archive page. Replace the OpenCAL hero with your own lab photography when you have it.

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
