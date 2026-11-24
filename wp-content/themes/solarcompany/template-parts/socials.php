<?php
/**
 * Social media links block.
 *
 * @package SolarCompanyTheme
 */

$socials    = get_field( 'socials', 'option' );
$list_class = ! empty( $args['class'] ) ? $args['class'] : 'socials-networks';
$icons      = array(
	'linkedin'  => 'linkedin.svg',
	'facebook'  => 'facebook.svg',
	'instagram' => 'instagram.svg',
	'twitter'   => 'twitter.svg',
);
if ( $socials ) :
	?>
<ul class="<?php echo esc_attr( $list_class ); ?>">
	<?php
	foreach ( $socials as $item ) :
		$layout = $item['acf_fc_layout'];
		if ( ! isset( $icons[ $layout ] ) ) {
			continue;
		}
		$icon_url = get_template_directory_uri() . '/assets/dist/images/' . $icons[ $layout ];
		?>
	<li>
	<a href="<?php echo esc_url( $item['url'] ); ?>" target="_blank" aria-label="<?php echo esc_attr( ucfirst( $layout ) ); ?>" class="social-icon">
		<img src="<?php echo esc_url( $icon_url ); ?>" alt="<?php echo esc_attr( $layout ); ?>" width="20" height="20" />
	</a>
	</li>
		<?php endforeach; ?>
</ul>
<?php endif; ?>
