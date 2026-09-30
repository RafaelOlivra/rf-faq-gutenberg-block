<?php

/**
 * Plugin Name:       FAQ
 * Description:       A block to display an FAQ section.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Rafael Oliveira
 * Author URL:        https://rafaeloliveiradesign.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       faq
 *
 * @package           faq
 */

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function rf_create_block_faq_block_init()
{
    register_block_type(__DIR__ . '/build/', [
        'render_callback' => 'rf_render_faq_block',
    ]);
    register_block_type(__DIR__ . '/build/faq-item/');
}
add_action('init', 'rf_create_block_faq_block_init');

/**
 * Renders the FAQ block by converting its FAQ items into the theme's
 * [accordion]/[ac_item] shortcodes, so the front-end output (and behavior)
 * matches the shortcode-based accordion exactly.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The default block content (unused).
 * @param WP_Block $block      The block instance.
 */
function rf_render_faq_block($attributes, $content, $block)
{
    $class        = trim(($attributes['className'] ?? ''));
    $enable_schema = ! empty($attributes['enable_faq_schema']) ? 'enable' : '';
    $inner_blocks = $block->parsed_block['innerBlocks'] ?? [];
    $items_output = '';

    foreach ($inner_blocks as $faq_item) {
        if (($faq_item['blockName'] ?? '') !== 'rf/faqitem') {
            continue;
        }

        $item_attrs = $faq_item['attrs'] ?? [];
        $question   = trim(wp_strip_all_tags($item_attrs['question'] ?? ''));
        $answer     = wp_kses_post($item_attrs['answer'] ?? '');
        $item_html  = $faq_item['innerHTML'] ?? '';

        if (! $question && preg_match('/<p\b(?=[^>]*\bclass=("|\')[^"\']*\bfaq-title\b[^"\']*\1)[^>]*>(.*?)<\/p>/is', $item_html, $matches)) {
            $question = trim(wp_strip_all_tags($matches[2]));
        }

        if (! $answer && preg_match('/<div\b(?=[^>]*\bclass=("|\')[^"\']*\bfaq-answer\b[^"\']*\1)[^>]*>(.*?)<\/div>/is', $item_html, $matches)) {
            $answer = wp_kses_post($matches[2]);
        }

        if (! $question && ! $answer) {
            continue;
        }

        $title = urlencode($question);
        $items_output .= "[ac_item title='{$title}' enable_faq_schema='{$enable_schema}']{$answer}[/ac_item]";
    }

    if (! $items_output) {
        return '';
    }

    return do_shortcode("[accordion class='" . esc_attr($class) . "' enable_faq_schema='{$enable_schema}']" . $items_output . '[/accordion]');
}

/**
 * Adds FAQ schema to the FAQ block.
 *
 * @param string $block_content The block content.
 * @param array  $block        The block data.
 */
function rf_add_faq_schema_to_custom_faq_block($block_content, $block)
{
    if ($block['blockName'] !== 'rf/faq') {
        return $block_content;
    }

    $schema = [
        '@context' => 'https://schema.org',
        '@type'    => 'FAQPage',
        'mainEntity' => [],
    ];

    if (! empty($block['innerBlocks'])) {
        foreach ($block['innerBlocks'] as $faq_item) {
            if ($faq_item['blockName'] === 'rf/faqitem') {
                $question = wp_strip_all_tags($faq_item['attrs']['question'] ?? '');
                $answer   = wp_kses_post($faq_item['attrs']['answer'] ?? '');

                if ($question && $answer) {
                    $schema['mainEntity'][] = [
                        '@type' => 'Question',
                        'name' => $question,
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $answer,
                        ],
                    ];
                }
            }
        }
    }

    if (empty($schema['mainEntity'])) {
        return $block_content;
    }

    $schema_output = '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';

    return $block_content . $schema_output;
}
add_filter('render_block', 'rf_add_faq_schema_to_custom_faq_block', 10, 2);
