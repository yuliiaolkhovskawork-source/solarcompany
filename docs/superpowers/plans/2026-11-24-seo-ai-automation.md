# SEO AI Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On every publish/update of a post or page, automatically generate SEO meta description and og:description using Claude API and save them to post_meta, then output them in `<head>`.

**Architecture:** A single new file `inc/seo-ai.php` is auto-loaded by `functions.php` glob. On `save_post`, the code extracts the post title + stripped block content, hashes it to avoid redundant API calls, calls the Anthropic Messages API (`claude-sonnet-4-6`), parses a JSON response, and saves two post_meta keys. A `wp_head` hook outputs the meta tags on the front end. A read-only admin meta box shows the current generated values in the editor.

**Tech Stack:** PHP 8.4, WordPress `wp_remote_post`, Anthropic Messages API (claude-sonnet-4-6), ACF Pro (already installed), DDEV local dev.

**Spec:** `docs/superpowers/plans/2026-11-24-seo-ai-automation.md` (this file)

## Global Constraints

- PHP file must follow WordPress coding standards (tabs, Yoda conditions, `array()` not `[]`)
- All output must be escaped with `esc_attr()` / `esc_html()`
- API key stored as `ANTHROPIC_API_KEY` constant in `wp-config.php` — never hard-coded
- Only run on `post` and `page` post types
- Skip autosaves, revisions, and trashed posts
- Regenerate only when post content changes (hash comparison) or meta is missing
- Meta description: max 160 characters. og:description: max 200 characters.
- Claude model: `claude-sonnet-4-6`
- Anthropic API endpoint: `https://api.anthropic.com/v1/messages`
- Anthropic API version header: `2023-06-01`

## Review Focus

- **API timeout/failure on save:** if `wp_remote_post` fails (network down, bad key), the post save should still succeed silently — no fatal error, no user-visible message; check that all API calls are wrapped in error checks
- **Infinite loop on save:** `update_post_meta` inside `save_post` triggers another `save_post` — guard with a static flag `$is_running`
- **Empty post content:** a page with only ACF blocks has empty `post_content` — `wp_strip_all_tags(get_the_content())` returns empty string; the prompt must still work using title only
- **Very long content:** posts with 5000+ words must be truncated before sending to Claude to stay within prompt limits (cap at 3000 chars)
- **Meta box shows stale data:** meta box reads from DB, not from live editor fields — a note in the meta box UI should tell the editor to save first to regenerate

---

## Task 1: API key setup + Claude HTTP client

**Files:**
- Modify: `wp-config.php` — add `ANTHROPIC_API_KEY` constant
- Create: `wp-content/themes/solarcompany/inc/seo-ai.php` — file skeleton + `seo_ai_call_claude()`

**Interfaces:**
- Produces: `seo_ai_call_claude( string $prompt ): array|WP_Error` — returns parsed array `['meta_description' => string, 'og_description' => string]` or `WP_Error` on failure

- [ ] **Step 1: Add API key constant to wp-config.php**

Add before the `/* That's all, stop editing! */` line:
```php
define( 'ANTHROPIC_API_KEY', 'YOUR_KEY_HERE' );
```
Verify: `ddev wp eval "echo defined('ANTHROPIC_API_KEY') ? 'ok' : 'missing';"` → `ok`

- [ ] **Step 2: Create `inc/seo-ai.php` with file header**

```php
<?php
/**
 * SEO AI — auto-generates meta description and og:description via Claude API.
 *
 * @package SolarCompanyTheme
 */
```

- [ ] **Step 3: Implement `seo_ai_call_claude( string $prompt ): array|WP_Error`**

Signature and behaviour:
- Returns `WP_Error` immediately if `ANTHROPIC_API_KEY` is not defined
- Calls `wp_remote_post( 'https://api.anthropic.com/v1/messages', [...] )` with:
  - Headers: `x-api-key`, `anthropic-version: 2023-06-01`, `content-type: application/json`
  - Body (JSON-encoded): `model: claude-sonnet-4-6`, `max_tokens: 300`, single user message with `$prompt`
  - `timeout: 20`
