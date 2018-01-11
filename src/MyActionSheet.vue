<template>
<div>
    <div class="cover"  v-show="sheetShow" @click="closeSheet"> </div>
    <!-- <transition name="action-sheet-tran"> -->
        <ul ref="ul"  :class="{show:ulShow}">
          <li v-for="(item,index) in list">{{item}}</li>
          <li>取消</li>
      </ul>
    <!-- </transition> -->
 
</div>
 
</template>

<script>
export default {
  data() {
    return {
      sheetShow: false,
      ulShow: false,
      list: ["拍照", "上传找票", "找不到了"]
    };
  },
  components: {},
  props: {},
  //实例初始化最之前，无法获取到data里的数据
  beforeCreate() {},
  //在挂载开始之前被调用
  beforeMount() {},
  //已成功挂载，相当ready()
  mounted() {
   
  },
  //相关操作事件
  methods: {
    closeSheet: function() {
      setTimeout(() => {
        this.sheetShow = false;
      }, 500);
      this.ulShow = false;
    }
  }
};
</script>

<style lang="less" scoped>
// .action-sheet-tran-enter-active,.action-sheet-tran-leave-active{
//     transition: 0.2s ;
// }
// .action-sheet-tran-enter{
//     margin-bottom: -100%;
// }
// .action-sheet-tran-leave-active{
//      margin-bottom: -100%;
// }

.cover {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2000;
}
ul {
  padding: 0;
  left: 0;
  position: absolute;
  z-index: 2001;
  bottom: 0;
  width: 100%;
  margin: 0;
  margin-bottom: -100%;
  transition: 0.7s ease-out;
  &.show {
    margin-bottom: 0;
  }
  li {
    list-style: none;
    background-color: #fff;
    line-height: 40px;
    width: 100%;
    text-align: center;
    &:active {
      background-color: #f0f0f0;
    }
    &:last-child {
      margin-top: 5px;
    }
  }
}
</style>
