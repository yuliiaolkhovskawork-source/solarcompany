<?php
/**
 * Nav Menu API: Walker_Nav_Menu class
 *
 * @package    SolarCompanyTheme
 * @subpackage Nav_Menus
 */

/**
 * Core class used to implement an HTML list of nav menu items.
 *
 * @see Walker
 */
class Custom_Walker_Nav_Menu extends Walker_Nav_Menu {


	/**
	 * Starts the list before the elements are added.
	 *
	 * @param string   $output Used to append additional content (passed by reference).
	 * @param int      $depth  Depth of menu item. Used for padding.
	 * @param stdClass $args   An object of wp_nav_menu() arguments.
	 *
	 * @see    Walker::start_lvl()
	 * @return void
	 */
	public function start_lvl( &$output, $depth = 0, $args = array() ) {
		if ( 0 === $depth ) {
			$output .= '<div class="item-drop item-drop-mega" aria-hidden="true"><div class="container"><div class="item-drop-list"><ul>' . "\n";
		} else {
			$output .= '<div class="item-drop"><ul>' . "\n";
		}
	}

	/**
	 * Ends the list of after the elements are added.
	 *
	 * @param string   $output Used to append additional content (passed by reference).
	 * @param int      $depth  Depth of menu item. Used for padding.
	 * @param stdClass $args   An object of wp_nav_menu() arguments.
	 *
	 * @see    Walker::end_lvl()
	 * @return void
	 */
	public function end_lvl( &$output, $depth = 0, $args = array() ) {
		if ( 0 === $depth ) {
			$output .= "</ul></div>\n";

			ob_start();
			get_template_part( 'template-parts/nav/drop-menu-panel' );
			$output .= ob_get_clean();

			$output .= "</div></div>\n";
		} else {
			$output .= "</ul></div>\n";
		}
	}

	/**
	 * Starts the element output.
	 *
	 * @see Walker::start_el()
	 *
	 * @param  string   $output Used to append additional content (passed by reference).
	 * @param  WP_Post  $item   Menu item data object.
	 * @param  int      $depth  Depth of menu item. Used for padding.
	 * @param  stdClass $args   An object of wp_nav_menu() arguments.
	 * @param  int      $id     Current item ID.
	 * @return void
	 */
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$classes      = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[]    = 'menu-item-' . $item->ID;
		$has_children = in_array( 'menu-item-has-children', $classes, true );

		if ( in_array( 'current-menu-item', $classes, true ) ) {
			$classes[] = 'active';
		}

		if ( 0 === $depth && $has_children ) {
			$classes[] = 'has-mega-panel';
		}

		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );
		$class_names = ' class="' . esc_attr( $class_names ) . '"';

		$id = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args );
		$id = strlen( $id ) ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $class_names . '>';

		$attributes  = ! empty( $item->attr_title ) ? ' title="' . esc_attr( $item->attr_title ) . '"' : '';
		$attributes .= ! empty( $item->target ) ? ' target="' . esc_attr( $item->target ) . '"' : '';
		$attributes .= ! empty( $item->xfn ) ? ' rel="' . esc_attr( $item->xfn ) . '"' : '';
		$attributes .= ! empty( $item->url ) ? ' href="' . esc_attr( $item->url ) . '"' : '';

		$item_output  = $args->before;
		$item_output .= '<a' . $attributes;

		if ( 0 === $depth ) {
			$item_output .= ' data-text="' . esc_attr( $item->title ) . '"';
			if ( $has_children ) {
				$item_output .= ' class="acc-opener-js" aria-expanded="false"';
			}
		}

		$item_output .= '>';

		if ( 0 === $depth ) {
			$item_output .= '<span class="link-text">' . apply_filters( 'the_title', $item->title, $item->ID ) . '</span>';
		} else {
			$item_output .= apply_filters( 'the_title', $item->title, $item->ID );
		}

		$item_output .= '</a>';

		if ( $depth > 0 && ! empty( $item->description ) ) {
			$item_output .= '<p>' . esc_html( $item->description ) . '</p>';
		}

		if ( 0 === $depth && $has_children ) {
			$item_output .= '<button class="arrow" type="button" aria-label="' . esc_attr__( 'Dropdown opener', 'solarcompany' ) . '" aria-expanded="false"></button>';
		}

		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

	/**
	 * Ends the element output, if needed.
	 *
	 * @see Walker::end_el()
	 *
	 * @param  string   $output Used to append additional content (passed by reference).
	 * @param  WP_Post  $item   Page data object. Not used.
	 * @param  int      $depth  Depth of page. Not Used.
	 * @param  stdClass $args   An object of wp_nav_menu() arguments.
	 * @return void
	 */
	public function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$output .= "</li>\n";
	}
}
