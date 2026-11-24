<?php
/**
 * Enqueues theme scripts and styles.
 *
 * @package SolarCompanyTheme
 */

/**
 * Enqueue front-end scripts and styles for the theme.
 *
 * This function:
 * - Deregisters the default 'comment-reply' script and re-enqueues it with defer strategy, if threaded comments are enabled.
 * - Enqueues Google Fonts.
 * - Enqueues the Google Maps API script if a valid API key is set via ACF in options.
 * - Enqueues the main theme JavaScript file with defer strategy.
 * - Enqueues the main stylesheet and a custom theme stylesheet.
 *
 * Hooked into the 'wp_enqueue_scripts' action.
 *
 * @return void
 */
function base_scripts_styles() {
	$in_footer = true;

	/*
	* Adds JavaScript to pages with the comment form to support
	* sites with threaded comments (when in use).
	*/

	wp_deregister_script( 'comment-reply' );
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script(
			'comment-reply',
			get_template_directory_uri() . '/assets/js/comment-reply.js',
			'',
			'1.0.0',
			array(
				'strategy' => 'defer',
			)
		);
	}

	wp_enqueue_style(
		'google-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&family=Plus+Jakarta+Sans:ital,wght@0,800;1,800&display=swap',
		array(),
		null
	);

	// Loads JavaScript file with functionality specific.
	wp_enqueue_script(
		'base-script',
		get_template_directory_uri() . '/assets/dist/js/app.js',
		array( 'jquery' ),
		'1.0.0',
		array(
			'strategy' => 'defer',
		)
	);

	// Loads our main stylesheet.
	wp_enqueue_style( 'base-style', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );

	// Main stylesheet.
	wp_enqueue_style( 'main-style', get_template_directory_uri() . '/assets/dist/style.css', array(), wp_get_theme()->get( 'Version' ) );

	// Implementation stylesheet.
	wp_enqueue_style( 'base-theme', get_template_directory_uri() . '/assets/css/theme.css', array(), wp_get_theme()->get( 'Version' ) );
}

add_action( 'wp_enqueue_scripts', 'base_scripts_styles' );

/**
 * Adds preconnect resource hints for Google Fonts.
 *
 * @param array  $urls          URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed for.
 * @return array
 */
function base_google_fonts_preconnect( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = 'https://fonts.googleapis.com';
		$urls[] = array(
			'href'        => 'https://fonts.gstatic.com',
			'crossorigin' => 'anonymous',
		);
	}

	return $urls;
}
add_filter( 'wp_resource_hints', 'base_google_fonts_preconnect', 10, 2 );

add_action(
	'admin_enqueue_scripts',
	function () {
		wp_enqueue_script(
			'admin-script',
			get_template_directory_uri() . '/assets/js/jquery.plugins.js',
			array( 'jquery' ),
			'1.0.0',
			array(
				'strategy' => 'defer',
			)
		);
	},
	99
);
