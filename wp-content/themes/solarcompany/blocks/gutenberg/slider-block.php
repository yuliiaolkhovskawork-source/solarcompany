<?php
/**
 * Gutenberg Slider Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Slider
Description: Slider block.
Keywords: slider reviews
Icon: slides
Other Available options: Icon, Category.
*/

$class_name = 'section-slider slider-view';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

$padding            = get_field( 'padding' );
$heading            = get_field( 'heading' );
$content            = get_field( 'content' );
$button             = acf_button( get_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
$block_theme        = get_field( 'block_theme' );
$selected_post_type = get_field( 'custom_post_type' ) ? get_field( 'custom_post_type' ) : 'post';
$format             = get_field( 'format' );
$items              = get_field( 'items' );
$num                = get_field( 'posts_number' );

if ( 'manual' === $format && ! empty( $items ) ) {
	$r = new WP_Query(
		array(
			'post_type'      => $selected_post_type,
			'posts_per_page' => -1,
			'post__in'       => $items,
			'orderby'        => 'post__in',
			'order'          => 'ASC',
		)
	);
} elseif ( 'automatic' === $format && ! empty( $num ) ) {
	$r = new WP_Query(
		array(
			'post_type'      => $selected_post_type,
			'posts_per_page' => $num,
		)
	);
}

$has_content = ! empty( $heading ) || ! empty( $content ) || ! empty( $button );
$has_posts   = ! empty( $r ) && $r->have_posts();

if ( ! $has_content && ! $has_posts ) {
	return;
}
?>
<section <?php echo esc_attr( $id_name ); ?> class="<?php echo esc_attr( $class_name ); ?><?php echo ! empty( $block_theme['block_style_options'] ) ? ' ' . esc_attr( get_body_style( $block_theme['block_style_options'] ) ) : ''; ?>"
<?php
if ( $padding ) :
	echo 'style="' . esc_attr( get_the_style( $padding ) ) . '"';
endif;
?>
>
	<div class="container">
		<div class="block-holder">
			<?php if ( $has_content ) : ?>
				<div class="text-area">
          <div class="slider-nav">
            <button type="button" class="swiper-button-prev" aria-label="<?php esc_attr_e( 'Previous slide', 'solarcompany' ); ?>">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.07 18.13"><path fill="#fff" d="M9.07 0c.26 0 .51.1.71.29.39.39.39 1.02 0 1.41L2.42 9.06l7.36 7.36a.996.996 0 1 1-1.41 1.41L.29 9.77a.996.996 0 0 1 0-1.41L8.36.29C8.55.1 8.81 0 9.07 0"/></svg>
            </button>
            <button type="button" class="swiper-button-next" aria-label="<?php esc_attr_e( 'Next slide', 'solarcompany' ); ?>">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.07 18.13"><path fill="#fff" d="M1 18.13c-.26 0-.51-.1-.71-.29a.996.996 0 0 1 0-1.41l7.36-7.36L.29 1.71C-.1 1.32-.1.68.29.29s1.03-.39 1.42 0l8.07 8.07c.39.39.39 1.02 0 1.41l-8.07 8.07c-.2.2-.45.29-.71.29"/></svg>
            </button>
          </div>
					<div class="text-holder">
						<?php if ( ! empty( $heading ) ) : ?>
							<h2><?php echo wp_kses( $heading, array( 'mark' => array() ) ); ?></h2>
						<?php endif; ?>
						<?php if ( ! empty( $content ) || ! empty( $button ) ) : ?>
							<div class="text-box">
								<?php if ( ! empty( $content ) ) : ?>
									<?php echo wp_kses_post( $content ); ?>
								<?php endif; ?>
								<?php if ( ! empty( $button ) ) : ?>
                  <?php echo wp_kses_post( $button ); ?>
                <?php endif; ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>

			<?php if ( $has_posts ) : ?>
				<div class="post-slider swiper">
					<div class="swiper-wrapper">
						<?php
						while ( $r->have_posts() ) :
							$r->the_post();
							?>
							<div class="swiper-slide">
								<?php get_template_part( 'template-parts/content/content', get_post_type(), array( 'no_li' => true ) ); ?>
							</div>
							<?php
						endwhile;
						wp_reset_postdata();
						?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
