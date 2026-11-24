<?php
/**
 * Gutenberg Blog Page Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Blog Page
Description: Blog posts list with pagination.
Keywords: blog, posts, list
Icon: list-view
*/

$class_name = 'section-blog-page';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

$id_attr            = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
$current_page       = get_query_var( 'paged' ) ? (int) get_query_var( 'paged' ) : 1;
$selected_post_type = get_field( 'post_type' ) ? get_field( 'post_type' ) : 'post';

$blog_query = new WP_Query(
	array(
		'post_type'      => $selected_post_type,
		'post_status'    => 'publish',
		'posts_per_page' => get_option( 'posts_per_page' ),
		'paged'          => $current_page,
	)
);
?>
<section<?php echo $id_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> class="<?php echo esc_attr( $class_name ); ?>">
	<div class="container">
		<?php if ( $blog_query->have_posts() ) : ?>
			<ul class="blog-list">
				<?php
				while ( $blog_query->have_posts() ) :
					$blog_query->the_post();
					get_template_part( 'template-parts/content/content', get_post_type() );
				endwhile;
				wp_reset_postdata();
				?>
			</ul>
			<?php
			if ( $blog_query->max_num_pages > 1 ) :
				$pagination = solarcompany_pagination(
					array(
						'base'      => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
						'format'    => '?paged=%#%',
						'current'   => $current_page,
						'total'     => $blog_query->max_num_pages,
						'prev_text' => 'Previous',
						'next_text' => 'Next',
						'end_size'  => 1,
						'mid_size'  => 2,
					)
				);
				if ( $pagination ) :
					?>
					<div class="pagination-holder">
						<?php echo wp_kses_post( $pagination ); ?>
					</div>
					<?php
				endif;
			endif;
			?>
		<?php else : ?>
			<?php get_template_part( 'template-parts/not_found/not-found' ); ?>
		<?php endif; ?>
	</div>
</section>
