/**
* @name VueJS vChatScroll (vue-chat-scroll)
* @description Monitors an element and scrolls to the bottom if a new child is added
* @author Theodore Messinezis <theo@theomessin.com>
* @file v-chat-scroll  directive definition
*/

const scrollToBottom = el => {
  setTimeout(() => {
    el.scrollTop = el.scrollHeight;
  }, 1);
};

const vChatScroll = {
  bind: (component, binding) => {
    let el = component.$el;
    let config = binding.value || {};
    let scrolled = false;

    console.log(component);

    el.addEventListener('scroll', e => {
      setTimeout(() => {
        const hadScrolledBeforeEvent = scrolled;
        scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight - (config.threshold || 20);

        console.log("onscroll", hadScrolledBeforeEvent, scrolled);

        if (! hadScrolledBeforeEvent && scrolled) {
          el.dispatchEvent(new CustomEvent("v-chat-scroll-scrolled-up", { detail: true }));
        } else if (hadScrolledBeforeEvent && ! scrolled) {
          el.dispatchEvent(new CustomEvent("v-chat-scroll-scrolled-up", { detail: false }));
        }
      }, 1);
    });

    (new MutationObserver(e => {
      console.log("MutationObserver", scrolled);
      // component.ps.update();
      if (scrolled) return;

      scrollToBottom(el);
    })).observe(el, { childList: true, subtree: true });

    (new ResizeObserver(e => {
      console.log("ResizeObserver", scrolled);
      // component.ps.update();
      if (scrolled) return;

      scrollToBottom(el);
    })).observe(el);
  },
  inserted: (el, binding) => {
    const config = binding.value || {};
    scrollToBottom(el);
  },
};

export default vChatScroll;
