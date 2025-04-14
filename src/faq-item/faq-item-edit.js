import { RichText, useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

export default function Edit({ attributes, setAttributes }) {
    const { question, answer } = attributes;
    const blockProps = useBlockProps({
        className: "faq-item",
    });

    return (
        <div {...blockProps}>
            <RichText
                tagName="p"
                className="title accordion-title faq-title"
                placeholder={__("Enter question…", "rf-faq")}
                value={question}
                onChange={(value) => setAttributes({ question: value })}
            />
            <RichText
                tagName="div"
                className="holder faq-answer"
                placeholder={__("Enter answer…", "rf-faq")}
                multiline="p"
                value={answer}
                onChange={(value) => setAttributes({ answer: value })}
            />
        </div>
    );
}
