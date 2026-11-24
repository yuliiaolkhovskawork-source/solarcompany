<?php
/**
 * Gutenberg Hero Section block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Page Hero
Description: Page Hero block.
Keywords: page, hero
Icon: format-image
Other Available options: Icon, Category.
*/

$class_name = 'hero-section section-hero-home';
$media_type = get_field( 'media_type' );
$grid_items = get_field( 'grid_items' );
$tile_index = 0;

$render_tile_list = function () use ( $grid_items, &$tile_index ) {
	if ( empty( $grid_items ) ) {
		return;
	}
	?>
			<ul class="tile-list">
				<?php foreach ( $grid_items as $image_id ) : ?>
			<li data-aos="fade" data-aos-delay="<?php echo esc_attr( $tile_index++ * 250 ); ?>">
					<?php echo wp_get_attachment_image( $image_id, 'full' ); ?>
			</li>
			<?php endforeach; ?>
		</ul>
	<?php
};

if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

if ( ! empty( $grid_items ) ) {
	$class_name .= ' tile-block';
}

$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

if ( 'none' === $media_type ) :
	$no_media    = get_field( 'no_media' );
	$class_name .= ' no-hero-image';

	if ( empty( $no_media['heading'] ) && empty( $no_media['content'] ) && empty( $no_media['button'] ) && empty( $grid_items ) ) :
		$class_name .= ' empty-hero-section';
	endif;
