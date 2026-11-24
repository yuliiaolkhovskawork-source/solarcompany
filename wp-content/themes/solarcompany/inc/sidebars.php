<?php
/**
 * Add theme sidebars function
 *
 * @package SolarCompanyTheme
 */

/**
 * Registers the default sidebar for the theme.
 *
 * @return void
 */
function theme_widget_init() {
	register_sidebar(
		array(
			'id'            => 'default-sidebar',
			'name'          => esc_html__( 'Default Sidebar', 'solarcompany' ),
			'before_widget' => '<div class="widget %2$s" id="%1$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3>',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'theme_widget_init' );
