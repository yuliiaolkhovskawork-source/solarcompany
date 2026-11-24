<?php
/**
 * Gutenberg Accordion Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Accordion
Description: Accordion block.
Keywords: accordion
Icon: editor-help
Other Available options: Icon, Category.
*/

$class_name = 'section-accordion-block';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}
$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

$padding    = get_field( 'padding' );
$heading    = get_field( 'heading' );
$button     = acf_button( get_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
$content    = get_field( 'content' );
$accordion  = get_field( 'accordion' );
if ( ! empty( $accordion ) || ! empty( $heading ) || ! empty( $button ) || ! empty( $content ) ) :
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
				<?php if ( ! empty( $accordion ) ) : ?>
					<ul class="accordion">
					<?php
					while ( have_rows( 'accordion' ) ) :
						the_row();
						$description = get_sub_field( 'description' );
						$button      = acf_button( get_sub_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
						$acc_heading = get_sub_field( 'acc_heading' );
						if ( $acc_heading ) :
							?>
								<li>
									<a class="opener" href="#">
											<span class="icon"><?php esc_html_e( 'Icon', 'solarcompany' ); ?></span>
							<?php echo wp_kses( $acc_heading, array() ); ?>
									</a>
									<div class="slide">
							<?php echo wp_kses_post( $description ); ?>
							<?php echo wp_kses_post( $button ); ?>
									</div>
								</li>
							<?php
						endif;
					endwhile;
					?>
					</ul>
				<?php endif; ?>
		</div>
	</section>
<?php endif; ?>
