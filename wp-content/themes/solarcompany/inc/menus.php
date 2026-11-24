<?php
/**
 * Theme menus
 *
 * @package SolarCompanyTheme
 */

	register_nav_menus(
		array(
			'primary'    => esc_html__( 'Primary Navigation', 'solarcompany' ),
			'copyrights' => esc_html__( 'Copyright Navigation', 'solarcompany' ),
			'footer'     => esc_html__( 'Footer Columns', 'solarcompany' ),
		)
	);
