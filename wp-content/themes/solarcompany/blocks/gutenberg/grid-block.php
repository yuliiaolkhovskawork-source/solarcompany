<?php
/**
 * Gutenberg Grid Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Grid
Description: Grid block.
Keywords: grid
Icon: grid-view
Other Available options: Icon, Category.
*/

$class_name = 'section-grid-block';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

$padding      = get_field( 'padding' );
$heading      = get_field( 'heading' );
$description  = get_field( 'description' );
$block_button = acf_button( get_field( 'button' ), array( 'btn', 'long' ) );
$columns_map  = array(
	'three' => 'three-columns',
	'four'  => 'four-columns',
);
$column_count = $columns_map[ get_field( 'column_count' ) ] ?? '';

if ( $heading || have_rows( 'grid' ) ) :
	?>
<section <?php echo esc_attr( $id_name ); ?> class="<?php echo esc_attr( $class_name ); ?>" 
	<?php
	if ( $padding ) :
		echo 'style="' . esc_attr( get_the_style( $padding ) ) . '"';
	endif;
	?>
	>
	<div class="container">
	<?php if ( $heading || $description || $block_button ) : ?>
	<div class="block-heading">
		<?php if ( $heading ) : ?>
		<h2><?php echo wp_kses( $heading, array( 'br' => array() ) ); ?></h2>
		<?php endif; ?>
		<?php if ( $description || $block_button ) : ?>
		<div class="text-block">
			<?php if ( $description ) : ?>
		<div class="text-area">
			<p><?php echo esc_html( $description ); ?></p>
		</div>
		<?php endif; ?>
			<?php if ( $block_button ) : ?>
				<?php echo wp_kses_post( $block_button ); ?>
		<?php endif; ?>
		</div>
		<?php endif; ?>
	</div>
	<?php endif; ?>
	<?php if ( have_rows( 'grid' ) ) : ?>
	<div class="holder-block <?php echo wp_kses( $column_count, array() ); ?>">
		<?php
		while ( have_rows( 'grid' ) ) :
			the_row();
			$supertitle   = get_sub_field( 'supertitle' );
			$card_title   = get_sub_field( 'title' );
			$photo        = get_sub_field( 'image' );
			$card_desc    = get_sub_field( 'description' );
			$icon         = get_sub_field( 'icon' );
			$icon_url     = $icon ? wp_get_attachment_url( $icon ) : '';
			$icon_alt     = $icon ? (string) get_post_meta( $icon, '_wp_attachment_image_alt', true ) : '';
			$button_field = get_sub_field( 'button' );
			$button_url   = ! empty( $button_field['url'] ) ? $button_field['url'] : '';
			$button       = '';
			if ( $button_field && ! empty( $button_field['title'] ) ) {
				$button = wp_kses(
					sprintf(
						'<span class="btn long"><span class="btn-text" data-text="%s"><span class="text">%s</span></span></span>',
						esc_attr( $button_field['title'] ),
						esc_html( $button_field['title'] )
					),
					array(
						'span' => array(
							'class'     => array(),
							'data-text' => array(),
						),
					)
				);
			}
			if ( $supertitle || $card_title || $photo || $card_desc || $icon || $button ) :
				$card_tag = $button_url ? 'a' : 'div';
				?>
		<<?php echo esc_html( $card_tag ); ?> class="card-block" aria-label="Card"
				<?php
				if ( $button_url ) :
					?>
			href="<?php echo esc_url( $button_url ); ?>"
					<?php
					if ( ! empty( $button_field['target'] ) ) :
						?>
			target="_blank" rel="noreferrer"<?php endif; ?><?php endif; ?>>
				<?php if ( ! empty( $photo ) ) : ?>
		<div class="img-block image">
					<?php echo wp_get_attachment_image( $photo, 'full' ); ?>
		</div>
		<?php endif; ?>
				<?php if ( $supertitle || $card_title || $icon_url ) : ?>
		<div class="heading-block">
			<div class="heading-text">
					<?php if ( $supertitle ) : ?>
			<strong class="subtitle"><?php echo wp_kses( $supertitle, array() ); ?></strong>
			<?php endif; ?>
					<?php if ( $card_title ) : ?>
			<h3><?php echo wp_kses( $card_title, array( 'br' => array() ) ); ?></h3>
			<?php endif; ?>
			</div>
					<?php if ( $icon_url ) : ?>
			<div class="icon">
			<img src="<?php echo esc_url( $icon_url ); ?>" alt="<?php echo esc_attr( $icon_alt ); ?>" />
			</div>
			<?php endif; ?>
		</div>
		<?php endif; ?>
		<div class="text-holder">
			<div class="text-block scroll-block">
			<div class="text-wrap">
				<?php if ( $supertitle || $card_title || $icon_url ) : ?>
				<div class="text-heading">
				<div class="heading-text">
					<?php if ( $supertitle ) : ?>
					<strong class="subtitle"><?php echo wp_kses( $supertitle, array() ); ?></strong>
					<?php endif; ?>
					<?php if ( $card_title ) : ?>
					<h3><?php echo wp_kses( $card_title, array( 'br' => array() ) ); ?></h3>
					<?php endif; ?>
				</div>
					<?php if ( $icon_url ) : ?>
				<div class="icon">
					<img src="<?php echo esc_url( $icon_url ); ?>" alt="<?php echo esc_attr( $icon_alt ); ?>" />
				</div>
				<?php endif; ?>
				</div>
				<?php endif; ?>
				<?php if ( $card_desc ) : ?>
					<?php echo wp_kses_post( $card_desc ); ?>
				<?php endif; ?>
				<?php if ( $button ) : ?>
					<?php echo $button; // phpcs:ignore WordPress.Security.EscapeOutput ?>
				<?php endif; ?>
			</div>
			</div>
		</div>
		</<?php echo esc_html( $card_tag ); ?>>
				<?php
			endif;
		endwhile;
		?>
	</div>
	<?php endif; ?>
	</div>
</section>
<?php endif; ?>