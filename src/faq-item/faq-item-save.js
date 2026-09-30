import { RichText, useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
    const { question, answer } = attributes;
    const blockProps = useBlockProps.save({
        className: "faq-item item accordion opened",
    });

    return (
        <div {...blockProps}>
            <RichText.Content tagName="p" className="title accordion-title faq-title" value={question} />
            <RichText.Content tagName="div" className="faq-answer" value={answer} />
        </div>
    );
}
