<?php
/**
 * Theme functions
 *
 * @package SolarCompanyTheme
 */

/**
 * Builds an inline CSS style string based on the provided configuration array.
 *
 * Currently supports padding (top and bottom) and background image styles.
 * Numeric values of `0` are treated as valid and will be included in the output.
 *
 * Example:
 * get_the_style([
 *     'padding' => [
 *         'top' => 0,
 *         'bottom' => 20,
 *     ],
 *     'background-image' => [
 *         'url' => 'image.jpg',
 *     ],
 * ]);
 *
 * Result:
 * padding-top: 0px;padding-bottom: 20px;background-image: url('image.jpg');
 *
 * @param array $atts Optional. Array of style attributes.
 *
 * @type array $atts['padding'] Optional. Padding configuration.
 * @type int|string $atts['padding']['top'] Padding top value in pixels.
 * @type int|string $atts['padding']['bottom'] Padding bottom value in pixels.
 *
 * @type array $atts['background-image'] Optional. Background image configuration.
 * @type string $atts['background-image']['url'] URL of the background image.
 *
 * @return string|null Generated CSS style string or null if no styles are generated.
 */
function get_the_style( array $atts = array() ) {

	$style = '';

	foreach ( $atts as $index => $item ) {
		if ( empty( $item ) ) {
			continue;
		}

		switch ( $index ) {
			case 'padding':
				if ( isset( $item['top'] ) ) {
					$style .= 'padding-top: ' . intval( $item['top'] ) . 'px;';
				}

				if ( isset( $item['bottom'] ) ) {
					$style .= 'padding-bottom: ' . intval( $item['bottom'] ) . 'px;';
				}
				break;

			case 'background-image':
				if ( ! empty( $item['url'] ) ) {
					$style .= 'background-image: url(\'' . esc_url( $item['url'] ) . '\');';
				}
				break;
		}
	}

	if ( '' === $style ) {
		return null;
	}

	return $style;
}

/**
 * Renders an ACF button link with optional classes, icon, and surrounding content.
 *
 * This function takes an ACF link field array and returns a sanitized anchor tag
 * with optional custom classes, icon, and content before/after the text.
 *
 * @param array  $button  ACF link array with keys: 'title', 'url', 'target'.
 * @param array  $classes Optional. Array of CSS classes to apply to the anchor tag.
 * @param string $icon    Optional. HTML string for an icon (e.g., <i class="icon"></i>).
 * @param string $before  Optional. Content to insert before the button text.
 * @param string $after   Optional. Content to insert after the button text.
 *
 * @return string|null Sanitized anchor tag HTML, or null if no button data is provided.
 */
function acf_button( $button, array $classes = array(), string $icon = '', string $before = '', string $after = '' ) {
	if ( empty( $button ) ) {
		return;
	}
	$title = ( $button['title'] ) ? $button['title'] : '';

	$attributes  = ( $button['url'] ) ? ' href="' . $button['url'] . '"' : '';
	$attributes .= ( $button['target'] ) ? ' target="_blank" rel="noreferrer"' : '';
	$attributes .= ( ! empty( $classes ) ) ? ' class="' . implode( ' ', $classes ) . '"' : '';

	$button = sprintf(
		'<a %s>%s</a>',
		$attributes,
		sprintf(
			'<span class="btn-text" data-text="%s"><span class="text">%s</span></span>',
			esc_attr( $title ),
			esc_html( $title )
		)
	);

	return wp_kses(
		$button,
		array(
			'a'    => array(
				'href'   => true,
				'target' => true,
				'rel'    => true,
				'class'  => true,
			),
			'span' => array(
				'class'       => true,
				'data-text'   => true,
				'aria-hidden' => true,
			),
			'i'    => array(
				'class' => true,
			),
		)
	);
}

/**
 * Output custom scripts stored in an ACF options field.
 *
 * Retrieves script code from a specified ACF field in the Options page
 * and prints it inside labeled HTML comment blocks. Used to output
 * custom header/footer scripts defined by administrators.
 *
 * @param string $field_name Name of the ACF field containing the scripts.
 * @param string $location   Location label (e.g., 'Header', 'Footer') for comment output.
 *
 * @return void
 */
function output_acf_scripts( $field_name, $location ) {
	$scripts = get_field( $field_name, 'option' );

	if ( ! $scripts ) {
		return;
	}

	$scripts = wp_unslash( $scripts );
	$scripts = trim( (string) $scripts );

	if ( '' === $scripts ) {
		return;
	}

	printf(
		"\n<!-- Custom %s Scripts (ACF) -->\n%s\n<!-- End %s Scripts -->\n",
		esc_html( $location ),
        $scripts, // @codingStandardsIgnoreLine WordPress.Security.EscapeOutput.OutputNotEscaped
		esc_html( $location )
	);
}

/**
* Hook into wp_head to output header scripts.
*
* Scripts here are placed before </head> tag.
*/
add_action(
	'wp_head',
	function () {
		output_acf_scripts( 'header_scripts', 'header' );
	},
	99
);

