let el = null;
let hasScrolled = false;
let threshold = 100;

const vChatScroll = {
  bind: (element, onScrolledUp) => {
    el = element;

    setTimeout(scrollToBottom, 100);

    el.addEventListener('scroll', e => {
      const hadScrolledBeforeEvent = hasScrolled;
      hasScrolled = el.scrollTop + el.clientHeight < el.scrollHeight - threshold;

      if (! hadScrolledBeforeEvent && hasScrolled) {
        onScrolledUp(true)
      } else if (hadScrolledBeforeEvent && ! hasScrolled) {
        onScrolledUp(false)
      }
    });

    el.addEventListener('mouseup', e => {
      if (e.target.tagName !== 'SPAN') {
        App.$bus.emit('CreateChatMessage/focus');
      }
    });

    (new ResizeObserver(e => {
      scrollToBottom();
    })).observe(el);

    (new MutationObserver(e => {
      scrollToBottom();
    })).observe(el, { childList: true, subtree: true });
  },
};

const scrollToBottom = (force = false) => {
  if (hasScrolled && ! force) return;

  el.scrollTop = el.scrollHeight - el.clientHeight;
};

export default vChatScroll;
