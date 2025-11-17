"use client";
import React, { useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// مهم: بدون import مباشر لـ "jodit-react" في الأعلى
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="p-4">Loading editor…</div>,
});

const copyStringToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.cssText = "position:absolute;left:-9999px;";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const facilityMergeFields = [
  "FacilityNumber",
  "FacilityName",
  "Address",
  "MapCategory",
  "Latitude",
  "Longitude",
  "ReceivingPlant",
  "TrunkLine",
  "SiteElevation",
];

const inspectionMergeFields = ["InspectionCompleteDate", "InspectionEventType"];

const createOptionGroupElement = (mergeFields, optionGroupLabel) => {
  const optionGroupElement = document.createElement("optgroup");
  optionGroupElement.setAttribute("label", optionGroupLabel);
  for (let i = 0; i < mergeFields.length; i++) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("class", "merge-field-select-option");
    optionElement.setAttribute("value", mergeFields[i]);
    optionElement.text = mergeFields[i];
    optionGroupElement.appendChild(optionElement);
  }
  return optionGroupElement;
};

export default function Jodit({
  content = "",
  onChange,
  placeholder = "Start typing...",
}) {
  // تأكيد التركيب بالمتصفح قبل لمس DOM
  const [mounted, setMounted] = useState(false);

  // تحريك useMemo قبل العودة المشروطة
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      toolbar: true,
      spellcheck: true,
      language: "en",
      toolbarButtonSize: "medium",
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: true,
      askBeforePasteFromWord: true,
      buttons: [
        "undo",
        "redo",
        "|",
        "bold",
        "strikethrough",
        "underline",
        "italic",
        "|",
        "superscript",
        "subscript",
        "|",
        "align",
        "|",
        "ul",
        "ol",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "link",
        "table",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "fullsize",
        "selectall",
        "print",
        "|",
        "source",
        "|",
        {
          name: "insertMergeField",
          tooltip: "Insert Merge Field",
          iconURL: "/images/merge.png", // ضع الأيقونة في public/images
          popup: (editor) => {
            function onSelected(e) {
              const mergeField = e.target.value;
              if (mergeField) {
                editor.selection.insertNode(
                  editor.create.inside.fromHTML(`{{${mergeField}}}`)
                );
              }
            }
            const divElement = editor.create.div("merge-field-popup");
            const labelElement = document.createElement("label");
            labelElement.setAttribute("class", "merge-field-label");
            labelElement.textContent = "Merge field: ";
            divElement.appendChild(labelElement);

            const selectElement = document.createElement("select");
            selectElement.setAttribute("class", "merge-field-select");
            selectElement.appendChild(
              createOptionGroupElement(facilityMergeFields, "Facility")
            );
            selectElement.appendChild(
              createOptionGroupElement(inspectionMergeFields, "Inspection")
            );
            selectElement.onchange = onSelected;
            divElement.appendChild(selectElement);

            return divElement;
          },
        },
        {
          name: "copyContent",
          tooltip: "Copy HTML to Clipboard",
          iconURL: "/images/copy.png",
          exec: (editor) => {
            const html = editor.value;
            copyStringToClipboard(html);
          },
        },
      ],
      uploader: { insertImageAsBase64URI: true },
      width: "100%",
      height: 400,
      placeholder,
    }),
    [placeholder]
  );

  useEffect(() => setMounted(true), []);

  const handleBlur = (newContent) => onChange && onChange(newContent);

  // العودة المشروطة بعد جميع الـ hooks
  if (!mounted) {
    return <div className="p-4">Loading editor…</div>;
  }

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <JoditEditor
        value={content}
        config={editorConfig}
        onBlur={handleBlur}
        onChange={() => {}}
      />
    </div>
  );
}
