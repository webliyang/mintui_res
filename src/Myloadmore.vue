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
    getScrollEventTarget(el) {
      var currentEle = el;
      while (
        currentEle.tagName != "BODY" &&
        currentEle.tagName != "HTML" &&
        currentEle.nodeType == 1
      ) {
        if (
          window.getComputedStyle(currentEle).overflowY == "auto" ||
          window.getComputedStyle(currentEle).overflowY == "scroll"
        ) {
          return currentEle;
        } else {
          currentEle = currentEle.parentNode;
        }
      }
      return window;
    },
    getScrollTop(el) {
      if (el == window) {
        return Math.max(
          window.pageXOffset || 0,
          document.documentElement.scrollTop
        );
      } else {
        return el.scrollTop;
      }
    },
    init() {
      (this.topStatus = "pull"),
        (this.bottomStatus = "pull"),
        (this.topText = this.topPullText);
      this.bottomText = this.bottomPullText;
      this.scrollEventTarget = this.getScrollEventTarget(this.$el);
      if (this.autoFill) {
        this.fillContainer();
      }
      if (
        typeof this.topMethod == "function" ||
        typeof this.bottomMethod == "function"
      ) {
        this.bindTouchEvents();
      }
    },
    bindTouchEvents() {
      this.$el.addEventListener("touchstart", handleTouchStart);
      this.$el.addEventListener("touchmove", handleTouchMove);
      this.$el.addEventListener("touchend", handleTouchEnd);
    },
    fillContainer() {
      if (!this.autoFill) {
        return false;
      }
      this.$nextTick(() => {
        //
        if (this.scrollEventTarget == window) {
          this.containerFilled =
            this.$el.getBoundingClientRect().bottom >=
            document.documentElement.clientHeight; //document.documentElement.clientHeight 如果html没撑满window返回的也是屏幕的高度
        } else {
          this.containerFilled =
            this.$el.getBoundingClientRect().bottom >=
            this.scrollEventTarget.getBoundingClientRect().bottom;
        }

        if (!this.containerFilled) {
          this.bottomStatus = "loadding"; //
          this.bottomMethod();
        }
      });
    },
    handleTouchStart(event) {
      if (this.topStatus == "loading" || this.bottomStatus == "loading") {
        return false;
      }
      this.startY = event.touchs[0].clientY;
      this.startScrollTop = this.getScrollEventTarget(this.scrollEventTarget);
      this.topStatus = "pull";
      this.bottomStatus = "pull";
      this.topDropped = false;
      this.bottomDropped = false;
    },
    handleTouchMove(event) {
      if (
        this.startY < this.$el.getBoundingClientRect().top ||
        this.startY > this.$el.getBoundingClientRect().bottom
      ) {
        //
        return;
      }
      this.currentY = event.touchs[0].clientY;
      var distance = (this.currentY - this.startY) / this.distanceIndex;
      this.direction = this.distance > 0 ? "down" : "up";
      event.stopPropagation();
      event.preventDefault();
      if (
        this.direction == "down" &&
        typeof this.topMethod == "function" &&
        this.getScrollTop(this.scrollEventTarget) == 0
      ) {
        //第三个条件很精髓
        if (this.maxDistance > 0) {
          this.translate =
            distance - this.startScrollTop > maxDistance
              ? this.translate
              : distance - this.startScrollTop;
        } else {
          this.translate = distance - this.startScrollTop;
        }
        if (this.translate <= 0) {
          this.translate = 0;
        }
        this.topStatus = this.translate >= this.topDistance ? "drop" : "pull";
      }

      if (this.direction === "up") {
        this.bottomReached = this.bottomReached || this.checkBottomReached();
      }
      if (
        typeof this.bottomMethod === "function" &&
        this.direction === "up" &&
        this.bottomReached &&
        this.bottomStatus !== "loading" &&
        !this.bottomAllLoaded
      ) {
        event.preventDefault();
        event.stopPropagation();
        if (this.maxDistance > 0) {
          this.translate =
            Math.abs(distance) <= this.maxDistance
              ? this.getScrollTop(this.scrollEventTarget) -
                this.startScrollTop +
                distance
              : this.translate;
        } else {
          this.translate =
            this.getScrollTop(this.scrollEventTarget) -
            this.startScrollTop +
            distance;
        }
        if (this.translate > 0) {
          this.translate = 0;
        }
        this.bottomStatus =
          -this.translate >= this.bottomDistance ? "drop" : "pull";
      }
    },
    handleTouchEnd(event){
      if(this.direction === 'down' && this.getScrollTop(this.scrollEventTarget) === 0 && this.translate > 0){
        this.topDropped = true;
          if (this.topStatus === 'drop') {
            this.translate = '50';
            this.topStatus = 'loading';
            this.topMethod();
          } else {
            this.translate = '0';
            this.topStatus = 'pull';
          }
      }
    }
  },

  mounted() {
    this.init();
  }
};
</script>