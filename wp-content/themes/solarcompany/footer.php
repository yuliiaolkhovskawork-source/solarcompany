<?php
/**
 * The template for displaying the footer.
 *
 * @package SolarCompanyTheme
 */

?>
</main>
<?php if ( is_front_page() ) : ?>
	<?php get_template_part( 'template-parts/popup' ); ?>
<?php endif; ?>
<footer id="footer">
	<?php
	$form_shortcode = get_field( 'form_shortcode', 'option' );
	$notes          = get_field( 'notes', 'option' );
	if ( ! empty( $form_shortcode ) || has_nav_menu( 'footer' ) ) :
		?>
	<div class="container">
		<div class="footer-holder">
		<div class="footer-content-wrapp">
			<?php if ( ! empty( $form_shortcode ) || ! empty( $notes ) ) : ?>
			<div class="footer-newsletter">
				<?php if ( ! empty( $notes ) ) : ?>
					<?php echo wp_kses_post( $notes ); ?>
				<?php endif; ?>
				<?php if ( ! empty( $form_shortcode ) ) : ?>
					<div class="form-block">
						<?php echo do_shortcode( $form_shortcode ); ?>
					</div>
				<?php endif; ?>
			</div>
			<?php endif; ?>
			<?php if ( has_nav_menu( 'footer' ) ) : ?>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'container'      => false,
						'menu_class'     => 'footer-columns',
						'walker'         => new Footer_Columns_Walker(),
						'fallback_cb'    => false,
						'depth'          => 2,
					)
				);
				?>
			<?php endif; ?>
			</div>
			<?php endif; ?>
		<div class="footer-bottom">
		<div class="footer-bottom-holder">
		<?php get_template_part( 'template-parts/socials' ); ?>
		<?php
		wp_nav_menu(
			array(
				'container'      => false,
				'theme_location' => 'copyrights',
				'items_wrap'     => '<nav class="footer-legal-nav" aria-label="' . esc_attr__( 'Legal', 'solarcompany' ) . '"><ul class="footer-legal">%3$s</ul></nav>',
				'fallback_cb'    => false,
			)
		);
		?>
		<div class="footer-copyright">
			<p>&copy;<?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
		</div>
		</div>
		</div>
		</div>
	</div>
</footer>
<a class="accessibility" href="#wrapper"><?php esc_html_e( 'Back to top', 'solarcompany' ); ?></a>
</div>
<?php wp_footer(); ?>
</body>

</html>
