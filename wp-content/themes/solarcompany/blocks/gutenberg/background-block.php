<?php
/**
 * Gutenberg Background Block.
 *
 * @package SolarCompanyTheme
 */

/*
Block title: Background block
Description: Background block.
Keywords: background
Icon: format-image
Other Available options: Icon, Category.
*/

$class_name = 'section-background-block ';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . $block['className'];
}

$id_name = '';
if ( ! empty( $block['anchor'] ) ) {
	$id_name = 'id=' . $block['anchor'];
}

$padding = get_field( 'padding' );
$format  = get_field( 'type' );
$image   = get_field( 'image' );
$video   = get_field( 'video' );
$heading = get_field( 'title' );
$desc    = get_field( 'description' );
$button  = acf_button( get_field( 'button' ), array( 'btn', 'btn-glass' ), '', '<span>', '</span>' );

if ( ! empty( $image ) || ! empty( $video ) || ! empty( $heading ) || ! empty( $desc ) || ! empty( $button ) ) : ?>
<section <?php echo esc_attr( $id_name ); ?> class="<?php echo esc_attr( $class_name ); ?>"
	<?php
	if ( $padding ) :
		echo 'style="' . esc_attr( get_the_style( $padding ) ) . '"';
endif;
	?>
>
<?php if ( ! empty( $heading ) || ! empty( $button ) ) : ?>
	<div class="container">
    <div class="holder-block">
      <?php if ( 'image' === $format && ! empty( $image ) ) : ?>
        <?php echo wp_get_attachment_image( $image, 'full' ); ?>
      <?php elseif ( 'video' === $format && ! empty( $video ) ) : ?>
        <?php
        if ( ! empty( $video['video'] ) ) :
          $video_html = acf_video( $video['video'], false );
          if ( ! empty( $video_html ) ) :
            echo wp_kses_post( $video_html );
          endif;
        endif;
        ?>
      <?php endif; ?>
      <div class="text-block">
        <?php if ( ! empty( $heading ) ) : ?>
        <h2><?php echo wp_kses( $heading, array( 'br' => array() ) ); ?></h2>
          <?php
        endif;
        if ( ! empty( $desc ) ) : ?>
          <div class="text-holder"><?php echo wp_kses_post( $desc ); ?></div>
        <?php endif;
        if ( $button ) :
          echo wp_kses_post( $button );
        endif;
        ?>
      </div>
    </div>
	</div>
	<?php endif; ?>
</section>
<?php endif; ?>
