<?php
/**
 * Gutenberg Content Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Content
Description: Content block.
Keywords: content
Icon: editor-justify
Other Available options: Icon, Category.
*/

$display_format = get_field( 'display_format' );
$class_name     = 'section-content-block';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}
if ( $display_format ) :
	$class_name .= ' ' . $display_format;
endif;

$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

$heading         = get_field( 'heading' );
$content         = get_field( 'content' );
$button          = acf_button( get_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
$padding         = get_field( 'padding' );
$enable_gradient = get_field( 'enable_gradient' );

if ( $heading || $content || $button ) :
	?>
	<section <?php echo esc_attr( $id_name ); ?> class="<?php echo esc_attr( $class_name ); ?>"
	<?php
	if ( $padding ) :
		echo 'style="' . esc_attr( get_the_style( $padding ) ) . '"';
	endif;
	?>
	>
		<?php if ( $enable_gradient ) : ?>
		<div class="bg-image"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/dist/images/content-bg.png' ); ?>" alt="" /></div>
		<?php endif; ?>
		<div class="container">
			<div class="holder-block">
				<?php
				if ( $heading ) :
					?>
					<div class="title-block">
						<h2>
					<?php
					echo wp_kses(
						$heading,
						array(
							'br'   => array(),
							'mark' => array(),
						)
					);
					?>
							</h2>
					</div>
					<?php
				endif;
				if ( $content || $button ) :
					?>
					<article class="content-block">
						<div class="text-block">
					<?php if ( ! empty( $content ) ) : ?>

						<?php echo wp_kses_post( $content ); ?>

						<?php
					endif;
					if ( $button ) :
						echo wp_kses_post( $button );
					endif;
					?>
					</div>
					</article>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>
