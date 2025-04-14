import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Edit() {
    const TEMPLATE = [["rf/faqitem"]];
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <InnerBlocks allowedBlocks={["rf/faqitem"]} template={TEMPLATE} templateLock={false} />
        </div>
    );
}
