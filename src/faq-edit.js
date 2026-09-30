import { useBlockProps, InnerBlocks, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
    const TEMPLATE = [["rf/faqitem"]];
    const blockProps = useBlockProps({ className: "accordion-list" });

    return (
        <>
            <InspectorControls>
                <PanelBody title="FAQ settings">
                    <ToggleControl
                        label="Enable FAQ schema"
                        checked={!!attributes.enable_faq_schema}
                        onChange={(value) => setAttributes({ enable_faq_schema: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <InnerBlocks allowedBlocks={["rf/faqitem"]} template={TEMPLATE} templateLock={false} />
            </div>
        </>
    );
}
