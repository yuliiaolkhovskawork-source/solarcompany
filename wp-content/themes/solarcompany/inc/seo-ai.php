<?php
/**
 * SEO AI — auto-generates meta description and og:description via Claude API.
 *
 * @package SolarCompanyTheme
 */

/**
 * Returns the Claude model name to use, allowing override via filter.
 *
 * Override example: add_filter( 'seo_ai_model', fn() => 'claude-opus-4-5' );
 *
 * @return string
 */
function seo_ai_model(): string {
	return apply_filters( 'seo_ai_model', 'claude-sonnet-4-6' );
}

/**
 * Calls the Claude API (Anthropic Messages endpoint) with a plain-text prompt.
 *
 * @param string $prompt The plain-text prompt to send as a user message.
 * @return array|WP_Error Parsed array with 'meta_description' and 'og_description' keys,
 *                        or WP_Error on failure.
 */
function seo_ai_call_claude( string $prompt ): array|WP_Error {
	if ( ! defined( 'ANTHROPIC_API_KEY' ) ) {
		return new WP_Error(
			'seo_ai_no_api_key',
			__( 'ANTHROPIC_API_KEY constant is not defined.', 'solarcompany' )
		);
	}

	$body = wp_json_encode(
		array(
			'model'      => seo_ai_model(),
			'max_tokens' => 300,
			'messages'   => array(
				array(
					'role'    => 'user',
					'content' => $prompt,
				),
			),
		)
	);

	$response = wp_remote_post(
		'https://api.anthropic.com/v1/messages',
		array(
			'timeout' => 20,
			'headers' => array(
				'x-api-key'         => ANTHROPIC_API_KEY,
				'anthropic-version' => '2023-06-01',
				'content-type'      => 'application/json',
			),
			'body'    => $body,
		)
	);

	if ( is_wp_error( $response ) ) {
		return new WP_Error(
			'seo_ai_request_failed',
			sprintf(
				/* translators: %s: underlying WP_Error message */
				__( 'HTTP request to Claude API failed: %s', 'solarcompany' ),
				$response->get_error_message()
			)
		);
	}

	$http_code = wp_remote_retrieve_response_code( $response );
	if ( 200 !== $http_code ) {
		return new WP_Error(
			'seo_ai_bad_status',
			sprintf(
				/* translators: %d: HTTP status code */
				__( 'Claude API returned unexpected HTTP status: %d', 'solarcompany' ),
				(int) $http_code
			)
		);
	}

	$raw_body = wp_remote_retrieve_body( $response );
	$parsed   = json_decode( $raw_body, true );

	if ( null === $parsed || ! isset( $parsed['content'][0]['text'] ) ) {
		return new WP_Error(
			'seo_ai_parse_error',
			__( 'Failed to parse JSON response from Claude API.', 'solarcompany' )
		);
	}

	// Strip markdown code fences in case Claude wraps JSON in ```json ... ```.
	$text = trim( $parsed['content'][0]['text'] );
	$text = preg_replace( '/^```(?:json)?\s*/i', '', $text );
	$text = preg_replace( '/\s*```$/', '', $text );

	$result = json_decode( $text, true );

	if ( null === $result || ! isset( $result['meta_description'], $result['og_description'] ) ) {
		// Log the raw response so issues are visible in debug logs.
		error_log( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			sprintf(
				'[seo-ai] json_decode failed. Raw Claude text: %s',
				$text
			)
		);

		return new WP_Error(
			'seo_ai_invalid_content',
			__( 'Claude API response did not contain expected meta_description and og_description keys.', 'solarcompany' )
		);
	}

	return array(
		'meta_description' => $result['meta_description'],
		'og_description'   => $result['og_description'],
	);
}

/**
 * Extracts plain text from a post for SEO generation.
 *
 * Falls back to title only when post_content is empty (e.g. ACF-only pages).
 *
 * @param int $post_id The post ID.
 * @return string Plain text truncated to 3000 characters.
 */
function seo_ai_get_post_text( int $post_id ): string {
	$title   = wp_strip_all_tags( get_the_title( $post_id ) );
	$title   = trim( preg_replace( '/\s+/', ' ', $title ) );

	$content = get_post_field( 'post_content', $post_id );
	$content = wp_strip_all_tags( $content );
	$content = trim( preg_replace( '/\s+/', ' ', $content ) );

	if ( '' !== $content ) {
		$text = 'Title: ' . $title . "\n\nContent: " . $content;
	} else {
		$text = 'Title: ' . $title;
	}

	return mb_substr( $text, 0, 3000 );
}

/**
 * Generates SEO meta via Claude and saves to post meta.
 *
 * Skips if post type/status is wrong, or if content hasn't changed
 * and meta is already populated.
 *
 * @param int $post_id The post ID.
 * @return void
 */
