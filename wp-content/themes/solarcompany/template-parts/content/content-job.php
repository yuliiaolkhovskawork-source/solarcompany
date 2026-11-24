<?php
/**
 * Template part for displaying a job card.
 *
 * @package SolarCompanyTheme
 */

$location   = get_field( 'location', get_the_ID() );
$learn_more = '<span class="btn"><span class="btn-text" data-text="' . esc_attr__( 'Learn More', 'solarcompany' ) . '"><span class="text">' . esc_html__( 'Learn More', 'solarcompany' ) . '</span></span></span>';
$no_li      = ! empty( $args['no_li'] );
?>
<?php
if ( ! $no_li ) :
	?>
	<li><?php endif; ?>
<a class="card" href="<?php the_permalink(); ?>">
		<?php if ( ! empty( $location ) ) : ?>
			<span class="subtitle"><?php echo esc_html( $location ); ?></span>
		<?php endif; ?>
		<h3><?php the_title(); ?></h3>
		<?php echo wp_kses_post( $learn_more ); ?>
	</a>
<?php
if ( ! $no_li ) :
	?>
	</li><?php endif; ?>