- Returns `WP_Error` if `is_wp_error($response)` or HTTP status != 200
- Decodes JSON body, extracts `content[0].text`, JSON-decodes that as `['meta_description'=>..., 'og_description'=>...]`
- Returns the decoded array, or `WP_Error` if JSON parse fails

- [ ] **Step 4: Verify the client works**

```bash
ddev wp eval "
  \$r = seo_ai_call_claude('Return JSON: {\"meta_description\":\"test\",\"og_description\":\"test\"}');
  var_dump(is_wp_error(\$r) ? \$r->get_error_message() : \$r);
"
```
Expected: array with `meta_description` and `og_description` keys.

- [ ] **Step 5: Commit**

```bash
git add wp-config.php wp-content/themes/solarcompany/inc/seo-ai.php
git commit -m "feat: add Claude API client for SEO generation"
```

---

## Task 2: Content extractor + generation + save_post hook

**Files:**
- Modify: `wp-content/themes/solarcompany/inc/seo-ai.php` — add extractor, generator, hook

**Interfaces:**
- Consumes: `seo_ai_call_claude( string $prompt ): array|WP_Error` from Task 1
- Produces:
  - `_seo_ai_meta_description` post_meta key (string, max 160 chars)
  - `_seo_ai_og_description` post_meta key (string, max 200 chars)
  - `_seo_ai_content_hash` post_meta key (md5 string, used to skip unchanged posts)

- [ ] **Step 1: Implement `seo_ai_get_post_text( int $post_id ): string`**

- Gets `get_the_title($post_id)` and `get_post_field('post_content', $post_id)`
- Strips all tags with `wp_strip_all_tags()`
- Trims whitespace, collapses multiple spaces/newlines
- Concatenates: `Title: {title}\n\nContent: {content}`
- Truncates total to 3000 characters with `mb_substr()`

- [ ] **Step 2: Implement `seo_ai_generate_and_save( int $post_id ): void`**

Logic:
1. Check `get_post_type($post_id)` is `'post'` or `'page'` — return otherwise
2. Check `get_post_status($post_id)` is `'publish'` — return otherwise
3. Extract text via `seo_ai_get_post_text($post_id)`
4. Compute `$hash = md5($text)`
5. If `get_post_meta($post_id, '_seo_ai_content_hash', true) === $hash` and `get_post_meta($post_id, '_seo_ai_meta_description', true) !== ''` — return (no change)
6. Build prompt (see below)
7. Call `seo_ai_call_claude($prompt)` — return silently on `WP_Error`
8. `update_post_meta($post_id, '_seo_ai_meta_description', mb_substr($result['meta_description'], 0, 160))`
9. `update_post_meta($post_id, '_seo_ai_og_description', mb_substr($result['og_description'], 0, 200))`
10. `update_post_meta($post_id, '_seo_ai_content_hash', $hash)`

Prompt template:
```
You are an SEO copywriter. Based on the page content below, write exactly two fields.
Return ONLY valid JSON with no explanation, no markdown:
{"meta_description":"...(max 160 chars, compelling, includes main keyword)...","og_description":"...(max 200 chars, engaging for social share)..."}

Page content:
{text}
```

- [ ] **Step 3: Register save_post hook with loop guard**

```php
add_action( 'save_post', 'seo_ai_on_save_post', 20, 1 );

function seo_ai_on_save_post( int $post_id ): void {
    static $is_running = false;
    if ( $is_running ) return;
    if ( wp_is_post_revision( $post_id ) ) return;
    if ( wp_is_post_autosave( $post_id ) ) return;
    $is_running = true;
    seo_ai_generate_and_save( $post_id );
    $is_running = false;
}
```

- [ ] **Step 4: Verify generation on save**

