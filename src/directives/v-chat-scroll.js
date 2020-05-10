/**
* @name VueJS vChatScroll (vue-chat-scroll)
* @description Monitors an element and scrolls to the bottom if a new child is added
* @author Theodore Messinezis <theo@theomessin.com>
* @file v-chat-scroll  directive definition
*/

const scrollToBottom = el => {
  setTimeout(() => {
    if (typeof el.scroll === "function") {
      el.scroll({
        top: el.scrollHeight,
        behavior: 'instant'
      });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, 1);
};

const vChatScroll = {
  bind: (el, binding) => {
    let config = binding.value || {};
    let scrolled = false;

    el.addEventListener('scroll', e => {
      const hadScrolledBeforeEvent = scrolled;
      scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight - (config.threshold || 20);

      if (scrolled && el.scrollTop === 0) {
        el.dispatchEvent(new Event("v-chat-scroll-top-reached"));
      }

      if (! hadScrolledBeforeEvent && scrolled) {
        el.dispatchEvent(new CustomEvent("v-chat-scroll-scrolled-up", { detail: true }));
      } else if (hadScrolledBeforeEvent && ! scrolled) {
        el.dispatchEvent(new CustomEvent("v-chat-scroll-scrolled-up", { detail: false }));
      }
    });

    (new MutationObserver(e => {
      if (scrolled) return;

      scrollToBottom(el);
    })).observe(el, { childList: true, subtree: false });

    (new ResizeObserver(e => {
      if (scrolled) return;

      scrollToBottom(el);
    })).observe(el);
  },
  inserted: (el, binding) => {
    const config = binding.value || {};
    scrollToBottom(el, config.notSmoothOnInit ? false : config.smooth);
  },
};

export default vChatScroll;
