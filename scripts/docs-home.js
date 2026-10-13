/*
 * Docs homepage: send the Ask AI box and the "Try" questions to the AI
 * Assistant (getting-started/introduction.mdx).
 *
 * The platform has no API for opening the assistant with a question, so this
 * does what a reader would: clicks the visible "Ask AI" button, types the
 * question into the assistant's message box, and presses Enter. If any of
 * that is missing, it gives up quietly: a "Try" question then follows its
 * link to the page that answers it, and the box focuses the assistant if it
 * could open it.
 *
 * Listeners sit on the document, so they survive the docs' client-side
 * navigation and do nothing on pages without a `[data-dh-ask]` form.
 */
(function () {
  var MESSAGE_BOX = 'textarea[placeholder="Write a message..."]';

  function isVisible(el) {
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  // The platform's own Ask AI button: in the header on a wide screen, floating at the foot on a narrow one.
  function findAskButton() {
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      if (b.closest(".dh-home")) continue;
      if (/^\s*Ask AI\s*$/i.test(b.textContent) && isVisible(b)) return b;
    }
    return null;
  }

  function findMessageBox() {
    var boxes = document.querySelectorAll(MESSAGE_BOX);
    for (var i = 0; i < boxes.length; i++) {
      if (isVisible(boxes[i])) return boxes[i];
    }
    return null;
  }

  function waitFor(find, timeout) {
    return new Promise(function (resolve) {
      var start = Date.now();
      (function poll() {
        var found = find();
        if (found || Date.now() - start > timeout) return resolve(found);
        setTimeout(poll, 50);
      })();
    });
  }

  // Resolves true once the question is sent, false if the assistant could not be reached.
  function ask(question) {
    var box = findMessageBox();
    if (!box) {
      var button = findAskButton();
      if (!button) return Promise.resolve(false);
      button.click();
    }
    return waitFor(findMessageBox, 3000).then(function (box) {
      if (!box) return false;
      if (!question) {
        box.focus();
        return true;
      }
      // The box is a React-controlled textarea: set its value through the native setter so React sees the change.
      var setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
      setValue.call(box, question);
      box.dispatchEvent(new Event("input", { bubbles: true }));
      box.focus();
      setTimeout(function () {
        box.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true })
        );
      }, 100);
      return true;
    });
  }

  document.addEventListener("submit", function (event) {
    var form = event.target.closest && event.target.closest("[data-dh-ask]");
    if (!form) return;
    event.preventDefault();
    var input = form.querySelector('input[name="q"]');
    var question = input ? input.value.trim() : "";
    ask(question).then(function (sent) {
      if (sent && input) input.value = "";
    });
  });

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest && event.target.closest("[data-dh-question]");
    if (!link) return;
    event.preventDefault();
    ask(link.getAttribute("data-dh-question")).then(function (sent) {
      if (!sent) window.location.href = link.href;
    });
  });
})();
