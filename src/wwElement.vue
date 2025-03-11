<template>
  <div class="PDF-viewer" id="app">
    <vue-pdf-app
      style="height:100vh;width:100%"
      :pdf="content.pdf"
      @after-created="afterCreated"
    ></vue-pdf-app>
  </div>
</template>

<script>
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";

export default {
  components: {
    VuePdfApp,
  },
  props: {
    content: {
      type: Object,
      default: () => ({
        pdf: "",
        search: "",
      }),
    },
  },
  data() {
    return {
      searchQuery: this.content.search, // Store reactive search query
      idConfig: {
        findInput: "findInputId",
        findHighlightAll: "findHighlightAllId",
      },
      pdfViewerApp: null,
    };
  },
  watch: {
    "content.search"(newSearch) {
      this.searchQuery = newSearch;
      this.triggerSearch();
    },
  },
  methods: {
    initObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        console.log(this.content.pdf);
        console.log("Resized");
        "content.search"(newSearch) {
          this.searchQuery = newSearch;
          this.triggerSearch();
        },
      });
      this.resizeObserver.observe(this.$el);
    },
    clearObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
    afterCreated(pdfApp) {
      console.log("PDF Viewer Created:", pdfApp);
      this.pdfViewerApp = pdfApp;
      this.waitForPagesToRender();
    },
    async waitForPagesToRender() {
      console.log("Waiting for PDF to render...");
      let attempts = 0;
      while (!this.pdfViewerApp?.pdfViewer?.pagesCount && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }
      if (this.pdfViewerApp.pdfViewer.pagesCount) {
        console.log("PDF Rendered. Starting search...", this.searchQuery);
        this.triggerSearch();
      } else {
        console.error("PDF did not render in time.");
      }
    },
    triggerSearch() {
      if (this.pdfViewerApp && this.searchQuery) {
        console.log("Triggering search:", this.searchQuery);
        this.pdfViewerApp.eventBus.dispatch("find", {
          query: this.searchQuery,
          phraseSearch: false,
          caseSensitive: false,
          entireWord: true,
          highlightAll: true,
          findPrevious: false
        });
      }
    },
  },
  beforeUnmount() {
    this.clearObserver();
  },
  mounted() {
    this.initObserver();
    console.log("PDF URL:", this.content.pdf); // Debugging output
    // Wait for DOM to render and update the z-index
    this.$nextTick(() => {
      const toolbar = document.querySelector(".pdf-app .toolbar");
      if (toolbar) {
        toolbar.style.zIndex = "auto";
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.PDF-viewer{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
}
/* Fix toolbar z-index */
::v-deep(.pdf-app .toolbar) {
  z-index: auto !important;
}
:deep(.pdf-app .toolbar) {
  z-index: auto !important;
}
</style>
