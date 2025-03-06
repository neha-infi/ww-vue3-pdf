export default {
  editor: {
    label: {
      en: "PDF viewer",
    },
    icon: 'document-report',
  },
  properties: {
    pdf: {
      label: { en: "PDF Url", fr: "PDF Url" },
      type: "Text",
      options: {
        placeholder: "PDF url",
      },
      defaultValue:
        "https://bsiybqzphvbftfzexyhc.supabase.co/storage/v1/object/public/gov_uk_docs/docs/1730739021-S_-_W_April_22.pdf",
      bindable: true,
    },
    search: {
      label: { en: "search", fr: "search" },
      type: "Text",
      options: {
        placeholder: "search",
      },
      bindable: true,
    },
  },
  
};