/**
* Hook into wp_body_open to output body scripts.
*
* Scripts here are placed immediately after <body> opening tag.
*/
add_action(
	'wp_body_open',
	function () {
		output_acf_scripts( 'body_scripts', 'body' );
	},
	10
);

/**
* Hook into wp_footer to output footer scripts.
*
* Scripts here are placed before </body> tag.
*/
add_action(
	'wp_footer',
	function () {
		output_acf_scripts( 'footer_scripts', 'footer' );
	},
	99
);

/**
 * Ensure WordPress properly validates JSON files during upload
 *
 * @param  array  $data     Array containing file type info.
 * @param  string $file     Full path to the file.
 * @param  string $filename Name of the uploaded file.
 * @param  array  $mimes    Allowed MIME types.
 * @return array Modified file type data.
 */
function allow_json_filetype_validation( $data, $file, $filename, $mimes ) {
	// Get the file extension.
	$ext = pathinfo( $filename, PATHINFO_EXTENSION );

	// If it's a JSON or Lottie file, set correct type and extension.
	if ( 'json' === $ext || 'lottie' === $ext ) {
		$data['ext']  = $ext;
		$data['type'] = 'application/json';
	}

	return $data;
}
add_filter( 'wp_check_filetype_and_ext', 'allow_json_filetype_validation', 10, 4 );

/**
 * Generates a space-separated list of CSS classes based on body style options.
 *
 * Used to apply a background color class like "blue-theme" to the body or wrapper element.
 *
 * @param  array $style Optional. Array with style settings, such as 'background_color'.
 * @return string Space-separated CSS classes or empty string if none.
 */
function get_body_style( $style = array() ) {
	$class = array();

	if ( ! empty( $style ) && ! empty( $style['background_color'] ) ) {
		$background_color = sanitize_html_class( $style['background_color'] );
		$class[]          = $background_color . '-theme';
	}

	return implode( ' ', $class );
}

// Disable all quote transformations.
add_filter( 'run_wptexturize', '__return_false' );

/**
 * Allow only custom ACF blocks in the Gutenberg editor.
 *
 * Removes all default WordPress blocks, leaving only blocks registered via ACF.
 *
 * @return array List of allowed ACF block names.
 */
function my_allowed_block_types() {
	$all_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

	$acf_blocks = array();

	foreach ( $all_blocks as $block_name => $block ) {
		if ( strpos( $block_name, 'acf/' ) === 0 ) {
			$acf_blocks[] = $block_name;
		}
	}

	return $acf_blocks;
}
add_filter( 'allowed_block_types_all', 'my_allowed_block_types', 10 );

/**
 * Add "active" class to menu items and their parents
 * when viewing single posts.
 *
 * @param array    $classes CSS classes for the menu item.
 * @param WP_Post  $item    The menu item object.
 * @param stdClass $args    Arguments from wp_nav_menu().
 * @param int      $depth   Menu depth.
 *
 * @return array Modified classes array.
 */
function my_custom_nav_menu_active_class( $classes, $item, $args = null, $depth = 0 ) {

	// Exit early if ACF is not available.
	if ( ! function_exists( 'get_field' ) ) {
		return $classes;
	}

	/**
	 * ---------------------------------------------------------------------
	 * Detect contexts: blog single.
	 * ---------------------------------------------------------------------
	 */

	$target_page_url  = '';
	$is_target_single = false;

	// Blog posts.
	if ( is_singular( 'post' ) ) {
		$page_id = get_option( 'page_for_posts' );
		if ( $page_id ) {
			$target_page_url  = get_permalink( $page_id );
			$is_target_single = true;
		}
	}

	// If not viewing a target single page — do nothing.
	if ( ! $is_target_single || empty( $target_page_url ) ) {
		return $classes;
	}

	// Normalize URLs for reliable comparison.
	$target_page_url = trailingslashit( $target_page_url );
	$menu_item_url   = trailingslashit( $item->url );

	/**
	 * ---------------------------------------------------------------------
	 * Step 1: Mark the direct menu item active.
	 * ---------------------------------------------------------------------
	 */
	if ( $menu_item_url === $target_page_url ) {
		$classes[] = 'active';
	}

	/**
	 * ---------------------------------------------------------------------
	 * Step 2: Mark parent menu levels active.
	 * ---------------------------------------------------------------------
	 */

	// Cannot lookup parent relations without a menu ID.
	if ( empty( $args->menu ) ) {
		return $classes;
	}

	// Load all menu items in the current menu.
	$menu_items = wp_get_nav_menu_items( $args->menu );

	// Find the menu item that corresponds to target page URL.
	$target_menu_item = null;

	foreach ( $menu_items as $menu_item ) {
		if ( trailingslashit( $menu_item->url ) === $target_page_url ) {
			$target_menu_item = $menu_item;
			break;
		}
	}

	// If a target menu item not found — nothing to highlight.
	if ( ! $target_menu_item ) {
		return $classes;
	}

	// Traverse up the menu tree and highlight parents.
	$current_item_id = (int) $item->ID;
	$parent_id       = (int) $target_menu_item->menu_item_parent;

	while ( 0 !== $parent_id ) {

		if ( $current_item_id === $parent_id ) {
			$classes[] = 'active';
			break;
		}

		// Move one level up.
		$found_parent = false;
		foreach ( $menu_items as $menu_item ) {
			if ( (int) $menu_item->ID === $parent_id ) {
				$parent_id    = (int) $menu_item->menu_item_parent;
				$found_parent = true;
				break;
			}
		}

		// Stop if no further parent is found.
		if ( ! $found_parent ) {
			break;
		}
	}

	return $classes;
}
add_filter( 'nav_menu_css_class', 'my_custom_nav_menu_active_class', 10, 4 );

