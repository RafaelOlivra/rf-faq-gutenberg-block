import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

export default function Edit({ attributes, setAttributes }) {
    const { question } = attributes;
    const blockProps = useBlockProps({
        className: "faq-item item accordion opened",
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
            <div className="holder faq-answer">
                <InnerBlocks
                    allowedBlocks={["core/paragraph", "core/list", "core/image"]}
                    template={[["core/paragraph", { placeholder: __("Enter answer…", "rf-faq") }]]}
                    templateLock={false}
                />
            </div>
        </div>
    );
}
