<?php
/**
 * Functions and definitions.
 *
 * @package SolarCompanyTheme
 */

/**
 * Automatically includes all PHP files from the /inc directory of the current theme.
 *
 * This function scans the /inc directory of the active theme and requires all .php files.
 * It is useful for organizing theme functionality into separate modular files.
 *
 * No parameters.
 *
 * @return void
 */
function include_inc_files() {
	$inc_path = get_template_directory() . '/inc/';

	// Check if the directory exists.
	if ( ! is_dir( $inc_path ) ) {
		return;
	}

	// Get all PHP files in the /inc directory (non-recursive).
	$php_files = glob( $inc_path . '*.php' );

	if ( empty( $php_files ) ) {
		return;
	}

	foreach ( $php_files as $file ) {
		// Extra safety: Only include files with .php extension.
		if ( is_file( $file ) && strtolower( pathinfo( $file, PATHINFO_EXTENSION ) ) === 'php' ) {
			include_once $file;
		}
	}
}
add_action( 'after_setup_theme', 'include_inc_files' );
