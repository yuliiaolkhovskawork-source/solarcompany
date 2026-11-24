<?php
/**
 * Template part for displaying the drop menu panel.
 *
 * @package SolarCompanyTheme
 */

$drop_image   = get_field( 'drop_menu_image', 'option' );
$drop_text    = get_field( 'drop_menu_text', 'option' );
$drop_buttons = get_field( 'drop_menu_buttons', 'option' );

if ( ! $drop_image && ! $drop_text && ! $drop_buttons ) {
	return;
}
?>
<div class="item-drop-panel">
	<?php if ( $drop_image ) : ?>
		<?php echo wp_get_attachment_image( $drop_image, 'full', false, array( 'decoding' => 'async' ) ); ?>
	<?php endif; ?>
	<?php if ( $drop_text || $drop_buttons ) : ?>
		<div class="block-wrap">
			<?php if ( $drop_text ) : ?>
				<div class="text-holder"><?php echo wp_kses_post( $drop_text ); ?></div>
			<?php endif; ?>
			<?php if ( $drop_buttons ) : ?>
				<ul class="buttons-list">
					<?php foreach ( $drop_buttons as $row ) : ?>
						<?php if ( ! empty( $row['button'] ) ) : ?>
							<?php $btn = $row['button']; ?>
							<li>
								<a href="<?php echo esc_url( $btn['url'] ); ?>" class="btn"<?php echo ! empty( $btn['target'] ) ? ' target="' . esc_attr( $btn['target'] ) . '"' : ''; ?>>
									<span class="btn-text" data-text="<?php echo esc_attr( $btn['title'] ); ?>">
										<span class="text"><?php echo esc_html( $btn['title'] ); ?></span>
									</span>
								</a>
							</li>
						<?php endif; ?>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</div>
