<?php
/**
 * Popup Block
 *
 * @package SolarCompanyTheme
 */

while ( have_rows( 'popover', 'option' ) ) :
	the_row();
	$expiration_date = get_sub_field( 'expiration_date' );
	$image           = get_sub_field( 'image' );
	$heading         = get_sub_field( 'heading' );
	$content         = get_sub_field( 'content' );
	$enable          = get_sub_field( 'enable_popover' );
	$button          = acf_button( get_sub_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
	if ( $enable && ( empty( $expiration_date ) || strtotime( $expiration_date ) >= strtotime( gmdate( 'dmY' ) ) ) ) :
		?>
<div class="popup cookie-popup" data-show="true" data-delay="<?php the_sub_field( 'delay_time' ); ?>" data-days="<?php the_sub_field( 'cookie_save' ); ?>">
	<div class="popup-container">
	<button class="close" data-close>
		<span class="visually-hidden"><?php esc_html_e( 'close', 'solarcompany' ); ?></span>
	</button>
		<?php
		if ( $heading || $content || $button ) :
			?>
	<div class="content-wrap">
		<div class="content">
			<?php
			if ( $heading ) :
				?>
		<h2><?php echo wp_kses( $heading, array( 'mark' => array() ) ); ?></h2>
				<?php
			endif;
			if ( $content ) :
					echo wp_kses_post( $content );
			endif;
			?>
			<?php
			if ( $button ) :
					echo wp_kses_post( $button );
			endif;
			?>
		</div>
	</div>
		<?php endif; ?>
	<div class="img-block">
		<?php
		if ( $image ) :
			echo wp_get_attachment_image( $image, 'full' );
			endif;
		?>
	</div>
	</div>
</div>
	<?php endif;
endwhile; ?>
