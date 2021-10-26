<template>
  <div v-html="parsedPost"></div>
</template>

<script>
export default {
  props: {
    post: String
  },
  computed: {
    parsedPost(){
      let p = this.post
      let BBCode = ["B", "U", "I", "S", "SUB", "SUP"]
      BBCode.forEach(e=>{
        let patt = `\\[${e}\\](((?!\\[\\/${e}).|\\r\\n)+)\\[\\/${e}\\]`
        p = p.replace( new RegExp(patt, 'g'),`<${e}>$1</${e}>`)
      })
      p = p.replace(/\[color=(\w+)\](((?!\[\/color).|\r\n)+)\[\/color\]/g,"<span style='color:$1;'>$2</span>")
      p = p.replace(/\[IMG](.+?)\[\/IMG\]/g,"<img style='max-height: 128px;' src='/images/tumbs/$1'>")
      // *vkKotik74png*
      p = p.replace(/\*([a-zA-Z]+)(\d{1,3})([ifgnp]{3})\*/g,"<img style='max-height: 64px;' src='/images/$1/$2.$3'>")
      p = p.replace(/\[SIZE=(\w+)\](((?!\[\/SIZE).|\r\n)+)\[\/SIZE\]/g,"<span style='font-size:$1;'>$2</span>")
      p = p.replace(/\[URL=([\w:_=&#\-\/.\?]+)\](((?!\[\/URL).|\r\n)+)\[\/URL\]/g,"<a href='$1' target='blank'>$2</a>")
      p = p.replace(/\[SPOILER=([^\]]+)\](((?!\[\/SPOILER).|\r\n)+)\[\/SPOILER\]/g,"<ul class='collapsible "+ this.rUUID +"'><li><div class='collapsible-header'><i class='material-icons'>filter_drama</i>$1</div><div class='collapsible-body'><span>$2</span></div></li></ul>")      
      p = p.replace(/[\r\n]+/g,"<br>")
      return p
    }
  },
}
</script>