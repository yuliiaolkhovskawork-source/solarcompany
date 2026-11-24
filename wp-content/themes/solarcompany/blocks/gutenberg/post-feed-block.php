<?php
/**
 * Gutenberg Post Feed Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Post Feed
Description: Post Feed block.
Keywords: post, feed
Icon: grid-view
Other Available options: Icon, Category.
*/

$class_name = 'section-posts';
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
$format             = get_field( 'format' );
$selected_post_type = get_field( 'post_type' ) ? get_field( 'post_type' ) : 'post';
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

if ( empty( $r ) || ! $r->have_posts() ) {
	return;
}
?>
<section <?php echo esc_attr( $id_name ); ?> class="<?php echo esc_attr( $class_name ); ?>"
<?php
if ( $padding ) :
	echo 'style="' . esc_attr( get_the_style( $padding ) ) . '"';
endif;
?>
>
	<div class="container">
		<?php if ( ! empty( $heading ) || ! empty( $content ) || ! empty( $button ) ) : ?>
			<div class="block-heading">
				<?php if ( ! empty( $heading ) ) : ?>
					<h2><?php echo wp_kses( $heading, array( 'mark' => array() ) ); ?></h2>
				<?php endif; ?>
				<?php if ( ! empty( $content ) || ! empty( $button ) ) : ?>
					<div class="text-area">
						<?php echo wp_kses_post( $content ); ?>
						<?php if ( ! empty( $button ) ) : ?>
							<?php echo wp_kses_post( $button ); ?>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<ul class="cards-list">
			<?php
			while ( $r->have_posts() ) :
				$r->the_post();
				get_template_part( 'template-parts/content/content', get_post_type() );
			endwhile;
			wp_reset_postdata();
			?>
		</ul>
	</div>
</section>
