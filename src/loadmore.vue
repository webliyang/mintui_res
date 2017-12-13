<template>
  <div class="mint-loadmore">
    <div class="mint-loadmore-content" :class="{ 'is-dropped': topDropped || bottomDropped}" :style="{ 'transform': 'translate3d(0, ' + translate + 'px, 0)' }">
      <slot name="top">
        <div class="mint-loadmore-top" v-if="topMethod">
          <div class="spinner"><spinner v-if="bottomStatus === 'loading'" class="mint-loadmore-spinner" :size="20" type="fading-circle"></spinner></div>
          <span class="mint-loadmore-text">{{ topText }}</span>
        </div>
      </slot>
      <slot></slot>
      <slot name="bottom">
        <div class="mint-loadmore-bottom" v-if="bottomMethod">
          <div class="spinner"><spinner v-if="bottomStatus === 'loading'" class="mint-loadmore-spinner" :size="20" type="fading-circle"></spinner></div>
          <span class="mint-loadmore-text">{{ bottomText }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<style>
.mint-loadmore {
  overflow: hidden;
}
.is-dropped {
  transition: 0.2s;
}

.mint-loadmore-top,
.mint-loadmore-bottom {
  text-align: center;
  height: 50px;
  line-height: 50px;
}

.mint-loadmore-top {
  margin-top: -50px;
}

.mint-loadmore-bottom {
  margin-bottom: -50px;
}

.spinner {
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
}
</style>

<script type="text/babel">
import { Spinner } from "mint-ui";
import Vue from "vue";
Vue.component(Spinner.name, Spinner);
export default {
  name: "mt-loadmore",
  components: {
    spinner: spinner
  },

  props: {
    maxDistance: {
      type: Number,
      default: 0
    },
    autoFill: {
      type: Boolean,
      default: true
    },
    distanceIndex: {
      type: Number,
      default: 2
    },
    topPullText: {
      type: String,
      default: "下拉刷新"
    },
    topDropText: {
      type: String,
      default: "释放更新"
    },
    topLoadingText: {
      type: String,
      default: "加载中..."
    },
    topDistance: {
      type: Number,
      default: 70
    },
    topMethod: {
      type: Function
    },
    bottomPullText: {
      type: String,
      default: "上拉刷新"
    },
    bottomDropText: {
      type: String,
      default: "释放更新"
    },
    bottomLoadingText: {
      type: String,
      default: "加载中..."
    },
    bottomDistance: {
      type: Number,
      default: 70
    },
    bottomMethod: {
      type: Function
    },
    bottomAllLoaded: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      translate: 0,
      scrollEventTarget: null,
      containerFilled: false,
      topText: "",
      topDropped: false,
      bottomText: "",
      bottomDropped: false,
      bottomReached: false,
      direction: "",
      startY: 0,
      startScrollTop: 0,
      currentY: 0,
      topStatus: "",
      bottomStatus: ""
    };
  },

  watch: {},

  methods: {
    init() {
      this.topStatus = "pull";
      this.bottomStatus = "pull";
      this.bottomText = this.bottomPullText;
      this.topText = this.topPullText;
      this.scrollEventTarget = this.getScrollEventTarget(this.$el);
      if (
        typeof this.topMethod === "function" ||
        typeof this.bottomMethod === "function"
      ) {
        this.bindTouchEvents();
      }
      if (typeof this.bottomMethod === "function" && this.autoFill) {
        this.fillContainer();
      }
    },
    getScrollEventTarget(el) {
      let currentnode = el;
      while (
        currentnode &&
        currentnode.tagName !== "HTML" &&
        currentnode.tagName !== "BODY" &&
        currentnode.nodeType == 1
      ) {
        let overflowy = currentnode.defaultView.getComputedStyle(currentnode)
          .overflowY;
        if (overflowy == "scroll" || overflowy == "auto") {
          return currentnode;
        }
      }
      return window;
    },
    fillContainer() {
      this.$nextTick(() => {
        if (this.scrollEventTarget == window) {
          this.containerFilled =
            this.$el.getBoundingClientRect().bottom >=
            document.documentElement.getBoundingClientRect().bottom;
        } else {
          this.containerFilled =
            this.$el.getBoundingClientRect().bottom >=
            this.scrollEventTarget.getBoundingClientRect().bottom;
        }
        if (!this.containerFilled) {
          this.bottomStatus = "loading";
          this.bottomMethod();
        }
      });
    },
    getScrollTop(el) {
      if (el == window) {
        return Math.max(
          window.pageYOffset || 0,
          document.documentElement.scrollTop
        );
      } else {
        return el.scrollTop;
      }
    },
    bindTouchEvents() {
      this.$el.addEventListener("touchstart", this.handleTouchStart);
      this.$el.addEventListener("touchmove", this.handleTouchMove);
      this.$el.addEventListener("touchend", this.handleTouchEnd);
    },
    handleTouchStart(event) {
      this.startY = event.touchs[0].clientY;
      this.startScrollTop = this.getScrollTop(this.scrollEventTarget);
    },
    handleTouchMove(event) {
      if (
        this.startY > this.scrollEventTarget.getBoundingClientRect().bottom ||
        this.startY < this.scrollEventTarget.getBoundingClientRect().top
      ) {
        return false;
      }
      event.preventDefault();
      event.stopPropagation();
      this.currentY = event.touchs[0].clientY;
      let distance = (this.currentY - this.startY) / this.distanceIndex;
      if (this.distance > 0) {
        this.direction = "down";
      } else {
        this.direction = "up";
      }
      if (
        typeof this.topMethod == "function" &&
        this.direction == "down" &&
        this.topStatus != "loading" &&
        this.getScrollTop(this.getScrollEventTarget) == 0
      ) {
        if (this.maxDistance > 0) {
          this.translate =
            distance - this.startScrollTop <= this.maxDistance
              ? distance - this.startScrollTop
              : this.translate;
        } else {
          this.translate = distance - this.startScrollTop;
        }

        this.topStatus = this.translate > this.topDistance ? "drop" : "pull";
        if (this.translate < 0) {
          this.translate = 0;
        }
      }

      if (this.direction == "up") {
        this.bottomReached = this.bottomReached || this.checkBottomReached();
       
      }
       if(this.bottomReached&&typeof this.bottomMethod === 'function'&&this.direction=='up'&&this.bottomStatus!='loading'&!this.bottomAllLoaded){
           if(this.maxDistance>0){
               this.translate = Math.abs(this.translate)<=this.maxDistance?this.getScrollTop(this.scrollEventTarget) - this.startScrollTop+distance:this.translate
           }
       }
    },
    handleTouchEnd() {},
    checkBottomReached() {
      if (this.scrollEventTarget == window) {
        return (
          document.documentElement.scrollTop +document.documentElement.clientHeight >= document.documentElement.scrollHeight
        );
      } else {
        return (
          this.$el.getBoundingClientRect().bottom <= this.scrollEventTarget.getBoundingClientRect().bottom + 1
        );
      }
    }
  },

  mounted() {
    this.init();
  }
};
</script>