<template>
  <div id="player-modal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <player v-bind:player-id="'modal-player-div'" ref="player"></player>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Player from "./player";
  export default {
    name: 'modal-player',
    components: {Player},
    data: function () {
      return {
        aliPlayer: {}, // 播放器实例
      }
    },
    mounted() {
      //回调函数中使用_this的时候需要使用bind异步绑定
      let _this = this;
      $("#player-modal").on("hide.bs.modal",function(){
        _this.$refs.player.stop();
      }.bind(_this));
    },//end 
    methods: {
      playUrl(url) {
        let _this = this;
        _this.$refs.player.playUrl(url);
        $("#player-modal").modal("show");
      },//end 

      playVod(vod) {
        let _this = this;
        _this.$refs.player.playVod(vod);
        $("#player-modal").modal("show");
      },//end 
    }
  }
</script>

<style scoped>
  #player-modal .modal-body {
    padding: 0;
  }

</style>
