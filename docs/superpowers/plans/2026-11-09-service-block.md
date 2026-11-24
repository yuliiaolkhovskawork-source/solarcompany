# Service Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new `service-block` Gutenberg ACF block based on `grid-block.php`, wired to the ACF field group from the exported JSON.

**Architecture:** The block registration is fully automatic — `acf-gutenberg.php` scans `blocks/gutenberg/` and registers every `.php` file by filename as `acf/<filename>`. The ACF field group is synced via ACF's local JSON feature: placing a `.json` file in `acf-json/` inside the theme root makes ACF pick it up and sync it to the DB on the next admin load. The PHP template is derived from `grid-block.php` with the icon sub-field removed (not in the JSON spec) and CSS class names updated.

**Tech Stack:** PHP 8.4, WordPress, ACF Pro, DDEV

**Spec:** `c:\Users\filip\Downloads\acf-export-2026-11-09.json` (fields), `blocks/gutenberg/grid-block.php` (template base)

## Global Constraints

- Block slug must be exactly `service-block` (filename = `service-block.php`, ACF location = `acf/service-block`)
- ACF field group key: `group_6af1c60e05867` — do not change it
- Padding clone references `field_65ba9204e93bc` — do not change it
- No icon sub-field — not present in the JSON spec; omit entirely from the template
- Follow WordPress coding standards (PHPCS `WordPress` ruleset)
- Never edit files in `assets/dist/`

## Review Focus

- **ACF JSON not syncing:** If the `acf-json/` folder has wrong permissions or ACF Pro is inactive, the field group won't appear — verify via ACF → Sync after DDEV restart.
- **Padding clone resolving to empty:** The clone field references `field_65ba9204e93bc`; if that source field group isn't in the DB, `get_the_style()` returns nothing — confirm padding renders on a test page.
- **Column count fallback:** If `column_count` is unset, `$columns_map[null]` returns `''` via the `??` fallback — confirm the grid still renders without a column modifier class.
- **Button link target blank:** The card `<a>` tag renders `target="_blank" rel="noreferrer"` only when `$button_field['target']` is non-empty — verify both cases (internal link, external link) in the editor.
- **ACF location mismatch:** If the JSON location value is left as `acf/services-block`, the field group won't attach to the block — confirm after sync that fields appear in the block editor.

---

### Task 1: ACF Local JSON

**Files:**
- Create: `wp-content/themes/solarcompany/acf-json/group_6af1c60e05867.json`

**Interfaces:**
- Produces: ACF field group `group_6af1c60e05867` registered at location `acf/service-block`; field keys used by Task 2:
  - `padding` (clone → `field_65ba9204e93bc`)
  - `column_count` (select: `three` | `four`)
  - `heading` (text)
  - `description` (text)
  - `button` (link, array)
  - `grid` (repeater) with sub-fields: `image` (image ID), `supertitle` (text), `title` (text), `description` (textarea), `button` (link, array)

- [ ] **Step 1: Create `acf-json/` folder and write the JSON file**

  Copy the full contents of `c:\Users\filip\Downloads\acf-export-2026-11-09.json` into `wp-content/themes/solarcompany/acf-json/group_6af1c60e05867.json`.

  Then change **only** the location value at the bottom of the file:

  ```json
  {
      "param": "block",
      "operator": "==",
      "value": "acf\/service-block"
  }
  ```

  (Change `acf\/services-block` → `acf\/service-block`. All field keys, group key, and all other values stay identical.)

- [ ] **Step 2: Verify ACF picks up the JSON**

  Run: `ddev wp cache flush && ddev wp eval "echo 'ok';"` — confirms WP-CLI reaches the site.

  Then open the WP admin at `https://solarcompany.ddev.site/wp-admin/edit.php?post_type=acf-field-group`. Navigate to **ACF → Sync**. The group **"Block: Services"** should appear in the sync list. Click **Sync**. After sync, the group should show as active with location `service-block`.

- [ ] **Step 3: Commit**

  ```bash
  git add wp-content/themes/solarcompany/acf-json/group_6af1c60e05867.json
  git commit -m "feat: add ACF local JSON for service-block field group"
  ```

---

### Task 2: PHP Block Template

**Files:**
- Create: `wp-content/themes/solarcompany/blocks/gutenberg/service-block.php`

**Interfaces:**
- Consumes: ACF field group from Task 1 — field names `padding`, `column_count`, `heading`, `description`, `button`, `grid` (repeater: `image`, `supertitle`, `title`, `description`, `button`)
- Consumes: `acf_button()` helper, `get_the_style()` helper (both already used in `grid-block.php` — same theme)

- [ ] **Step 1: Create `service-block.php` from `grid-block.php`**

  Copy `blocks/gutenberg/grid-block.php` to `blocks/gutenberg/service-block.php`, then apply these changes:

  **Header metadata** (top comment block):
  ```php
  /*
  Block title: Services
  Description: Services block.
  Keywords: services
  Icon: layout
  */
  ```

  **CSS class** (line ~16):
  ```php
  $class_name = 'section-services-block';
  ```

  **Remove icon logic entirely** — delete these lines from inside the `while ( have_rows('grid') )` loop:
  ```php
  $icon         = get_sub_field( 'icon' );
  $icon_url     = $icon ? wp_get_attachment_url( $icon ) : '';
  $icon_alt     = $icon ? (string) get_post_meta( $icon, '_wp_attachment_image_alt', true ) : '';
  ```
  Also remove every `$icon_url` / `$icon_alt` reference in the HTML output (the two `<div class="icon">` blocks and their `if ( $icon_url )` guards).

  All other logic (image, supertitle, title, description, button, card link wrapping) stays identical to `grid-block.php`.

- [ ] **Step 2: Run PHPCS**

  ```bash
  ddev exec phpcs --standard=WordPress wp-content/themes/solarcompany/blocks/gutenberg/service-block.php
  ```

  Expected: no errors or warnings.

- [ ] **Step 3: Verify block appears in editor**

  Open `https://solarcompany.ddev.site/wp-admin/post-new.php`. Search for **"Services"** in the block inserter. The block should appear under the **Theme blocks** category. Insert it and confirm ACF fields (Padding, Column count, Heading, Description, Button, Grid repeater) are all present.

- [ ] **Step 4: Commit**

  ```bash
  git add wp-content/themes/solarcompany/blocks/gutenberg/service-block.php
  git commit -m "feat: add service-block Gutenberg ACF block template"
  ```
