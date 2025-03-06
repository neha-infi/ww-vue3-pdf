<template>
  <div class="PDF-viewer" id="app">
    <p style="display:none">
      <input type="text" ref="searchInput" :id="idConfig.findInput" v-model="searchQuery" />
      <input type="checkbox" :id="idConfig.findHighlightAll" checked />
    </p>
    <vue-pdf-app
      style="height:100vh;width:100%"
      :pdf="content.pdf"
      :id-config="idConfig"
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
          highlightAll: true,
          caseSensitive: false,
          entireWord: false,
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
  }
};
</script>

<style lang="scss" scoped>
.pdf-app .toolbar{
  z-index: unset;
}
.PDF-viewer{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
