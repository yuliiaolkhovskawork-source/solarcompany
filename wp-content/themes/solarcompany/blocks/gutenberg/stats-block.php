<?php
/**
 * Gutenberg Stats Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Stats
Description: Stats block.
Keywords: stats
Icon: chart-area
Other Available options: Icon, Category.
*/

$class_name = 'section-statistics';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

$padding = get_field( 'padding' );
$heading = get_field( 'heading' );
$content = get_field( 'content' );
$stats   = get_field( 'stats' );

if ( $heading || $content || $stats ) : ?>
<section
	<?php if ( ! empty( $block['anchor'] ) ) : ?>
		id="<?php echo esc_attr( $block['anchor'] ); ?>"
	<?php endif; ?>
	class="<?php echo esc_attr( $class_name ); ?>"
	<?php if ( $padding ) : ?>
		style="<?php echo esc_attr( get_the_style( $padding ) ); ?>"
	<?php endif; ?>
>
	<div class="container">
		<div class="holder-area">
			<?php if ( $heading || $content ) : ?>
			<div class="text-block">
				<?php if ( $heading ) : ?>
					<h2><?php echo esc_html( $heading ); ?></h2>
				<?php endif; ?>
				<?php if ( $content ) : ?>
					<div class="text-area">
						<?php echo wp_kses_post( $content ); ?>
					</div>
				<?php endif; ?>
			</div>
			<?php endif; ?>
			<?php if ( have_rows( 'stats' ) ) : ?>
			<ul class="stats-list">
				<?php
				while ( have_rows( 'stats' ) ) :
					the_row();
					$prefix      = get_sub_field( 'prefix' );
					$stat_number = get_sub_field( 'stat_number' );
					$suffix      = get_sub_field( 'suffix' );
					$text_label  = get_sub_field( 'text_label' );
					$bg_image_id = get_sub_field( 'bg_image' );
					$description = get_sub_field( 'description' );

					if ( ! $prefix && ! $stat_number && ! $suffix && ! $text_label && ! $bg_image_id && ! $description ) {
						continue;
					}
					?>
					<li>
						<div class="card-stats">
							<?php if ( $bg_image_id ) : ?>
								<?php echo wp_get_attachment_image( $bg_image_id, 'thumbnail_403x403' ); ?>
							<?php endif; ?>
							<div class="stat-holder">
								<?php if ( $prefix || $stat_number || $suffix ) : ?>
								<strong class="value-holder">
									<span class="suffix"><?php echo esc_html( $prefix ); ?></span>
									<span class="value count" data-value="<?php echo esc_attr( $stat_number ); ?>"><?php echo esc_html( $stat_number ); ?></span>
									<span class="prefix"><?php echo esc_html( $suffix ); ?></span>
								</strong>
								<?php endif; ?>
								<?php if ( $text_label ) : ?>
								<strong class="card-title"><?php echo esc_html( $text_label ); ?></strong>
								<?php endif; ?>
								<?php if ( $description ) : ?>
								<p><?php echo esc_html( $description ); ?></p>
								<?php endif; ?>
							</div>
						</div>
					</li>
				<?php endwhile; ?>
			</ul>
			<?php endif; ?>
		</div>
	</div>
</section>
<?php endif; ?>
