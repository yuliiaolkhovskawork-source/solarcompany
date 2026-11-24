<?php
/**
 * Gutenberg blocks
 *
 * @package SolarCompanyTheme
 */

/**
 * Converts PHP files in a given theme folder to an array of filenames (without extension).
 *
 * Scans the specified directory (relative to the theme root) and returns
 * an array of PHP filenames (without the `.php` extension), ignoring
 * subdirectories and non-PHP files.
 *
 * @param string $dir Relative path to the directory inside the theme.
 *
 * @return array|false Array of file names without extension on success, false on failure or if empty.
 */
function files_to_array( $dir ) {
	$block_fields = scandir( get_theme_file_path( $dir ) );
	if ( $block_fields ) :
		$block_fields = array_diff( $block_fields, array( '.', '..' ) );
		$block_fields = array_filter(
			$block_fields,
			function ( $file ) {
				if ( ! is_dir( $file ) ) {
					return $file;
				}
			}
		);
		$names        = array();
		foreach ( $block_fields as $item ) :
			$names[] = str_replace( '.php', '', $item );
		endforeach;
		if ( ! empty( $names ) ) :
			return $names;
	else :
		return false;
	endif;
	else :
		return false;
	endif;
}

add_action( 'acf/init', 'my_acf_init' );

/**
 * Registers ACF blocks dynamically from PHP files in the theme's /blocks/gutenberg directory.
 *
 * Each block file should include metadata in the form of:
 *  - Block title
 *  - Description
 *  - Keywords (comma-separated)
 *  - Category
 *  - Icon
 *
 * Optionally, a JS file with the same name can be placed in /blocks/gutenberg-js/
 * to enqueue custom editor scripts.
 *
 * @return void
 */
function my_acf_init() {
	if ( function_exists( 'acf_register_block' ) ) {
		$block_fields = files_to_array( '/blocks/gutenberg/' );
		if ( $block_fields ) {
			foreach ( $block_fields as $block_name ) {
				$file_path             = get_theme_file_path( '/blocks/gutenberg/' . $block_name . '.php' );
				$file_data             = get_file_data(
					$file_path,
					array(
						'title'       => 'Block title',
						'description' => 'Description',
						'keywords'    => 'Keywords',
						'category'    => 'Category',
						'icon'        => 'Icon',
					)
				);
				$file_data['keywords'] = explode( ', ', $file_data['keywords'] );
				$file_data['keywords'] = array_map( 'trim', $file_data['keywords'] );
				// fallback options.
				$file_data['title']       = $file_data['title'] ? $file_data['title'] : $block_name;
				$file_data['description'] = $file_data['description'] ? $file_data['description'] : $block_name;
				$file_data['category']    = $file_data['category'] ? $file_data['category'] : 'theme-blocks';
				$file_data['icon']        = $file_data['icon'] ? $file_data['icon'] : 'media-text';
				$preview_file             = '';
				foreach ( array( 'jpg', 'png' ) as $ext ) {
					if ( file_exists( get_theme_file_path( '/blocks/preview/' . $block_name . '.' . $ext ) ) ) {
						$preview_file = $block_name . '.' . $ext;
						break;
					}
				}
				$has_preview = ! empty( $preview_file );

				$args = array(
					'name'            => $block_name,
					'title'           => $file_data['title'],
					'description'     => $file_data['description'],
					'category'        => $file_data['category'],
					'icon'            => $file_data['icon'],
					'keywords'        => $file_data['keywords'],
					'mode'            => 'edit',
					'align'           => 'full',
					'supports'        => array(
						'align'  => false,
						'anchor' => true,
					),
					'render_callback' => function ( $block, $content = '', $is_preview = false ) use ( $block_name, $has_preview, $preview_file ) {
						if ( $is_preview && $has_preview ) {
							echo '<img src="' . esc_url( get_theme_file_uri( '/blocks/preview/' . $preview_file ) ) . '" style="width:100%;height:auto;" alt="" />';
							return;
						}
						include get_theme_file_path( '/blocks/gutenberg/' . $block_name . '.php' );
					},
				);

				if ( $has_preview ) {
					$args['example'] = array(
						'attributes' => array(
							'data' => array( 'is_preview' => true ),
						),
					);
				}

				if ( file_exists( get_stylesheet_directory() . '/blocks/gutenberg-js/' . $block_name . '.js' ) ) :
					$args['enqueue_script'] = get_template_directory_uri() . '/blocks/gutenberg-js/' . $block_name . '.js';
				endif;
				acf_register_block_type( $args );
			}
		}
	}
}

add_filter( 'block_categories_all', 'my_plugin_block_categories', 10, 2 );
/**
 * Add a custom block category for ACF blocks.
 *
 * @param array   $categories Existing block categories.
 * @param WP_Post $post       Current post object (unused).
 *
 * @return array Modified block categories.
 *
 * @phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
 */
function my_plugin_block_categories( $categories, $post ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug'  => 'theme-blocks',
				'title' => esc_html__( 'Theme blocks', 'solarcompany' ),
			),
		)
	);
}

/**
 * Callback to render an ACF block.
 *
 * Includes the PHP template file from the theme's /blocks/gutenberg directory
 * based on the block's slug.
 *
 * @param array $block Block settings and attributes.
 *
 * @return void
 */
function my_acf_block_render_callback( $block ) {
	$slug = str_replace( 'acf/', '', $block['name'] );
	if ( file_exists( get_theme_file_path( "/blocks/gutenberg/{$slug}.php" ) ) ) {
		include get_theme_file_path( "/blocks/gutenberg/{$slug}.php" );
	}
}
