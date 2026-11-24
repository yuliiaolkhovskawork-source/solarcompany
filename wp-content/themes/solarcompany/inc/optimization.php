<?php
/**
 * Theme optimisation
 *
 * @package SolarCompanyTheme
 */

if ( ! function_exists( 'disable_emojis' ) ) {

	/**
	 * Disable WordPress emoji's library which can take up to .2s on slow networks.
	 *
	 * Removes actions and filters related to emoji scripts, styles,
	 * TinyMCE plugin, and DNS prefetching to improve performance and reduce unnecessary output.
	 *
	 * @return void
	 */
	function disable_emojis() {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
		add_filter( 'wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2 );
	}

	add_action( 'init', 'disable_emojis' );

	/**
	 * Filter function used to remove the tinymce emoji plugin.
	 *
	 * This prevents the TinyMCE editor (used in classic editor and some widgets)
	 * from loading the 'wpemoji' plugin, which adds emoji support.
	 *
	 * @param  array $plugins Array of TinyMCE plugins.
	 * @return array Filtered array of TinyMCE plugins without 'wpemoji'.
	 */
	function disable_emojis_tinymce( $plugins ) {
		if ( is_array( $plugins ) ) {
			return array_diff( $plugins, array( 'wpemoji' ) );
		} else {
			return array();
		}
	}

	/**
	 * Remove emoji CDN hostname from DNS prefetching hints.
	 *
	 * This prevents WordPress from including a DNS prefetch hint for the emoji CDN,
	 * which is not needed when emojis are disabled.
	 *
	 * @param  array  $urls          URLs to print for resource hints.
	 * @param  string $relation_type The relation type the URLs are printed for (e.g., 'dns-prefetch').
	 * @return array Filtered array of URLs without the emoji CDN URL.
	 */
	function disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
		if ( 'dns-prefetch' === $relation_type ) {
			/**

		* This filter is documented in wp-includes/formatting.php
*/
			$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );
			$urls          = array_diff( $urls, array( $emoji_svg_url ) );
		}
		return $urls;
	}
}
