<template>
  <div class="masonry">
    <div class="item" v-for="g in paginationImageList" :key="g.gid">
      <div>
        <a target="_blank" :href="'http://morivvv.byethost32.com/image/' + g.ORIG_IMAGE" ><img class="materialboxed" :src="'images/tumbs/' + g.TUMBS" /></a>
      </div>      
      <div class="row">
        <div class="col s12 white">
          <input type="text" :id="g.gid" :value="g.n" />
        </div>
        <div v-if="g.FULLHD" class="col">
          <a target="_blank" :href="'http://morivvv.byethost32.com/image/1080p/' + g['1080p']" class="btn">1080px</a>
        </div>
        <div v-if="g.HD" class="col">
          <a target="_blank" :href="'http://morivvv.byethost32.com/image/720p/' + g['720p']" class="btn">720px</a>
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
        url: "api/restGet",
        data:{
          fields: [], 
          from: ["bd_gallery:g", "bd_gallery_access:ga"], 
          filter: {"ga.kod_folder": this.folder, "ga.kod_user": this.user},
          join:  ["ga.kod_gallery=g.id"],
          sort: ["-id"]
        },
      stateName: "gallery/imageList",
    });
    },
    user(){
      this.fetchData({url: "api/restGet",data:{fields: [],from: "bd_gallery", sort: ["-id"], filter: {kod_folder: this.folder, kod_user: this.user} },
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
    this.fetchData({url: "api/restGet",data:{fields: [],from: "bd_gallery", sort: ["-id"], filter: { kod_user: this.user} },
      stateName: "gallery/imageList",
    });
  },
}
</script>

<style scoped>
.masonry{
  padding-bottom: 45px;
  column-count: 6;
  column-gap: 2px;
  }

.item{
  display: inline-block;
  padding: 3px;
  background: white;
  border: 1px solid silver;
  width: 100%;
  position: relative;
}
.item img {
    width: 100%;
    height: auto;
}
.item div.row{
    top: 0px
}

</style>