/**
 * Allow iframe tags in post content for WYSIWYG fields.
 *
 * This is required to support embedded content (e.g. YouTube, Vimeo).
 * while still sanitizing output via wp_kses_post().
 *
 * @param array  $tags    Allowed HTML tags.
 * @param string $context Sanitization context.
 *
 * @return array
 */
add_filter(
	'wp_kses_allowed_html',
	function ( $tags, $context ) {
		if ( 'post' !== $context ) {
			return $tags;
		}

		$tags['iframe'] = array(
			'src'             => true,
			'width'           => true,
			'height'          => true,
			'frameborder'     => true,
			'allow'           => true,
			'allowfullscreen' => true,
		);

		return $tags;
	},
	10,
	2
);

/**
 * Returns the HTML markup for an ACF video block.
 *
 * @param array $item             Video data from ACF field.
 * @param bool  $show_play_button Whether to display the play button (default: true).
 *
 * @return string|null HTML for the video block or null if data is invalid.
 */
function acf_video( $item, $show_play_button = true ) {
	if ( empty( $item ) || ! is_array( $item ) ) {
		return null;
	}

	// Get video format (e.g., 'html5' or other).
	$video_format    = isset( $item['video_format'] ) ? $item['video_format'] : '';
	$video_size_type = isset( $item['video_size_type'] ) ? filter_var( $item['video_size_type'], FILTER_VALIDATE_BOOLEAN ) : true;
	$video           = '';

	// Get video source depending on format.
	if ( 'html5' === $video_format && ! empty( $item['video_url'] ) ) {
		$video = $item['video_url'];
	} elseif ( ! empty( $item['video_id'] ) ) {
		$video = $item['video_id'];
	}

	// Stop if no video source is available.
	if ( empty( $video ) ) {
		return null;
	}

	// Set autoplay to true if play button is hidden.
	$autoplay = $show_play_button ? false : true;

	// Prepare video data for the data-video attribute.
	$data_video = array(
		'type'       => $video_format,
		'video'      => $video,
		'autoplay'   => $autoplay,
		'fluidWidth' => $video_size_type,
	);

	// Determine container class.
	$container_class = $show_play_button ? 'video-block' : '';

	$output = '<div' . ( $container_class ? ' class="' . esc_attr( $container_class ) . '"' : '' ) . ' data-video=\'' . esc_attr( wp_json_encode( $data_video ) ) . '\'>';

	if ( ! empty( $item['video_poster'] ) ) {
		$output .= '<div class="poster image">';
		$output .= wp_get_attachment_image(
			$item['video_poster'],
			'full',
			false,
			array(
				'class' => 'poster',
				'alt'   => esc_attr__( 'Video poster', 'simframeworks' ),
			)
		);
		$output .= '</div>';
	}

	// Add play button if enabled.
	if ( $show_play_button ) {
		$output .= '<button class="btn-play" aria-label="' . esc_attr__( 'Play video', 'simframeworks' ) . '"><span class="btn-icon"></span></button>';
	}

	$output .= '</div>';

	return $output;
}

add_filter(
	'wp_get_ext_types',
	function ( $ext_types ) {
		if ( ! in_array( 'svg', $ext_types['image'], true ) ) {
			$ext_types['image'][] = 'svg';
		}
		return $ext_types;
	}
);

/**
 * Builds custom pagination HTML with a numbers-holder wrapper.
 *
 * Separates prev/next links from page number links so they can be
 * positioned independently via CSS.
 *
 * @param array $args Arguments passed to paginate_links() (without 'type').
 * @return string Pagination HTML or empty string when not needed.
 */
function solarcompany_pagination( $args ) {
	$links = paginate_links( array_merge( $args, array( 'type' => 'array' ) ) );

	if ( empty( $links ) ) {
		return '';
	}

	$prev    = '';
	$next    = '';
	$numbers = array();

	foreach ( $links as $link ) {
		if ( false !== strpos( $link, 'prev page-numbers' ) ) {
			$prev = $link;
		} elseif ( false !== strpos( $link, 'next page-numbers' ) ) {
			$next = $link;
		} else {
			$numbers[] = $link;
		}
	}

	$label = esc_attr__( 'Posts pagination', 'solarcompany' );
	$html  = '<nav class="navigation pagination" aria-label="' . $label . '">';
	$html .= '<div class="nav-links">';
	$html .= $prev;

	if ( ! empty( $numbers ) ) {
		$html .= '<div class="numbers-holder">' . implode( '', $numbers ) . '</div>';
	}

	$html .= $next;
	$html .= '</div></nav>';

	return $html;
}