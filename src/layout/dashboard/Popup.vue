<template>
  <div class="modal fade bs-example-modal-new" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">

    <div class="modal-dialog">

      <!-- Modal Content: begins -->
      <div class="modal-content">
        <div class="modal-body">
          <div class="body-message">
            <h4>Any Heading</h4>
            <p>And a paragraph with a full sentence or something else...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { MarkdownCard } from "@/components/index";

  export default {
    name: "Popup",
    components: {
      MarkdownCard
    }
  }
</script>

<style scoped>

</style>
