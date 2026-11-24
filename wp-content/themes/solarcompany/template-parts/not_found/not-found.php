<?php
/**
 * The template part for displaying the 404 info.
 *
 * @package SolarCompanyTheme
 */

$title_404 = get_field( '404_title', 'option' );
$text      = get_field( '404_message', 'option' );
if ( ! empty( $title_404 ) || ! empty( $text ) ) :
	?>
	<section class="section-404">
	<?php
	if ( ! empty( $title_404 ) ) :
		?>
			<header class="head">
				<h1><?php echo wp_kses( $title_404, array() ); ?></h1>
			</header>
	<?php endif; ?>
	<?php
	if ( ! empty( $text ) ) :
		?>
			<div class="content">
		<?php echo wp_kses_post( $text ); ?>
			</div>
	<?php endif; ?>
	</section>
<?php endif; ?>
