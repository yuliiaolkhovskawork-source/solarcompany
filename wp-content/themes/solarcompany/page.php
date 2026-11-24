<?php
/**
 * The page template.
 *
 * @package SolarCompanyTheme
 */

get_header(); ?>
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<?php the_content(); ?>
	<?php endwhile; ?>
	<?php wp_link_pages(); ?>
	<?php comments_template(); ?>
<?php
get_footer();
