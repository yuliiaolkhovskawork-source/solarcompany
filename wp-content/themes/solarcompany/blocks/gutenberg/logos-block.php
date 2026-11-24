<?php
/**
 * Gutenberg Logos Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Logos
Description: Logos grid block.
Keywords: logos, grid
Icon: format-image
Other Available options: Icon, Category.
*/

$class_name = 'section-logos-block';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

$padding     = get_field( 'padding' );
$block_title = get_field( 'title' );
$content     = get_field( 'content' );
$button      = acf_button( get_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
$logos       = get_field( 'logos' );

$has_heading = ! empty( $block_title ) || ! empty( $content ) || ! empty( $button );

if ( ! $has_heading && ! $logos ) {
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
		<?php if ( $has_heading ) : ?>
			<div class="block-heading">
				<?php if ( ! empty( $block_title ) ) : ?>
					<h2><?php echo wp_kses( $block_title, array( 'mark' => array() ) ); ?></h2>
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
		<?php if ( have_rows( 'logos' ) ) : ?>
			<div class="logos-holder">
				<ul class="logos-list">
					<?php
					while ( have_rows( 'logos' ) ) :
						the_row();
						$logo       = get_sub_field( 'logo' );
						$logo_link  = get_sub_field( 'link' );
						$logo_title = get_sub_field( 'title' );

						if ( is_array( $logo ) ) {
							$logo_url = $logo['url'] ?? '';
							$logo_alt = $logo['alt'] ?? '';
						} else {
							$logo_id  = (int) $logo;
							$logo_url = wp_get_attachment_url( $logo_id );
							$logo_alt = get_post_meta( $logo_id, '_wp_attachment_image_alt', true );
						}

						if ( empty( $logo_url ) ) :
							continue;
						endif;
						?>
						<li>
							<?php if ( $logo_link ) : ?>
							<a href="<?php echo esc_url( $logo_link ); ?>" target="_blank" rel="noopener">
							<?php endif; ?>
								<div class="logo-box"<?php if ( ! empty( $logo_title ) ) : ?> title="<?php echo esc_attr( $logo_title ); ?>"<?php endif; ?>>
									<img loading="lazy" decoding="async" src="<?php echo esc_url( $logo_url ); ?>" alt="<?php echo esc_attr( $logo_alt ); ?>" width="167" height="167">
								</div>
							<?php if ( $logo_link ) : ?>
							</a>
							<?php endif; ?>
						</li>
					<?php endwhile; ?>
				</ul>
			</div>
		<?php endif; ?>
	</div>
</section>
