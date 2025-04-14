import { RichText, useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
    const { question, answer } = attributes;
    const blockProps = useBlockProps.save({
        className: "faq-item",
    });

    return (
        <div {...blockProps}>
            <RichText.Content tagName="p" className="title accordion-title faq-title" value={question} />
            <RichText.Content tagName="div" className="holder faq-answer" value={answer} />
        </div>
    );
}
