<?php
/**
 * The main template file.
 *
 * @package SolarCompanyTheme
 */

get_header(); ?>
	<?php
	$blog_obj = get_post( get_option( 'page_for_posts' ) );
	$content  = apply_filters( 'the_content', $blog_obj->post_content );
	if ( ! empty( $content ) ) :
		?>
		<?php echo wp_kses_post( $content ); ?>
	<?php endif; ?>
	<section class="section-blog-page">
		<div class="container">
			<?php if ( have_posts() ) : ?>
				<ul class="blog-list cards-holder">
					<?php
					while ( have_posts() ) :
						the_post();
						get_template_part( 'template-parts/content/content' );
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
