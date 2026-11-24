# Services Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `services-block` Gutenberg ACF block based on `grid-block.php`, wired to the ACF field group from the exported JSON.

**Architecture:** Block registration is automatic — `acf-gutenberg.php` scans `blocks/gutenberg/` and registers every `.php` file by filename as `acf/<filename>`. The ACF field group is synced via ACF's local JSON feature: placing the `.json` file in `acf-json/` inside the theme root makes ACF pick it up and sync it to the DB on the next admin load. The PHP template is derived from `grid-block.php` with the `icon` sub-field removed (not present in the JSON spec) and CSS class / header metadata updated.

**Tech Stack:** PHP 8.4, WordPress, ACF Pro, DDEV

**Spec:** `c:\Users\filip\Downloads\acf-export-2026-11-09.json` (field group key: `group_6af1c60e05867`, title: "Block: Services", location: `acf/services-block`)

## Global Constraints

- Block slug must be exactly `services-block` (filename = `services-block.php`, ACF location = `acf/services-block`)
- ACF field group key: `group_6af1c60e05867` — do not change
- Padding clone references `field_65ba9204e93bc` — do not change
- JSON location value is already `acf/services-block` — copy as-is, no edit needed
- No `icon` sub-field — not in the JSON spec; omit from template entirely
- Follow WordPress coding standards (PHPCS `WordPress` ruleset)
- Never edit files in `assets/dist/`

## Review Focus

- **ACF JSON not syncing:** If `acf-json/` has wrong permissions or ACF Pro is inactive the field group won't appear — verify via ACF → Sync after DDEV restart.
- **Padding clone resolving to empty:** Clone references `field_65ba9204e93bc`; if that source field group isn't in the DB `get_the_style()` returns nothing — confirm padding renders on a test page.
- **Column count fallback:** If `column_count` is unset `$columns_map[null]` returns `''` via `??` — confirm grid still renders without a column modifier class.
- **Button link target blank:** Card `<a>` renders `target="_blank" rel="noreferrer"` only when `$button_field['target']` is non-empty — verify both internal and external link cases in the editor.
- **Image ID vs array:** JSON spec sets `return_format: id` for the image sub-field — confirm `wp_get_attachment_image( $photo, 'full' )` receives an integer ID, not an array.

---

### Task 1: ACF Local JSON

**Files:**
- Create: `wp-content/themes/solarcompany/acf-json/group_6af1c60e05867.json`

**Interfaces:**
- Produces: ACF field group `group_6af1c60e05867` registered at location `acf/services-block`; field names consumed by Task 2:
  - `padding` (clone → `field_65ba9204e93bc`)
  - `column_count` (select: `three` | `four`)
  - `heading` (text)
  - `description` (text)
  - `button` (link, array)
  - `grid` (repeater) with sub-fields: `image` (image ID), `supertitle` (text), `title` (text), `description` (textarea), `button` (link, array)

- [ ] **Step 1: Create `acf-json/` folder and write the JSON file**

  Create folder `wp-content/themes/solarcompany/acf-json/` if it doesn't exist. Copy the full contents of `c:\Users\filip\Downloads\acf-export-2026-11-09.json` verbatim into `wp-content/themes/solarcompany/acf-json/group_6af1c60e05867.json`. No edits needed — the location value is already `acf\/services-block`.

- [ ] **Step 2: Verify ACF picks up the JSON**

  Run: `ddev wp cache flush`

  Then open `https://solarcompany.ddev.site/wp-admin` → **Custom Fields → Sync**. The group **"Block: Services"** must appear in the sync list. Click **Sync**. After sync the group shows as active with location `services-block`.

- [ ] **Step 3: Commit**

  ```bash
  git add wp-content/themes/solarcompany/acf-json/group_6af1c60e05867.json
  git commit -m "feat: add ACF local JSON for services-block field group"
  ```

---

### Task 2: PHP Block Template

**Files:**
- Create: `wp-content/themes/solarcompany/blocks/gutenberg/services-block.php`

**Interfaces:**
- Consumes: ACF field group from Task 1 — field names `padding`, `column_count`, `heading`, `description`, `button`, `grid` (repeater: `image`, `supertitle`, `title`, `description`, `button`)
- Consumes: `acf_button()` and `get_the_style()` helpers (already used in `grid-block.php`)

- [ ] **Step 1: Create `services-block.php` from `grid-block.php`**

  Copy `blocks/gutenberg/grid-block.php` to `blocks/gutenberg/services-block.php`, then apply these exact changes:

  **Header metadata** (top comment block):
  ```php
  /*
  Block title: Services
  Description: Services block.
  Keywords: services
  Icon: layout
  Other Available options: Icon, Category.
  */
  ```

  **CSS class** (first line after the comment block):
  ```php
  $class_name = 'section-services-block';
  ```

  **Remove icon logic entirely** from inside the `while ( have_rows('grid') )` loop — delete these three lines:
  ```php
  $icon         = get_sub_field( 'icon' );
  $icon_url     = $icon ? wp_get_attachment_url( $icon ) : '';
  $icon_alt     = $icon ? (string) get_post_meta( $icon, '_wp_attachment_image_alt', true ) : '';
  ```

  Update both `if` conditions guarding `.heading-block` and `.text-heading` from `if ( $supertitle || $card_title || $icon_url )` to `if ( $supertitle || $card_title )`.

  Remove both `<div class="icon">` blocks (and their `if ( $icon_url )` guards) from inside `.heading-block` and `.text-heading`.

  All other logic stays identical to `grid-block.php`.

- [ ] **Step 2: Run PHPCS**

  ```bash
  ddev exec phpcs --standard=WordPress wp-content/themes/solarcompany/blocks/gutenberg/services-block.php
  ```

  Expected: no errors, no warnings.

- [ ] **Step 3: Verify block appears in editor**

  Open `https://solarcompany.ddev.site/wp-admin/post-new.php`. Search **"Services"** in the block inserter — it must appear under the **Theme blocks** category. Insert it and confirm all ACF fields are present: Padding, Column count, Heading, Description, Button, and the Grid repeater with Image / Subtitle / Title / Description / Button sub-fields.

- [ ] **Step 4: Commit**

  ```bash
  git add wp-content/themes/solarcompany/blocks/gutenberg/services-block.php
  git commit -m "feat: add services-block Gutenberg ACF block template"
  ```
