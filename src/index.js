import { createBlock, rawHandler, registerBlockType } from "@wordpress/blocks";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import faqEdit from "./faq-edit";
import faqSave from "./faq-save";
import faqItemEdit from "./faq-item/faq-item-edit";
import faqItemSave from "./faq-item/faq-item-save";

import "./style.scss";
import "./editor.scss";

registerBlockType("rf/faq", {
    edit: faqEdit,
    save: faqSave,
});

registerBlockType("rf/faqitem", {
    edit: faqItemEdit,
    save: faqItemSave,
    deprecated: [{
        attributes: {
            question: { type: "string", source: "html", selector: ".faq-title" },
            answer: { type: "string", source: "html", selector: ".faq-answer" },
        },
        save({ attributes }) {
            const blockProps = useBlockProps.save({ className: "faq-item item accordion" });
            return (
                <div {...blockProps}>
                    <RichText.Content tagName="p" className="title accordion-title faq-title" value={attributes.question} />
                    <RichText.Content tagName="div" className="holder faq-answer" value={attributes.answer} />
                </div>
            );
        },
        migrate({ answer, ...attributes }) {
            const blocks = rawHandler({ HTML: answer || "", mode: "BLOCKS" });
            const convert = (block) => {
                if (["core/paragraph", "core/list", "core/image"].includes(block.name)) {
                    return [block];
                }
                if (block.innerBlocks.length) {
                    return block.innerBlocks.flatMap(convert);
                }
                return [createBlock("core/paragraph", { content: block.attributes.content || "" })];
            };
            const answerBlocks = blocks.flatMap(convert);
            return [attributes, answerBlocks.length ? answerBlocks : [createBlock("core/paragraph")]];
        },
    }],
});
