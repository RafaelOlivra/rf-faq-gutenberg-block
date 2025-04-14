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
    register_block_type(__DIR__ . '/src/');
    register_block_type(__DIR__ . '/src/faq-item/');
}
add_action('init', 'rf_create_block_faq_block_init');


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
            if ($faq_item['blockName'] === 'rf/faqItem') {
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
