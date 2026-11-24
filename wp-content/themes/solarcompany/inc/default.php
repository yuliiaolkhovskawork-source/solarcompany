<?php
/**
 * Default theme settings
 *
 * @package SolarCompanyTheme
 */

/**
 * Staging restrictions
 */

if ( file_exists( sys_get_temp_dir() . '/staging-restrictions.php' ) ) {
	define( 'STAGING_RESTRICTIONS', true );
	include_once sys_get_temp_dir() . '/staging-restrictions.php';
}

/**
 * Ensure that no content or assets break the container of the site
 */

if ( ! isset( $content_width ) ) {
	$content_width = 900;
}

/**
 * Removes WordPress version info from the <head> for security.
 */

remove_action( 'wp_head', 'wp_generator' );

if ( ! function_exists( 'seo_warning' ) ) {

	/**
	 * Displays a warning message in the admin area if search engine visibility is disabled.
	 *
	 * Checks if the blog is set to private (blocking robots) and
	 * outputs an admin notice with a link to the Reading settings page.
	 *
	 * @return void
	 */
	function seo_warning() {
		if ( get_option( 'blog_public' ) ) {
			return;
		}

		// translators: %s is the URL to the Reading Settings page in the WordPress admin.
		$message = esc_html__( 'You are blocking access to robots. You must go to your <a href="%s">Reading</a> settings and uncheck the box for Search Engine Visibility.', 'seattleselect' );

		$url               = admin_url( 'options-reading.php' );
		$formatted_message = sprintf( $message, esc_url( $url ) );

		echo '<div class="error"><p>' . wp_kses_post( $formatted_message ) . '</p></div>';
	}
	add_action( 'admin_notices', 'seo_warning' );
}

if ( ! function_exists( 'theme_localization' ) ) {

	/**
	 * Loads theme's text domain for localization.
	 *
	 * Loads the translation files from the /languages directory inside the theme.
	 *
	 * @return void
	 */
	function theme_localization() {
		load_theme_textdomain( 'seattleselect', get_template_directory() . '/languages' );
	}
	add_action( 'after_setup_theme', 'theme_localization' );
}

if ( ! function_exists( 'shortcode_email' ) ) {

	/**
	 * Shortcode handler to protect email addresses from spambots.
	 *
	 * Converts the email address inside the shortcode content into an obfuscated format.
	 *
	 * @param  array  $atts    Shortcode attributes (not used).
	 * @param  string $content The content between shortcode tags, expected to be an email address.
	 * @return string Obfuscated email address.
	 */
	function shortcode_email( $atts, $content ) {
		return antispambot( $content );
	}
	add_shortcode( 'email', 'shortcode_email' );
}

if ( ! function_exists( 'change_menu_classes' ) ) {

	/**
	 * Replace standard wp menu classes with 'active'.
	 *
	 * This function replaces 'current-menu-item', 'current-menu-parent',
	 * and 'current-menu-ancestor' CSS classes with 'active' in the given array.
	 *
	 * @param  array $css_classes Array of CSS classes for a menu item.
	 * @return array Modified array with replaced classes.
	 */
	function change_menu_classes( $css_classes ) {
		return str_replace( array( 'current-menu-item', 'current-menu-parent', 'current-menu-ancestor' ), 'active', $css_classes );
	}
	add_filter( 'nav_menu_css_class', 'change_menu_classes' );
}

if ( ! function_exists( 'clean_phone' ) ) {

	/**
	 * Cleans a phone number by removing all non-numeric characters.
	 *
	 * @param string $phone the phone number to clean.
	 *
	 * @return string the cleaned phone number containing only numeric characters
	 */
	function clean_phone( $phone ) {
		return preg_replace( '/[^0-9]/', '', $phone );
	}
}

