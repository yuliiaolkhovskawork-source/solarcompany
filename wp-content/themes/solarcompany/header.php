<?php
/**
 * The Header.
 *
 * @package SolarCompanyTheme
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<!-- set the viewport width and initial-scale on mobile devices -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
	<!-- set the encoding of your site -->
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<!-- include custom JavaScript -->
	<script type="text/javascript">
	var pathInfo = {
	base: '<?php echo esc_url( get_template_directory_uri() ); ?>/',
	css: 'css/',
	js: 'js/',
	}
	</script>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>
	<noscript>
	<div><?php esc_html_e( 'Javascript must be enabled for the correct page display', 'solarcompany' ); ?></div>
	</noscript>
	<a class="accessibility" href="#main"><?php esc_html_e( 'Skip to Content', 'solarcompany' ); ?></a>
	<div id="wrapper">
	<!-- header of the page -->
	<?php
	$logo       = get_field( 'logo', 'option' );
	$logo_white = get_field( 'logo_white', 'option' );
	$button     = get_field( 'button', 'option' );
	$button_2   = get_field( 'button_2', 'option' );
	?>
	<header id="header">
		<div class="header-panel">
			<div class="container">
				<div class="header-inner">

					<?php if ( ! empty( $logo ) || ! empty( $logo_white ) ) : ?>
					<strong class="logo">
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" title="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
							<?php
							if ( ! empty( $logo ) ) :
								echo wp_get_attachment_image( $logo, 'full', false, array( 'class' => 'logo-default' ) );
							endif;
							if ( ! empty( $logo_white ) ) :
								echo wp_get_attachment_image( $logo_white, 'full', false, array( 'class' => 'logo-light' ) );
							endif;
							?>
						</a>
					</strong>
					<?php endif; ?>

					<?php if ( has_nav_menu( 'primary' ) ) : ?>
					<nav class="nav" aria-label="Primary">
						<div class="nav-holder">
							<div class="holder-block">
								<div class="menu-main-container">
						<?php
						wp_nav_menu(
							array(
								'container'      => false,
								'theme_location' => 'primary',
								'menu_id'        => 'primary-menu',
								'menu_class'     => 'main-menu acc-js',
								'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
								'walker'         => new Custom_Walker_Nav_Menu(),
							)
						);
						?>
					<div class="search-block">
					<button type="button" class="search-opener">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.38 24.38"><path fill="#fff" d="m24.09 22.68-8.32-8.32c2.77-3.47 2.55-8.55-.66-11.76C11.65-.86 6.04-.86 2.59 2.59s-3.45 9.06 0 12.51a8.79 8.79 0 0 0 6.26 2.59c2.03 0 3.95-.68 5.51-1.93l8.32 8.32c.2.2.45.29.71.29s.51-.1.71-.29a.996.996 0 0 0 0-1.41ZM4 13.69C1.33 11.02 1.33 6.67 4 4c1.34-1.33 3.09-2 4.84-2s3.51.67 4.84 2c2.67 2.67 2.67 7.02 0 9.69-1.29 1.29-3.01 2.01-4.84 2.01S5.29 14.99 4 13.69"/></svg>
					</button>
					<div class="search-slider">
						<form action="<?php echo esc_url( home_url( '/' ) ); ?>" class="form-search" method="get">
						<input type="search" name="s" placeholder="<?php esc_attr_e( 'Search', 'solarcompany' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>">
						</form>
					</div>
					</div>
				</div>


								<?php if ( ! empty( $button ) || ! empty( $button_2 ) ) : ?>
								<div class="button-group">
									<?php if ( ! empty( $button ) ) : ?>
									<a href="<?php echo esc_url( $button['url'] ); ?>" class="btn btn-outline"<?php echo ! empty( $button['target'] ) ? ' target="' . esc_attr( $button['target'] ) . '"' : ''; ?>>
										<span class="btn-text" data-text="<?php echo esc_attr( $button['title'] ); ?>">
											<span class="text"><?php echo esc_html( $button['title'] ); ?></span>
										</span>
									</a>
									<?php endif; ?>
									<?php if ( ! empty( $button_2 ) ) : ?>
									<a href="<?php echo esc_url( $button_2['url'] ); ?>" class="btn show-on-desktop"<?php echo ! empty( $button_2['target'] ) ? ' target="' . esc_attr( $button_2['target'] ) . '"' : ''; ?>>
										<span class="btn-text" data-text="<?php echo esc_attr( $button_2['title'] ); ?>">
											<span class="text"><?php echo esc_html( $button_2['title'] ); ?></span>
										</span>
									</a>
									<?php endif; ?>
								</div>
								<?php endif; ?>
						<?php get_template_part( 'template-parts/nav/drop-menu-panel' ); ?>
							</div>
						</div>
					</nav>

						<?php if ( ! empty( $button_2 ) ) : ?>
					<a href="<?php echo esc_url( $button_2['url'] ); ?>" class="btn show-on-mobile"<?php echo ! empty( $button_2['target'] ) ? ' target="' . esc_attr( $button_2['target'] ) . '"' : ''; ?>>
						<span class="btn-text" data-text="<?php echo esc_attr( $button_2['title'] ); ?>">
							<span class="text"><?php echo esc_html( $button_2['title'] ); ?></span>
						</span>
					</a>
					<?php endif; ?>

					<button type="button" class="nav-opener" aria-label="<?php esc_attr_e( 'Toggle navigation', 'solarcompany' ); ?>" aria-expanded="false">
						<span><?php esc_html_e( 'Menu', 'solarcompany' ); ?></span>
					</button>
					<?php endif; ?>

				</div>
			</div>
		</div>
	</header>
	<!-- contain main informative part of the site -->
	<main class="main" id="main" role="main">
