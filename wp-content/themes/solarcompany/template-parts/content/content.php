<?php
/**
 * The template part for displaying the article card.
 *
 * @package SolarCompanyTheme
 */

$learn_more = '<span class="btn"><span class="btn-text" data-text="' . esc_attr__( 'Learn More', 'solarcompany' ) . '"><span class="text">' . esc_html__( 'Learn More', 'solarcompany' ) . '</span></span></span>';
$no_li      = ! empty( $args['no_li'] );
?>
<?php
if ( ! $no_li ) :
	?>
	<li><?php endif; ?>
<a class="card" href="<?php the_permalink(); ?>">
		<h3><?php the_title(); ?></h3>
		<?php if ( has_excerpt() ) : ?>
			<?php the_excerpt(); ?>
		<?php else : ?>
			<p><?php echo esc_html( wp_trim_words( wp_strip_all_tags( apply_filters( 'the_content', get_the_content() ) ), 15, '&hellip;' ) ); ?></p>
		<?php endif; ?>
		<?php echo wp_kses_post( $learn_more ); ?>
	</a>
<?php
if ( ! $no_li ) :
	?>
	</li><?php endif; ?>
