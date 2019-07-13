<?php
/*
Plugin Name: RDFa
Description: Permite al usuario realizar anotaciones en su contenido con formato RDFa
Version: 1.0
Author: Maria José Alobuela
License: GPLv2 
*/
add_action( 'admin_head', 'fb_add_tinymce' );
function fb_add_tinymce() {
    global $typenow;
    if( ! in_array( $typenow, array( 'post', 'page' ) ) )
        return ;
	wp_enqueue_script('jquery');
    add_filter( 'mce_external_plugins', 'fb_add_tinymce_plugin' );
    add_filter( 'mce_buttons', 'fb_add_tinymce_button' );
	add_filter('tiny_mce_before_init', 'opciones_mce');
}

function fb_add_tinymce_plugin( $plugin_array ) {
    $plugin_array['rdfa'] = plugins_url( 'plugin.min.js', __FILE__ );
    return $plugin_array;
}

function fb_add_tinymce_button( $buttons ) {
    array_push( $buttons, '| rdfaPrin codHTML' );
    return $buttons;
}
function opciones_mce( $init ) {
	$init['css'] = WP_PLUGIN_URL . '/rdfa/css/rdfa.css,'.WP_PLUGIN_URL.'/rdfa/schema/coloresSchema.css';
    return $init;
}
?>
