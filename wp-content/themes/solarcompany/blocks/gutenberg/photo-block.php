<?php
/**
 * Gutenberg Photo Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Photo
Description: Photo block.
Keywords: photo
Icon: media-document
Other Available options: Icon, Category.
*/

$class_name = 'section-photo-block';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

$padding         = get_field( 'padding' );
$heading         = get_field( 'heading' );
$content         = get_field( 'content' );
$photo           = get_field( 'photo' );
$button          = acf_button( get_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
$photo_alignment = get_field( 'photo_alignment' );
$layout_option   = get_field( 'layout_option' );

if ( ! empty( $heading ) || ! empty( $content ) || ! empty( $photo ) || ! empty( $button ) ) :
	?>
	<section <?php echo esc_attr( $id_name ); ?> class="<?php echo esc_attr( $class_name ); ?>"
	<?php
	if ( $padding ) :
		echo 'style="' . esc_attr( get_the_style( $padding ) ) . '"';
	endif;
	?>
	>
		<div class="container">
			<div class="holder-block <?php echo esc_attr( $photo_alignment ); ?>">
				<div class="img-block image">
					<?php
					if ( ! empty( $photo ) ) :
						?>
						<?php echo wp_get_attachment_image( $photo, 'full' ); ?>
					<?php endif; ?>
				</div>
				<div class="text-block">
					<?php
					if ( ! empty( $content ) || ! empty( $heading ) || ! empty( $button ) ) :
						?>
						<div class="text-wrap <?php echo esc_attr( $layout_option ); ?>">
						<?php
						if ( ! empty( $heading ) ) :
							?>
								<h2><?php echo wp_kses( $heading, array( 'mark' => array() ) ); ?></h2>
							<?php
						endif;
						?>
						<?php if ( ! empty( $content ) ) : ?>
								<div class="text-area"><?php echo wp_kses_post( $content ); ?></div>
						<?php endif; ?>
						<?php if ( ! empty( $button ) ) : ?>
							<?php echo wp_kses_post( $button ); ?>
						<?php endif; ?>
						</div>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>
