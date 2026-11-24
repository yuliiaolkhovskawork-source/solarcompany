<?php
/**
 * Template part for displaying an advocacy card.
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
<a class="card-block" href="<?php the_permalink(); ?>" aria-label="Card">
		<div class="img-block image">
			<?php if ( has_post_thumbnail() ) : ?>
				<?php the_post_thumbnail( 'large' ); ?>
			<?php endif; ?>
		</div>
		<div class="heading-block">
			<h3><?php the_title(); ?></h3>
		</div>
		<div class="text-holder">
			<div class="text-block scroll-block">
				<div class="text-wrap">
					<div class="text-heading">
						<h3><?php the_title(); ?></h3>
					</div>
					<?php if ( has_excerpt() ) : ?>
						<?php the_excerpt(); ?>
					<?php else : ?>
						<p><?php echo esc_html( wp_trim_words( wp_strip_all_tags( apply_filters( 'the_content', get_the_content() ) ), 20, '&hellip;' ) ); ?></p>
					<?php endif; ?>
					<?php echo wp_kses_post( $learn_more ); ?>
				</div>
			</div>
		</div>
	</a>
<?php
if ( ! $no_li ) :
	?>
	</li><?php endif; ?>