if ( ! function_exists( 'theme_page_comment_status' ) ) {

	/**
	 * Disable comments on pages by default
	 *
	 * When a new page is created (not updated), this function disables comments by setting
	 * the comment_status to 'closed'. It temporarily removes itself from the save_post_page
	 * hook to avoid infinite loops during the update.
	 *
	 * @param  int     $post_ID The post ID.
	 * @param  WP_Post $post    The post object.
	 * @param  bool    $update  Whether this is an existing post being updated or not.
	 * @return void
	 */
	function theme_page_comment_status( $post_ID, $post, $update ) {
		if ( ! $update ) {
			remove_action( 'save_post_page', 'theme_page_comment_status', 10 );
			wp_update_post(
				array(
					'ID'             => $post->ID,
					'comment_status' => 'closed',
				)
			);
			add_action( 'save_post_page', 'theme_page_comment_status', 10, 3 );
		}
	}
	add_action( 'save_post_page', 'theme_page_comment_status', 10, 3 );
}

if ( ! function_exists( 'theme_get_the_password_form' ) ) {

	/**
	 * Generate a custom password form for password-protected posts.
	 *
	 * This function creates a custom HTML form that prompts users to enter
	 * the password to view protected content.
	 *
	 * @global WP_Post $post The current post object.
	 * @return string The HTML output of the password form.
	 */
	function theme_get_the_password_form() {
		$post  = get_post();
		$label = 'pwbox-' . ( empty( $post->ID ) ? wp_rand() : $post->ID );

		// translators: Message shown on password-protected posts before the password form.
		$message = __( 'This content is password protected. To view it please enter your password below:', 'solarcompany' );

		// translators: Label before the password input field.
		$password_label = __( 'Password:', 'seattleselect' );

		$output = '<div class="container"><form action="' . esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) . '" class="post-password-form" method="post">
			<p>' . esc_html( $message ) . '</p>
			<p><label for="' . esc_attr( $label ) . '">' . esc_html( $password_label ) . '</label>
			<input name="post_password" id="' . esc_attr( $label ) . '" type="password" size="20" />
			<input type="submit" name="Submit" value="' . esc_attr__( 'Submit', 'solarcompany' ) . '" /></p></form></div>';

		return $output;
	}
	add_filter( 'the_password_form', 'theme_get_the_password_form' );
}

if ( ! function_exists( 'basetheme_options_capability' ) ) {

	/**
	 * Grants administrators the custom capability to view theme options.
	 *
	 * This function grants the 'theme_options_view' capability to administrators,
	 * allowing them to access theme options.
	 *
	 * @return void
	 */
	function basetheme_options_capability() {
		$role = get_role( 'administrator' );
		$role->add_cap( 'theme_options_view' );
	}
	add_action( 'admin_init', 'basetheme_options_capability' );
}

/**
 * Date archive link
 *
 * @package ElevationattheuTheme
 */

if ( ! function_exists( 'eg_setting_callback_function' ) ) {
	add_action(
		'admin_init',
		function () {
			add_settings_section(
				'eg_setting_section',
				__( 'Date archive link', 'solarcompany' ),
				function () {
				},
				'reading'
			);

			add_settings_field(
				'eg_setting_name',
				__( 'Type', 'solarcompany' ),
				'eg_setting_callback_function',
				'reading',
				'eg_setting_section'
			);

			register_setting( 'reading', 'eg_date_archive_link_type' );
		}
	);
	/**
	 * Callback function for rendering the archive link type setting field.
	 *
	 * Outputs a `<select>` dropdown field in the WordPress admin settings page
	 * for choosing how date-based archives should be linked: by day, month, or year.
	 *
	 * Uses `get_option()` to retrieve the saved value and `selected()` to mark the
	 * appropriate option as selected. Falls back to 'month' if no value is saved.
	 *
	 * @return void
	 */
	function eg_setting_callback_function() {
		if ( get_option( 'eg_date_archive_link_type' ) ) {
			$type = get_option( 'eg_date_archive_link_type' );
		} else {
			$type = 'month';
		}
		echo '
			<select name="eg_date_archive_link_type">
				<option ' . selected( $type, 'day', false ) . ' value="day">' . esc_html__( 'Day', 'solarcompany' ) . '</option>
				<option ' . selected( $type, 'month', false ) . ' value="month">' . esc_html__( 'Month', 'solarcompany' ) . '</option>
				<option ' . selected( $type, 'year', false ) . ' value="year">' . esc_html__( 'Year', 'solarcompany' ) . '</option>
			</select>
		';
	}
}

