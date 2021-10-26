<template>
  <div class="blue-text">
    <label>{{ label }}</label>
    <textarea
      :id="uniq"
      :value="value"
      @input="$emit('input', $event.target.value)"
    ></textarea>
  </div>
</template>

<script>
import MD5 from "js-md5";
import tinymce from "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver/theme";
export default {
  name: "TextTinyMCE",
  props: {
    value: { type: String, default: "" },
    label: { type: String, default: "" }
  },
  computed: {
    uniq() {
      return MD5("" + this.label + Date.now() * Math.random());
    }
  },
  mounted() {
    let vuedata = this;
    tinymce.init({
      selector: "textarea#" + this.uniq,
      images_upload_url: "",
      base_url: "/js",
      convert_urls: false,
      images_upload_base_path: "",
      automatic_uploads: true,
      language: "ru",
      entity_encoding: "raw",
      menubar: "insert",
      fixed_toolbar_container: "#mytoolbar",
      extended_valid_elements:
        "img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|data-mce-src]",
      verify_html: false,
      plugins: [
        "autoresize preview pagebreak spellchecker",
        "searchreplace visualblocks visualchars code insertdatetime nonbreaking link",
        "save table contextmenu directionality emoticons image template paste textcolor anchor fullscreen"
      ],
      image_list: [
    {title: 'My image 1', value: '/images/tumbs/d749477cc2d03261f8912a7f32f19959.jpg'},
    {title: 'My image 2', value: '/images/tumbs/ea2cafb7639e2b457ba7c7f2bb594f61.jpg'}
  ],
      paste_data_images: true,
      setup: function(ed) {
        ed.on("change", () => vuedata.$emit("input", ed.getContent()));
      },
      toolbar:
        "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview | forecolor backcolor emoticons image paste anchor fullscreen"
    });
  }
};
</script>

<style scoped>
input[type="text"]:not(.browser-default) {
  margin: 0;
}
</style>
