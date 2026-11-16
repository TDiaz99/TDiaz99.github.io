# tdiaz99.github.io

Taylor Diaz's technical writing portfolio, published with GitHub Pages at
<https://tdiaz99.github.io>. GitHub builds the site with Jekyll on every push to
`main`; there is no separate build or deploy step.

## Layout of the repo

| Path | What it is |
| --- | --- |
| `_config.yml` | Site name, description, contact details, footer text |
| `_data/navigation.yml` | The sidebar menu — add or reorder items here |
| `_layouts/default.html` | The page shell every page shares |
| `_includes/head.html` | `<head>`: title, description, link previews, favicon, CSS |
| `_includes/header.html` | Top bar with name and LinkedIn icon |
| `_includes/sidebar.html` | Menu, contact block and footer |
| `index.html`, `XYZ Company.html`, `WIP.html`, `404.html` | Pages that use the shared layout |
| `assets/` | Theme CSS, JavaScript and icon fonts (Editorial by HTML5 UP) |
| `images/` | Images used in pages |
| `resume/` | Resume PDF |

The whole site is kept out of search engines: every layout page carries a
`noindex` tag, and `robots.txt` blocks the files that can't (the resume PDF and
pages without front matter).

Files without the `---` front matter block at the top (for example the
`Default Pages/` and `Microsoft Office Suite Sample Documentation/` folders) are
published exactly as they are and do not use the shared layout.

## Adding a page

1. Create an `.html` file that starts with front matter, then only the page's
   own content:

   ```html
   ---
   layout: default
   title: SOP Sample: Onboarding a New Vendor
   description: One sentence shown in link previews.
   ---
   <section>
     ...
   </section>
   ```

   The browser tab title becomes "*title* — Taylor Diaz".
2. Add it to the menu in `_data/navigation.yml`.

## Previewing locally

Requires Ruby 3.3 with DevKit (`winget install RubyInstallerTeam.RubyWithDevKit.3.3`).

```bash
bundle install          # first time only
bundle exec jekyll serve --port 8322
```

Then open <http://localhost:8322>. Pages rebuild automatically when you save;
restart the server after editing `_config.yml`.
