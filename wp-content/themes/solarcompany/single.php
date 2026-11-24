<?php
/**
 * The template for displaying all single posts.
 *
 * @package SolarCompanyTheme
 */

get_header(); ?>
	<div class="single-post-wrap">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<?php the_title( '<div class="container"><h1 class="page-title">', '</h1></div>' ); ?>
			<?php the_content(); ?>
			<?php comments_template(); ?>
			<?php get_template_part( 'template-parts/pager/pager-single', get_post_type() ); ?>
		<?php endwhile; ?>
	</div>
<?php
get_footer();