if ( ! function_exists( 'get_date_archive_link' ) ) {
	/**
	 * Returns the link to the date archive based on the option setting (year, month, or day).
	 *
	 * The granularity (year/month/day) is determined by the option `eg_date_archive_link_type`,
	 * which is expected to be one of: 'year', 'month', or 'day'. This value is typically set
	 * via a custom settings page.
	 *
	 * Uses `get_the_date()` to extract the year, month, and day from the current post's date
	 * and generates the appropriate archive link using WordPress core functions:
	 * - get_year_link()
	 * - get_month_link()
	 * - get_day_link()
	 *
	 * Defaults to 'month' if the option is not set or contains an invalid value.
	 *
	 * @return string Archive URL based on the current post's date and selected granularity.
	 */
	function get_date_archive_link() {
		if ( 'year' === get_option( 'eg_date_archive_link_type' ) ) {
			$res = get_year_link( get_the_date( 'Y' ) );
		} elseif ( 'day' === get_option( 'eg_date_archive_link_type' ) ) {
			$res = get_day_link( get_the_date( 'Y' ), get_the_date( 'm' ), get_the_date( 'd' ) );
		} else {
			$res = get_month_link( get_the_date( 'Y' ), get_the_date( 'm' ) );
		}
		return $res;
	}
}

/**
 * Enables support for styles in block-based themes.
 */

add_theme_support( 'wp-block-styles' );

/**
 * Allows wide and full-width alignment options for blocks.
 */

add_theme_support( 'align-wide' );

/**
 * Enables support for custom line heights in the block editor.
 */

add_theme_support( 'custom-line-height' );

/**
 * Supports responsive embeds in block-based themes.
 */

add_theme_support( 'responsive-embeds' );

/**
 * Allows custom spacing options in the block editor.
 */

add_theme_support( 'custom-spacing' );

/**
 * Enables support for appearance tools in the block editor.
 */

add_theme_support( 'appearance-tools' );

/**
 * Supports block template parts for more flexible block-based themes.
 */

add_theme_support( 'block-template-parts' );

/**
 * Enables automatic RSS feed links in the head section of your site.
 */

add_theme_support( 'automatic-feed-links' );

/**
 * Allows WordPress to manage the title tag dynamically.
 */

add_theme_support( 'title-tag' );

/**
 * Enables support for html5 in the block editor.
 */

add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'style', 'script' ) );

if ( ! function_exists( 'custom_class' ) ) {
	add_filter( 'body_class', 'custom_class' );

	/**
	 * Add custom CSS classes based on block content and ACF field.
	 *
	 * Adds 'no-space' class if the first block is an ACF block,
	 * and adds 'brand-active' class if the ACF field 'enable_brand_block' is true.
	 *
	 * @param  array $classes Existing array of CSS classes.
	 * @return array Modified array of CSS classes.
	 */
	function custom_class( $classes ) {
		if ( is_page() || is_single() ) {
			$post   = get_post();
			$blocks = parse_blocks( $post->post_content );
			if ( $blocks ) {
				$start = substr( $blocks[0]['blockName'], 0, 3 );
				if ( 'acf' === $start ) {
					$classes[] = 'no-space';
				}
			}
			$enable_brand_block = get_field( 'enable_brand_block', get_the_ID() );
			if ( $enable_brand_block ) {
				$classes[] = 'brand-active';
			}
		}
		return $classes;
	}
}

if ( ! function_exists( 'custom_admin_css' ) ) {

	/**
	 * Update Gutenberg block width in admin panel
	 *
	 * Adjusts the max-width of Gutenberg blocks to improve the editing experience.
	 *
	 * @return void
	 */
	function custom_admin_css() {
		echo '<style>.wp-block {max-width: 90%;}.wp-block[data-align="wide"] {max-width: 90%;}.wp-block[data-align="full"] {max-width: none;}</style>';
	}
	add_action( 'admin_head', 'custom_admin_css' );
}
