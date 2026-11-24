<?php
/**
 * Theme thumbnails
 *
 * @package SolarCompanyTheme
 */

	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 50, 50, true ); // Normal post thumbnails.
	add_image_size( 'thumbnail_950x1080', 950, 1080, true );
	add_image_size( 'thumbnail_870x758', 870, 758, true );
	add_image_size( 'thumbnail_276x276', 276, 276, true );
	add_image_size( 'thumbnail_403x403', 403, 403, true );