Publish or update any page/post, then:
```bash
ddev wp post meta get <POST_ID> _seo_ai_meta_description
ddev wp post meta get <POST_ID> _seo_ai_og_description
```
Expected: non-empty strings under 160/200 chars respectively.

- [ ] **Step 5: Verify hash deduplication**

Update the same post without changing content, check API is not called again:
```bash
# Meta hash should stay the same:
ddev wp post meta get <POST_ID> _seo_ai_content_hash
# Save post again (via WP-CLI):
ddev wp post update <POST_ID> --post_status=publish
# Hash unchanged → meta unchanged
ddev wp post meta get <POST_ID> _seo_ai_content_hash
```

- [ ] **Step 6: Commit**

```bash
git add wp-content/themes/solarcompany/inc/seo-ai.php
git commit -m "feat: generate and save SEO meta on post save via Claude API"
```

---

## Task 3: Admin meta box — display generated values

**Files:**
- Modify: `wp-content/themes/solarcompany/inc/seo-ai.php` — add meta box registration + render callback

**Interfaces:**
- Consumes: `_seo_ai_meta_description`, `_seo_ai_og_description` post_meta from Task 2

- [ ] **Step 1: Register meta box for post and page screens**

```php
add_action( 'add_meta_boxes', 'seo_ai_register_meta_box' );

function seo_ai_register_meta_box(): void {
    foreach ( array( 'post', 'page' ) as $screen ) {
        add_meta_box(
            'seo_ai_meta_box',
            'SEO (AI Generated)',
            'seo_ai_meta_box_render',
            $screen,
            'normal',
            'high'
        );
    }
}
```

- [ ] **Step 2: Implement `seo_ai_meta_box_render( WP_Post $post ): void`**

Output a read-only table showing:
- Label "Meta Description" + value from `get_post_meta($post->ID, '_seo_ai_meta_description', true)`
- Label "OG Description" + value from `get_post_meta($post->ID, '_seo_ai_og_description', true)`
- A note: `<em>Values are auto-generated on save. Save the post to regenerate after content changes.</em>`
- If both values are empty: show `<em>Not yet generated. Publish or update this post to generate.</em>`
- All values escaped with `esc_html()`

- [ ] **Step 3: Verify meta box appears in editor**

Open any post or page in the WP admin. The "SEO (AI Generated)" meta box must be visible in the sidebar/below content area with the generated values (or the "not yet generated" message).

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/solarcompany/inc/seo-ai.php
git commit -m "feat: add read-only SEO AI meta box in post editor"
```

---

## Task 4: Output meta tags in `<head>`

**Files:**
- Modify: `wp-content/themes/solarcompany/inc/seo-ai.php` — add wp_head hook

**Interfaces:**
- Consumes: `_seo_ai_meta_description`, `_seo_ai_og_description` post_meta from Task 2

- [ ] **Step 1: Register wp_head hook**

```php
add_action( 'wp_head', 'seo_ai_output_meta_tags', 1 );
```

- [ ] **Step 2: Implement `seo_ai_output_meta_tags(): void`**

Logic:
- Only run on singular pages: `if ( ! is_singular() ) return;`
- Get `$post_id = get_queried_object_id()`
- Read both meta values
- If `$meta_description` is not empty: `printf( '<meta name="description" content="%s">' . "\n", esc_attr( $meta_description ) )`
- If `$og_description` is not empty: `printf( '<meta property="og:description" content="%s">' . "\n", esc_attr( $og_description ) )`

- [ ] **Step 3: Verify output on front end**

```bash
curl -s https://solarcompany.ddev.site/<any-published-post-slug>/ | grep 'meta name="description"'
curl -s https://solarcompany.ddev.site/<any-published-post-slug>/ | grep 'og:description'
```
Expected: both tags present with the generated values.

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/solarcompany/inc/seo-ai.php
git commit -m "feat: output AI-generated SEO meta tags in wp_head"
```
