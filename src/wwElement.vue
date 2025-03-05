<template>
  <div class="PDF-viewer" id="app">
    <p>
      <input type="text" ref="searchInput" :id="idConfig.findInput" :value="this.content.search" />
      <input type="checkbox" :id="idConfig.findHighlightAll" checked />
    </p>
    <vue-pdf-app style="height:100vh;width:100%" :pdf="this.content.pdf"
      :id-config="idConfig"
      @after-created="afterCreated">
    </vue-pdf-app>
  </div>
</template>

<script>
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";

export default {
  components: {
    VuePdfApp
  },
  props: {
    content: {
      type: Object,
      default: () => ({ pdf: this.content.pdf, idConfig: { findInput: this.content.search, findHighlightAll:true} })
    }
  },
  data() {
    return {
      pdf: this.content.pdf,
      idConfig: {
        findInput: "findInputId",
        findHighlightAll: "findHighlightAllId",
      },
      pdfViewerApp: null,
    };
  },
  methods: {
    afterCreated(pdfApp) {
      console.log("PDF Viewer Created:", pdfApp);
      this.pdfViewerApp = pdfApp;

      // Wait for pages to load before searching
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
        console.log("PDF Rendered. Starting search...", this.content.search);

        this.pdfViewerApp.eventBus.dispatch("find", {
          query: this.content.search,
          highlightAll: true,
          caseSensitive: false,
          entireWord: false,
        });
      } else {
        console.error("PDF did not render in time.");
      }
    },
  },
  beforeUnmount() {
    this.clearObserver();
  },
  mounted() {
    this.initObserver();
    console.log("PDF URL:", this.content.pdf); // Debugging output
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
</style>
