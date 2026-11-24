<?php
/**
 * The search form template.
 *
 * @package SolarCompanyTheme
 */

$sq = get_search_query() ? get_search_query() : esc_html__( 'Enter search terms&hellip;', 'solarcompany' ); ?>
<form class="search-form" action="<?php echo esc_url( home_url() ); ?>" method="get" role="search">
	<fieldset>
		<legend class="accessibility"><?php esc_html_e( 'Site Search Form', 'solarcompany' ); ?></legend>
		<label for="site-search" class="accessibility"><?php esc_html_e( 'Search the site for:', 'solarcompany' ); ?></label>
		<input id="site-search" type="search" name="s" value="<?php echo get_search_query(); ?>" placeholder="<?php echo esc_attr( $sq ); ?>">
		<input type="submit" value="<?php esc_html_e( 'Search', 'solarcompany' ); ?>">
	</fieldset>
</form>
