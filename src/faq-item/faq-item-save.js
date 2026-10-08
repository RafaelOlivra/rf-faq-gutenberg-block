import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
    const { question } = attributes;
    const blockProps = useBlockProps.save({
        className: "faq-item item accordion",
    });

    return (
        <div {...blockProps}>
            <RichText.Content tagName="p" className="title accordion-title faq-title" value={question} />
            <div className="holder faq-answer"><InnerBlocks.Content /></div>
        </div>
    );
}
