<?php
/**
 * The search results template.
 *
 * @package SolarCompanyTheme
 */

get_header(); ?>
	<section class="section-blog-page">
		<div class="container">
			<?php if ( have_posts() ) : ?>
				<h1>
					<?php
					printf(
						/* translators: %s: search query */
						esc_html__( 'Search Results for: %s', 'solarcompany' ),
						'<span>' . get_search_query() . '</span>'
					);
					?>
				</h1>
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
