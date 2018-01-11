import Vue from 'vue';
const ToastConstructor = Vue.extend(require('./MyToast.vue'));
let toastpool = [];

let getAnInstance = () => {
    if (toastpool.length > 0) {
        return toastpool[0];
        toastpool.splice(0, 1);
    } else {
        return new ToastConstructor({
            el: document.createElement('div')
        })
    }
}
var returnAnInstance = (instance) => {
    if (instance) {
        toastpool.push(instance)
    }
}

ToastConstructor.prototype.close = function () {

    this.visible = false;
    this.$el.addEventListener('transitionend', removeDom);
    this.closed = true;
    returnAnInstance(this);
}

let removeDom = function () {
    this.parentNode.removeChild(this)
}

let Toast = (options = {}) => {
    let duration = options.duration || 3000;
    let instance = getAnInstance();
    instance.closed = false;
    clearTimeout(instance.timer);
    instance.message = typeof options == 'string' ? options : options.message;
    instance.position = options.position || 'middle';
    instance.className = options.className || '';
    instance.iconClass = options.iconClass || '';
    document.body.appendChild(instance.$el);
    instance.visible = true;
    instance.$el.removeEventListener('transitionend', removeDom);
    instance.timer = setTimeout(function () {
        if (instance.closed) {
            return;
        } else {
            instance.close();
        }
    }, duration)

    return instance;
}


export default Toast;