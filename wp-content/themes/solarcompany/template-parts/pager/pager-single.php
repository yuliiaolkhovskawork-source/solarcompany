<?php
/**
 * Pager for single post page
 *
 * @package SolarCompanyTheme
 */

$prev = get_previous_post_link( __( '%link', 'solarcompany' ), '&laquo;&nbsp;Previous' ); ?>
<?php $next = get_next_post_link( __( '%link', 'solarcompany' ), 'Next&nbsp;&raquo;' ); ?>
<?php
if ( $prev || $next ) :
	?>
	<div class="navigation-single-holder">
		<div class="container">
			<nav class="navigation-single">
			<?php
			if ( $prev ) :
				?>
					<div class="prev"><?php echo wp_kses_post( $prev ); ?></div>
					<?php
			endif
			?>
			<?php
			if ( $next ) :
				?>
					<div class="next"><?php echo wp_kses_post( $next ); ?></div>
					<?php
			endif
			?>
			</nav>
		</div>
	</div>
<?php endif ?>