endif;
?>
<section <?php echo esc_attr( $id_name ); ?> class="<?php echo esc_attr( $class_name ); ?>">
		<?php
		switch ( $media_type ) :
			case 'photo':
				while ( have_rows( 'photo' ) ) :
					the_row();
					$photo   = get_sub_field( 'photo' );
					$heading = get_sub_field( 'heading' );
					$content = get_sub_field( 'content' );
					$button  = acf_button( get_sub_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );

					if ( $heading || $content || $button || $photo || $grid_items ) :
						?>
	<div class="holder-block">
		<div class="container">
			<div class="text-block">
						<?php if ( $heading ) : ?>
				<h1>
							<?php
							echo wp_kses(
								$heading,
								array(
									'br'   => array(),
									'mark' => array(),
								)
							);
							?>
					</h1>
				<?php endif; ?>
						<?php if ( $content ) : ?>
				<div class="text-area">
							<?php echo wp_kses_post( $content ); ?>
				</div>
				<?php endif; ?>
						<?php
						if ( $button ) :
							echo wp_kses_post( $button );
						endif;
						?>
			</div>
						<?php if ( $photo ) : ?>
			<div class="bg-image">
							<?php echo wp_get_attachment_image( $photo, 'full' ); ?>
			</div>
			<?php endif; ?>
						<?php $render_tile_list(); ?>
		</div>
	</div>
						<?php
					endif;
				endwhile;
				break;
			case 'slider':
				while ( have_rows( 'slider' ) ) :
					the_row();
					$delay = get_sub_field( 'delay' );
					if ( have_rows( 'slides' ) ) :
						?>
	<div class="hero-slider swiper">
		<div class="swiper-wrapper">
						<?php
						while ( have_rows( 'slides' ) ) :
							the_row();
							$subtitle = get_sub_field( 'subtitle' );
							$heading  = get_sub_field( 'heading' );
							$photo    = get_sub_field( 'photo' );
							$content  = get_sub_field( 'content' );
							$button   = acf_button( get_sub_field( 'button' ), array( 'btn', 'btn-white' ), '', '<span>', '</span>' );
							?>
			<div class="swiper-slide" data-swiper-autoplay="<?php echo wp_kses( $delay, array() ); ?>">
							<?php if ( $photo ) : ?>
				<div class="bg-image image">
								<?php echo wp_get_attachment_image( $photo, 'full' ); ?>
				</div>
				<?php endif; ?>
							<?php if ( ! empty( $content ) || ! empty( $heading ) || ! empty( $button ) || ! empty( $grid_items ) ) : ?>
				<div class="holder-block">
					<div class="container">
						<div class="text-block">
								<?php if ( $subtitle ) : ?>
							<strong class="subtitle"><?php echo wp_kses( $subtitle, array() ); ?></strong>
							<?php endif; ?>
								<?php if ( $heading ) : ?>
							<h1><?php echo wp_kses( $heading, array() ); ?></h1>
							<?php endif; ?>
								<?php if ( ! empty( $content ) ) : ?>
							<div class="text-area">
									<?php echo wp_kses_post( $content ); ?>
							</div>
							<?php endif; ?>
								<?php
								if ( $button ) :
									echo wp_kses_post( $button );
							endif;
								?>
						</div>
						<?php $render_tile_list(); ?>
					</div>
				</div>
				<?php endif; ?>
			</div>
			<?php endwhile; ?>
		</div>
		<div class="slider-nav">
			<button class="swiper-button-prev">
				<span class="visually-hidden"><?php esc_html_e( 'prev', 'solarcompany' ); ?></span>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22.06 14.87">
					<line stroke="currentColor" stroke-width="2" stroke-miterlimit="10" x1="22.06" y1="7.44" x2="1.41" y2="7.44"/>
					<polyline stroke="currentColor" stroke-width="2" points="8.14 14.17 1.41 7.44 8.14 0.71"/>
				</svg>
			</button>
			<button class="swiper-button-next">
				<span class="visually-hidden"><?php esc_html_e( 'next', 'solarcompany' ); ?></span>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22.06 14.87">
					<line stroke="currentColor" stroke-width="2" stroke-miterlimit="10" x1="22.06" y1="7.44" x2="1.41" y2="7.44"/>
					<polyline stroke="currentColor" stroke-width="2" points="8.14 14.17 1.41 7.44 8.14 0.71"/>
				</svg>
			</button>
		</div>
	</div>
						<?php
					endif;
				endwhile;
				break;
			case 'video':
				while ( have_rows( 'video' ) ) :
					the_row();
					$subtitle = get_sub_field( 'subtitle' );
					$heading  = get_sub_field( 'heading' );
					$button   = acf_button( get_sub_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
					$content  = get_sub_field( 'content' );
					$video    = get_sub_field( 'video' );
					?>
	<div class="holder-block">
		<div class="container">
					<?php
					if ( $video ) :
						$video_html = acf_video( $video, false );
						if ( ! empty( $video_html ) ) :
							echo wp_kses_post( $video_html );
						endif;
					endif;
					if ( ! empty( $heading ) || ! empty( $content ) || ! empty( $button ) ) :
						?>
			<div class="text-block">
						<?php if ( $subtitle ) : ?>
				<strong class="subtitle"><?php echo wp_kses( $subtitle, array() ); ?></strong>
				<?php endif; ?>
						<?php if ( $heading ) : ?>
				<h1><?php echo wp_kses( $heading, array() ); ?></h1>
				<?php endif; ?>
						<?php if ( $content ) : ?>
				<div class="text-area">
							<?php echo wp_kses_post( $content ); ?>
				</div>
				<?php endif; ?>
						<?php
						if ( $button ) :
							echo wp_kses_post( $button );
				endif;
						?>
			</div>
					<?php endif; ?>
					<?php $render_tile_list(); ?>
		</div>
	</div>
					<?php
				endwhile;
				break;
			case 'none':
				while ( have_rows( 'no_media' ) ) :
					the_row();
					$subtitle = get_sub_field( 'subtitle' );
					$heading  = get_sub_field( 'heading' );
					$content  = get_sub_field( 'content' );
					$button   = acf_button( get_sub_field( 'button' ), array( 'btn' ), '', '<span>', '</span>' );
					if ( $heading || $content || $button || $grid_items ) :
						?>
	<div class="holder-block">
		<div class="container">
						<?php if ( $heading || $content || $button ) : ?>
			<div class="text-block">
							<?php if ( $subtitle ) : ?>
				<strong class="subtitle"><?php echo wp_kses( $subtitle, array() ); ?></strong>
				<?php endif; ?>
							<?php if ( $heading ) : ?>
				<h1><?php echo wp_kses( $heading, array( 'br' => array() ) ); ?></h1>
				<?php endif; ?>
							<?php if ( $content ) : ?>
				<div class="text-area">
								<?php echo wp_kses_post( $content ); ?>
				</div>
				<?php endif; ?>
							<?php
							if ( $button ) :
								echo wp_kses_post( $button );
				endif;
							?>
			</div>
						<?php endif; ?>
						<?php $render_tile_list(); ?>
		</div>
	</div>
						<?php
					endif;
				endwhile;
				break;
	endswitch;
		?>
</section>
