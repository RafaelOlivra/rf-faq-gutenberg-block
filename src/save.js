import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { SmartTagControl, SmartTag } from "./SmartTag";

export default function save(props) {
    const { attributes } = props;
    const { title, captionStyle, backgroundColor, borderColor, captionColor } = attributes;
    const blockProps = useBlockProps.save({
        className: `faq caption-${captionStyle || "default"}`,
        style: {
            backgroundColor: backgroundColor || undefined,
            borderColor: borderColor || undefined,
        },
        captionStyle: {
            backgroundColor: borderColor || undefined,
            color: captionColor || undefined,
        },
    });

    return (
        <SmartTag {...attributes} className={blockProps.className} style={blockProps.style}>
            {title && (
                <p className="caption-title title" style={blockProps.captionStyle}>
                    {title}
                </p>
            )}
            <div className="caption-content">
                <InnerBlocks.Content />
            </div>
        </SmartTag>
    );
}