function seo_ai_generate_and_save( int $post_id ): void {
	$post_type = get_post_type( $post_id );
	if ( 'post' !== $post_type && 'page' !== $post_type ) {
		return;
	}

	if ( 'publish' !== get_post_status( $post_id ) ) {
		return;
	}

	$text = seo_ai_get_post_text( $post_id );
	$hash = md5( $text );

	$stored_hash = get_post_meta( $post_id, '_seo_ai_content_hash', true );
	$stored_meta = get_post_meta( $post_id, '_seo_ai_meta_description', true );
	if ( $stored_hash === $hash && '' !== $stored_meta ) {
		return;
	}

	$prompt = 'You are an SEO copywriter. Based on the page content below, write exactly two fields.' . "\n"
		. 'Return ONLY valid JSON with no explanation, no markdown:' . "\n"
		. '{"meta_description":"...(max 160 chars, compelling, includes main keyword)...","og_description":"...(max 200 chars, engaging for social share)..."}' . "\n\n"
		. 'Page content:' . "\n"
		. $text;

	$result = seo_ai_call_claude( $prompt );

	if ( is_wp_error( $result ) ) {
		error_log( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			sprintf(
				'[seo-ai] generation failed for post %d: %s',
				$post_id,
				$result->get_error_message()
			)
		);
		return;
	}

	update_post_meta( $post_id, '_seo_ai_meta_description', mb_substr( $result['meta_description'], 0, 160 ) );
	update_post_meta( $post_id, '_seo_ai_og_description', mb_substr( $result['og_description'], 0, 200 ) );
	update_post_meta( $post_id, '_seo_ai_content_hash', $hash );
}

add_action( 'seo_ai_process_post', 'seo_ai_generate_and_save' );

/**
 * Hooks into save_post to schedule background SEO generation via WP-Cron.
 *
 * Scheduling via WP-Cron prevents the API call (up to 20s) from blocking
 * the editor save response.
 *
 * @param int $post_id The post ID being saved.
 * @return void
 */
function seo_ai_on_save_post( int $post_id ): void {
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}
	if ( wp_is_post_autosave( $post_id ) ) {
		return;
	}

	// Schedule generation on the next WP-Cron run so save doesn't block.
	if ( ! wp_next_scheduled( 'seo_ai_process_post', array( $post_id ) ) ) {
		wp_schedule_single_event( time(), 'seo_ai_process_post', array( $post_id ) );
	}
}

add_action( 'save_post', 'seo_ai_on_save_post', 20, 1 );

/**
 * Registers the SEO AI meta box for post and page edit screens.
 *
 * @return void
 */
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

add_action( 'add_meta_boxes', 'seo_ai_register_meta_box' );

/**
 * Renders the read-only SEO AI meta box content.
 *
 * @param WP_Post $post The current post object.
 * @return void
 */
function seo_ai_meta_box_render( WP_Post $post ): void {
	$meta_description = get_post_meta( $post->ID, '_seo_ai_meta_description', true );
	$og_description   = get_post_meta( $post->ID, '_seo_ai_og_description', true );

	if ( '' === $meta_description && '' === $og_description ) {
		echo '<p><em>' . esc_html__( 'Not yet generated. Publish or update this post to generate.', 'solarcompany' ) . '</em></p>';
	} else {
		?>
		<table style="width:100%;border-collapse:collapse;">
			<tbody>
				<tr>
					<th style="text-align:left;padding:6px 8px;width:160px;vertical-align:top;"><?php esc_html_e( 'Meta Description', 'solarcompany' ); ?></th>
					<td style="padding:6px 8px;vertical-align:top;"><?php echo esc_html( $meta_description ); ?></td>
				</tr>
				<tr>
					<th style="text-align:left;padding:6px 8px;width:160px;vertical-align:top;"><?php esc_html_e( 'OG Description', 'solarcompany' ); ?></th>
					<td style="padding:6px 8px;vertical-align:top;"><?php echo esc_html( $og_description ); ?></td>
				</tr>
			</tbody>
		</table>
		<?php
	}

	echo '<p><em>' . esc_html__( 'Values are auto-generated on save. Save the post to regenerate after content changes.', 'solarcompany' ) . '</em></p>';
}

/**
 * Returns true if Yoast SEO or Rank Math is active.
 *
 * When a dedicated SEO plugin is present it manages meta tags itself,
 * so this module skips its own output to avoid duplicates.
 *
 * @return bool
 */
function seo_ai_has_seo_plugin(): bool {
	if ( ! function_exists( 'is_plugin_active' ) ) {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	return is_plugin_active( 'wordpress-seo/wp-seo.php' )
		|| is_plugin_active( 'seo-by-rank-math/rank-math.php' );
}

/**
 * Outputs AI-generated meta tags in the page <head>.
 *
 * Skipped entirely when Yoast SEO or Rank Math is active to prevent
 * duplicate meta tags.
 *
 * @return void
 */
function seo_ai_output_meta_tags(): void {
	if ( ! is_singular() ) {
		return;
	}

	// Defer to dedicated SEO plugins when present.
	if ( seo_ai_has_seo_plugin() ) {
		return;
	}

	$post_id = get_queried_object_id();

	$meta_description = get_post_meta( $post_id, '_seo_ai_meta_description', true );
	$og_description   = get_post_meta( $post_id, '_seo_ai_og_description', true );

	if ( '' !== $meta_description ) {
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( $meta_description ) );
	}

	if ( '' !== $og_description ) {
		printf( '<meta property="og:description" content="%s">' . "\n", esc_attr( $og_description ) );
	}
}

add_action( 'wp_head', 'seo_ai_output_meta_tags', 1 );
