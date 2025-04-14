import { registerBlockType } from "@wordpress/blocks";
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
});
