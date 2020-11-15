<template>
  <div class="masonry">
    <div class="item" v-for="g in paginationImageList" :key="g.gid">
      <div>
        <a target="_blank" :href="'http://morivvv.byethost32.com/image/' + g.ORIG_IMAGE" ><img :src="'images/tumbs/' + g.t" /></a>
      </div>      
      <div class="row">
        <div class="col s12 white">
          <input type="text" :id="g.gid" :value="g.n" />
        </div>
        <div v-if="g.FULLHD" class="col">
          <a target="_blank" :href="'http://morivvv.byethost32.com/image/1080p/' + g.FULLHD" class="btn">1080px</a>
        </div>
        <div v-if="g.HD" class="col">
          <a target="_blank" :href="'http://morivvv.byethost32.com/image/720p/' + g.HD" class="btn">720px</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props:{
    folder: Number,
    user: Number,
    start: Number,
    end: Number
  },
  watch: {
    folder(){
      this.fetchData({
      data: { sqlname: "getGallery", kod_folder: this.folder, kod_user: this.user },
      stateName: "gallery/imageList",
    });
    },
    user(){
      this.fetchData({
      data: { sqlname: "getGallery", kod_folder: this.folder, kod_user: this.user },
      stateName: "gallery/imageList",
    });
    }
  },
  computed: {
    ...mapState("gallery", ["imageList"]),
    paginationImageList(){
      let i=0
      return this.imageList.filter(()=>
        {
          i++
          if (i >= this.start && i <= this.end ){
            return true
          }
          return false
        }
      )
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
  },
  mounted() {
    this.fetchData({
      data: { sqlname: "getGallery", kod_folder: this.folder, kod_user: this.user },
      stateName: "gallery/imageList",
    });
  },
}
</script>

<style lang="sass" scoped>
.masonry
  padding-bottom: 45px
  column-count: 6
  column-gap: 2px

.item
  display: inline-block
  padding: 3px
  background: white
  border: 1px solid silver
  width: 100%
  position: relative
  img 
    width: 100%
    height: auto
  div.row
    top: 0px
    input
      height: 1rem
      font-size: 12px
      margin: 0;
  div.row
    display: none
    width: 100%
    position: absolute
  &:hover
    div.row
      display: block
      color: white
      z-index: 2
      .btn
        height: 15px
        line-height: 10px
        padding: 1px
</style>