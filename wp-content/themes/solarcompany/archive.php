<?php
/**
 * The template for displaying archive pages.
 *
 * @package SolarCompanyTheme
 */

get_header(); ?>
	<section class="section-blog-page">
		<div class="container">
			<?php if ( have_posts() ) : ?>
				<?php the_archive_title( '<h1>', '</h1>' ); ?>
				<ul class="blog-list cards-holder">
					<?php
					while ( have_posts() ) :
						the_post();
						get_template_part( 'template-parts/content/content', get_post_type() );
					endwhile;
					?>
				</ul>
				<?php get_template_part( 'template-parts/pager/pager' ); ?>
			<?php else : ?>
				<?php get_template_part( 'template-parts/not_found/not-found' ); ?>
			<?php endif; ?>
		</div>
	</section>

<?php get_footer(); ?>
