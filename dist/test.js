/*
Trix 2.1.12
Copyright © 2025 37signals, LLC
 */
var name = "trix";
var version = "2.1.12";
var description = "A rich text editor for everyday writing";
var main = "dist/trix.umd.min.js";
var module = "dist/trix.esm.min.js";
var style = "dist/trix.css";
var files = [
	"dist/*.css",
	"dist/*.js",
	"dist/*.map",
	"src/{inspector,trix}/*.js"
];
var repository = {
	type: "git",
	url: "git+https://github.com/basecamp/trix.git"
};
var keywords = [
	"rich text",
	"wysiwyg",
	"editor"
];
var author = "37signals, LLC";
var license = "MIT";
var bugs = {
	url: "https://github.com/basecamp/trix/issues"
};
var homepage = "https://trix-editor.org/";
var devDependencies = {
	"@babel/core": "^7.16.0",
	"@babel/preset-env": "^7.16.4",
	"@rollup/plugin-babel": "^5.3.0",
	"@rollup/plugin-commonjs": "^22.0.2",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.3.0",
	"@web/dev-server": "^0.1.34",
	"babel-eslint": "^10.1.0",
	chokidar: "^4.0.2",
	concurrently: "^7.4.0",
	eslint: "^7.32.0",
	esm: "^3.2.25",
	karma: "6.4.1",
	"karma-chrome-launcher": "3.2.0",
	"karma-qunit": "^4.1.2",
	"karma-sauce-launcher": "^4.3.6",
	qunit: "2.19.1",
	rangy: "^1.3.0",
	rollup: "^2.56.3",
	"rollup-plugin-includepaths": "^0.2.4",
	"rollup-plugin-terser": "^7.0.2",
	sass: "^1.83.0",
	svgo: "^2.8.0",
	webdriverio: "^7.19.5"
};
var resolutions = {
	webdriverio: "^7.19.5"
};
var scripts = {
	"build-css": "bin/sass-build assets/trix.scss dist/trix.css",
	"build-js": "rollup -c",
	"build-assets": "cp -f assets/*.html dist/",
	build: "yarn run build-js && yarn run build-css && yarn run build-assets",
	watch: "rollup -c -w",
	lint: "eslint .",
	pretest: "yarn run lint && yarn run build",
	test: "karma start",
	prerelease: "yarn version && yarn test",
	release: "npm adduser && npm publish",
	postrelease: "git push && git push --tags",
	dev: "web-dev-server --app-index index.html  --root-dir dist --node-resolve --open",
	start: "yarn build-assets && concurrently --kill-others --names js,css,dev-server 'yarn watch' 'yarn build-css --watch' 'yarn dev'"
};
var dependencies = {
	dompurify: "^3.2.3"
};
var _package = {
	name: name,
	version: version,
	description: description,
	main: main,
	module: module,
	style: style,
	files: files,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	resolutions: resolutions,
	scripts: scripts,
	dependencies: dependencies
};

const attachmentSelector = "[data-trix-attachment]";
const attachments = {
  preview: {
    presentation: "gallery",
    caption: {
      name: true,
      size: true
    }
  },
  file: {
    caption: {
      size: true
    }
  }
};

const attributes = {
  default: {
    tagName: "div",
    parse: false
  },
  textstart: {
    tagName: "div",
    className: "text-start",
    terminal: true,
    breakOnReturn: true
  },
  textcenter: {
    tagName: "div",
    className: "text-center",
    terminal: true,
    breakOnReturn: true
  },
  textend: {
    tagName: "div",
    className: "text-end",
    terminal: true,
    breakOnReturn: true
  },
  quote: {
    tagName: "blockquote",
    nestable: true
  },
  heading1: {
    tagName: "h1",
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  heading2: {
    tagName: 'h2',
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  heading3: {
    tagName: 'h3',
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  heading4: {
    tagName: 'h4',
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  heading5: {
    tagName: 'h5',
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  heading6: {
    tagName: 'h6',
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  code: {
    tagName: "pre",
    terminal: true,
    htmlAttributes: ["language"],
    text: {
      plaintext: true
    }
  },
  bulletList: {
    tagName: "ul",
    parse: false
  },
  bullet: {
    tagName: "li",
    listAttribute: "bulletList",
    group: false,
    nestable: true,
    test(element) {
      return tagName$1(element.parentNode) === attributes[this.listAttribute].tagName;
    }
  },
  numberList: {
    tagName: "ol",
    parse: false
  },
  number: {
    tagName: "li",
    listAttribute: "numberList",
    group: false,
    nestable: true,
    test(element) {
      return tagName$1(element.parentNode) === attributes[this.listAttribute].tagName;
    }
  },
  attachmentGallery: {
    tagName: "div",
    exclusive: true,
    terminal: true,
    parse: false,
    group: false
  }
};
const tagName$1 = element => {
  var _element$tagName;
  return element === null || element === void 0 || (_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toLowerCase();
};

const androidVersionMatch = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i);
const androidVersion = androidVersionMatch && parseInt(androidVersionMatch[1]);
var browser$1 = {
  // Android emits composition events when moving the cursor through existing text
  // Introduced in Chrome 65: https://bugs.chromium.org/p/chromium/issues/detail?id=764439#c9
  composesExistingText: /Android.*Chrome/.test(navigator.userAgent),
  // Android 13, especially on Samsung keyboards, emits extra compositionend and beforeinput events
  // that can make the input handler lose the current selection or enter an infinite input -> render -> input
  // loop.
  recentAndroid: androidVersion && androidVersion > 12,
  samsungAndroid: androidVersion && navigator.userAgent.match(/Android.*SM-/),
  // IE 11 activates resizing handles on editable elements that have "layout"
  forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent),
  // https://www.w3.org/TR/input-events-1/ + https://www.w3.org/TR/input-events-2/
  supportsInputEvents: typeof InputEvent !== "undefined" && ["data", "getTargetRanges", "inputType"].every(prop => prop in InputEvent.prototype)
};

var css$4 = {
  attachment: "attachment",
  attachmentCaption: "attachment__caption",
  attachmentCaptionEditor: "attachment__caption-editor",
  attachmentMetadata: "attachment__metadata",
  attachmentMetadataContainer: "attachment__metadata-container",
  attachmentName: "attachment__name",
  attachmentProgress: "attachment__progress",
  attachmentSize: "attachment__size",
  attachmentToolbar: "attachment__toolbar",
  attachmentGallery: "attachment-gallery"
};

var dompurify = {
  ADD_ATTR: ["language"],
  SAFE_FOR_XML: false,
  RETURN_DOM: true
};

var lang$1 = {
  attachFiles: "Attach Files",
  bold: "Bold",
  bullets: "Bullets",
  byte: "Byte",
  bytes: "Bytes",
  captionPlaceholder: "Add a caption…",
  code: "Code",
  heading1: "Heading",
  indent: "Increase Level",
  italic: "Italic",
  link: "Link",
  numbers: "Numbers",
  outdent: "Decrease Level",
  quote: "Quote",
  redo: "Redo",
  remove: "Remove",
  strike: "Strikethrough",
  undo: "Undo",
  unlink: "Unlink",
  url: "URL",
  urlPlaceholder: "Enter a URL…",
  GB: "GB",
  KB: "KB",
  MB: "MB",
  PB: "PB",
  TB: "TB"
};

/* eslint-disable
    no-case-declarations,
*/
const sizes = [lang$1.bytes, lang$1.KB, lang$1.MB, lang$1.GB, lang$1.TB, lang$1.PB];
var file_size_formatting = {
  prefix: "IEC",
  precision: 2,
  formatter(number) {
    switch (number) {
      case 0:
        return "0 ".concat(lang$1.bytes);
      case 1:
        return "1 ".concat(lang$1.byte);
      default:
        let base;
        if (this.prefix === "SI") {
          base = 1000;
        } else if (this.prefix === "IEC") {
          base = 1024;
        }
        const exp = Math.floor(Math.log(number) / Math.log(base));
        const humanSize = number / Math.pow(base, exp);
        const string = humanSize.toFixed(this.precision);
        const withoutInsignificantZeros = string.replace(/0*$/, "").replace(/\.$/, "");
        return "".concat(withoutInsignificantZeros, " ").concat(sizes[exp]);
    }
  }
};

const ZERO_WIDTH_SPACE = "\uFEFF";
const NON_BREAKING_SPACE = "\u00A0";
const OBJECT_REPLACEMENT_CHARACTER = "\uFFFC";

const extend$1 = function (properties) {
  for (const key in properties) {
    const value = properties[key];
    this[key] = value;
  }
  return this;
};

const html$2 = document.documentElement;
const match = html$2.matches;
const handleEvent = function (eventName) {
  let {
    onElement,
    matchingSelector,
    withCallback,
    inPhase,
    preventDefault,
    times
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const element = onElement ? onElement : html$2;
  const selector = matchingSelector;
  const useCapture = inPhase === "capturing";
  const handler = function (event) {
    if (times != null && --times === 0) {
      handler.destroy();
    }
    const target = findClosestElementFromNode(event.target, {
      matchingSelector: selector
    });
    if (target != null) {
      withCallback === null || withCallback === void 0 || withCallback.call(target, event, target);
      if (preventDefault) {
        event.preventDefault();
      }
    }
  };
  handler.destroy = () => element.removeEventListener(eventName, handler, useCapture);
  element.addEventListener(eventName, handler, useCapture);
  return handler;
};
const handleEventOnce = function (eventName) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.times = 1;
  return handleEvent(eventName, options);
};
const triggerEvent$1 = function (eventName) {
  let {
    onElement,
    bubbles,
    cancelable,
    attributes
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const element = onElement != null ? onElement : html$2;
  bubbles = bubbles !== false;
  cancelable = cancelable !== false;
  const event = document.createEvent("Events");
  event.initEvent(eventName, bubbles, cancelable);
  if (attributes != null) {
    extend$1.call(event, attributes);
  }
  return element.dispatchEvent(event);
};
const elementMatchesSelector = function (element, selector) {
  if ((element === null || element === void 0 ? void 0 : element.nodeType) === 1) {
    return match.call(element, selector);
  }
};
const findClosestElementFromNode = function (node) {
  let {
    matchingSelector,
    untilNode
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  while (node && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }
  if (node == null) {
    return;
  }
  if (matchingSelector != null) {
    if (node.closest && untilNode == null) {
      return node.closest(matchingSelector);
    } else {
      while (node && node !== untilNode) {
        if (elementMatchesSelector(node, matchingSelector)) {
          return node;
        }
        node = node.parentNode;
      }
    }
  } else {
    return node;
  }
};
const findInnerElement = function (element) {
  while ((_element = element) !== null && _element !== void 0 && _element.firstElementChild) {
    var _element;
    element = element.firstElementChild;
  }
  return element;
};
const innerElementIsActive = element => document.activeElement !== element && elementContainsNode(element, document.activeElement);
const elementContainsNode = function (element, node) {
  if (!element || !node) {
    return;
  }
  while (node) {
    if (node === element) {
      return true;
    }
    node = node.parentNode;
  }
};
const findNodeFromContainerAndOffset = function (container, offset) {
  if (!container) {
    return;
  }
  if (container.nodeType === Node.TEXT_NODE) {
    return container;
  } else if (offset === 0) {
    return container.firstChild != null ? container.firstChild : container;
  } else {
    return container.childNodes.item(offset - 1);
  }
};
const findElementFromContainerAndOffset = function (container, offset) {
  const node = findNodeFromContainerAndOffset(container, offset);
  return findClosestElementFromNode(node);
};
const findChildIndexOfNode = function (node) {
  var _node;
  if (!((_node = node) !== null && _node !== void 0 && _node.parentNode)) {
    return;
  }
  let childIndex = 0;
  node = node.previousSibling;
  while (node) {
    childIndex++;
    node = node.previousSibling;
  }
  return childIndex;
};
const removeNode = node => {
  var _node$parentNode;
  return node === null || node === void 0 || (_node$parentNode = node.parentNode) === null || _node$parentNode === void 0 ? void 0 : _node$parentNode.removeChild(node);
};
const walkTree = function (tree) {
  let {
    onlyNodesOfType,
    usingFilter,
    expandEntityReferences
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const whatToShow = (() => {
    switch (onlyNodesOfType) {
      case "element":
        return NodeFilter.SHOW_ELEMENT;
      case "text":
        return NodeFilter.SHOW_TEXT;
      case "comment":
        return NodeFilter.SHOW_COMMENT;
      default:
        return NodeFilter.SHOW_ALL;
    }
  })();
  return document.createTreeWalker(tree, whatToShow, usingFilter != null ? usingFilter : null, expandEntityReferences === true);
};
const tagName = element => {
  var _element$tagName;
  return element === null || element === void 0 || (_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toLowerCase();
};
const makeElement = function (tag) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let key, value;
  if (typeof tag === "object") {
    options = tag;
    tag = options.tagName;
  } else {
    options = {
      attributes: options
    };
  }
  const element = document.createElement(tag);
  if (options.editable != null) {
    if (options.attributes == null) {
      options.attributes = {};
    }
    options.attributes.contenteditable = options.editable;
  }
  if (options.attributes) {
    for (key in options.attributes) {
      value = options.attributes[key];
      element.setAttribute(key, value);
    }
  }
  if (options.style) {
    for (key in options.style) {
      value = options.style[key];
      element.style[key] = value;
    }
  }
  if (options.data) {
    for (key in options.data) {
      value = options.data[key];
      element.dataset[key] = value;
    }
  }
  if (options.className) {
    options.className.split(" ").forEach(className => {
      element.classList.add(className);
    });
  }
  if (options.textContent) {
    element.textContent = options.textContent;
  }
  if (options.childNodes) {
    [].concat(options.childNodes).forEach(childNode => {
      element.appendChild(childNode);
    });
  }
  return element;
};
let blockTagNames = undefined;
const getBlockTagNames = function () {
  if (blockTagNames != null) {
    return blockTagNames;
  }
  blockTagNames = [];
  for (const key in attributes) {
    const attributes$1 = attributes[key];
    if (attributes$1.tagName) {
      blockTagNames.push(attributes$1.tagName);
    }
  }
  return blockTagNames;
};
const nodeIsBlockContainer = node => nodeIsBlockStartComment(node === null || node === void 0 ? void 0 : node.firstChild);
const nodeProbablyIsBlockContainer = function (node) {
  return getBlockTagNames().includes(tagName(node)) && !getBlockTagNames().includes(tagName(node.firstChild));
};
const nodeIsBlockStart = function (node) {
  let {
    strict
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    strict: true
  };
  if (strict) {
    return nodeIsBlockStartComment(node);
  } else {
    return nodeIsBlockStartComment(node) || !nodeIsBlockStartComment(node.firstChild) && nodeProbablyIsBlockContainer(node);
  }
};
const nodeIsBlockStartComment = node => nodeIsCommentNode(node) && (node === null || node === void 0 ? void 0 : node.data) === "block";
const nodeIsCommentNode = node => (node === null || node === void 0 ? void 0 : node.nodeType) === Node.COMMENT_NODE;
const nodeIsCursorTarget = function (node) {
  let {
    name
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!node) {
    return;
  }
  if (nodeIsTextNode(node)) {
    if (node.data === ZERO_WIDTH_SPACE) {
      if (name) {
        return node.parentNode.dataset.trixCursorTarget === name;
      } else {
        return true;
      }
    }
  } else {
    return nodeIsCursorTarget(node.firstChild);
  }
};
const nodeIsAttachmentElement = node => elementMatchesSelector(node, attachmentSelector);
const nodeIsEmptyTextNode = node => nodeIsTextNode(node) && (node === null || node === void 0 ? void 0 : node.data) === "";
const nodeIsTextNode = node => (node === null || node === void 0 ? void 0 : node.nodeType) === Node.TEXT_NODE;

const input = {
  level2Enabled: true,
  getLevel() {
    if (this.level2Enabled && browser$1.supportsInputEvents) {
      return 2;
    } else {
      return 0;
    }
  },
  pickFiles(callback) {
    const input = makeElement("input", {
      type: "file",
      multiple: true,
      hidden: true,
      id: this.fileInputId
    });
    input.addEventListener("change", () => {
      callback(input.files);
      removeNode(input);
    });
    removeNode(document.getElementById(this.fileInputId));
    document.body.appendChild(input);
    input.click();
  }
};

var key_names = {
  8: "backspace",
  9: "tab",
  13: "return",
  27: "escape",
  37: "left",
  39: "right",
  46: "delete",
  68: "d",
  72: "h",
  79: "o"
};

var parser = {
  removeBlankTableCells: false,
  tableCellSeparator: " | ",
  tableRowSeparator: "\n"
};

var text_attributes = {
  bold: {
    tagName: "strong",
    inheritable: true,
    parser(element) {
      const style = window.getComputedStyle(element);
      return style.fontWeight === "bold" || style.fontWeight >= 600;
    }
  },
  italic: {
    tagName: "em",
    inheritable: true,
    parser(element) {
      const style = window.getComputedStyle(element);
      return style.fontStyle === "italic";
    }
  },
  span: {
    tagName: "span",
    inheritable: true
  },
  href: {
    groupTagName: "a",
    parser(element) {
      const matchingSelector = "a:not(".concat(attachmentSelector, ")");
      const link = element.closest(matchingSelector);
      if (link) {
        return link.getAttribute("href");
      }
    }
  },
  strike: {
    tagName: "del",
    inheritable: true
  },
  frozen: {
    style: {
      backgroundColor: "highlight"
    }
  }
};

var toolbar = {
  getDefaultHTML() {
    return "<div class=\"trix-button-row\">\n      <span class=\"trix-button-group trix-button-group--text-tools\" data-trix-button-group=\"text-tools\">\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-bold\" data-trix-attribute=\"bold\" data-trix-key=\"b\" title=\"".concat(lang$1.bold, "\" tabindex=\"-1\">").concat(lang$1.bold, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-italic\" data-trix-attribute=\"italic\" data-trix-key=\"i\" title=\"").concat(lang$1.italic, "\" tabindex=\"-1\">").concat(lang$1.italic, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-strike\" data-trix-attribute=\"strike\" title=\"").concat(lang$1.strike, "\" tabindex=\"-1\">").concat(lang$1.strike, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-link\" data-trix-attribute=\"href\" data-trix-action=\"link\" data-trix-key=\"k\" title=\"").concat(lang$1.link, "\" tabindex=\"-1\">").concat(lang$1.link, "</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"span\">SPAN</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"textstart\">LEFT</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"textcenter\">CENTER</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"textend\">RIGHT</button>\n      </span>\n\n      <span class=\"trix-button-group trix-button-group--block-tools\" data-trix-button-group=\"block-tools\">\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-heading-1\" data-trix-attribute=\"heading1\" title=\"").concat(lang$1.heading1, "\" tabindex=\"-1\">").concat(lang$1.heading1, "</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"heading2\">h2</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"heading3\">h3</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"heading4\">h4</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"heading5\">h5</button>\n        <button type=\"button\" class=\"trix-button\" data-trix-attribute=\"heading6\">h6</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-quote\" data-trix-attribute=\"quote\" title=\"").concat(lang$1.quote, "\" tabindex=\"-1\">").concat(lang$1.quote, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-code\" data-trix-attribute=\"code\" title=\"").concat(lang$1.code, "\" tabindex=\"-1\">").concat(lang$1.code, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-bullet-list\" data-trix-attribute=\"bullet\" title=\"").concat(lang$1.bullets, "\" tabindex=\"-1\">").concat(lang$1.bullets, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-number-list\" data-trix-attribute=\"number\" title=\"").concat(lang$1.numbers, "\" tabindex=\"-1\">").concat(lang$1.numbers, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-decrease-nesting-level\" data-trix-action=\"decreaseNestingLevel\" title=\"").concat(lang$1.outdent, "\" tabindex=\"-1\">").concat(lang$1.outdent, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-increase-nesting-level\" data-trix-action=\"increaseNestingLevel\" title=\"").concat(lang$1.indent, "\" tabindex=\"-1\">").concat(lang$1.indent, "</button>\n      </span>\n\n      <span class=\"trix-button-group trix-button-group--file-tools\" data-trix-button-group=\"file-tools\">\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-attach\" data-trix-action=\"attachFiles\" title=\"").concat(lang$1.attachFiles, "\" tabindex=\"-1\">").concat(lang$1.attachFiles, "</button>\n      </span>\n\n      <span class=\"trix-button-group-spacer\"></span>\n\n      <span class=\"trix-button-group trix-button-group--history-tools\" data-trix-button-group=\"history-tools\">\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-undo\" data-trix-action=\"undo\" data-trix-key=\"z\" title=\"").concat(lang$1.undo, "\" tabindex=\"-1\">").concat(lang$1.undo, "</button>\n        <button type=\"button\" class=\"trix-button trix-button--icon trix-button--icon-redo\" data-trix-action=\"redo\" data-trix-key=\"shift+z\" title=\"").concat(lang$1.redo, "\" tabindex=\"-1\">").concat(lang$1.redo, "</button>\n      </span>\n    </div>\n\n    <div class=\"trix-dialogs\" data-trix-dialogs>\n      <div class=\"trix-dialog trix-dialog--link\" data-trix-dialog=\"href\" data-trix-dialog-attribute=\"href\">\n        <div class=\"trix-dialog__link-fields\">\n          <input type=\"text\" name=\"href\" class=\"trix-input trix-input--dialog\" placeholder=\"").concat(lang$1.urlPlaceholder, "\" aria-label=\"").concat(lang$1.url, "\" data-trix-validate-href required data-trix-input>\n          <div class=\"trix-button-group\">\n            <input type=\"button\" class=\"trix-button trix-button--dialog\" value=\"").concat(lang$1.link, "\" data-trix-method=\"setAttribute\">\n            <input type=\"button\" class=\"trix-button trix-button--dialog\" value=\"").concat(lang$1.unlink, "\" data-trix-method=\"removeAttribute\">\n          </div>\n        </div>\n      </div>\n    </div>");
  }
};

const undo = {
  interval: 5000
};

var config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  attachments: attachments,
  blockAttributes: attributes,
  browser: browser$1,
  css: css$4,
  dompurify: dompurify,
  fileSize: file_size_formatting,
  input: input,
  keyNames: key_names,
  lang: lang$1,
  parser: parser,
  textAttributes: text_attributes,
  toolbar: toolbar,
  undo: undo
});

class BasicObject {
  static proxyMethod(expression) {
    const {
      name,
      toMethod,
      toProperty,
      optional
    } = parseProxyMethodExpression(expression);
    this.prototype[name] = function () {
      let subject;
      let object;
      if (toMethod) {
        if (optional) {
          var _this$toMethod;
          object = (_this$toMethod = this[toMethod]) === null || _this$toMethod === void 0 ? void 0 : _this$toMethod.call(this);
        } else {
          object = this[toMethod]();
        }
      } else if (toProperty) {
        object = this[toProperty];
      }
      if (optional) {
        var _object;
        subject = (_object = object) === null || _object === void 0 ? void 0 : _object[name];
        if (subject) {
          return apply$1.call(subject, object, arguments);
        }
      } else {
        subject = object[name];
        return apply$1.call(subject, object, arguments);
      }
    };
  }
}
const parseProxyMethodExpression = function (expression) {
  const match = expression.match(proxyMethodExpressionPattern);
  if (!match) {
    throw new Error("can't parse @proxyMethod expression: ".concat(expression));
  }
  const args = {
    name: match[4]
  };
  if (match[2] != null) {
    args.toMethod = match[1];
  } else {
    args.toProperty = match[1];
  }
  if (match[3] != null) {
    args.optional = true;
  }
  return args;
};
const {
  apply: apply$1
} = Function.prototype;
const proxyMethodExpressionPattern = new RegExp("\
^\
(.+?)\
(\\(\\))?\
(\\?)?\
\\.\
(.+?)\
$\
");

var _Array$from, _$codePointAt$1, _$1, _String$fromCodePoint;
class UTF16String extends BasicObject {
  static box() {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    if (value instanceof this) {
      return value;
    } else {
      return this.fromUCS2String(value === null || value === void 0 ? void 0 : value.toString());
    }
  }
  static fromUCS2String(ucs2String) {
    return new this(ucs2String, ucs2decode(ucs2String));
  }
  static fromCodepoints(codepoints) {
    return new this(ucs2encode(codepoints), codepoints);
  }
  constructor(ucs2String, codepoints) {
    super(...arguments);
    this.ucs2String = ucs2String;
    this.codepoints = codepoints;
    this.length = this.codepoints.length;
    this.ucs2Length = this.ucs2String.length;
  }
  offsetToUCS2Offset(offset) {
    return ucs2encode(this.codepoints.slice(0, Math.max(0, offset))).length;
  }
  offsetFromUCS2Offset(ucs2Offset) {
    return ucs2decode(this.ucs2String.slice(0, Math.max(0, ucs2Offset))).length;
  }
  slice() {
    return this.constructor.fromCodepoints(this.codepoints.slice(...arguments));
  }
  charAt(offset) {
    return this.slice(offset, offset + 1);
  }
  isEqualTo(value) {
    return this.constructor.box(value).ucs2String === this.ucs2String;
  }
  toJSON() {
    return this.ucs2String;
  }
  getCacheKey() {
    return this.ucs2String;
  }
  toString() {
    return this.ucs2String;
  }
}
const hasArrayFrom = ((_Array$from = Array.from) === null || _Array$from === void 0 ? void 0 : _Array$from.call(Array, "\ud83d\udc7c").length) === 1;
const hasStringCodePointAt$1 = ((_$codePointAt$1 = (_$1 = " ").codePointAt) === null || _$codePointAt$1 === void 0 ? void 0 : _$codePointAt$1.call(_$1, 0)) != null;
const hasStringFromCodePoint = ((_String$fromCodePoint = String.fromCodePoint) === null || _String$fromCodePoint === void 0 ? void 0 : _String$fromCodePoint.call(String, 32, 128124)) === " \ud83d\udc7c";

// UCS-2 conversion helpers ported from Mathias Bynens' Punycode.js:
// https://github.com/bestiejs/punycode.js#punycodeucs2

let ucs2decode, ucs2encode;

// Creates an array containing the numeric code points of each Unicode
// character in the string. While JavaScript uses UCS-2 internally,
// this function will convert a pair of surrogate halves (each of which
// UCS-2 exposes as separate characters) into a single code point,
// matching UTF-16.
if (hasArrayFrom && hasStringCodePointAt$1) {
  ucs2decode = string => Array.from(string).map(char => char.codePointAt(0));
} else {
  ucs2decode = function (string) {
    const output = [];
    let counter = 0;
    const {
      length
    } = string;
    while (counter < length) {
      let value = string.charCodeAt(counter++);
      if (0xd800 <= value && value <= 0xdbff && counter < length) {
        // high surrogate, and there is a next character
        const extra = string.charCodeAt(counter++);
        if ((extra & 0xfc00) === 0xdc00) {
          // low surrogate
          value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
        } else {
          // unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair
          counter--;
        }
      }
      output.push(value);
    }
    return output;
  };
}

// Creates a string based on an array of numeric code points.
if (hasStringFromCodePoint) {
  ucs2encode = array => String.fromCodePoint(...Array.from(array || []));
} else {
  ucs2encode = function (array) {
    const characters = (() => {
      const result = [];
      Array.from(array).forEach(value => {
        let output = "";
        if (value > 0xffff) {
          value -= 0x10000;
          output += String.fromCharCode(value >>> 10 & 0x3ff | 0xd800);
          value = 0xdc00 | value & 0x3ff;
        }
        result.push(output + String.fromCharCode(value));
      });
      return result;
    })();
    return characters.join("");
  };
}

let id$2 = 0;
class TrixObject extends BasicObject {
  static fromJSONString(jsonString) {
    return this.fromJSON(JSON.parse(jsonString));
  }
  constructor() {
    super(...arguments);
    this.id = ++id$2;
  }
  hasSameConstructorAs(object) {
    return this.constructor === (object === null || object === void 0 ? void 0 : object.constructor);
  }
  isEqualTo(object) {
    return this === object;
  }
  inspect() {
    const parts = [];
    const contents = this.contentsForInspection() || {};
    for (const key in contents) {
      const value = contents[key];
      parts.push("".concat(key, "=").concat(value));
    }
    return "#<".concat(this.constructor.name, ":").concat(this.id).concat(parts.length ? " ".concat(parts.join(", ")) : "", ">");
  }
  contentsForInspection() {}
  toJSONString() {
    return JSON.stringify(this);
  }
  toUTF16String() {
    return UTF16String.box(this);
  }
  getCacheKey() {
    return this.id.toString();
  }
}

/* eslint-disable
    id-length,
*/
const arraysAreEqual = function () {
  let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (a.length !== b.length) {
    return false;
  }
  for (let index = 0; index < a.length; index++) {
    const value = a[index];
    if (value !== b[index]) {
      return false;
    }
  }
  return true;
};
const arrayStartsWith = function () {
  let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return arraysAreEqual(a.slice(0, b.length), b);
};
const spliceArray = function (array) {
  const result = array.slice(0);
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  result.splice(...args);
  return result;
};
const summarizeArrayChange = function () {
  let oldArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let newArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const added = [];
  const removed = [];
  const existingValues = new Set();
  oldArray.forEach(value => {
    existingValues.add(value);
  });
  const currentValues = new Set();
  newArray.forEach(value => {
    currentValues.add(value);
    if (!existingValues.has(value)) {
      added.push(value);
    }
  });
  oldArray.forEach(value => {
    if (!currentValues.has(value)) {
      removed.push(value);
    }
  });
  return {
    added,
    removed
  };
};

// https://github.com/mathiasbynens/unicode-2.1.8/blob/master/Bidi_Class/Right_To_Left/regex.js
const RTL_PATTERN = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/;
const getDirection = function () {
  const input = makeElement("input", {
    dir: "auto",
    name: "x",
    dirName: "x.dir"
  });
  const textArea = makeElement("textarea", {
    dir: "auto",
    name: "y",
    dirName: "y.dir"
  });
  const form = makeElement("form");
  form.appendChild(input);
  form.appendChild(textArea);
  const supportsDirName = function () {
    try {
      return new FormData(form).has(textArea.dirName);
    } catch (error) {
      return false;
    }
  }();
  const supportsDirSelector = function () {
    try {
      return input.matches(":dir(ltr),:dir(rtl)");
    } catch (error) {
      return false;
    }
  }();
  if (supportsDirName) {
    return function (string) {
      textArea.value = string;
      return new FormData(form).get(textArea.dirName);
    };
  } else if (supportsDirSelector) {
    return function (string) {
      input.value = string;
      if (input.matches(":dir(rtl)")) {
        return "rtl";
      } else {
        return "ltr";
      }
    };
  } else {
    return function (string) {
      const char = string.trim().charAt(0);
      if (RTL_PATTERN.test(char)) {
        return "rtl";
      } else {
        return "ltr";
      }
    };
  }
}();

let allAttributeNames = null;
let blockAttributeNames = null;
let textAttributeNames = null;
let listAttributeNames = null;
const getAllAttributeNames = () => {
  if (!allAttributeNames) {
    allAttributeNames = getTextAttributeNames().concat(getBlockAttributeNames());
  }
  return allAttributeNames;
};
const getBlockConfig = attributeName => attributes[attributeName];
const getBlockAttributeNames = () => {
  if (!blockAttributeNames) {
    blockAttributeNames = Object.keys(attributes);
  }
  return blockAttributeNames;
};
const getTextConfig = attributeName => text_attributes[attributeName];
const getTextAttributeNames = () => {
  if (!textAttributeNames) {
    textAttributeNames = Object.keys(text_attributes);
  }
  return textAttributeNames;
};
const getListAttributeNames = () => {
  if (!listAttributeNames) {
    listAttributeNames = [];
    for (const key in attributes) {
      const {
        listAttribute
      } = attributes[key];
      if (listAttribute != null) {
        listAttributeNames.push(listAttribute);
      }
    }
  }
  return listAttributeNames;
};

/* eslint-disable
*/
const installDefaultCSSForTagName = function (tagName, defaultCSS) {
  const styleElement = insertStyleElementForTagName(tagName);
  styleElement.textContent = defaultCSS.replace(/%t/g, tagName);
};
const insertStyleElementForTagName = function (tagName) {
  const element = document.createElement("style");
  element.setAttribute("type", "text/css");
  element.setAttribute("data-tag-name", tagName.toLowerCase());
  const nonce = getCSPNonce();
  if (nonce) {
    element.setAttribute("nonce", nonce);
  }
  document.head.insertBefore(element, document.head.firstChild);
  return element;
};
const getCSPNonce = function () {
  const element = getMetaElement("trix-csp-nonce") || getMetaElement("csp-nonce");
  if (element) {
    const {
      nonce,
      content
    } = element;
    return nonce == "" ? content : nonce;
  }
};
const getMetaElement = name => document.head.querySelector("meta[name=".concat(name, "]"));

const testTransferData = {
  "application/x-trix-feature-detection": "test"
};
const dataTransferIsPlainText = function (dataTransfer) {
  const text = dataTransfer.getData("text/plain");
  const html = dataTransfer.getData("text/html");
  if (text && html) {
    const {
      body
    } = new DOMParser().parseFromString(html, "text/html");
    if (body.textContent === text) {
      return !body.querySelector("*");
    }
  } else {
    return text === null || text === void 0 ? void 0 : text.length;
  }
};
const dataTransferIsMsOfficePaste = _ref => {
  let {
    dataTransfer
  } = _ref;
  return dataTransfer.types.includes("Files") && dataTransfer.types.includes("text/html") && dataTransfer.getData("text/html").includes("urn:schemas-microsoft-com:office:office");
};
const dataTransferIsWritable = function (dataTransfer) {
  if (!(dataTransfer !== null && dataTransfer !== void 0 && dataTransfer.setData)) return false;
  for (const key in testTransferData) {
    const value = testTransferData[key];
    try {
      dataTransfer.setData(key, value);
      if (!dataTransfer.getData(key) === value) return false;
    } catch (error) {
      return false;
    }
  }
  return true;
};
const keyEventIsKeyboardCommand = function () {
  if (/Mac|^iP/.test(navigator.platform)) {
    return event => event.metaKey;
  } else {
    return event => event.ctrlKey;
  }
}();
function shouldRenderInmmediatelyToDealWithIOSDictation(inputEvent) {
  if (/iPhone|iPad/.test(navigator.userAgent)) {
    // Handle garbled content and duplicated newlines when using dictation on iOS 18+. Upon dictation completion, iOS sends
    // the list of insertText / insertParagraph events in a quick sequence. If we don't render
    // the editor synchronously, the internal range fails to update and results in garbled content or duplicated newlines.
    //
    // This workaround is necessary because iOS doesn't send composing events as expected while dictating:
    // https://bugs.webkit.org/show_bug.cgi?id=261764
    return !inputEvent.inputType || inputEvent.inputType === "insertParagraph";
  } else {
    return false;
  }
}

const defer = fn => setTimeout(fn, 1);

/* eslint-disable
    id-length,
*/
const copyObject = function () {
  let object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const result = {};
  for (const key in object) {
    const value = object[key];
    result[key] = value;
  }
  return result;
};
const objectsAreEqual = function () {
  let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    const value = a[key];
    if (value !== b[key]) {
      return false;
    }
  }
  return true;
};

const normalizeRange = function (range) {
  if (range == null) return;
  if (!Array.isArray(range)) {
    range = [range, range];
  }
  return [copyValue(range[0]), copyValue(range[1] != null ? range[1] : range[0])];
};
const rangeIsCollapsed = function (range) {
  if (range == null) return;
  const [start, end] = normalizeRange(range);
  return rangeValuesAreEqual(start, end);
};
const rangesAreEqual = function (leftRange, rightRange) {
  if (leftRange == null || rightRange == null) return;
  const [leftStart, leftEnd] = normalizeRange(leftRange);
  const [rightStart, rightEnd] = normalizeRange(rightRange);
  return rangeValuesAreEqual(leftStart, rightStart) && rangeValuesAreEqual(leftEnd, rightEnd);
};
const copyValue = function (value) {
  if (typeof value === "number") {
    return value;
  } else {
    return copyObject(value);
  }
};
const rangeValuesAreEqual = function (left, right) {
  if (typeof left === "number") {
    return left === right;
  } else {
    return objectsAreEqual(left, right);
  }
};

class SelectionChangeObserver extends BasicObject {
  constructor() {
    super(...arguments);
    this.update = this.update.bind(this);
    this.selectionManagers = [];
  }
  start() {
    if (!this.started) {
      this.started = true;
      document.addEventListener("selectionchange", this.update, true);
    }
  }
  stop() {
    if (this.started) {
      this.started = false;
      return document.removeEventListener("selectionchange", this.update, true);
    }
  }
  registerSelectionManager(selectionManager) {
    if (!this.selectionManagers.includes(selectionManager)) {
      this.selectionManagers.push(selectionManager);
      return this.start();
    }
  }
  unregisterSelectionManager(selectionManager) {
    this.selectionManagers = this.selectionManagers.filter(sm => sm !== selectionManager);
    if (this.selectionManagers.length === 0) {
      return this.stop();
    }
  }
  notifySelectionManagersOfSelectionChange() {
    return this.selectionManagers.map(selectionManager => selectionManager.selectionDidChange());
  }
  update() {
    this.notifySelectionManagersOfSelectionChange();
  }
  reset() {
    this.update();
  }
}
const selectionChangeObserver = new SelectionChangeObserver();
const getDOMSelection = function () {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    return selection;
  }
};
const getDOMRange = function () {
  var _getDOMSelection;
  const domRange = (_getDOMSelection = getDOMSelection()) === null || _getDOMSelection === void 0 ? void 0 : _getDOMSelection.getRangeAt(0);
  if (domRange) {
    if (!domRangeIsPrivate(domRange)) {
      return domRange;
    }
  }
};
const setDOMRange = function (domRange) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(domRange);
  return selectionChangeObserver.update();
};

// In Firefox, clicking certain <input> elements changes the selection to a
// private element used to draw its UI. Attempting to access properties of those
// elements throws an error.
// https://bugzilla.mozilla.org/show_bug.cgi?id=208427
const domRangeIsPrivate = domRange => nodeIsPrivate(domRange.startContainer) || nodeIsPrivate(domRange.endContainer);
const nodeIsPrivate = node => !Object.getPrototypeOf(node);

/* eslint-disable
    id-length,
    no-useless-escape,
*/
const normalizeSpaces = string => string.replace(new RegExp("".concat(ZERO_WIDTH_SPACE), "g"), "").replace(new RegExp("".concat(NON_BREAKING_SPACE), "g"), " ");
const normalizeNewlines = string => string.replace(/\r\n?/g, "\n");
const breakableWhitespacePattern = new RegExp("[^\\S".concat(NON_BREAKING_SPACE, "]"));
const squishBreakableWhitespace = string => string
// Replace all breakable whitespace characters with a space
.replace(new RegExp("".concat(breakableWhitespacePattern.source), "g"), " ")
// Replace two or more spaces with a single space
.replace(/\ {2,}/g, " ");
const summarizeStringChange = function (oldString, newString) {
  let added, removed;
  oldString = UTF16String.box(oldString);
  newString = UTF16String.box(newString);
  if (newString.length < oldString.length) {
    [removed, added] = utf16StringDifferences(oldString, newString);
  } else {
    [added, removed] = utf16StringDifferences(newString, oldString);
  }
  return {
    added,
    removed
  };
};
const utf16StringDifferences = function (a, b) {
  if (a.isEqualTo(b)) {
    return ["", ""];
  }
  const diffA = utf16StringDifference(a, b);
  const {
    length
  } = diffA.utf16String;
  let diffB;
  if (length) {
    const {
      offset
    } = diffA;
    const codepoints = a.codepoints.slice(0, offset).concat(a.codepoints.slice(offset + length));
    diffB = utf16StringDifference(b, UTF16String.fromCodepoints(codepoints));
  } else {
    diffB = utf16StringDifference(b, a);
  }
  return [diffA.utf16String.toString(), diffB.utf16String.toString()];
};
const utf16StringDifference = function (a, b) {
  let leftIndex = 0;
  let rightIndexA = a.length;
  let rightIndexB = b.length;
  while (leftIndex < rightIndexA && a.charAt(leftIndex).isEqualTo(b.charAt(leftIndex))) {
    leftIndex++;
  }
  while (rightIndexA > leftIndex + 1 && a.charAt(rightIndexA - 1).isEqualTo(b.charAt(rightIndexB - 1))) {
    rightIndexA--;
    rightIndexB--;
  }
  return {
    utf16String: a.slice(leftIndex, rightIndexA),
    offset: leftIndex
  };
};

class Hash extends TrixObject {
  static fromCommonAttributesOfObjects() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (!objects.length) {
      return new this();
    }
    let hash = box(objects[0]);
    let keys = hash.getKeys();
    objects.slice(1).forEach(object => {
      keys = hash.getKeysCommonToHash(box(object));
      hash = hash.slice(keys);
    });
    return hash;
  }
  static box(values) {
    return box(values);
  }
  constructor() {
    let values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(...arguments);
    this.values = copy(values);
  }
  add(key, value) {
    return this.merge(object(key, value));
  }
  remove(key) {
    return new Hash(copy(this.values, key));
  }
  get(key) {
    return this.values[key];
  }
  has(key) {
    return key in this.values;
  }
  merge(values) {
    return new Hash(merge(this.values, unbox(values)));
  }
  slice(keys) {
    const values = {};
    Array.from(keys).forEach(key => {
      if (this.has(key)) {
        values[key] = this.values[key];
      }
    });
    return new Hash(values);
  }
  getKeys() {
    return Object.keys(this.values);
  }
  getKeysCommonToHash(hash) {
    hash = box(hash);
    return this.getKeys().filter(key => this.values[key] === hash.values[key]);
  }
  isEqualTo(values) {
    return arraysAreEqual(this.toArray(), box(values).toArray());
  }
  isEmpty() {
    return this.getKeys().length === 0;
  }
  toArray() {
    if (!this.array) {
      const result = [];
      for (const key in this.values) {
        const value = this.values[key];
        result.push(result.push(key, value));
      }
      this.array = result.slice(0);
    }
    return this.array;
  }
  toObject() {
    return copy(this.values);
  }
  toJSON() {
    return this.toObject();
  }
  contentsForInspection() {
    return {
      values: JSON.stringify(this.values)
    };
  }
}
const object = function (key, value) {
  const result = {};
  result[key] = value;
  return result;
};
const merge = function (object, values) {
  const result = copy(object);
  for (const key in values) {
    const value = values[key];
    result[key] = value;
  }
  return result;
};
const copy = function (object, keyToRemove) {
  const result = {};
  const sortedKeys = Object.keys(object).sort();
  sortedKeys.forEach(key => {
    if (key !== keyToRemove) {
      result[key] = object[key];
    }
  });
  return result;
};
const box = function (object) {
  if (object instanceof Hash) {
    return object;
  } else {
    return new Hash(object);
  }
};
const unbox = function (object) {
  if (object instanceof Hash) {
    return object.values;
  } else {
    return object;
  }
};

class ObjectGroup {
  static groupObjects() {
    let ungroupedObjects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let {
      depth,
      asTree
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let group;
    if (asTree) {
      if (depth == null) {
        depth = 0;
      }
    }
    const objects = [];
    Array.from(ungroupedObjects).forEach(object => {
      var _object$canBeGrouped2;
      if (group) {
        var _object$canBeGrouped, _group$canBeGroupedWi, _group;
        if ((_object$canBeGrouped = object.canBeGrouped) !== null && _object$canBeGrouped !== void 0 && _object$canBeGrouped.call(object, depth) && (_group$canBeGroupedWi = (_group = group[group.length - 1]).canBeGroupedWith) !== null && _group$canBeGroupedWi !== void 0 && _group$canBeGroupedWi.call(_group, object, depth)) {
          group.push(object);
          return;
        } else {
          objects.push(new this(group, {
            depth,
            asTree
          }));
          group = null;
        }
      }
      if ((_object$canBeGrouped2 = object.canBeGrouped) !== null && _object$canBeGrouped2 !== void 0 && _object$canBeGrouped2.call(object, depth)) {
        group = [object];
      } else {
        objects.push(object);
      }
    });
    if (group) {
      objects.push(new this(group, {
        depth,
        asTree
      }));
    }
    return objects;
  }
  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let {
      depth,
      asTree
    } = arguments.length > 1 ? arguments[1] : undefined;
    this.objects = objects;
    if (asTree) {
      this.depth = depth;
      this.objects = this.constructor.groupObjects(this.objects, {
        asTree,
        depth: this.depth + 1
      });
    }
  }
  getObjects() {
    return this.objects;
  }
  getDepth() {
    return this.depth;
  }
  getCacheKey() {
    const keys = ["objectGroup"];
    Array.from(this.getObjects()).forEach(object => {
      keys.push(object.getCacheKey());
    });
    return keys.join("/");
  }
}

class ObjectMap extends BasicObject {
  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    this.objects = {};
    Array.from(objects).forEach(object => {
      const hash = JSON.stringify(object);
      if (this.objects[hash] == null) {
        this.objects[hash] = object;
      }
    });
  }
  find(object) {
    const hash = JSON.stringify(object);
    return this.objects[hash];
  }
}

class ElementStore {
  constructor(elements) {
    this.reset(elements);
  }
  add(element) {
    const key = getKey(element);
    this.elements[key] = element;
  }
  remove(element) {
    const key = getKey(element);
    const value = this.elements[key];
    if (value) {
      delete this.elements[key];
      return value;
    }
  }
  reset() {
    let elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    this.elements = {};
    Array.from(elements).forEach(element => {
      this.add(element);
    });
    return elements;
  }
}
const getKey = element => element.dataset.trixStoreKey;

class Operation extends BasicObject {
  isPerforming() {
    return this.performing === true;
  }
  hasPerformed() {
    return this.performed === true;
  }
  hasSucceeded() {
    return this.performed && this.succeeded;
  }
  hasFailed() {
    return this.performed && !this.succeeded;
  }
  getPromise() {
    if (!this.promise) {
      this.promise = new Promise((resolve, reject) => {
        this.performing = true;
        return this.perform((succeeded, result) => {
          this.succeeded = succeeded;
          this.performing = false;
          this.performed = true;
          if (this.succeeded) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    }
    return this.promise;
  }
  perform(callback) {
    return callback(false);
  }
  release() {
    var _this$promise, _this$promise$cancel;
    (_this$promise = this.promise) === null || _this$promise === void 0 || (_this$promise$cancel = _this$promise.cancel) === null || _this$promise$cancel === void 0 || _this$promise$cancel.call(_this$promise);
    this.promise = null;
    this.performing = null;
    this.performed = null;
    this.succeeded = null;
  }
}
Operation.proxyMethod("getPromise().then");
Operation.proxyMethod("getPromise().catch");

class ObjectView extends BasicObject {
  constructor(object) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.object = object;
    this.options = options;
    this.childViews = [];
    this.rootView = this;
  }
  getNodes() {
    if (!this.nodes) {
      this.nodes = this.createNodes();
    }
    return this.nodes.map(node => node.cloneNode(true));
  }
  invalidate() {
    var _this$parentView;
    this.nodes = null;
    this.childViews = [];
    return (_this$parentView = this.parentView) === null || _this$parentView === void 0 ? void 0 : _this$parentView.invalidate();
  }
  invalidateViewForObject(object) {
    var _this$findViewForObje;
    return (_this$findViewForObje = this.findViewForObject(object)) === null || _this$findViewForObje === void 0 ? void 0 : _this$findViewForObje.invalidate();
  }
  findOrCreateCachedChildView(viewClass, object, options) {
    let view = this.getCachedViewForObject(object);
    if (view) {
      this.recordChildView(view);
    } else {
      view = this.createChildView(...arguments);
      this.cacheViewForObject(view, object);
    }
    return view;
  }
  createChildView(viewClass, object) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (object instanceof ObjectGroup) {
      options.viewClass = viewClass;
      viewClass = ObjectGroupView;
    }
    const view = new viewClass(object, options);
    return this.recordChildView(view);
  }
  recordChildView(view) {
    view.parentView = this;
    view.rootView = this.rootView;
    this.childViews.push(view);
    return view;
  }
  getAllChildViews() {
    let views = [];
    this.childViews.forEach(childView => {
      views.push(childView);
      views = views.concat(childView.getAllChildViews());
    });
    return views;
  }
  findElement() {
    return this.findElementForObject(this.object);
  }
  findElementForObject(object) {
    const id = object === null || object === void 0 ? void 0 : object.id;
    if (id) {
      return this.rootView.element.querySelector("[data-trix-id='".concat(id, "']"));
    }
  }
  findViewForObject(object) {
    for (const view of this.getAllChildViews()) {
      if (view.object === object) {
        return view;
      }
    }
  }
  getViewCache() {
    if (this.rootView === this) {
      if (this.isViewCachingEnabled()) {
        if (!this.viewCache) {
          this.viewCache = {};
        }
        return this.viewCache;
      }
    } else {
      return this.rootView.getViewCache();
    }
  }
  isViewCachingEnabled() {
    return this.shouldCacheViews !== false;
  }
  enableViewCaching() {
    this.shouldCacheViews = true;
  }
  disableViewCaching() {
    this.shouldCacheViews = false;
  }
  getCachedViewForObject(object) {
    var _this$getViewCache;
    return (_this$getViewCache = this.getViewCache()) === null || _this$getViewCache === void 0 ? void 0 : _this$getViewCache[object.getCacheKey()];
  }
  cacheViewForObject(view, object) {
    const cache = this.getViewCache();
    if (cache) {
      cache[object.getCacheKey()] = view;
    }
  }
  garbageCollectCachedViews() {
    const cache = this.getViewCache();
    if (cache) {
      const views = this.getAllChildViews().concat(this);
      const objectKeys = views.map(view => view.object.getCacheKey());
      for (const key in cache) {
        if (!objectKeys.includes(key)) {
          delete cache[key];
        }
      }
    }
  }
}
class ObjectGroupView extends ObjectView {
  constructor() {
    super(...arguments);
    this.objectGroup = this.object;
    this.viewClass = this.options.viewClass;
    delete this.options.viewClass;
  }
  getChildViews() {
    if (!this.childViews.length) {
      Array.from(this.objectGroup.getObjects()).forEach(object => {
        this.findOrCreateCachedChildView(this.viewClass, object, this.options);
      });
    }
    return this.childViews;
  }
  createNodes() {
    const element = this.createContainerElement();
    this.getChildViews().forEach(view => {
      Array.from(view.getNodes()).forEach(node => {
        element.appendChild(node);
      });
    });
    return [element];
  }
  createContainerElement() {
    let depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.objectGroup.getDepth();
    return this.getChildViews()[0].createContainerElement(depth);
  }
}

/*! @license DOMPurify 3.2.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.3/LICENSE */

const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object; // eslint-disable-line import/no-mutable-exports
let {
  apply,
  construct
} = typeof Reflect !== 'undefined' && Reflect;
if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply(fun, thisValue, args) {
    return fun.apply(thisValue, args);
  };
}
if (!construct) {
  construct = function construct(Func, args) {
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
 * Creates a new function that calls the given function with a specified thisArg and arguments.
 *
 * @param func - The function to be wrapped and called.
 * @returns A new function that calls the given function with a specified thisArg and arguments.
 */
function unapply(func) {
  return function (thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return apply(func, thisArg, args);
  };
}
/**
 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
 *
 * @param func - The constructor function to be wrapped and called.
 * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
 */
function unconstruct(func) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return construct(func, args);
  };
}
/**
 * Add properties to a lookup table
 *
 * @param set - The set to which elements will be added.
 * @param array - The array containing elements to be added to the set.
 * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
 * @returns The modified set with added elements.
 */
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === 'string') {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
/**
 * Clean up an array to harden against CSPP
 *
 * @param array - The array to be cleaned.
 * @returns The cleaned version of the array
 */
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
/**
 * Shallow clone an object
 *
 * @param object - The object to be cloned.
 * @returns A new object that copies the original.
 */
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
/**
 * This method automatically checks if the prop is function or getter and behaves accordingly.
 *
 * @param object - The object to look up the getter function in its prototype chain.
 * @param prop - The property name for which to find the getter function.
 * @returns The getter function found in the prototype chain or a fallback function.
 */
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);
const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);
// List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.
const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']);
// Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.
const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
const text = freeze(['#text']);
const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'popover', 'popovertarget', 'popovertargetaction', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'wrap', 'xmlns', 'slot']);
const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'amplitude', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'exponent', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'slope', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'tablevalues', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

// eslint-disable-next-line unicorn/better-regex
const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\$\{[\w\W]*}/gm); // eslint-disable-line unicorn/better-regex
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);

const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);

const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var EXPRESSIONS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ARIA_ATTR: ARIA_ATTR,
  ATTR_WHITESPACE: ATTR_WHITESPACE,
  CUSTOM_ELEMENT: CUSTOM_ELEMENT,
  DATA_ATTR: DATA_ATTR,
  DOCTYPE_NAME: DOCTYPE_NAME,
  ERB_EXPR: ERB_EXPR,
  IS_ALLOWED_URI: IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR: MUSTACHE_EXPR,
  TMPLIT_EXPR: TMPLIT_EXPR
});

/* eslint-disable @typescript-eslint/indent */
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12 // Deprecated
};

const getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param trustedTypes The policy factory.
 * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
 * @return The policy created (or null, if Trusted Types
 * are not supported or creating the policy failed).
 */
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  }
  // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.
  let suffix = null;
  const ATTR_NAME = 'data-tt-policy-suffix';
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html) {
        return html;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};
const _createHooksMap = function _createHooksMap() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
  const DOMPurify = root => createDOMPurify(root);
  DOMPurify.version = '3.2.3';
  DOMPurify.removed = [];
  if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document
  } = window;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  const remove = lookupGetter(ElementPrototype, 'remove');
  const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
  // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.
  if (typeof HTMLTemplateElement === 'function') {
    const template = document.createElement('template');
    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = '';
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */
  DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
  const {
    MUSTACHE_EXPR,
    ERB_EXPR,
    TMPLIT_EXPR,
    DATA_ATTR,
    ARIA_ATTR,
    IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE,
    CUSTOM_ELEMENT
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */
  /* allowed element names */
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  /* Allowed attribute names */
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  /*
   * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
  let FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
  let FORBID_ATTR = null;
  /* Decide if ARIA attributes are okay */
  let ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */
  let ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Decide if self-closing tags in attributes are allowed.
   * Usually removed due to a mXSS issue in jQuery 3.0 */
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */
  let SAFE_FOR_TEMPLATES = false;
  /* Output should be safe even for XML used within HTML and alike.
   * This means, DOMPurify removes comments when containing risky content.
   */
  let SAFE_FOR_XML = true;
  /* Decide if document with <html>... should be returned */
  let WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */
  let SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */
  let FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */
  let RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */
  let RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */
  let RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks?
   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
   */
  let SANITIZE_DOM = true;
  /* Achieve full DOM Clobbering protection by isolating the namespace of named
   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
   *
   * HTML/DOM spec rules that enable DOM Clobbering:
   *   - Named Access on Window (§7.3.3)
   *   - DOM Tree Accessors (§3.1.5)
   *   - Form Element Parent-Child Relations (§4.10.3)
   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
   *   - HTMLCollection (§4.2.10.2)
   *
   * Namespace isolation is implemented by prefixing `id` and `name` attributes
   * with a constant string, i.e., `user-content-`
   */
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
  /* Keep element content when removing element? */
  let KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */
  let IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */
  let USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
  /* Tags that are safe for data: URIs */
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
  const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  /* Allowed XHTML+XML namespaces */
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
  // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Parsing of strict XHTML documents */
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  let transformCaseFunc = null;
  /* Keep a reference to config to pass to hooks */
  let CONFIG = null;
  /* Ideally, do not touch anything below this line */
  /* ______________________________________________ */
  const formElement = document.createElement('form');
  const isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param cfg optional config literal
   */
  // eslint-disable-next-line complexity
  const _parseConfig = function _parseConfig() {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */
    if (!cfg || typeof cfg !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE =
    // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
    /* Set configuration parameters */
    ALLOWED_TAGS = objectHasOwnProperty(cfg, 'ALLOWED_TAGS') ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, 'ALLOWED_ATTR') ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, 'FORBID_CONTENTS') ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, 'FORBID_TAGS') ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
    FORBID_ATTR = objectHasOwnProperty(cfg, 'FORBID_ATTR') ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
    USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES') ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
    RETURN_DOM = cfg.RETURN_DOM || false; // Default false
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
    FORCE_BODY = cfg.FORCE_BODY || false; // Default false
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
    IN_PLACE = cfg.IN_PLACE || false; // Default false
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Merge configuration parameters */
    if (cfg.ADD_TAGS) {
      if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }
      addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
    }
    if (cfg.ADD_ATTR) {
      if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    /* Add #text in case KEEP_CONTENT is set to true */
    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      // Overwrite existing TrustedTypes policy.
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      // Sign local variables required by `sanitize`.
      emptyHTML = trustedTypesPolicy.createHTML('');
    } else {
      // Uninitialized policy, attempt to initialize the internal dompurify policy.
      if (trustedTypesPolicy === undefined) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      // If creating the internal policy succeeded sign internal variables.
      if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
        emptyHTML = trustedTypesPolicy.createHTML('');
      }
    }
    // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  /**
   * @param element a DOM element whose namespace is being checked
   * @returns Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */
  const _checkValidNamespace = function _checkValidNamespace(element) {
    let parent = getParentNode(element);
    // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: 'template'
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      }
      // The only way to switch from MathML to SVG is via`
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      }
      // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      }
      // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    // For XHTML and XML documents that support custom namespaces
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
    // Return false just in case.
    return false;
  };
  /**
   * _forceRemove
   *
   * @param node a DOM node
   */
  const _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  /**
   * _removeAttribute
   *
   * @param name an Attribute name
   * @param element a DOM node
   */
  const _removeAttribute = function _removeAttribute(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    // We void attribute values for unremovable "is" attributes
    if (name === 'is') {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {}
      } else {
        try {
          element.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param dirty - a string of dirty markup
   * @return a DOM, filled with the dirty markup
   */
  const _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
        // Syntax error if dirtyPayload is invalid xml
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   *
   * @param root The root element or node to start traversing on.
   * @return The created NodeIterator
   */
  const _createNodeIterator = function _createNodeIterator(root) {
    return createNodeIterator.call(root.ownerDocument || root, root,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
  };
  /**
   * _isClobbered
   *
   * @param element element to check for clobbering attacks
   * @return true if clobbered, false if safe
   */
  const _isClobbered = function _isClobbered(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== 'string' || typeof element.textContent !== 'string' || typeof element.removeChild !== 'function' || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== 'function' || typeof element.setAttribute !== 'function' || typeof element.namespaceURI !== 'string' || typeof element.insertBefore !== 'function' || typeof element.hasChildNodes !== 'function');
  };
  /**
   * Checks whether the given object is a DOM node.
   *
   * @param value object to check whether it's a DOM node
   * @return true is object is a DOM node
   */
  const _isNode = function _isNode(value) {
    return typeof Node === 'function' && value instanceof Node;
  };
  function _executeHooks(hooks, currentNode, data) {
    arrayForEach(hooks, hook => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   * @param currentNode to check for permission to exist
   * @return true if node was killed, false if left alive
   */
  const _sanitizeElements = function _sanitizeElements(currentNode) {
    let content = null;
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    /* Check if element is clobbered or can clobber */
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Now let's check the element's type and name */
    const tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */
    if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any occurrence of processing instructions */
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any kind of possibly harmful comments */
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove element if anything forbids its presence */
    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      /* Keep content except for bad-listed elements */
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    /* Check whether element has a valid namespace */
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Make sure that older browsers don't get fallback-tag mXSS */
    if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Sanitize element content to be template-safe */
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      /* Get the element's text content */
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        content = stringReplace(content, expr, ' ');
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param lcTag Lowercase tag name of containing element.
   * @param lcName Lowercase attribute name.
   * @param value Attribute value.
   * @return Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity
  const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ;else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ;else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
      // First condition does a very basic check if a) it's basically a valid custom element tagname AND
      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
      _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) ||
      // Alternative, second condition checks if it's an `is`-attribute, AND
      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ;else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ;else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ;else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ;else if (value) {
      return false;
    } else ;
    return true;
  };
  /**
   * _isBasicCustomElement
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   *
   * @param tagName name of the tag of the node to sanitize
   * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
   */
  const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
    return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT);
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param currentNode to sanitize
   */
  const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    /* Check if we have attributes; if not we might have a text node */
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: undefined
    };
    let l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      let value = name === 'value' ? attrValue : stringTrim(attrValue);
      /* Execute a hook if present */
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      /* Full DOM Clobbering protection via namespace isolation,
       * Prefix id and name attributes with `user-content-`
       */
      if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
        // Remove the attribute with this value
        _removeAttribute(name, currentNode);
        // Prefix the value and later re-create the attribute with the sanitized value
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      /* Work around a security issue with comments inside attributes */
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Remove attribute */
      _removeAttribute(name, currentNode);
      /* Did the hooks approve of the attribute? */
      if (!hookEvent.keepAttr) {
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Sanitize attribute content to be template-safe */
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          value = stringReplace(value, expr, ' ');
        });
      }
      /* Is `value` valid for this attribute? */
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        continue;
      }
      /* Handle attributes that require Trusted Types */
      if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
        if (namespaceURI) ;else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case 'TrustedHTML':
              {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
            case 'TrustedScriptURL':
              {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
          }
        }
      }
      /* Handle invalid data-* attribute set by try-catching it */
      try {
        if (namespaceURI) {
          currentNode.setAttributeNS(namespaceURI, name, value);
        } else {
          /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
          currentNode.setAttribute(name, value);
        }
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
        } else {
          arrayPop(DOMPurify.removed);
        }
      } catch (_) {}
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param fragment to iterate over recursively
   */
  const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      /* Execute a hook if present */
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      /* Sanitize tags and elements */
      _sanitizeElements(shadowNode);
      /* Check attributes next */
      _sanitizeAttributes(shadowNode);
      /* Deep shadow DOM detected */
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(shadowNode.content);
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  // eslint-disable-next-line complexity
  DOMPurify.sanitize = function (dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */
    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      if (typeof dirty.toString === 'function') {
        dirty = dirty.toString();
        if (typeof dirty !== 'string') {
          throw typeErrorCreate('dirty is not a string, aborting');
        }
      } else {
        throw typeErrorCreate('toString is not a function');
      }
    }
    /* Return dirty HTML if DOMPurify cannot run */
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    /* Assign config vars */
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */
    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */
    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes */
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
    } else if (dirty instanceof Node) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
    } else {
      /* Exit directly if we have nothing to do */
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
      // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf('<') === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */
      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */
    while (currentNode = nodeIterator.nextNode()) {
      /* Sanitize tags and elements */
      _sanitizeElements(currentNode);
      /* Check attributes next */
      _sanitizeAttributes(currentNode);
      /* Shadow DOM detected, sanitize it */
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    /* If we sanitized `dirty` in-place, return it. */
    if (IN_PLACE) {
      return dirty;
    }
    /* Return sanitized string or DOM */
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */
    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        serializedHTML = stringReplace(serializedHTML, expr, ' ');
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function () {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function (entryPoint) {
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function (entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function () {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

purify.addHook("uponSanitizeAttribute", function (node, data) {
  const allowedAttributePattern = /^data-trix-/;
  if (allowedAttributePattern.test(data.attrName)) {
    data.forceKeepAttr = true;
  }
});
const DEFAULT_ALLOWED_ATTRIBUTES = "style href src width height language class".split(" ");
const DEFAULT_FORBIDDEN_PROTOCOLS = "javascript:".split(" ");
const DEFAULT_FORBIDDEN_ELEMENTS = "script iframe form noscript".split(" ");
class HTMLSanitizer extends BasicObject {
  static setHTML(element, html) {
    const sanitizedElement = new this(html).sanitize();
    const sanitizedHtml = sanitizedElement.getHTML ? sanitizedElement.getHTML() : sanitizedElement.outerHTML;
    element.innerHTML = sanitizedHtml;
  }
  static sanitize(html, options) {
    const sanitizer = new this(html, options);
    sanitizer.sanitize();
    return sanitizer;
  }
  constructor(html) {
    let {
      allowedAttributes,
      forbiddenProtocols,
      forbiddenElements
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.allowedAttributes = allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES;
    this.forbiddenProtocols = forbiddenProtocols || DEFAULT_FORBIDDEN_PROTOCOLS;
    this.forbiddenElements = forbiddenElements || DEFAULT_FORBIDDEN_ELEMENTS;
    this.body = createBodyElementForHTML(html);
  }
  sanitize() {
    this.sanitizeElements();
    this.normalizeListElementNesting();
    purify.setConfig(dompurify);
    this.body = purify.sanitize(this.body);
    return this.body;
  }
  getHTML() {
    return this.body.innerHTML;
  }
  getBody() {
    return this.body;
  }

  // Private

  sanitizeElements() {
    const walker = walkTree(this.body);
    const nodesToRemove = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          if (this.elementIsRemovable(node)) {
            nodesToRemove.push(node);
          } else {
            this.sanitizeElement(node);
          }
          break;
        case Node.COMMENT_NODE:
          nodesToRemove.push(node);
          break;
      }
    }
    nodesToRemove.forEach(node => removeNode(node));
    return this.body;
  }
  sanitizeElement(element) {
    if (element.hasAttribute("href")) {
      if (this.forbiddenProtocols.includes(element.protocol)) {
        element.removeAttribute("href");
      }
    }
    Array.from(element.attributes).forEach(_ref => {
      let {
        name
      } = _ref;
      if (!this.allowedAttributes.includes(name) && name.indexOf("data-trix") !== 0) {
        element.removeAttribute(name);
      }
    });
    return element;
  }
  normalizeListElementNesting() {
    Array.from(this.body.querySelectorAll("ul,ol")).forEach(listElement => {
      const previousElement = listElement.previousElementSibling;
      if (previousElement) {
        if (tagName(previousElement) === "li") {
          previousElement.appendChild(listElement);
        }
      }
    });
    return this.body;
  }
  elementIsRemovable(element) {
    if ((element === null || element === void 0 ? void 0 : element.nodeType) !== Node.ELEMENT_NODE) return;
    return this.elementIsForbidden(element) || this.elementIsntSerializable(element);
  }
  elementIsForbidden(element) {
    return this.forbiddenElements.includes(tagName(element));
  }
  elementIsntSerializable(element) {
    return element.getAttribute("data-trix-serialize") === "false" && !nodeIsAttachmentElement(element);
  }
}
const createBodyElementForHTML = function () {
  let html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  // Remove everything after </html>
  html = html.replace(/<\/html[^>]*>[^]*$/i, "</html>");
  const doc = document.implementation.createHTMLDocument("");
  doc.documentElement.innerHTML = html;
  Array.from(doc.head.querySelectorAll("style")).forEach(element => {
    doc.body.appendChild(element);
  });
  return doc.body;
};

const {
  css: css$3
} = config;
class AttachmentView extends ObjectView {
  constructor() {
    super(...arguments);
    this.attachment = this.object;
    this.attachment.uploadProgressDelegate = this;
    this.attachmentPiece = this.options.piece;
  }
  createContentNodes() {
    return [];
  }
  createNodes() {
    let innerElement;
    const figure = innerElement = makeElement({
      tagName: "figure",
      className: this.getClassName(),
      data: this.getData(),
      editable: false
    });
    const href = this.getHref();
    if (href) {
      innerElement = makeElement({
        tagName: "a",
        editable: false,
        attributes: {
          href,
          tabindex: -1
        }
      });
      figure.appendChild(innerElement);
    }
    if (this.attachment.hasContent()) {
      HTMLSanitizer.setHTML(innerElement, this.attachment.getContent());
    } else {
      this.createContentNodes().forEach(node => {
        innerElement.appendChild(node);
      });
    }
    innerElement.appendChild(this.createCaptionElement());
    if (this.attachment.isPending()) {
      this.progressElement = makeElement({
        tagName: "progress",
        attributes: {
          class: css$3.attachmentProgress,
          value: this.attachment.getUploadProgress(),
          max: 100
        },
        data: {
          trixMutable: true,
          trixStoreKey: ["progressElement", this.attachment.id].join("/")
        }
      });
      figure.appendChild(this.progressElement);
    }
    return [createCursorTarget$1("left"), figure, createCursorTarget$1("right")];
  }
  createCaptionElement() {
    const figcaption = makeElement({
      tagName: "figcaption",
      className: css$3.attachmentCaption
    });
    const caption = this.attachmentPiece.getCaption();
    if (caption) {
      figcaption.classList.add("".concat(css$3.attachmentCaption, "--edited"));
      figcaption.textContent = caption;
    } else {
      let name, size;
      const captionConfig = this.getCaptionConfig();
      if (captionConfig.name) {
        name = this.attachment.getFilename();
      }
      if (captionConfig.size) {
        size = this.attachment.getFormattedFilesize();
      }
      if (name) {
        const nameElement = makeElement({
          tagName: "span",
          className: css$3.attachmentName,
          textContent: name
        });
        figcaption.appendChild(nameElement);
      }
      if (size) {
        if (name) {
          figcaption.appendChild(document.createTextNode(" "));
        }
        const sizeElement = makeElement({
          tagName: "span",
          className: css$3.attachmentSize,
          textContent: size
        });
        figcaption.appendChild(sizeElement);
      }
    }
    return figcaption;
  }
  getClassName() {
    const names = [css$3.attachment, "".concat(css$3.attachment, "--").concat(this.attachment.getType())];
    const extension = this.attachment.getExtension();
    if (extension) {
      names.push("".concat(css$3.attachment, "--").concat(extension));
    }
    return names.join(" ");
  }
  getData() {
    const data = {
      trixAttachment: JSON.stringify(this.attachment),
      trixContentType: this.attachment.getContentType(),
      trixId: this.attachment.id
    };
    const {
      attributes
    } = this.attachmentPiece;
    if (!attributes.isEmpty()) {
      data.trixAttributes = JSON.stringify(attributes);
    }
    if (this.attachment.isPending()) {
      data.trixSerialize = false;
    }
    return data;
  }
  getHref() {
    if (!htmlContainsTagName(this.attachment.getContent(), "a")) {
      return this.attachment.getHref();
    }
  }
  getCaptionConfig() {
    var _config$attachments$t;
    const type = this.attachment.getType();
    const captionConfig = copyObject((_config$attachments$t = attachments[type]) === null || _config$attachments$t === void 0 ? void 0 : _config$attachments$t.caption);
    if (type === "file") {
      captionConfig.name = true;
    }
    return captionConfig;
  }
  findProgressElement() {
    var _this$findElement;
    return (_this$findElement = this.findElement()) === null || _this$findElement === void 0 ? void 0 : _this$findElement.querySelector("progress");
  }

  // Attachment delegate

  attachmentDidChangeUploadProgress() {
    const value = this.attachment.getUploadProgress();
    const progressElement = this.findProgressElement();
    if (progressElement) {
      progressElement.value = value;
    }
  }
}
const createCursorTarget$1 = name => makeElement({
  tagName: "span",
  textContent: ZERO_WIDTH_SPACE,
  data: {
    trixCursorTarget: name,
    trixSerialize: false
  }
});
const htmlContainsTagName = function (html, tagName) {
  const div = makeElement("div");
  HTMLSanitizer.setHTML(div, html || "");
  return div.querySelector(tagName);
};

class PreviewableAttachmentView extends AttachmentView {
  constructor() {
    super(...arguments);
    this.attachment.previewDelegate = this;
  }
  createContentNodes() {
    this.image = makeElement({
      tagName: "img",
      attributes: {
        src: ""
      },
      data: {
        trixMutable: true
      }
    });
    this.refresh(this.image);
    return [this.image];
  }
  createCaptionElement() {
    const figcaption = super.createCaptionElement(...arguments);
    if (!figcaption.textContent) {
      figcaption.setAttribute("data-trix-placeholder", lang$1.captionPlaceholder);
    }
    return figcaption;
  }
  refresh(image) {
    if (!image) {
      var _this$findElement;
      image = (_this$findElement = this.findElement()) === null || _this$findElement === void 0 ? void 0 : _this$findElement.querySelector("img");
    }
    if (image) {
      return this.updateAttributesForImage(image);
    }
  }
  updateAttributesForImage(image) {
    const url = this.attachment.getURL();
    const previewURL = this.attachment.getPreviewURL();
    image.src = previewURL || url;
    if (previewURL === url) {
      image.removeAttribute("data-trix-serialized-attributes");
    } else {
      const serializedAttributes = JSON.stringify({
        src: url
      });
      image.setAttribute("data-trix-serialized-attributes", serializedAttributes);
    }
    const width = this.attachment.getWidth();
    const height = this.attachment.getHeight();
    if (width != null) {
      image.width = width;
    }
    if (height != null) {
      image.height = height;
    }
    const storeKey = ["imageElement", this.attachment.id, image.src, image.width, image.height].join("/");
    image.dataset.trixStoreKey = storeKey;
  }

  // Attachment delegate

  attachmentDidChangeAttributes() {
    this.refresh(this.image);
    return this.refresh();
  }
}

/* eslint-disable
    no-useless-escape,
    no-var,
*/
class PieceView extends ObjectView {
  constructor() {
    super(...arguments);
    this.piece = this.object;
    this.attributes = this.piece.getAttributes();
    this.textConfig = this.options.textConfig;
    this.context = this.options.context;
    if (this.piece.attachment) {
      this.attachment = this.piece.attachment;
    } else {
      this.string = this.piece.toString();
    }
  }
  createNodes() {
    let nodes = this.attachment ? this.createAttachmentNodes() : this.createStringNodes();
    const element = this.createElement();
    if (element) {
      const innerElement = findInnerElement(element);
      Array.from(nodes).forEach(node => {
        innerElement.appendChild(node);
      });
      nodes = [element];
    }
    return nodes;
  }
  createAttachmentNodes() {
    const constructor = this.attachment.isPreviewable() ? PreviewableAttachmentView : AttachmentView;
    const view = this.createChildView(constructor, this.piece.attachment, {
      piece: this.piece
    });
    return view.getNodes();
  }
  createStringNodes() {
    var _this$textConfig;
    if ((_this$textConfig = this.textConfig) !== null && _this$textConfig !== void 0 && _this$textConfig.plaintext) {
      return [document.createTextNode(this.string)];
    } else {
      const nodes = [];
      const iterable = this.string.split("\n");
      for (let index = 0; index < iterable.length; index++) {
        const substring = iterable[index];
        if (index > 0) {
          const element = makeElement("br");
          nodes.push(element);
        }
        if (substring.length) {
          const node = document.createTextNode(this.preserveSpaces(substring));
          nodes.push(node);
        }
      }
      return nodes;
    }
  }
  createElement() {
    let element, key, value;
    const styles = {};
    for (key in this.attributes) {
      value = this.attributes[key];
      const config = getTextConfig(key);
      if (config) {
        if (config.tagName) {
          var innerElement;
          const pendingElement = makeElement(config.tagName);
          if (innerElement) {
            innerElement.appendChild(pendingElement);
            innerElement = pendingElement;
          } else {
            element = innerElement = pendingElement;
          }
        }
        if (config.styleProperty) {
          styles[config.styleProperty] = value;
        }
        if (config.style) {
          for (key in config.style) {
            value = config.style[key];
            styles[key] = value;
          }
        }
      }
    }
    if (Object.keys(styles).length) {
      if (!element) {
        element = makeElement("span");
      }
      for (key in styles) {
        value = styles[key];
        element.style[key] = value;
      }
    }
    return element;
  }
  createContainerElement() {
    for (const key in this.attributes) {
      const value = this.attributes[key];
      const config = getTextConfig(key);
      if (config) {
        if (config.groupTagName) {
          const attributes = {};
          attributes[key] = value;
          return makeElement(config.groupTagName, attributes);
        }
      }
    }
  }
  preserveSpaces(string) {
    if (this.context.isLast) {
      string = string.replace(/\ $/, NON_BREAKING_SPACE);
    }
    string = string.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(NON_BREAKING_SPACE, " $2")).replace(/\ {2}/g, "".concat(NON_BREAKING_SPACE, " ")).replace(/\ {2}/g, " ".concat(NON_BREAKING_SPACE));
    if (this.context.isFirst || this.context.followsWhitespace) {
      string = string.replace(/^\ /, NON_BREAKING_SPACE);
    }
    return string;
  }
}

/* eslint-disable
    no-var,
*/
class TextView extends ObjectView {
  constructor() {
    super(...arguments);
    this.text = this.object;
    this.textConfig = this.options.textConfig;
  }
  createNodes() {
    const nodes = [];
    const pieces = ObjectGroup.groupObjects(this.getPieces());
    const lastIndex = pieces.length - 1;
    for (let index = 0; index < pieces.length; index++) {
      const piece = pieces[index];
      const context = {};
      if (index === 0) {
        context.isFirst = true;
      }
      if (index === lastIndex) {
        context.isLast = true;
      }
      if (endsWithWhitespace(previousPiece)) {
        context.followsWhitespace = true;
      }
      const view = this.findOrCreateCachedChildView(PieceView, piece, {
        textConfig: this.textConfig,
        context
      });
      nodes.push(...Array.from(view.getNodes() || []));
      var previousPiece = piece;
    }
    return nodes;
  }
  getPieces() {
    return Array.from(this.text.getPieces()).filter(piece => !piece.hasAttribute("blockBreak"));
  }
}
const endsWithWhitespace = piece => /\s$/.test(piece === null || piece === void 0 ? void 0 : piece.toString());

const {
  css: css$2
} = config;
class BlockView extends ObjectView {
  constructor() {
    super(...arguments);
    this.block = this.object;
    this.attributes = this.block.getAttributes();
  }
  createNodes() {
    const comment = document.createComment("block");
    const nodes = [comment];
    if (this.block.isEmpty()) {
      nodes.push(makeElement("br"));
    } else {
      var _getBlockConfig;
      const textConfig = (_getBlockConfig = getBlockConfig(this.block.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.text;
      const textView = this.findOrCreateCachedChildView(TextView, this.block.text, {
        textConfig
      });
      nodes.push(...Array.from(textView.getNodes() || []));
      if (this.shouldAddExtraNewlineElement()) {
        nodes.push(makeElement("br"));
      }
    }
    if (this.attributes.length) {
      return nodes;
    } else {
      let attributes$1;
      const {
        tagName,
        className
      } = attributes.default;
      if (this.block.isRTL()) {
        attributes$1 = {
          dir: "rtl"
        };
      }
      const element = makeElement({
        tagName,
        className,
        attributes: attributes$1
      });
      nodes.forEach(node => element.appendChild(node));
      return [element];
    }
  }
  createContainerElement(depth) {
    const attributes = {};
    // let className
    const attributeName = this.attributes[depth];
    const {
      tagName,
      className,
      htmlAttributes = []
    } = getBlockConfig(attributeName);
    if (depth === 0 && this.block.isRTL()) {
      Object.assign(attributes, {
        dir: "rtl"
      });
    }
    if (attributeName === "attachmentGallery") {
      const size = this.block.getBlockBreakPosition();
      className = "".concat(css$2.attachmentGallery, " ").concat(css$2.attachmentGallery, "--").concat(size);
    }
    Object.entries(this.block.htmlAttributes).forEach(_ref => {
      let [name, value] = _ref;
      if (htmlAttributes.includes(name)) {
        attributes[name] = value;
      }
    });
    return makeElement({
      tagName,
      className,
      attributes
    });
  }

  // A single <br> at the end of a block element has no visual representation
  // so add an extra one.
  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString());
  }
}

class DocumentView extends ObjectView {
  static render(document) {
    const element = makeElement("div");
    const view = new this(document, {
      element
    });
    view.render();
    view.sync();
    return element;
  }
  constructor() {
    super(...arguments);
    this.element = this.options.element;
    this.elementStore = new ElementStore();
    this.setDocument(this.object);
  }
  setDocument(document) {
    if (!document.isEqualTo(this.document)) {
      this.document = this.object = document;
    }
  }
  render() {
    this.childViews = [];
    this.shadowElement = makeElement("div");
    if (!this.document.isEmpty()) {
      const objects = ObjectGroup.groupObjects(this.document.getBlocks(), {
        asTree: true
      });
      Array.from(objects).forEach(object => {
        const view = this.findOrCreateCachedChildView(BlockView, object);
        Array.from(view.getNodes()).map(node => this.shadowElement.appendChild(node));
      });
    }
  }
  isSynced() {
    return elementsHaveEqualHTML(this.shadowElement, this.element);
  }
  sync() {
    const fragment = this.createDocumentFragmentForSync();
    while (this.element.lastChild) {
      this.element.removeChild(this.element.lastChild);
    }
    this.element.appendChild(fragment);
    return this.didSync();
  }

  // Private

  didSync() {
    this.elementStore.reset(findStoredElements(this.element));
    return defer(() => this.garbageCollectCachedViews());
  }
  createDocumentFragmentForSync() {
    const fragment = document.createDocumentFragment();
    Array.from(this.shadowElement.childNodes).forEach(node => {
      fragment.appendChild(node.cloneNode(true));
    });
    Array.from(findStoredElements(fragment)).forEach(element => {
      const storedElement = this.elementStore.remove(element);
      if (storedElement) {
        element.parentNode.replaceChild(storedElement, element);
      }
    });
    return fragment;
  }
}
const findStoredElements = element => element.querySelectorAll("[data-trix-store-key]");
const elementsHaveEqualHTML = (element, otherElement) => ignoreSpaces(element.innerHTML) === ignoreSpaces(otherElement.innerHTML);
const ignoreSpaces = html => html.replace(/&nbsp;/g, " ");

function _AsyncGenerator(e) {
  var r, t;
  function resume(r, t) {
    try {
      var n = e[r](t),
        o = n.value,
        u = o instanceof _OverloadYield;
      Promise.resolve(u ? o.v : o).then(function (t) {
        if (u) {
          var i = "return" === r ? "return" : "next";
          if (!o.k || t.done) return resume(i, t);
          t = e[i](t).value;
        }
        settle(n.done ? "return" : "normal", t);
      }, function (e) {
        resume("throw", e);
      });
    } catch (e) {
      settle("throw", e);
    }
  }
  function settle(e, n) {
    switch (e) {
      case "return":
        r.resolve({
          value: n,
          done: !0
        });
        break;
      case "throw":
        r.reject(n);
        break;
      default:
        r.resolve({
          value: n,
          done: !1
        });
    }
    (r = r.next) ? resume(r.key, r.arg) : t = null;
  }
  this._invoke = function (e, n) {
    return new Promise(function (o, u) {
      var i = {
        key: e,
        arg: n,
        resolve: o,
        reject: u,
        next: null
      };
      t ? t = t.next = i : (r = t = i, resume(e, n));
    });
  }, "function" != typeof e.return && (this.return = void 0);
}
_AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () {
  return this;
}, _AsyncGenerator.prototype.next = function (e) {
  return this._invoke("next", e);
}, _AsyncGenerator.prototype.throw = function (e) {
  return this._invoke("throw", e);
}, _AsyncGenerator.prototype.return = function (e) {
  return this._invoke("return", e);
};
function _OverloadYield(t, e) {
  this.v = t, this.k = e;
}
function old_createMetadataMethodsForProperty(e, t, a, r) {
  return {
    getMetadata: function (o) {
      old_assertNotFinished(r, "getMetadata"), old_assertMetadataKey(o);
      var i = e[o];
      if (void 0 !== i) if (1 === t) {
        var n = i.public;
        if (void 0 !== n) return n[a];
      } else if (2 === t) {
        var l = i.private;
        if (void 0 !== l) return l.get(a);
      } else if (Object.hasOwnProperty.call(i, "constructor")) return i.constructor;
    },
    setMetadata: function (o, i) {
      old_assertNotFinished(r, "setMetadata"), old_assertMetadataKey(o);
      var n = e[o];
      if (void 0 === n && (n = e[o] = {}), 1 === t) {
        var l = n.public;
        void 0 === l && (l = n.public = {}), l[a] = i;
      } else if (2 === t) {
        var s = n.priv;
        void 0 === s && (s = n.private = new Map()), s.set(a, i);
      } else n.constructor = i;
    }
  };
}
function old_convertMetadataMapToFinal(e, t) {
  var a = e[Symbol.metadata || Symbol.for("Symbol.metadata")],
    r = Object.getOwnPropertySymbols(t);
  if (0 !== r.length) {
    for (var o = 0; o < r.length; o++) {
      var i = r[o],
        n = t[i],
        l = a ? a[i] : null,
        s = n.public,
        c = l ? l.public : null;
      s && c && Object.setPrototypeOf(s, c);
      var d = n.private;
      if (d) {
        var u = Array.from(d.values()),
          f = l ? l.private : null;
        f && (u = u.concat(f)), n.private = u;
      }
      l && Object.setPrototypeOf(n, l);
    }
    a && Object.setPrototypeOf(t, a), e[Symbol.metadata || Symbol.for("Symbol.metadata")] = t;
  }
}
function old_createAddInitializerMethod(e, t) {
  return function (a) {
    old_assertNotFinished(t, "addInitializer"), old_assertCallable(a, "An initializer"), e.push(a);
  };
}
function old_memberDec(e, t, a, r, o, i, n, l, s) {
  var c;
  switch (i) {
    case 1:
      c = "accessor";
      break;
    case 2:
      c = "method";
      break;
    case 3:
      c = "getter";
      break;
    case 4:
      c = "setter";
      break;
    default:
      c = "field";
  }
  var d,
    u,
    f = {
      kind: c,
      name: l ? "#" + t : t,
      isStatic: n,
      isPrivate: l
    },
    p = {
      v: !1
    };
  if (0 !== i && (f.addInitializer = old_createAddInitializerMethod(o, p)), l) {
    d = 2, u = Symbol(t);
    var v = {};
    0 === i ? (v.get = a.get, v.set = a.set) : 2 === i ? v.get = function () {
      return a.value;
    } : (1 !== i && 3 !== i || (v.get = function () {
      return a.get.call(this);
    }), 1 !== i && 4 !== i || (v.set = function (e) {
      a.set.call(this, e);
    })), f.access = v;
  } else d = 1, u = t;
  try {
    return e(s, Object.assign(f, old_createMetadataMethodsForProperty(r, d, u, p)));
  } finally {
    p.v = !0;
  }
}
function old_assertNotFinished(e, t) {
  if (e.v) throw new Error("attempted to call " + t + " after decoration was finished");
}
function old_assertMetadataKey(e) {
  if ("symbol" != typeof e) throw new TypeError("Metadata keys must be symbols, received: " + e);
}
function old_assertCallable(e, t) {
  if ("function" != typeof e) throw new TypeError(t + " must be a function");
}
function old_assertValidReturnValue(e, t) {
  var a = typeof t;
  if (1 === e) {
    if ("object" !== a || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
    void 0 !== t.get && old_assertCallable(t.get, "accessor.get"), void 0 !== t.set && old_assertCallable(t.set, "accessor.set"), void 0 !== t.init && old_assertCallable(t.init, "accessor.init"), void 0 !== t.initializer && old_assertCallable(t.initializer, "accessor.initializer");
  } else if ("function" !== a) {
    var r;
    throw r = 0 === e ? "field" : 10 === e ? "class" : "method", new TypeError(r + " decorators must return a function or void 0");
  }
}
function old_getInit(e) {
  var t;
  return null == (t = e.init) && (t = e.initializer) && "undefined" != typeof console && console.warn(".initializer has been renamed to .init as of March 2022"), t;
}
function old_applyMemberDec(e, t, a, r, o, i, n, l, s) {
  var c,
    d,
    u,
    f,
    p,
    v,
    h = a[0];
  if (n ? c = 0 === o || 1 === o ? {
    get: a[3],
    set: a[4]
  } : 3 === o ? {
    get: a[3]
  } : 4 === o ? {
    set: a[3]
  } : {
    value: a[3]
  } : 0 !== o && (c = Object.getOwnPropertyDescriptor(t, r)), 1 === o ? u = {
    get: c.get,
    set: c.set
  } : 2 === o ? u = c.value : 3 === o ? u = c.get : 4 === o && (u = c.set), "function" == typeof h) void 0 !== (f = old_memberDec(h, r, c, l, s, o, i, n, u)) && (old_assertValidReturnValue(o, f), 0 === o ? d = f : 1 === o ? (d = old_getInit(f), p = f.get || u.get, v = f.set || u.set, u = {
    get: p,
    set: v
  }) : u = f);else for (var y = h.length - 1; y >= 0; y--) {
    var b;
    if (void 0 !== (f = old_memberDec(h[y], r, c, l, s, o, i, n, u))) old_assertValidReturnValue(o, f), 0 === o ? b = f : 1 === o ? (b = old_getInit(f), p = f.get || u.get, v = f.set || u.set, u = {
      get: p,
      set: v
    }) : u = f, void 0 !== b && (void 0 === d ? d = b : "function" == typeof d ? d = [d, b] : d.push(b));
  }
  if (0 === o || 1 === o) {
    if (void 0 === d) d = function (e, t) {
      return t;
    };else if ("function" != typeof d) {
      var g = d;
      d = function (e, t) {
        for (var a = t, r = 0; r < g.length; r++) a = g[r].call(e, a);
        return a;
      };
    } else {
      var m = d;
      d = function (e, t) {
        return m.call(e, t);
      };
    }
    e.push(d);
  }
  0 !== o && (1 === o ? (c.get = u.get, c.set = u.set) : 2 === o ? c.value = u : 3 === o ? c.get = u : 4 === o && (c.set = u), n ? 1 === o ? (e.push(function (e, t) {
    return u.get.call(e, t);
  }), e.push(function (e, t) {
    return u.set.call(e, t);
  })) : 2 === o ? e.push(u) : e.push(function (e, t) {
    return u.call(e, t);
  }) : Object.defineProperty(t, r, c));
}
function old_applyMemberDecs(e, t, a, r, o) {
  for (var i, n, l = new Map(), s = new Map(), c = 0; c < o.length; c++) {
    var d = o[c];
    if (Array.isArray(d)) {
      var u,
        f,
        p,
        v = d[1],
        h = d[2],
        y = d.length > 3,
        b = v >= 5;
      if (b ? (u = t, f = r, 0 !== (v -= 5) && (p = n = n || [])) : (u = t.prototype, f = a, 0 !== v && (p = i = i || [])), 0 !== v && !y) {
        var g = b ? s : l,
          m = g.get(h) || 0;
        if (!0 === m || 3 === m && 4 !== v || 4 === m && 3 !== v) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
        !m && v > 2 ? g.set(h, v) : g.set(h, !0);
      }
      old_applyMemberDec(e, u, d, h, v, b, y, f, p);
    }
  }
  old_pushInitializers(e, i), old_pushInitializers(e, n);
}
function old_pushInitializers(e, t) {
  t && e.push(function (e) {
    for (var a = 0; a < t.length; a++) t[a].call(e);
    return e;
  });
}
function old_applyClassDecs(e, t, a, r) {
  if (r.length > 0) {
    for (var o = [], i = t, n = t.name, l = r.length - 1; l >= 0; l--) {
      var s = {
        v: !1
      };
      try {
        var c = Object.assign({
            kind: "class",
            name: n,
            addInitializer: old_createAddInitializerMethod(o, s)
          }, old_createMetadataMethodsForProperty(a, 0, n, s)),
          d = r[l](i, c);
      } finally {
        s.v = !0;
      }
      void 0 !== d && (old_assertValidReturnValue(10, d), i = d);
    }
    e.push(i, function () {
      for (var e = 0; e < o.length; e++) o[e].call(i);
    });
  }
}
function _applyDecs(e, t, a) {
  var r = [],
    o = {},
    i = {};
  return old_applyMemberDecs(r, e, i, o, t), old_convertMetadataMapToFinal(e.prototype, i), old_applyClassDecs(r, e, o, a), old_convertMetadataMapToFinal(e, o), r;
}
function applyDecs2203Factory() {
  function createAddInitializerMethod(e, t) {
    return function (r) {
      !function (e, t) {
        if (e.v) throw new Error("attempted to call " + t + " after decoration was finished");
      }(t, "addInitializer"), assertCallable(r, "An initializer"), e.push(r);
    };
  }
  function memberDec(e, t, r, a, n, i, s, o) {
    var c;
    switch (n) {
      case 1:
        c = "accessor";
        break;
      case 2:
        c = "method";
        break;
      case 3:
        c = "getter";
        break;
      case 4:
        c = "setter";
        break;
      default:
        c = "field";
    }
    var l,
      u,
      f = {
        kind: c,
        name: s ? "#" + t : t,
        static: i,
        private: s
      },
      p = {
        v: !1
      };
    0 !== n && (f.addInitializer = createAddInitializerMethod(a, p)), 0 === n ? s ? (l = r.get, u = r.set) : (l = function () {
      return this[t];
    }, u = function (e) {
      this[t] = e;
    }) : 2 === n ? l = function () {
      return r.value;
    } : (1 !== n && 3 !== n || (l = function () {
      return r.get.call(this);
    }), 1 !== n && 4 !== n || (u = function (e) {
      r.set.call(this, e);
    })), f.access = l && u ? {
      get: l,
      set: u
    } : l ? {
      get: l
    } : {
      set: u
    };
    try {
      return e(o, f);
    } finally {
      p.v = !0;
    }
  }
  function assertCallable(e, t) {
    if ("function" != typeof e) throw new TypeError(t + " must be a function");
  }
  function assertValidReturnValue(e, t) {
    var r = typeof t;
    if (1 === e) {
      if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
      void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init");
    } else if ("function" !== r) {
      var a;
      throw a = 0 === e ? "field" : 10 === e ? "class" : "method", new TypeError(a + " decorators must return a function or void 0");
    }
  }
  function applyMemberDec(e, t, r, a, n, i, s, o) {
    var c,
      l,
      u,
      f,
      p,
      d,
      h = r[0];
    if (s ? c = 0 === n || 1 === n ? {
      get: r[3],
      set: r[4]
    } : 3 === n ? {
      get: r[3]
    } : 4 === n ? {
      set: r[3]
    } : {
      value: r[3]
    } : 0 !== n && (c = Object.getOwnPropertyDescriptor(t, a)), 1 === n ? u = {
      get: c.get,
      set: c.set
    } : 2 === n ? u = c.value : 3 === n ? u = c.get : 4 === n && (u = c.set), "function" == typeof h) void 0 !== (f = memberDec(h, a, c, o, n, i, s, u)) && (assertValidReturnValue(n, f), 0 === n ? l = f : 1 === n ? (l = f.init, p = f.get || u.get, d = f.set || u.set, u = {
      get: p,
      set: d
    }) : u = f);else for (var v = h.length - 1; v >= 0; v--) {
      var g;
      if (void 0 !== (f = memberDec(h[v], a, c, o, n, i, s, u))) assertValidReturnValue(n, f), 0 === n ? g = f : 1 === n ? (g = f.init, p = f.get || u.get, d = f.set || u.set, u = {
        get: p,
        set: d
      }) : u = f, void 0 !== g && (void 0 === l ? l = g : "function" == typeof l ? l = [l, g] : l.push(g));
    }
    if (0 === n || 1 === n) {
      if (void 0 === l) l = function (e, t) {
        return t;
      };else if ("function" != typeof l) {
        var y = l;
        l = function (e, t) {
          for (var r = t, a = 0; a < y.length; a++) r = y[a].call(e, r);
          return r;
        };
      } else {
        var m = l;
        l = function (e, t) {
          return m.call(e, t);
        };
      }
      e.push(l);
    }
    0 !== n && (1 === n ? (c.get = u.get, c.set = u.set) : 2 === n ? c.value = u : 3 === n ? c.get = u : 4 === n && (c.set = u), s ? 1 === n ? (e.push(function (e, t) {
      return u.get.call(e, t);
    }), e.push(function (e, t) {
      return u.set.call(e, t);
    })) : 2 === n ? e.push(u) : e.push(function (e, t) {
      return u.call(e, t);
    }) : Object.defineProperty(t, a, c));
  }
  function pushInitializers(e, t) {
    t && e.push(function (e) {
      for (var r = 0; r < t.length; r++) t[r].call(e);
      return e;
    });
  }
  return function (e, t, r) {
    var a = [];
    return function (e, t, r) {
      for (var a, n, i = new Map(), s = new Map(), o = 0; o < r.length; o++) {
        var c = r[o];
        if (Array.isArray(c)) {
          var l,
            u,
            f = c[1],
            p = c[2],
            d = c.length > 3,
            h = f >= 5;
          if (h ? (l = t, 0 != (f -= 5) && (u = n = n || [])) : (l = t.prototype, 0 !== f && (u = a = a || [])), 0 !== f && !d) {
            var v = h ? s : i,
              g = v.get(p) || 0;
            if (!0 === g || 3 === g && 4 !== f || 4 === g && 3 !== f) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + p);
            !g && f > 2 ? v.set(p, f) : v.set(p, !0);
          }
          applyMemberDec(e, l, c, p, f, h, d, u);
        }
      }
      pushInitializers(e, a), pushInitializers(e, n);
    }(a, e, t), function (e, t, r) {
      if (r.length > 0) {
        for (var a = [], n = t, i = t.name, s = r.length - 1; s >= 0; s--) {
          var o = {
            v: !1
          };
          try {
            var c = r[s](n, {
              kind: "class",
              name: i,
              addInitializer: createAddInitializerMethod(a, o)
            });
          } finally {
            o.v = !0;
          }
          void 0 !== c && (assertValidReturnValue(10, c), n = c);
        }
        e.push(n, function () {
          for (var e = 0; e < a.length; e++) a[e].call(n);
        });
      }
    }(a, e, r), a;
  };
}
var applyDecs2203Impl;
function _applyDecs2203(e, t, r) {
  return (applyDecs2203Impl = applyDecs2203Impl || applyDecs2203Factory())(e, t, r);
}
function applyDecs2203RFactory() {
  function createAddInitializerMethod(e, t) {
    return function (r) {
      !function (e, t) {
        if (e.v) throw new Error("attempted to call " + t + " after decoration was finished");
      }(t, "addInitializer"), assertCallable(r, "An initializer"), e.push(r);
    };
  }
  function memberDec(e, t, r, n, a, i, s, o) {
    var c;
    switch (a) {
      case 1:
        c = "accessor";
        break;
      case 2:
        c = "method";
        break;
      case 3:
        c = "getter";
        break;
      case 4:
        c = "setter";
        break;
      default:
        c = "field";
    }
    var l,
      u,
      f = {
        kind: c,
        name: s ? "#" + t : t,
        static: i,
        private: s
      },
      p = {
        v: !1
      };
    0 !== a && (f.addInitializer = createAddInitializerMethod(n, p)), 0 === a ? s ? (l = r.get, u = r.set) : (l = function () {
      return this[t];
    }, u = function (e) {
      this[t] = e;
    }) : 2 === a ? l = function () {
      return r.value;
    } : (1 !== a && 3 !== a || (l = function () {
      return r.get.call(this);
    }), 1 !== a && 4 !== a || (u = function (e) {
      r.set.call(this, e);
    })), f.access = l && u ? {
      get: l,
      set: u
    } : l ? {
      get: l
    } : {
      set: u
    };
    try {
      return e(o, f);
    } finally {
      p.v = !0;
    }
  }
  function assertCallable(e, t) {
    if ("function" != typeof e) throw new TypeError(t + " must be a function");
  }
  function assertValidReturnValue(e, t) {
    var r = typeof t;
    if (1 === e) {
      if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
      void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init");
    } else if ("function" !== r) {
      var n;
      throw n = 0 === e ? "field" : 10 === e ? "class" : "method", new TypeError(n + " decorators must return a function or void 0");
    }
  }
  function applyMemberDec(e, t, r, n, a, i, s, o) {
    var c,
      l,
      u,
      f,
      p,
      d,
      h = r[0];
    if (s ? c = 0 === a || 1 === a ? {
      get: r[3],
      set: r[4]
    } : 3 === a ? {
      get: r[3]
    } : 4 === a ? {
      set: r[3]
    } : {
      value: r[3]
    } : 0 !== a && (c = Object.getOwnPropertyDescriptor(t, n)), 1 === a ? u = {
      get: c.get,
      set: c.set
    } : 2 === a ? u = c.value : 3 === a ? u = c.get : 4 === a && (u = c.set), "function" == typeof h) void 0 !== (f = memberDec(h, n, c, o, a, i, s, u)) && (assertValidReturnValue(a, f), 0 === a ? l = f : 1 === a ? (l = f.init, p = f.get || u.get, d = f.set || u.set, u = {
      get: p,
      set: d
    }) : u = f);else for (var v = h.length - 1; v >= 0; v--) {
      var g;
      if (void 0 !== (f = memberDec(h[v], n, c, o, a, i, s, u))) assertValidReturnValue(a, f), 0 === a ? g = f : 1 === a ? (g = f.init, p = f.get || u.get, d = f.set || u.set, u = {
        get: p,
        set: d
      }) : u = f, void 0 !== g && (void 0 === l ? l = g : "function" == typeof l ? l = [l, g] : l.push(g));
    }
    if (0 === a || 1 === a) {
      if (void 0 === l) l = function (e, t) {
        return t;
      };else if ("function" != typeof l) {
        var y = l;
        l = function (e, t) {
          for (var r = t, n = 0; n < y.length; n++) r = y[n].call(e, r);
          return r;
        };
      } else {
        var m = l;
        l = function (e, t) {
          return m.call(e, t);
        };
      }
      e.push(l);
    }
    0 !== a && (1 === a ? (c.get = u.get, c.set = u.set) : 2 === a ? c.value = u : 3 === a ? c.get = u : 4 === a && (c.set = u), s ? 1 === a ? (e.push(function (e, t) {
      return u.get.call(e, t);
    }), e.push(function (e, t) {
      return u.set.call(e, t);
    })) : 2 === a ? e.push(u) : e.push(function (e, t) {
      return u.call(e, t);
    }) : Object.defineProperty(t, n, c));
  }
  function applyMemberDecs(e, t) {
    for (var r, n, a = [], i = new Map(), s = new Map(), o = 0; o < t.length; o++) {
      var c = t[o];
      if (Array.isArray(c)) {
        var l,
          u,
          f = c[1],
          p = c[2],
          d = c.length > 3,
          h = f >= 5;
        if (h ? (l = e, 0 !== (f -= 5) && (u = n = n || [])) : (l = e.prototype, 0 !== f && (u = r = r || [])), 0 !== f && !d) {
          var v = h ? s : i,
            g = v.get(p) || 0;
          if (!0 === g || 3 === g && 4 !== f || 4 === g && 3 !== f) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + p);
          !g && f > 2 ? v.set(p, f) : v.set(p, !0);
        }
        applyMemberDec(a, l, c, p, f, h, d, u);
      }
    }
    return pushInitializers(a, r), pushInitializers(a, n), a;
  }
  function pushInitializers(e, t) {
    t && e.push(function (e) {
      for (var r = 0; r < t.length; r++) t[r].call(e);
      return e;
    });
  }
  return function (e, t, r) {
    return {
      e: applyMemberDecs(e, t),
      get c() {
        return function (e, t) {
          if (t.length > 0) {
            for (var r = [], n = e, a = e.name, i = t.length - 1; i >= 0; i--) {
              var s = {
                v: !1
              };
              try {
                var o = t[i](n, {
                  kind: "class",
                  name: a,
                  addInitializer: createAddInitializerMethod(r, s)
                });
              } finally {
                s.v = !0;
              }
              void 0 !== o && (assertValidReturnValue(10, o), n = o);
            }
            return [n, function () {
              for (var e = 0; e < r.length; e++) r[e].call(n);
            }];
          }
        }(e, r);
      }
    };
  };
}
function _applyDecs2203R(e, t, r) {
  return (_applyDecs2203R = applyDecs2203RFactory())(e, t, r);
}
function applyDecs2301Factory() {
  function createAddInitializerMethod(e, t) {
    return function (r) {
      !function (e, t) {
        if (e.v) throw new Error("attempted to call " + t + " after decoration was finished");
      }(t, "addInitializer"), assertCallable(r, "An initializer"), e.push(r);
    };
  }
  function assertInstanceIfPrivate(e, t) {
    if (!e(t)) throw new TypeError("Attempted to access private element on non-instance");
  }
  function memberDec(e, t, r, n, a, i, s, o, c) {
    var u;
    switch (a) {
      case 1:
        u = "accessor";
        break;
      case 2:
        u = "method";
        break;
      case 3:
        u = "getter";
        break;
      case 4:
        u = "setter";
        break;
      default:
        u = "field";
    }
    var l,
      f,
      p = {
        kind: u,
        name: s ? "#" + t : t,
        static: i,
        private: s
      },
      d = {
        v: !1
      };
    if (0 !== a && (p.addInitializer = createAddInitializerMethod(n, d)), s || 0 !== a && 2 !== a) {
      if (2 === a) l = function (e) {
        return assertInstanceIfPrivate(c, e), r.value;
      };else {
        var h = 0 === a || 1 === a;
        (h || 3 === a) && (l = s ? function (e) {
          return assertInstanceIfPrivate(c, e), r.get.call(e);
        } : function (e) {
          return r.get.call(e);
        }), (h || 4 === a) && (f = s ? function (e, t) {
          assertInstanceIfPrivate(c, e), r.set.call(e, t);
        } : function (e, t) {
          r.set.call(e, t);
        });
      }
    } else l = function (e) {
      return e[t];
    }, 0 === a && (f = function (e, r) {
      e[t] = r;
    });
    var v = s ? c.bind() : function (e) {
      return t in e;
    };
    p.access = l && f ? {
      get: l,
      set: f,
      has: v
    } : l ? {
      get: l,
      has: v
    } : {
      set: f,
      has: v
    };
    try {
      return e(o, p);
    } finally {
      d.v = !0;
    }
  }
  function assertCallable(e, t) {
    if ("function" != typeof e) throw new TypeError(t + " must be a function");
  }
  function assertValidReturnValue(e, t) {
    var r = typeof t;
    if (1 === e) {
      if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
      void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init");
    } else if ("function" !== r) {
      var n;
      throw n = 0 === e ? "field" : 10 === e ? "class" : "method", new TypeError(n + " decorators must return a function or void 0");
    }
  }
  function curryThis2(e) {
    return function (t) {
      e(this, t);
    };
  }
  function applyMemberDec(e, t, r, n, a, i, s, o, c) {
    var u,
      l,
      f,
      p,
      d,
      h,
      v,
      g = r[0];
    if (s ? u = 0 === a || 1 === a ? {
      get: (p = r[3], function () {
        return p(this);
      }),
      set: curryThis2(r[4])
    } : 3 === a ? {
      get: r[3]
    } : 4 === a ? {
      set: r[3]
    } : {
      value: r[3]
    } : 0 !== a && (u = Object.getOwnPropertyDescriptor(t, n)), 1 === a ? f = {
      get: u.get,
      set: u.set
    } : 2 === a ? f = u.value : 3 === a ? f = u.get : 4 === a && (f = u.set), "function" == typeof g) void 0 !== (d = memberDec(g, n, u, o, a, i, s, f, c)) && (assertValidReturnValue(a, d), 0 === a ? l = d : 1 === a ? (l = d.init, h = d.get || f.get, v = d.set || f.set, f = {
      get: h,
      set: v
    }) : f = d);else for (var y = g.length - 1; y >= 0; y--) {
      var m;
      if (void 0 !== (d = memberDec(g[y], n, u, o, a, i, s, f, c))) assertValidReturnValue(a, d), 0 === a ? m = d : 1 === a ? (m = d.init, h = d.get || f.get, v = d.set || f.set, f = {
        get: h,
        set: v
      }) : f = d, void 0 !== m && (void 0 === l ? l = m : "function" == typeof l ? l = [l, m] : l.push(m));
    }
    if (0 === a || 1 === a) {
      if (void 0 === l) l = function (e, t) {
        return t;
      };else if ("function" != typeof l) {
        var b = l;
        l = function (e, t) {
          for (var r = t, n = 0; n < b.length; n++) r = b[n].call(e, r);
          return r;
        };
      } else {
        var I = l;
        l = function (e, t) {
          return I.call(e, t);
        };
      }
      e.push(l);
    }
    0 !== a && (1 === a ? (u.get = f.get, u.set = f.set) : 2 === a ? u.value = f : 3 === a ? u.get = f : 4 === a && (u.set = f), s ? 1 === a ? (e.push(function (e, t) {
      return f.get.call(e, t);
    }), e.push(function (e, t) {
      return f.set.call(e, t);
    })) : 2 === a ? e.push(f) : e.push(function (e, t) {
      return f.call(e, t);
    }) : Object.defineProperty(t, n, u));
  }
  function applyMemberDecs(e, t, r) {
    for (var n, a, i, s = [], o = new Map(), c = new Map(), u = 0; u < t.length; u++) {
      var l = t[u];
      if (Array.isArray(l)) {
        var f,
          p,
          d = l[1],
          h = l[2],
          v = l.length > 3,
          g = d >= 5,
          y = r;
        if (g ? (f = e, 0 !== (d -= 5) && (p = a = a || []), v && !i && (i = function (t) {
          return _checkInRHS(t) === e;
        }), y = i) : (f = e.prototype, 0 !== d && (p = n = n || [])), 0 !== d && !v) {
          var m = g ? c : o,
            b = m.get(h) || 0;
          if (!0 === b || 3 === b && 4 !== d || 4 === b && 3 !== d) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
          !b && d > 2 ? m.set(h, d) : m.set(h, !0);
        }
        applyMemberDec(s, f, l, h, d, g, v, p, y);
      }
    }
    return pushInitializers(s, n), pushInitializers(s, a), s;
  }
  function pushInitializers(e, t) {
    t && e.push(function (e) {
      for (var r = 0; r < t.length; r++) t[r].call(e);
      return e;
    });
  }
  return function (e, t, r, n) {
    return {
      e: applyMemberDecs(e, t, n),
      get c() {
        return function (e, t) {
          if (t.length > 0) {
            for (var r = [], n = e, a = e.name, i = t.length - 1; i >= 0; i--) {
              var s = {
                v: !1
              };
              try {
                var o = t[i](n, {
                  kind: "class",
                  name: a,
                  addInitializer: createAddInitializerMethod(r, s)
                });
              } finally {
                s.v = !0;
              }
              void 0 !== o && (assertValidReturnValue(10, o), n = o);
            }
            return [n, function () {
              for (var e = 0; e < r.length; e++) r[e].call(n);
            }];
          }
        }(e, r);
      }
    };
  };
}
function _applyDecs2301(e, t, r, n) {
  return (_applyDecs2301 = applyDecs2301Factory())(e, t, r, n);
}
function createAddInitializerMethod(e, t) {
  return function (r) {
    assertNotFinished(t, "addInitializer"), assertCallable(r, "An initializer"), e.push(r);
  };
}
function assertInstanceIfPrivate(e, t) {
  if (!e(t)) throw new TypeError("Attempted to access private element on non-instance");
}
function memberDec(e, t, r, a, n, i, s, o, c, l, u) {
  var f;
  switch (i) {
    case 1:
      f = "accessor";
      break;
    case 2:
      f = "method";
      break;
    case 3:
      f = "getter";
      break;
    case 4:
      f = "setter";
      break;
    default:
      f = "field";
  }
  var d,
    p,
    h = {
      kind: f,
      name: o ? "#" + r : r,
      static: s,
      private: o,
      metadata: u
    },
    v = {
      v: !1
    };
  if (0 !== i && (h.addInitializer = createAddInitializerMethod(n, v)), o || 0 !== i && 2 !== i) {
    if (2 === i) d = function (e) {
      return assertInstanceIfPrivate(l, e), a.value;
    };else {
      var y = 0 === i || 1 === i;
      (y || 3 === i) && (d = o ? function (e) {
        return assertInstanceIfPrivate(l, e), a.get.call(e);
      } : function (e) {
        return a.get.call(e);
      }), (y || 4 === i) && (p = o ? function (e, t) {
        assertInstanceIfPrivate(l, e), a.set.call(e, t);
      } : function (e, t) {
        a.set.call(e, t);
      });
    }
  } else d = function (e) {
    return e[r];
  }, 0 === i && (p = function (e, t) {
    e[r] = t;
  });
  var m = o ? l.bind() : function (e) {
    return r in e;
  };
  h.access = d && p ? {
    get: d,
    set: p,
    has: m
  } : d ? {
    get: d,
    has: m
  } : {
    set: p,
    has: m
  };
  try {
    return e.call(t, c, h);
  } finally {
    v.v = !0;
  }
}
function assertNotFinished(e, t) {
  if (e.v) throw new Error("attempted to call " + t + " after decoration was finished");
}
function assertCallable(e, t) {
  if ("function" != typeof e) throw new TypeError(t + " must be a function");
}
function assertValidReturnValue(e, t) {
  var r = typeof t;
  if (1 === e) {
    if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
    void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init");
  } else if ("function" !== r) {
    var a;
    throw a = 0 === e ? "field" : 5 === e ? "class" : "method", new TypeError(a + " decorators must return a function or void 0");
  }
}
function curryThis1(e) {
  return function () {
    return e(this);
  };
}
function curryThis2(e) {
  return function (t) {
    e(this, t);
  };
}
function applyMemberDec(e, t, r, a, n, i, s, o, c, l, u) {
  var f,
    d,
    p,
    h,
    v,
    y,
    m = r[0];
  a || Array.isArray(m) || (m = [m]), o ? f = 0 === i || 1 === i ? {
    get: curryThis1(r[3]),
    set: curryThis2(r[4])
  } : 3 === i ? {
    get: r[3]
  } : 4 === i ? {
    set: r[3]
  } : {
    value: r[3]
  } : 0 !== i && (f = Object.getOwnPropertyDescriptor(t, n)), 1 === i ? p = {
    get: f.get,
    set: f.set
  } : 2 === i ? p = f.value : 3 === i ? p = f.get : 4 === i && (p = f.set);
  for (var g = a ? 2 : 1, b = m.length - 1; b >= 0; b -= g) {
    var I;
    if (void 0 !== (h = memberDec(m[b], a ? m[b - 1] : void 0, n, f, c, i, s, o, p, l, u))) assertValidReturnValue(i, h), 0 === i ? I = h : 1 === i ? (I = h.init, v = h.get || p.get, y = h.set || p.set, p = {
      get: v,
      set: y
    }) : p = h, void 0 !== I && (void 0 === d ? d = I : "function" == typeof d ? d = [d, I] : d.push(I));
  }
  if (0 === i || 1 === i) {
    if (void 0 === d) d = function (e, t) {
      return t;
    };else if ("function" != typeof d) {
      var w = d;
      d = function (e, t) {
        for (var r = t, a = w.length - 1; a >= 0; a--) r = w[a].call(e, r);
        return r;
      };
    } else {
      var M = d;
      d = function (e, t) {
        return M.call(e, t);
      };
    }
    e.push(d);
  }
  0 !== i && (1 === i ? (f.get = p.get, f.set = p.set) : 2 === i ? f.value = p : 3 === i ? f.get = p : 4 === i && (f.set = p), o ? 1 === i ? (e.push(function (e, t) {
    return p.get.call(e, t);
  }), e.push(function (e, t) {
    return p.set.call(e, t);
  })) : 2 === i ? e.push(p) : e.push(function (e, t) {
    return p.call(e, t);
  }) : Object.defineProperty(t, n, f));
}
function applyMemberDecs(e, t, r, a) {
  for (var n, i, s, o = [], c = new Map(), l = new Map(), u = 0; u < t.length; u++) {
    var f = t[u];
    if (Array.isArray(f)) {
      var d,
        p,
        h = f[1],
        v = f[2],
        y = f.length > 3,
        m = 16 & h,
        g = !!(8 & h),
        b = r;
      if (h &= 7, g ? (d = e, 0 !== h && (p = i = i || []), y && !s && (s = function (t) {
        return _checkInRHS(t) === e;
      }), b = s) : (d = e.prototype, 0 !== h && (p = n = n || [])), 0 !== h && !y) {
        var I = g ? l : c,
          w = I.get(v) || 0;
        if (!0 === w || 3 === w && 4 !== h || 4 === w && 3 !== h) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + v);
        I.set(v, !(!w && h > 2) || h);
      }
      applyMemberDec(o, d, f, m, v, h, g, y, p, b, a);
    }
  }
  return pushInitializers(o, n), pushInitializers(o, i), o;
}
function pushInitializers(e, t) {
  t && e.push(function (e) {
    for (var r = 0; r < t.length; r++) t[r].call(e);
    return e;
  });
}
function applyClassDecs(e, t, r, a) {
  if (t.length) {
    for (var n = [], i = e, s = e.name, o = r ? 2 : 1, c = t.length - 1; c >= 0; c -= o) {
      var l = {
        v: !1
      };
      try {
        var u = t[c].call(r ? t[c - 1] : void 0, i, {
          kind: "class",
          name: s,
          addInitializer: createAddInitializerMethod(n, l),
          metadata: a
        });
      } finally {
        l.v = !0;
      }
      void 0 !== u && (assertValidReturnValue(5, u), i = u);
    }
    return [defineMetadata(i, a), function () {
      for (var e = 0; e < n.length; e++) n[e].call(i);
    }];
  }
}
function defineMetadata(e, t) {
  return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), {
    configurable: !0,
    enumerable: !0,
    value: t
  });
}
function _applyDecs2305(e, t, r, a, n, i) {
  if (arguments.length >= 6) var s = i[Symbol.metadata || Symbol.for("Symbol.metadata")];
  var o = Object.create(void 0 === s ? null : s),
    c = applyMemberDecs(e, t, n, o);
  return r.length || defineMetadata(e, o), {
    e: c,
    get c() {
      return applyClassDecs(e, r, a, o);
    }
  };
}
function _asyncGeneratorDelegate(t) {
  var e = {},
    n = !1;
  function pump(e, r) {
    return n = !0, r = new Promise(function (n) {
      n(t[e](r));
    }), {
      done: !1,
      value: new _OverloadYield(r, 1)
    };
  }
  return e["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function () {
    return this;
  }, e.next = function (t) {
    return n ? (n = !1, t) : pump("next", t);
  }, "function" == typeof t.throw && (e.throw = function (t) {
    if (n) throw n = !1, t;
    return pump("throw", t);
  }), "function" == typeof t.return && (e.return = function (t) {
    return n ? (n = !1, t) : pump("return", t);
  }), e;
}
function _asyncIterator(r) {
  var n,
    t,
    o,
    e = 2;
  for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
    if (t && null != (n = r[t])) return n.call(r);
    if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
    t = "@@asyncIterator", o = "@@iterator";
  }
  throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(r) {
  function AsyncFromSyncIteratorContinuation(r) {
    if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
    var n = r.done;
    return Promise.resolve(r.value).then(function (r) {
      return {
        value: r,
        done: n
      };
    });
  }
  return AsyncFromSyncIterator = function (r) {
    this.s = r, this.n = r.next;
  }, AsyncFromSyncIterator.prototype = {
    s: null,
    n: null,
    next: function () {
      return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
    },
    return: function (r) {
      var n = this.s.return;
      return void 0 === n ? Promise.resolve({
        value: r,
        done: !0
      }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
    },
    throw: function (r) {
      var n = this.s.return;
      return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
    }
  }, new AsyncFromSyncIterator(r);
}
function _awaitAsyncGenerator(e) {
  return new _OverloadYield(e, 0);
}
function _checkInRHS(e) {
  if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null"));
  return e;
}
function _defineAccessor(e, r, n, t) {
  var c = {
    configurable: !0,
    enumerable: !0
  };
  return c[e] = t, Object.defineProperty(r, n, c);
}
function dispose_SuppressedError(r, e) {
  return "undefined" != typeof SuppressedError ? dispose_SuppressedError = SuppressedError : (dispose_SuppressedError = function (r, e) {
    this.suppressed = r, this.error = e, this.stack = new Error().stack;
  }, dispose_SuppressedError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: dispose_SuppressedError,
      writable: !0,
      configurable: !0
    }
  })), new dispose_SuppressedError(r, e);
}
function _dispose(r, e, s) {
  function next() {
    for (; r.length > 0;) try {
      var o = r.pop(),
        p = o.d.call(o.v);
      if (o.a) return Promise.resolve(p).then(next, err);
    } catch (r) {
      return err(r);
    }
    if (s) throw e;
  }
  function err(r) {
    return e = s ? new dispose_SuppressedError(r, e) : r, s = !0, next();
  }
  return next();
}
function _importDeferProxy(e) {
  var t = null,
    constValue = function (e) {
      return function () {
        return e;
      };
    },
    proxy = function (r) {
      return function (n, o, f) {
        return null === t && (t = e()), r(t, o, f);
      };
    };
  return new Proxy({}, {
    defineProperty: constValue(!1),
    deleteProperty: constValue(!1),
    get: proxy(Reflect.get),
    getOwnPropertyDescriptor: proxy(Reflect.getOwnPropertyDescriptor),
    getPrototypeOf: constValue(null),
    isExtensible: constValue(!1),
    has: proxy(Reflect.has),
    ownKeys: proxy(Reflect.ownKeys),
    preventExtensions: constValue(!0),
    set: constValue(!1),
    setPrototypeOf: constValue(!1)
  });
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _iterableToArrayLimitLoose(e, r) {
  var t = e && ("undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"]);
  if (null != t) {
    var o,
      l = [];
    for (t = t.call(e); e.length < r && !(o = t.next()).done;) l.push(o.value);
    return l;
  }
}
var REACT_ELEMENT_TYPE;
function _jsx(e, r, E, l) {
  REACT_ELEMENT_TYPE || (REACT_ELEMENT_TYPE = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103);
  var o = e && e.defaultProps,
    n = arguments.length - 3;
  if (r || 0 === n || (r = {
    children: void 0
  }), 1 === n) r.children = l;else if (n > 1) {
    for (var t = new Array(n), f = 0; f < n; f++) t[f] = arguments[f + 3];
    r.children = t;
  }
  if (r && o) for (var i in o) void 0 === r[i] && (r[i] = o[i]);else r || (r = o || {});
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: e,
    key: void 0 === E ? null : "" + E,
    ref: null,
    props: r,
    _owner: null
  };
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _using(o, e, n) {
  if (null == e) return e;
  if ("object" != typeof e) throw new TypeError("using declarations can only be used with objects, null, or undefined.");
  if (n) var r = e[Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")];
  if (null == r && (r = e[Symbol.dispose || Symbol.for("Symbol.dispose")]), "function" != typeof r) throw new TypeError("Property [Symbol.dispose] is not a function.");
  return o.push({
    v: e,
    d: r,
    a: n
  }), e;
}
function _wrapRegExp() {
  _wrapRegExp = function (e, r) {
    return new BabelRegExp(e, void 0, r);
  };
  var e = RegExp.prototype,
    r = new WeakMap();
  function BabelRegExp(e, t, p) {
    var o = new RegExp(e, t);
    return r.set(o, p || r.get(e)), _setPrototypeOf(o, BabelRegExp.prototype);
  }
  function buildGroups(e, t) {
    var p = r.get(t);
    return Object.keys(p).reduce(function (r, t) {
      var o = p[t];
      if ("number" == typeof o) r[t] = e[o];else {
        for (var i = 0; void 0 === e[o[i]] && i + 1 < o.length;) i++;
        r[t] = e[o[i]];
      }
      return r;
    }, Object.create(null));
  }
  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (r) {
    var t = e.exec.call(this, r);
    if (t) {
      t.groups = buildGroups(t, this);
      var p = t.indices;
      p && (p.groups = buildGroups(p, this));
    }
    return t;
  }, BabelRegExp.prototype[Symbol.replace] = function (t, p) {
    if ("string" == typeof p) {
      var o = r.get(this);
      return e[Symbol.replace].call(this, t, p.replace(/\$<([^>]+)>/g, function (e, r) {
        var t = o[r];
        return "$" + (Array.isArray(t) ? t.join("$") : t);
      }));
    }
    if ("function" == typeof p) {
      var i = this;
      return e[Symbol.replace].call(this, t, function () {
        var e = arguments;
        return "object" != typeof e[e.length - 1] && (e = [].slice.call(e)).push(buildGroups(e, i)), p.apply(this, e);
      });
    }
    return e[Symbol.replace].call(this, t, p);
  }, _wrapRegExp.apply(this, arguments);
}
function _AwaitValue(value) {
  this.wrapped = value;
}
function _wrapAsyncGenerator(fn) {
  return function () {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineEnumerableProperties(obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }
  if (Object.getOwnPropertySymbols) {
    var objectSymbols = Object.getOwnPropertySymbols(descs);
    for (var i = 0; i < objectSymbols.length; i++) {
      var sym = objectSymbols[i];
      var desc = descs[sym];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, sym, desc);
    }
  }
  return obj;
}
function _defaults(obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);
    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }
  return obj;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}
function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure " + obj);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function set(target, property, value, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.set) {
    set = Reflect.set;
  } else {
    set = function set(target, property, value, receiver) {
      var base = _superPropBase(target, property);
      var desc;
      if (base) {
        desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.set) {
          desc.set.call(receiver, value);
          return true;
        } else if (!desc.writable) {
          return false;
        }
      }
      desc = Object.getOwnPropertyDescriptor(receiver, property);
      if (desc) {
        if (!desc.writable) {
          return false;
        }
        desc.value = value;
        Object.defineProperty(receiver, property, desc);
      } else {
        _defineProperty(receiver, property, value);
      }
      return true;
    };
  }
  return set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
  var s = set(target, property, value, receiver || target);
  if (!s && isStrict) {
    throw new TypeError('failed to set property');
  }
  return value;
}
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}
function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  strings.raw = raw;
  return strings;
}
function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}
function _writeOnlyError(name) {
  throw new TypeError("\"" + name + "\" is write-only");
}
function _classNameTDZError(name) {
  throw new ReferenceError("Class \"" + name + "\" cannot be referenced in computed property keys.");
}
function _temporalUndefined() {}
function _tdz(name) {
  throw new ReferenceError(name + " is not defined - temporal dead zone");
}
function _temporalRef(val, name) {
  return val === _temporalUndefined ? _tdz(name) : val;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _slicedToArrayLoose(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _maybeArrayLike(next, arr, i) {
  if (arr && !Array.isArray(arr) && typeof arr.length === "number") {
    var len = arr.length;
    return _arrayLikeToArray(arr, i !== void 0 && i < len ? i : len);
  }
  return next(arr, i);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _skipFirstGeneratorNext(fn) {
  return function () {
    var it = fn.apply(this, arguments);
    it.next();
    return it;
  };
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.');
}
function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}
var id$1 = 0;
function _classPrivateFieldLooseKey(name) {
  return "__private_" + id$1++ + "_" + name;
}
function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }
  return receiver;
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classPrivateFieldDestructureSet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  return _classApplyDescriptorDestructureSet(receiver, descriptor);
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);
  _classCheckPrivateStaticFieldDescriptor(descriptor, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);
  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);
  return method;
}
function _classStaticPrivateMethodSet() {
  throw new TypeError("attempted to set read only static private field");
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classApplyDescriptorDestructureSet(receiver, descriptor) {
  if (descriptor.set) {
    if (!("__destrObj" in descriptor)) {
      descriptor.__destrObj = {
        set value(v) {
          descriptor.set.call(receiver, v);
        }
      };
    }
    return descriptor.__destrObj;
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    return descriptor;
  }
}
function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);
  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");
  return _classApplyDescriptorDestructureSet(receiver, descriptor);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
  if (receiver !== classConstructor) {
    throw new TypeError("Private static access of wrong provenance");
  }
}
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
  if (descriptor === undefined) {
    throw new TypeError("attempted to " + action + " private static field before its declaration");
  }
}
function _decorate(decorators, factory, superClass, mixins) {
  var api = _getDecoratorsApi();
  if (mixins) {
    for (var i = 0; i < mixins.length; i++) {
      api = mixins[i](api);
    }
  }
  var r = factory(function initialize(O) {
    api.initializeInstanceElements(O, decorated.elements);
  }, superClass);
  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
  api.initializeClassElements(r.F, decorated.elements);
  return api.runClassFinishers(r.F, decorated.finishers);
}
function _getDecoratorsApi() {
  _getDecoratorsApi = function () {
    return api;
  };
  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
      var proto = F.prototype;
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          var placement = element.placement;
          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
            var receiver = placement === "static" ? F : proto;
            this.defineClassElement(receiver, element);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (receiver, element) {
      var descriptor = element.descriptor;
      if (element.kind === "field") {
        var initializer = element.initializer;
        descriptor = {
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          value: initializer === void 0 ? void 0 : initializer.call(receiver)
        };
      }
      Object.defineProperty(receiver, element.key, descriptor);
    },
    decorateClass: function (elements, decorators) {
      var newElements = [];
      var finishers = [];
      var placements = {
        static: [],
        prototype: [],
        own: []
      };
      elements.forEach(function (element) {
        this.addElementPlacement(element, placements);
      }, this);
      elements.forEach(function (element) {
        if (!_hasDecorators(element)) return newElements.push(element);
        var elementFinishersExtras = this.decorateElement(element, placements);
        newElements.push(elementFinishersExtras.element);
        newElements.push.apply(newElements, elementFinishersExtras.extras);
        finishers.push.apply(finishers, elementFinishersExtras.finishers);
      }, this);
      if (!decorators) {
        return {
          elements: newElements,
          finishers: finishers
        };
      }
      var result = this.decorateConstructor(newElements, decorators);
      finishers.push.apply(finishers, result.finishers);
      result.finishers = finishers;
      return result;
    },
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];
      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }
      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
      var extras = [];
      var finishers = [];
      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
        var keys = placements[element.placement];
        keys.splice(keys.indexOf(element.key), 1);
        var elementObject = this.fromElementDescriptor(element);
        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
        element = elementFinisherExtras.element;
        this.addElementPlacement(element, placements);
        if (elementFinisherExtras.finisher) {
          finishers.push(elementFinisherExtras.finisher);
        }
        var newExtras = elementFinisherExtras.extras;
        if (newExtras) {
          for (var j = 0; j < newExtras.length; j++) {
            this.addElementPlacement(newExtras[j], placements);
          }
          extras.push.apply(extras, newExtras);
        }
      }
      return {
        element: element,
        finishers: finishers,
        extras: extras
      };
    },
    decorateConstructor: function (elements, decorators) {
      var finishers = [];
      for (var i = decorators.length - 1; i >= 0; i--) {
        var obj = this.fromClassDescriptor(elements);
        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);
        if (elementsAndFinisher.finisher !== undefined) {
          finishers.push(elementsAndFinisher.finisher);
        }
        if (elementsAndFinisher.elements !== undefined) {
          elements = elementsAndFinisher.elements;
          for (var j = 0; j < elements.length - 1; j++) {
            for (var k = j + 1; k < elements.length; k++) {
              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                throw new TypeError("Duplicated element (" + elements[j].key + ")");
              }
            }
          }
        }
      }
      return {
        elements: elements,
        finishers: finishers
      };
    },
    fromElementDescriptor: function (element) {
      var obj = {
        kind: element.kind,
        key: element.key,
        placement: element.placement,
        descriptor: element.descriptor
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      if (element.kind === "field") obj.initializer = element.initializer;
      return obj;
    },
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
      var kind = String(elementObject.kind);
      if (kind !== "method" && kind !== "field") {
        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
      }
      var key = _toPropertyKey(elementObject.key);
      var placement = String(elementObject.placement);
      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
      }
      var descriptor = elementObject.descriptor;
      this.disallowProperty(elementObject, "elements", "An element descriptor");
      var element = {
        kind: kind,
        key: key,
        placement: placement,
        descriptor: Object.assign({}, descriptor)
      };
      if (kind !== "field") {
        this.disallowProperty(elementObject, "initializer", "A method descriptor");
      } else {
        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
        element.initializer = elementObject.initializer;
      }
      return element;
    },
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);
      var finisher = _optionalCallableProperty(elementObject, "finisher");
      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
      var obj = {
        kind: "class",
        elements: elements.map(this.fromElementDescriptor, this)
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      return obj;
    },
    toClassDescriptor: function (obj) {
      var kind = String(obj.kind);
      if (kind !== "class") {
        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
      }
      this.disallowProperty(obj, "key", "A class descriptor");
      this.disallowProperty(obj, "placement", "A class descriptor");
      this.disallowProperty(obj, "descriptor", "A class descriptor");
      this.disallowProperty(obj, "initializer", "A class descriptor");
      this.disallowProperty(obj, "extras", "A class descriptor");
      var finisher = _optionalCallableProperty(obj, "finisher");
      var elements = this.toElementDescriptors(obj.elements);
      return {
        elements: elements,
        finisher: finisher
      };
    },
    runClassFinishers: function (constructor, finishers) {
      for (var i = 0; i < finishers.length; i++) {
        var newConstructor = (0, finishers[i])(constructor);
        if (newConstructor !== undefined) {
          if (typeof newConstructor !== "function") {
            throw new TypeError("Finishers must return a constructor.");
          }
          constructor = newConstructor;
        }
      }
      return constructor;
    },
    disallowProperty: function (obj, name, objectType) {
      if (obj[name] !== undefined) {
        throw new TypeError(objectType + " can't have a ." + name + " property.");
      }
    }
  };
  return api;
}
function _createElementDescriptor(def) {
  var key = _toPropertyKey(def.key);
  var descriptor;
  if (def.kind === "method") {
    descriptor = {
      value: def.value,
      writable: true,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "get") {
    descriptor = {
      get: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "set") {
    descriptor = {
      set: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "field") {
    descriptor = {
      configurable: true,
      writable: true,
      enumerable: true
    };
  }
  var element = {
    kind: def.kind === "field" ? "field" : "method",
    key: key,
    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
    descriptor: descriptor
  };
  if (def.decorators) element.decorators = def.decorators;
  if (def.kind === "field") element.initializer = def.value;
  return element;
}
function _coalesceGetterSetter(element, other) {
  if (element.descriptor.get !== undefined) {
    other.descriptor.get = element.descriptor.get;
  } else {
    other.descriptor.set = element.descriptor.set;
  }
}
function _coalesceClassElements(elements) {
  var newElements = [];
  var isSameElement = function (other) {
    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
  };
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var other;
    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
        if (_hasDecorators(element) || _hasDecorators(other)) {
          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
        }
        other.descriptor = element.descriptor;
      } else {
        if (_hasDecorators(element)) {
          if (_hasDecorators(other)) {
            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
          }
          other.decorators = element.decorators;
        }
        _coalesceGetterSetter(element, other);
      }
    } else {
      newElements.push(element);
    }
  }
  return newElements;
}
function _hasDecorators(element) {
  return element.decorators && element.decorators.length;
}
function _isDataDescriptor(desc) {
  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
}
function _optionalCallableProperty(obj, name) {
  var value = obj[name];
  if (value !== undefined && typeof value !== "function") {
    throw new TypeError("Expected '" + name + "' to be a function");
  }
  return value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return fn;
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}
function _classPrivateMethodSet() {
  throw new TypeError("attempted to reassign private method");
}
function _identity(x) {
  return x;
}
function _nullishReceiverError(r) {
  throw new TypeError("Cannot set property of null or undefined.");
}

class Piece extends TrixObject {
  static registerType(type, constructor) {
    constructor.type = type;
    this.types[type] = constructor;
  }
  static fromJSON(pieceJSON) {
    const constructor = this.types[pieceJSON.type];
    if (constructor) {
      return constructor.fromJSON(pieceJSON);
    }
  }
  constructor(value) {
    let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.attributes = Hash.box(attributes);
  }
  copyWithAttributes(attributes) {
    return new this.constructor(this.getValue(), attributes);
  }
  copyWithAdditionalAttributes(attributes) {
    return this.copyWithAttributes(this.attributes.merge(attributes));
  }
  copyWithoutAttribute(attribute) {
    return this.copyWithAttributes(this.attributes.remove(attribute));
  }
  copy() {
    return this.copyWithAttributes(this.attributes);
  }
  getAttribute(attribute) {
    return this.attributes.get(attribute);
  }
  getAttributesHash() {
    return this.attributes;
  }
  getAttributes() {
    return this.attributes.toObject();
  }
  hasAttribute(attribute) {
    return this.attributes.has(attribute);
  }
  hasSameStringValueAsPiece(piece) {
    return piece && this.toString() === piece.toString();
  }
  hasSameAttributesAsPiece(piece) {
    return piece && (this.attributes === piece.attributes || this.attributes.isEqualTo(piece.attributes));
  }
  isBlockBreak() {
    return false;
  }
  isEqualTo(piece) {
    return super.isEqualTo(...arguments) || this.hasSameConstructorAs(piece) && this.hasSameStringValueAsPiece(piece) && this.hasSameAttributesAsPiece(piece);
  }
  isEmpty() {
    return this.length === 0;
  }
  isSerializable() {
    return true;
  }
  toJSON() {
    return {
      type: this.constructor.type,
      attributes: this.getAttributes()
    };
  }
  contentsForInspection() {
    return {
      type: this.constructor.type,
      attributes: this.attributes.inspect()
    };
  }

  // Grouping

  canBeGrouped() {
    return this.hasAttribute("href");
  }
  canBeGroupedWith(piece) {
    return this.getAttribute("href") === piece.getAttribute("href");
  }

  // Splittable

  getLength() {
    return this.length;
  }
  canBeConsolidatedWith(piece) {
    return false;
  }
}
_defineProperty(Piece, "types", {});

class ImagePreloadOperation extends Operation {
  constructor(url) {
    super(...arguments);
    this.url = url;
  }
  perform(callback) {
    const image = new Image();
    image.onload = () => {
      image.width = this.width = image.naturalWidth;
      image.height = this.height = image.naturalHeight;
      return callback(true, image);
    };
    image.onerror = () => callback(false);
    image.src = this.url;
  }
}

class Attachment extends TrixObject {
  static attachmentForFile(file) {
    const attributes = this.attributesForFile(file);
    const attachment = new this(attributes);
    attachment.setFile(file);
    return attachment;
  }
  static attributesForFile(file) {
    return new Hash({
      filename: file.name,
      filesize: file.size,
      contentType: file.type
    });
  }
  static fromJSON(attachmentJSON) {
    return new this(attachmentJSON);
  }
  constructor() {
    let attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(attributes);
    this.releaseFile = this.releaseFile.bind(this);
    this.attributes = Hash.box(attributes);
    this.didChangeAttributes();
  }
  getAttribute(attribute) {
    return this.attributes.get(attribute);
  }
  hasAttribute(attribute) {
    return this.attributes.has(attribute);
  }
  getAttributes() {
    return this.attributes.toObject();
  }
  setAttributes() {
    let attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const newAttributes = this.attributes.merge(attributes);
    if (!this.attributes.isEqualTo(newAttributes)) {
      var _this$previewDelegate, _this$previewDelegate2, _this$delegate, _this$delegate$attach;
      this.attributes = newAttributes;
      this.didChangeAttributes();
      (_this$previewDelegate = this.previewDelegate) === null || _this$previewDelegate === void 0 || (_this$previewDelegate2 = _this$previewDelegate.attachmentDidChangeAttributes) === null || _this$previewDelegate2 === void 0 || _this$previewDelegate2.call(_this$previewDelegate, this);
      return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$attach = _this$delegate.attachmentDidChangeAttributes) === null || _this$delegate$attach === void 0 ? void 0 : _this$delegate$attach.call(_this$delegate, this);
    }
  }
  didChangeAttributes() {
    if (this.isPreviewable()) {
      return this.preloadURL();
    }
  }
  isPending() {
    return this.file != null && !(this.getURL() || this.getHref());
  }
  isPreviewable() {
    if (this.attributes.has("previewable")) {
      return this.attributes.get("previewable");
    } else {
      return Attachment.previewablePattern.test(this.getContentType());
    }
  }
  getType() {
    if (this.hasContent()) {
      return "content";
    } else if (this.isPreviewable()) {
      return "preview";
    } else {
      return "file";
    }
  }
  getURL() {
    return this.attributes.get("url");
  }
  getHref() {
    return this.attributes.get("href");
  }
  getFilename() {
    return this.attributes.get("filename") || "";
  }
  getFilesize() {
    return this.attributes.get("filesize");
  }
  getFormattedFilesize() {
    const filesize = this.attributes.get("filesize");
    if (typeof filesize === "number") {
      return file_size_formatting.formatter(filesize);
    } else {
      return "";
    }
  }
  getExtension() {
    var _this$getFilename$mat;
    return (_this$getFilename$mat = this.getFilename().match(/\.(\w+)$/)) === null || _this$getFilename$mat === void 0 ? void 0 : _this$getFilename$mat[1].toLowerCase();
  }
  getContentType() {
    return this.attributes.get("contentType");
  }
  hasContent() {
    return this.attributes.has("content");
  }
  getContent() {
    return this.attributes.get("content");
  }
  getWidth() {
    return this.attributes.get("width");
  }
  getHeight() {
    return this.attributes.get("height");
  }
  getFile() {
    return this.file;
  }
  setFile(file) {
    this.file = file;
    if (this.isPreviewable()) {
      return this.preloadFile();
    }
  }
  releaseFile() {
    this.releasePreloadedFile();
    this.file = null;
  }
  getUploadProgress() {
    return this.uploadProgress != null ? this.uploadProgress : 0;
  }
  setUploadProgress(value) {
    if (this.uploadProgress !== value) {
      var _this$uploadProgressD, _this$uploadProgressD2;
      this.uploadProgress = value;
      return (_this$uploadProgressD = this.uploadProgressDelegate) === null || _this$uploadProgressD === void 0 || (_this$uploadProgressD2 = _this$uploadProgressD.attachmentDidChangeUploadProgress) === null || _this$uploadProgressD2 === void 0 ? void 0 : _this$uploadProgressD2.call(_this$uploadProgressD, this);
    }
  }
  toJSON() {
    return this.getAttributes();
  }
  getCacheKey() {
    return [super.getCacheKey(...arguments), this.attributes.getCacheKey(), this.getPreviewURL()].join("/");
  }

  // Previewable

  getPreviewURL() {
    return this.previewURL || this.preloadingURL;
  }
  setPreviewURL(url) {
    if (url !== this.getPreviewURL()) {
      var _this$previewDelegate3, _this$previewDelegate4, _this$delegate2, _this$delegate2$attac;
      this.previewURL = url;
      (_this$previewDelegate3 = this.previewDelegate) === null || _this$previewDelegate3 === void 0 || (_this$previewDelegate4 = _this$previewDelegate3.attachmentDidChangeAttributes) === null || _this$previewDelegate4 === void 0 || _this$previewDelegate4.call(_this$previewDelegate3, this);
      return (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 || (_this$delegate2$attac = _this$delegate2.attachmentDidChangePreviewURL) === null || _this$delegate2$attac === void 0 ? void 0 : _this$delegate2$attac.call(_this$delegate2, this);
    }
  }
  preloadURL() {
    return this.preload(this.getURL(), this.releaseFile);
  }
  preloadFile() {
    if (this.file) {
      this.fileObjectURL = URL.createObjectURL(this.file);
      return this.preload(this.fileObjectURL);
    }
  }
  releasePreloadedFile() {
    if (this.fileObjectURL) {
      URL.revokeObjectURL(this.fileObjectURL);
      this.fileObjectURL = null;
    }
  }
  preload(url, callback) {
    if (url && url !== this.getPreviewURL()) {
      this.preloadingURL = url;
      const operation = new ImagePreloadOperation(url);
      return operation.then(_ref => {
        let {
          width,
          height
        } = _ref;
        if (!this.getWidth() || !this.getHeight()) {
          this.setAttributes({
            width,
            height
          });
        }
        this.preloadingURL = null;
        this.setPreviewURL(url);
        return callback === null || callback === void 0 ? void 0 : callback();
      }).catch(() => {
        this.preloadingURL = null;
        return callback === null || callback === void 0 ? void 0 : callback();
      });
    }
  }
}
_defineProperty(Attachment, "previewablePattern", /^image(\/(gif|png|webp|jpe?g)|$)/);

class AttachmentPiece extends Piece {
  static fromJSON(pieceJSON) {
    return new this(Attachment.fromJSON(pieceJSON.attachment), pieceJSON.attributes);
  }
  constructor(attachment) {
    super(...arguments);
    this.attachment = attachment;
    this.length = 1;
    this.ensureAttachmentExclusivelyHasAttribute("href");
    if (!this.attachment.hasContent()) {
      this.removeProhibitedAttributes();
    }
  }
  ensureAttachmentExclusivelyHasAttribute(attribute) {
    if (this.hasAttribute(attribute)) {
      if (!this.attachment.hasAttribute(attribute)) {
        this.attachment.setAttributes(this.attributes.slice([attribute]));
      }
      this.attributes = this.attributes.remove(attribute);
    }
  }
  removeProhibitedAttributes() {
    const attributes = this.attributes.slice(AttachmentPiece.permittedAttributes);
    if (!attributes.isEqualTo(this.attributes)) {
      this.attributes = attributes;
    }
  }
  getValue() {
    return this.attachment;
  }
  isSerializable() {
    return !this.attachment.isPending();
  }
  getCaption() {
    return this.attributes.get("caption") || "";
  }
  isEqualTo(piece) {
    var _piece$attachment;
    return super.isEqualTo(piece) && this.attachment.id === (piece === null || piece === void 0 || (_piece$attachment = piece.attachment) === null || _piece$attachment === void 0 ? void 0 : _piece$attachment.id);
  }
  toString() {
    return OBJECT_REPLACEMENT_CHARACTER;
  }
  toJSON() {
    const json = super.toJSON(...arguments);
    json.attachment = this.attachment;
    return json;
  }
  getCacheKey() {
    return [super.getCacheKey(...arguments), this.attachment.getCacheKey()].join("/");
  }
  toConsole() {
    return JSON.stringify(this.toString());
  }
}
_defineProperty(AttachmentPiece, "permittedAttributes", ["caption", "presentation"]);
Piece.registerType("attachment", AttachmentPiece);

class StringPiece extends Piece {
  static fromJSON(pieceJSON) {
    return new this(pieceJSON.string, pieceJSON.attributes);
  }
  constructor(string) {
    super(...arguments);
    this.string = normalizeNewlines(string);
    this.length = this.string.length;
  }
  getValue() {
    return this.string;
  }
  toString() {
    return this.string.toString();
  }
  isBlockBreak() {
    return this.toString() === "\n" && this.getAttribute("blockBreak") === true;
  }
  toJSON() {
    const result = super.toJSON(...arguments);
    result.string = this.string;
    return result;
  }

  // Splittable

  canBeConsolidatedWith(piece) {
    return piece && this.hasSameConstructorAs(piece) && this.hasSameAttributesAsPiece(piece);
  }
  consolidateWith(piece) {
    return new this.constructor(this.toString() + piece.toString(), this.attributes);
  }
  splitAtOffset(offset) {
    let left, right;
    if (offset === 0) {
      left = null;
      right = this;
    } else if (offset === this.length) {
      left = this;
      right = null;
    } else {
      left = new this.constructor(this.string.slice(0, offset), this.attributes);
      right = new this.constructor(this.string.slice(offset), this.attributes);
    }
    return [left, right];
  }
  toConsole() {
    let {
      string
    } = this;
    if (string.length > 15) {
      string = string.slice(0, 14) + "…";
    }
    return JSON.stringify(string.toString());
  }
}
Piece.registerType("string", StringPiece);

/* eslint-disable
    prefer-const,
*/
class SplittableList extends TrixObject {
  static box(objects) {
    if (objects instanceof this) {
      return objects;
    } else {
      return new this(objects);
    }
  }
  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    this.objects = objects.slice(0);
    this.length = this.objects.length;
  }
  indexOf(object) {
    return this.objects.indexOf(object);
  }
  splice() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return new this.constructor(spliceArray(this.objects, ...args));
  }
  eachObject(callback) {
    return this.objects.map((object, index) => callback(object, index));
  }
  insertObjectAtIndex(object, index) {
    return this.splice(index, 0, object);
  }
  insertSplittableListAtIndex(splittableList, index) {
    return this.splice(index, 0, ...splittableList.objects);
  }
  insertSplittableListAtPosition(splittableList, position) {
    const [objects, index] = this.splitObjectAtPosition(position);
    return new this.constructor(objects).insertSplittableListAtIndex(splittableList, index);
  }
  editObjectAtIndex(index, callback) {
    return this.replaceObjectAtIndex(callback(this.objects[index]), index);
  }
  replaceObjectAtIndex(object, index) {
    return this.splice(index, 1, object);
  }
  removeObjectAtIndex(index) {
    return this.splice(index, 1);
  }
  getObjectAtIndex(index) {
    return this.objects[index];
  }
  getSplittableListInRange(range) {
    const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
    return new this.constructor(objects.slice(leftIndex, rightIndex + 1));
  }
  selectSplittableList(test) {
    const objects = this.objects.filter(object => test(object));
    return new this.constructor(objects);
  }
  removeObjectsInRange(range) {
    const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
    return new this.constructor(objects).splice(leftIndex, rightIndex - leftIndex + 1);
  }
  transformObjectsInRange(range, transform) {
    const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
    const transformedObjects = objects.map((object, index) => leftIndex <= index && index <= rightIndex ? transform(object) : object);
    return new this.constructor(transformedObjects);
  }
  splitObjectsAtRange(range) {
    let rightOuterIndex;
    let [objects, leftInnerIndex, offset] = this.splitObjectAtPosition(startOfRange(range));
    [objects, rightOuterIndex] = new this.constructor(objects).splitObjectAtPosition(endOfRange(range) + offset);
    return [objects, leftInnerIndex, rightOuterIndex - 1];
  }
  getObjectAtPosition(position) {
    const {
      index
    } = this.findIndexAndOffsetAtPosition(position);
    return this.objects[index];
  }
  splitObjectAtPosition(position) {
    let splitIndex, splitOffset;
    const {
      index,
      offset
    } = this.findIndexAndOffsetAtPosition(position);
    const objects = this.objects.slice(0);
    if (index != null) {
      if (offset === 0) {
        splitIndex = index;
        splitOffset = 0;
      } else {
        const object = this.getObjectAtIndex(index);
        const [leftObject, rightObject] = object.splitAtOffset(offset);
        objects.splice(index, 1, leftObject, rightObject);
        splitIndex = index + 1;
        splitOffset = leftObject.getLength() - offset;
      }
    } else {
      splitIndex = objects.length;
      splitOffset = 0;
    }
    return [objects, splitIndex, splitOffset];
  }
  consolidate() {
    const objects = [];
    let pendingObject = this.objects[0];
    this.objects.slice(1).forEach(object => {
      var _pendingObject$canBeC, _pendingObject;
      if ((_pendingObject$canBeC = (_pendingObject = pendingObject).canBeConsolidatedWith) !== null && _pendingObject$canBeC !== void 0 && _pendingObject$canBeC.call(_pendingObject, object)) {
        pendingObject = pendingObject.consolidateWith(object);
      } else {
        objects.push(pendingObject);
        pendingObject = object;
      }
    });
    if (pendingObject) {
      objects.push(pendingObject);
    }
    return new this.constructor(objects);
  }
  consolidateFromIndexToIndex(startIndex, endIndex) {
    const objects = this.objects.slice(0);
    const objectsInRange = objects.slice(startIndex, endIndex + 1);
    const consolidatedInRange = new this.constructor(objectsInRange).consolidate().toArray();
    return this.splice(startIndex, objectsInRange.length, ...consolidatedInRange);
  }
  findIndexAndOffsetAtPosition(position) {
    let index;
    let currentPosition = 0;
    for (index = 0; index < this.objects.length; index++) {
      const object = this.objects[index];
      const nextPosition = currentPosition + object.getLength();
      if (currentPosition <= position && position < nextPosition) {
        return {
          index,
          offset: position - currentPosition
        };
      }
      currentPosition = nextPosition;
    }
    return {
      index: null,
      offset: null
    };
  }
  findPositionAtIndexAndOffset(index, offset) {
    let position = 0;
    for (let currentIndex = 0; currentIndex < this.objects.length; currentIndex++) {
      const object = this.objects[currentIndex];
      if (currentIndex < index) {
        position += object.getLength();
      } else if (currentIndex === index) {
        position += offset;
        break;
      }
    }
    return position;
  }
  getEndPosition() {
    if (this.endPosition == null) {
      this.endPosition = 0;
      this.objects.forEach(object => this.endPosition += object.getLength());
    }
    return this.endPosition;
  }
  toString() {
    return this.objects.join("");
  }
  toArray() {
    return this.objects.slice(0);
  }
  toJSON() {
    return this.toArray();
  }
  isEqualTo(splittableList) {
    return super.isEqualTo(...arguments) || objectArraysAreEqual(this.objects, splittableList === null || splittableList === void 0 ? void 0 : splittableList.objects);
  }
  contentsForInspection() {
    return {
      objects: "[".concat(this.objects.map(object => object.inspect()).join(", "), "]")
    };
  }
}
const objectArraysAreEqual = function (left) {
  let right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (left.length !== right.length) {
    return false;
  }
  let result = true;
  for (let index = 0; index < left.length; index++) {
    const object = left[index];
    if (result && !object.isEqualTo(right[index])) {
      result = false;
    }
  }
  return result;
};
const startOfRange = range => range[0];
const endOfRange = range => range[1];

class Text extends TrixObject {
  static textForAttachmentWithAttributes(attachment, attributes) {
    const piece = new AttachmentPiece(attachment, attributes);
    return new this([piece]);
  }
  static textForStringWithAttributes(string, attributes) {
    const piece = new StringPiece(string, attributes);
    return new this([piece]);
  }
  static fromJSON(textJSON) {
    const pieces = Array.from(textJSON).map(pieceJSON => Piece.fromJSON(pieceJSON));
    return new this(pieces);
  }
  constructor() {
    let pieces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    const notEmpty = pieces.filter(piece => !piece.isEmpty());
    this.pieceList = new SplittableList(notEmpty);
  }
  copy() {
    return this.copyWithPieceList(this.pieceList);
  }
  copyWithPieceList(pieceList) {
    return new this.constructor(pieceList.consolidate().toArray());
  }
  copyUsingObjectMap(objectMap) {
    const pieces = this.getPieces().map(piece => objectMap.find(piece) || piece);
    return new this.constructor(pieces);
  }
  appendText(text) {
    return this.insertTextAtPosition(text, this.getLength());
  }
  insertTextAtPosition(text, position) {
    return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(text.pieceList, position));
  }
  removeTextAtRange(range) {
    return this.copyWithPieceList(this.pieceList.removeObjectsInRange(range));
  }
  replaceTextAtRange(text, range) {
    return this.removeTextAtRange(range).insertTextAtPosition(text, range[0]);
  }
  moveTextFromRangeToPosition(range, position) {
    if (range[0] <= position && position <= range[1]) return;
    const text = this.getTextAtRange(range);
    const length = text.getLength();
    if (range[0] < position) {
      position -= length;
    }
    return this.removeTextAtRange(range).insertTextAtPosition(text, position);
  }
  addAttributeAtRange(attribute, value, range) {
    const attributes = {};
    attributes[attribute] = value;
    return this.addAttributesAtRange(attributes, range);
  }
  addAttributesAtRange(attributes, range) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, piece => piece.copyWithAdditionalAttributes(attributes)));
  }
  removeAttributeAtRange(attribute, range) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, piece => piece.copyWithoutAttribute(attribute)));
  }
  setAttributesAtRange(attributes, range) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, piece => piece.copyWithAttributes(attributes)));
  }
  getAttributesAtPosition(position) {
    var _this$pieceList$getOb;
    return ((_this$pieceList$getOb = this.pieceList.getObjectAtPosition(position)) === null || _this$pieceList$getOb === void 0 ? void 0 : _this$pieceList$getOb.getAttributes()) || {};
  }
  getCommonAttributes() {
    const objects = Array.from(this.pieceList.toArray()).map(piece => piece.getAttributes());
    return Hash.fromCommonAttributesOfObjects(objects).toObject();
  }
  getCommonAttributesAtRange(range) {
    return this.getTextAtRange(range).getCommonAttributes() || {};
  }
  getExpandedRangeForAttributeAtOffset(attributeName, offset) {
    let right;
    let left = right = offset;
    const length = this.getLength();
    while (left > 0 && this.getCommonAttributesAtRange([left - 1, right])[attributeName]) {
      left--;
    }
    while (right < length && this.getCommonAttributesAtRange([offset, right + 1])[attributeName]) {
      right++;
    }
    return [left, right];
  }
  getTextAtRange(range) {
    return this.copyWithPieceList(this.pieceList.getSplittableListInRange(range));
  }
  getStringAtRange(range) {
    return this.pieceList.getSplittableListInRange(range).toString();
  }
  getStringAtPosition(position) {
    return this.getStringAtRange([position, position + 1]);
  }
  startsWithString(string) {
    return this.getStringAtRange([0, string.length]) === string;
  }
  endsWithString(string) {
    const length = this.getLength();
    return this.getStringAtRange([length - string.length, length]) === string;
  }
  getAttachmentPieces() {
    return this.pieceList.toArray().filter(piece => !!piece.attachment);
  }
  getAttachments() {
    return this.getAttachmentPieces().map(piece => piece.attachment);
  }
  getAttachmentAndPositionById(attachmentId) {
    let position = 0;
    for (const piece of this.pieceList.toArray()) {
      var _piece$attachment;
      if (((_piece$attachment = piece.attachment) === null || _piece$attachment === void 0 ? void 0 : _piece$attachment.id) === attachmentId) {
        return {
          attachment: piece.attachment,
          position
        };
      }
      position += piece.length;
    }
    return {
      attachment: null,
      position: null
    };
  }
  getAttachmentById(attachmentId) {
    const {
      attachment
    } = this.getAttachmentAndPositionById(attachmentId);
    return attachment;
  }
  getRangeOfAttachment(attachment) {
    const attachmentAndPosition = this.getAttachmentAndPositionById(attachment.id);
    const position = attachmentAndPosition.position;
    attachment = attachmentAndPosition.attachment;
    if (attachment) {
      return [position, position + 1];
    }
  }
  updateAttributesForAttachment(attributes, attachment) {
    const range = this.getRangeOfAttachment(attachment);
    if (range) {
      return this.addAttributesAtRange(attributes, range);
    } else {
      return this;
    }
  }
  getLength() {
    return this.pieceList.getEndPosition();
  }
  isEmpty() {
    return this.getLength() === 0;
  }
  isEqualTo(text) {
    var _text$pieceList;
    return super.isEqualTo(text) || (text === null || text === void 0 || (_text$pieceList = text.pieceList) === null || _text$pieceList === void 0 ? void 0 : _text$pieceList.isEqualTo(this.pieceList));
  }
  isBlockBreak() {
    return this.getLength() === 1 && this.pieceList.getObjectAtIndex(0).isBlockBreak();
  }
  eachPiece(callback) {
    return this.pieceList.eachObject(callback);
  }
  getPieces() {
    return this.pieceList.toArray();
  }
  getPieceAtPosition(position) {
    return this.pieceList.getObjectAtPosition(position);
  }
  contentsForInspection() {
    return {
      pieceList: this.pieceList.inspect()
    };
  }
  toSerializableText() {
    const pieceList = this.pieceList.selectSplittableList(piece => piece.isSerializable());
    return this.copyWithPieceList(pieceList);
  }
  toString() {
    return this.pieceList.toString();
  }
  toJSON() {
    return this.pieceList.toJSON();
  }
  toConsole() {
    return JSON.stringify(this.pieceList.toArray().map(piece => JSON.parse(piece.toConsole())));
  }

  // BIDI

  getDirection() {
    return getDirection(this.toString());
  }
  isRTL() {
    return this.getDirection() === "rtl";
  }
}

class Block extends TrixObject {
  static fromJSON(blockJSON) {
    const text = Text.fromJSON(blockJSON.text);
    return new this(text, blockJSON.attributes, blockJSON.htmlAttributes);
  }
  constructor(text, attributes, htmlAttributes) {
    super(...arguments);
    this.text = applyBlockBreakToText(text || new Text());
    this.attributes = attributes || [];
    this.htmlAttributes = htmlAttributes || {};
  }
  isEmpty() {
    return this.text.isBlockBreak();
  }
  isEqualTo(block) {
    if (super.isEqualTo(block)) return true;
    return this.text.isEqualTo(block === null || block === void 0 ? void 0 : block.text) && arraysAreEqual(this.attributes, block === null || block === void 0 ? void 0 : block.attributes) && objectsAreEqual(this.htmlAttributes, block === null || block === void 0 ? void 0 : block.htmlAttributes);
  }
  copyWithText(text) {
    return new Block(text, this.attributes, this.htmlAttributes);
  }
  copyWithoutText() {
    return this.copyWithText(null);
  }
  copyWithAttributes(attributes) {
    return new Block(this.text, attributes, this.htmlAttributes);
  }
  copyWithoutAttributes() {
    return this.copyWithAttributes(null);
  }
  copyUsingObjectMap(objectMap) {
    const mappedText = objectMap.find(this.text);
    if (mappedText) {
      return this.copyWithText(mappedText);
    } else {
      return this.copyWithText(this.text.copyUsingObjectMap(objectMap));
    }
  }
  addAttribute(attribute) {
    const attributes = this.attributes.concat(expandAttribute(attribute));
    return this.copyWithAttributes(attributes);
  }
  addHTMLAttribute(attribute, value) {
    const htmlAttributes = Object.assign({}, this.htmlAttributes, {
      [attribute]: value
    });
    return new Block(this.text, this.attributes, htmlAttributes);
  }
  removeAttribute(attribute) {
    const {
      listAttribute
    } = getBlockConfig(attribute);
    const attributes = removeLastValue(removeLastValue(this.attributes, attribute), listAttribute);
    return this.copyWithAttributes(attributes);
  }
  removeLastAttribute() {
    return this.removeAttribute(this.getLastAttribute());
  }
  getLastAttribute() {
    return getLastElement(this.attributes);
  }
  getAttributes() {
    return this.attributes.slice(0);
  }
  getAttributeLevel() {
    return this.attributes.length;
  }
  getAttributeAtLevel(level) {
    return this.attributes[level - 1];
  }
  hasAttribute(attributeName) {
    return this.attributes.includes(attributeName);
  }
  hasAttributes() {
    return this.getAttributeLevel() > 0;
  }
  getLastNestableAttribute() {
    return getLastElement(this.getNestableAttributes());
  }
  getNestableAttributes() {
    return this.attributes.filter(attribute => getBlockConfig(attribute).nestable);
  }
  getNestingLevel() {
    return this.getNestableAttributes().length;
  }
  decreaseNestingLevel() {
    const attribute = this.getLastNestableAttribute();
    if (attribute) {
      return this.removeAttribute(attribute);
    } else {
      return this;
    }
  }
  increaseNestingLevel() {
    const attribute = this.getLastNestableAttribute();
    if (attribute) {
      const index = this.attributes.lastIndexOf(attribute);
      const attributes = spliceArray(this.attributes, index + 1, 0, ...expandAttribute(attribute));
      return this.copyWithAttributes(attributes);
    } else {
      return this;
    }
  }
  getListItemAttributes() {
    return this.attributes.filter(attribute => getBlockConfig(attribute).listAttribute);
  }
  isListItem() {
    var _getBlockConfig;
    return (_getBlockConfig = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.listAttribute;
  }
  isTerminalBlock() {
    var _getBlockConfig2;
    return (_getBlockConfig2 = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig2 === void 0 ? void 0 : _getBlockConfig2.terminal;
  }
  breaksOnReturn() {
    var _getBlockConfig3;
    return (_getBlockConfig3 = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig3 === void 0 ? void 0 : _getBlockConfig3.breakOnReturn;
  }
  findLineBreakInDirectionFromPosition(direction, position) {
    const string = this.toString();
    let result;
    switch (direction) {
      case "forward":
        result = string.indexOf("\n", position);
        break;
      case "backward":
        result = string.slice(0, position).lastIndexOf("\n");
    }
    if (result !== -1) {
      return result;
    }
  }
  contentsForInspection() {
    return {
      text: this.text.inspect(),
      attributes: this.attributes
    };
  }
  toString() {
    return this.text.toString();
  }
  toJSON() {
    return {
      text: this.text,
      attributes: this.attributes,
      htmlAttributes: this.htmlAttributes
    };
  }

  // BIDI

  getDirection() {
    return this.text.getDirection();
  }
  isRTL() {
    return this.text.isRTL();
  }

  // Splittable

  getLength() {
    return this.text.getLength();
  }
  canBeConsolidatedWith(block) {
    return !this.hasAttributes() && !block.hasAttributes() && this.getDirection() === block.getDirection();
  }
  consolidateWith(block) {
    const newlineText = Text.textForStringWithAttributes("\n");
    const text = this.getTextWithoutBlockBreak().appendText(newlineText);
    return this.copyWithText(text.appendText(block.text));
  }
  splitAtOffset(offset) {
    let left, right;
    if (offset === 0) {
      left = null;
      right = this;
    } else if (offset === this.getLength()) {
      left = this;
      right = null;
    } else {
      left = this.copyWithText(this.text.getTextAtRange([0, offset]));
      right = this.copyWithText(this.text.getTextAtRange([offset, this.getLength()]));
    }
    return [left, right];
  }
  getBlockBreakPosition() {
    return this.text.getLength() - 1;
  }
  getTextWithoutBlockBreak() {
    if (textEndsInBlockBreak(this.text)) {
      return this.text.getTextAtRange([0, this.getBlockBreakPosition()]);
    } else {
      return this.text.copy();
    }
  }

  // Grouping

  canBeGrouped(depth) {
    return this.attributes[depth];
  }
  canBeGroupedWith(otherBlock, depth) {
    const otherAttributes = otherBlock.getAttributes();
    const otherAttribute = otherAttributes[depth];
    const attribute = this.attributes[depth];
    return attribute === otherAttribute && !(getBlockConfig(attribute).group === false && !getListAttributeNames().includes(otherAttributes[depth + 1])) && (this.getDirection() === otherBlock.getDirection() || otherBlock.isEmpty());
  }
}

// Block breaks

const applyBlockBreakToText = function (text) {
  text = unmarkExistingInnerBlockBreaksInText(text);
  text = addBlockBreakToText(text);
  return text;
};
const unmarkExistingInnerBlockBreaksInText = function (text) {
  let modified = false;
  const pieces = text.getPieces();
  let innerPieces = pieces.slice(0, pieces.length - 1);
  const lastPiece = pieces[pieces.length - 1];
  if (!lastPiece) return text;
  innerPieces = innerPieces.map(piece => {
    if (piece.isBlockBreak()) {
      modified = true;
      return unmarkBlockBreakPiece(piece);
    } else {
      return piece;
    }
  });
  if (modified) {
    return new Text([...innerPieces, lastPiece]);
  } else {
    return text;
  }
};
const blockBreakText = Text.textForStringWithAttributes("\n", {
  blockBreak: true
});
const addBlockBreakToText = function (text) {
  if (textEndsInBlockBreak(text)) {
    return text;
  } else {
    return text.appendText(blockBreakText);
  }
};
const textEndsInBlockBreak = function (text) {
  const length = text.getLength();
  if (length === 0) {
    return false;
  }
  const endText = text.getTextAtRange([length - 1, length]);
  return endText.isBlockBreak();
};
const unmarkBlockBreakPiece = piece => piece.copyWithoutAttribute("blockBreak");

// Attributes

const expandAttribute = function (attribute) {
  const {
    listAttribute
  } = getBlockConfig(attribute);
  if (listAttribute) {
    return [listAttribute, attribute];
  } else {
    return [attribute];
  }
};

// Array helpers

const getLastElement = array => array.slice(-1)[0];
const removeLastValue = function (array, value) {
  const index = array.lastIndexOf(value);
  if (index === -1) {
    return array;
  } else {
    return spliceArray(array, index, 1);
  }
};

class Document extends TrixObject {
  static fromJSON(documentJSON) {
    const blocks = Array.from(documentJSON).map(blockJSON => Block.fromJSON(blockJSON));
    return new this(blocks);
  }
  static fromString(string, textAttributes) {
    const text = Text.textForStringWithAttributes(string, textAttributes);
    return new this([new Block(text)]);
  }
  constructor() {
    let blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    if (blocks.length === 0) {
      blocks = [new Block()];
    }
    this.blockList = SplittableList.box(blocks);
  }
  isEmpty() {
    const block = this.getBlockAtIndex(0);
    return this.blockList.length === 1 && block.isEmpty() && !block.hasAttributes();
  }
  copy() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const blocks = options.consolidateBlocks ? this.blockList.consolidate().toArray() : this.blockList.toArray();
    return new this.constructor(blocks);
  }
  copyUsingObjectsFromDocument(sourceDocument) {
    const objectMap = new ObjectMap(sourceDocument.getObjects());
    return this.copyUsingObjectMap(objectMap);
  }
  copyUsingObjectMap(objectMap) {
    const blocks = this.getBlocks().map(block => {
      const mappedBlock = objectMap.find(block);
      return mappedBlock || block.copyUsingObjectMap(objectMap);
    });
    return new this.constructor(blocks);
  }
  copyWithBaseBlockAttributes() {
    let blockAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const blocks = this.getBlocks().map(block => {
      const attributes = blockAttributes.concat(block.getAttributes());
      return block.copyWithAttributes(attributes);
    });
    return new this.constructor(blocks);
  }
  replaceBlock(oldBlock, newBlock) {
    const index = this.blockList.indexOf(oldBlock);
    if (index === -1) {
      return this;
    }
    return new this.constructor(this.blockList.replaceObjectAtIndex(newBlock, index));
  }
  insertDocumentAtRange(document, range) {
    const {
      blockList
    } = document;
    range = normalizeRange(range);
    let [position] = range;
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    let result = this;
    const block = this.getBlockAtPosition(position);
    if (rangeIsCollapsed(range) && block.isEmpty() && !block.hasAttributes()) {
      result = new this.constructor(result.blockList.removeObjectAtIndex(index));
    } else if (block.getBlockBreakPosition() === offset) {
      position++;
    }
    result = result.removeTextAtRange(range);
    return new this.constructor(result.blockList.insertSplittableListAtPosition(blockList, position));
  }
  mergeDocumentAtRange(document, range) {
    let formattedDocument, result;
    range = normalizeRange(range);
    const [startPosition] = range;
    const startLocation = this.locationFromPosition(startPosition);
    const blockAttributes = this.getBlockAtIndex(startLocation.index).getAttributes();
    const baseBlockAttributes = document.getBaseBlockAttributes();
    const trailingBlockAttributes = blockAttributes.slice(-baseBlockAttributes.length);
    if (arraysAreEqual(baseBlockAttributes, trailingBlockAttributes)) {
      const leadingBlockAttributes = blockAttributes.slice(0, -baseBlockAttributes.length);
      formattedDocument = document.copyWithBaseBlockAttributes(leadingBlockAttributes);
    } else {
      formattedDocument = document.copy({
        consolidateBlocks: true
      }).copyWithBaseBlockAttributes(blockAttributes);
    }
    const blockCount = formattedDocument.getBlockCount();
    const firstBlock = formattedDocument.getBlockAtIndex(0);
    if (arraysAreEqual(blockAttributes, firstBlock.getAttributes())) {
      const firstText = firstBlock.getTextWithoutBlockBreak();
      result = this.insertTextAtRange(firstText, range);
      if (blockCount > 1) {
        formattedDocument = new this.constructor(formattedDocument.getBlocks().slice(1));
        const position = startPosition + firstText.getLength();
        result = result.insertDocumentAtRange(formattedDocument, position);
      }
    } else {
      result = this.insertDocumentAtRange(formattedDocument, range);
    }
    return result;
  }
  insertTextAtRange(text, range) {
    range = normalizeRange(range);
    const [startPosition] = range;
    const {
      index,
      offset
    } = this.locationFromPosition(startPosition);
    const document = this.removeTextAtRange(range);
    return new this.constructor(document.blockList.editObjectAtIndex(index, block => block.copyWithText(block.text.insertTextAtPosition(text, offset))));
  }
  removeTextAtRange(range) {
    let blocks;
    range = normalizeRange(range);
    const [leftPosition, rightPosition] = range;
    if (rangeIsCollapsed(range)) {
      return this;
    }
    const [leftLocation, rightLocation] = Array.from(this.locationRangeFromRange(range));
    const leftIndex = leftLocation.index;
    const leftOffset = leftLocation.offset;
    const leftBlock = this.getBlockAtIndex(leftIndex);
    const rightIndex = rightLocation.index;
    const rightOffset = rightLocation.offset;
    const rightBlock = this.getBlockAtIndex(rightIndex);
    const removeRightNewline = rightPosition - leftPosition === 1 && leftBlock.getBlockBreakPosition() === leftOffset && rightBlock.getBlockBreakPosition() !== rightOffset && rightBlock.text.getStringAtPosition(rightOffset) === "\n";
    if (removeRightNewline) {
      blocks = this.blockList.editObjectAtIndex(rightIndex, block => block.copyWithText(block.text.removeTextAtRange([rightOffset, rightOffset + 1])));
    } else {
      let block;
      const leftText = leftBlock.text.getTextAtRange([0, leftOffset]);
      const rightText = rightBlock.text.getTextAtRange([rightOffset, rightBlock.getLength()]);
      const text = leftText.appendText(rightText);
      const removingLeftBlock = leftIndex !== rightIndex && leftOffset === 0;
      const useRightBlock = removingLeftBlock && leftBlock.getAttributeLevel() >= rightBlock.getAttributeLevel();
      if (useRightBlock) {
        block = rightBlock.copyWithText(text);
      } else {
        block = leftBlock.copyWithText(text);
      }
      const affectedBlockCount = rightIndex + 1 - leftIndex;
      blocks = this.blockList.splice(leftIndex, affectedBlockCount, block);
    }
    return new this.constructor(blocks);
  }
  moveTextFromRangeToPosition(range, position) {
    let text;
    range = normalizeRange(range);
    const [startPosition, endPosition] = range;
    if (startPosition <= position && position <= endPosition) {
      return this;
    }
    let document = this.getDocumentAtRange(range);
    let result = this.removeTextAtRange(range);
    const movingRightward = startPosition < position;
    if (movingRightward) {
      position -= document.getLength();
    }
    const [firstBlock, ...blocks] = document.getBlocks();
    if (blocks.length === 0) {
      text = firstBlock.getTextWithoutBlockBreak();
      if (movingRightward) {
        position += 1;
      }
    } else {
      text = firstBlock.text;
    }
    result = result.insertTextAtRange(text, position);
    if (blocks.length === 0) {
      return result;
    }
    document = new this.constructor(blocks);
    position += text.getLength();
    return result.insertDocumentAtRange(document, position);
  }
  addAttributeAtRange(attribute, value, range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, (block, textRange, index) => blockList = blockList.editObjectAtIndex(index, function () {
      if (getBlockConfig(attribute)) {
        return block.addAttribute(attribute, value);
      } else {
        if (textRange[0] === textRange[1]) {
          return block;
        } else {
          return block.copyWithText(block.text.addAttributeAtRange(attribute, value, textRange));
        }
      }
    }));
    return new this.constructor(blockList);
  }
  addAttribute(attribute, value) {
    let {
      blockList
    } = this;
    this.eachBlock((block, index) => blockList = blockList.editObjectAtIndex(index, () => block.addAttribute(attribute, value)));
    return new this.constructor(blockList);
  }
  removeAttributeAtRange(attribute, range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      if (getBlockConfig(attribute)) {
        blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(attribute));
      } else if (textRange[0] !== textRange[1]) {
        blockList = blockList.editObjectAtIndex(index, () => block.copyWithText(block.text.removeAttributeAtRange(attribute, textRange)));
      }
    });
    return new this.constructor(blockList);
  }
  updateAttributesForAttachment(attributes, attachment) {
    const range = this.getRangeOfAttachment(attachment);
    const [startPosition] = Array.from(range);
    const {
      index
    } = this.locationFromPosition(startPosition);
    const text = this.getTextAtIndex(index);
    return new this.constructor(this.blockList.editObjectAtIndex(index, block => block.copyWithText(text.updateAttributesForAttachment(attributes, attachment))));
  }
  removeAttributeForAttachment(attribute, attachment) {
    const range = this.getRangeOfAttachment(attachment);
    return this.removeAttributeAtRange(attribute, range);
  }
  setHTMLAttributeAtPosition(position, name, value) {
    const block = this.getBlockAtPosition(position);
    const updatedBlock = block.addHTMLAttribute(name, value);
    return this.replaceBlock(block, updatedBlock);
  }
  insertBlockBreakAtRange(range) {
    let blocks;
    range = normalizeRange(range);
    const [startPosition] = range;
    const {
      offset
    } = this.locationFromPosition(startPosition);
    const document = this.removeTextAtRange(range);
    if (offset === 0) {
      blocks = [new Block()];
    }
    return new this.constructor(document.blockList.insertSplittableListAtPosition(new SplittableList(blocks), startPosition));
  }
  applyBlockAttributeAtRange(attributeName, value, range) {
    const expanded = this.expandRangeToLineBreaksAndSplitBlocks(range);
    let document = expanded.document;
    range = expanded.range;
    const blockConfig = getBlockConfig(attributeName);
    if (blockConfig.listAttribute) {
      document = document.removeLastListAttributeAtRange(range, {
        exceptAttributeName: attributeName
      });
      const converted = document.convertLineBreaksToBlockBreaksInRange(range);
      document = converted.document;
      range = converted.range;
    } else if (blockConfig.exclusive) {
      document = document.removeBlockAttributesAtRange(range);
    } else if (blockConfig.terminal) {
      document = document.removeLastTerminalAttributeAtRange(range);
    } else {
      document = document.consolidateBlocksAtRange(range);
    }
    return document.addAttributeAtRange(attributeName, value, range);
  }
  removeLastListAttributeAtRange(range) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      const lastAttributeName = block.getLastAttribute();
      if (!lastAttributeName) {
        return;
      }
      if (!getBlockConfig(lastAttributeName).listAttribute) {
        return;
      }
      if (lastAttributeName === options.exceptAttributeName) {
        return;
      }
      blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(lastAttributeName));
    });
    return new this.constructor(blockList);
  }
  removeLastTerminalAttributeAtRange(range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      const lastAttributeName = block.getLastAttribute();
      if (!lastAttributeName) {
        return;
      }
      if (!getBlockConfig(lastAttributeName).terminal) {
        return;
      }
      blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(lastAttributeName));
    });
    return new this.constructor(blockList);
  }
  removeBlockAttributesAtRange(range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      if (block.hasAttributes()) {
        blockList = blockList.editObjectAtIndex(index, () => block.copyWithoutAttributes());
      }
    });
    return new this.constructor(blockList);
  }
  expandRangeToLineBreaksAndSplitBlocks(range) {
    let position;
    range = normalizeRange(range);
    let [startPosition, endPosition] = range;
    const startLocation = this.locationFromPosition(startPosition);
    const endLocation = this.locationFromPosition(endPosition);
    let document = this;
    const startBlock = document.getBlockAtIndex(startLocation.index);
    startLocation.offset = startBlock.findLineBreakInDirectionFromPosition("backward", startLocation.offset);
    if (startLocation.offset != null) {
      position = document.positionFromLocation(startLocation);
      document = document.insertBlockBreakAtRange([position, position + 1]);
      endLocation.index += 1;
      endLocation.offset -= document.getBlockAtIndex(startLocation.index).getLength();
      startLocation.index += 1;
    }
    startLocation.offset = 0;
    if (endLocation.offset === 0 && endLocation.index > startLocation.index) {
      endLocation.index -= 1;
      endLocation.offset = document.getBlockAtIndex(endLocation.index).getBlockBreakPosition();
    } else {
      const endBlock = document.getBlockAtIndex(endLocation.index);
      if (endBlock.text.getStringAtRange([endLocation.offset - 1, endLocation.offset]) === "\n") {
        endLocation.offset -= 1;
      } else {
        endLocation.offset = endBlock.findLineBreakInDirectionFromPosition("forward", endLocation.offset);
      }
      if (endLocation.offset !== endBlock.getBlockBreakPosition()) {
        position = document.positionFromLocation(endLocation);
        document = document.insertBlockBreakAtRange([position, position + 1]);
      }
    }
    startPosition = document.positionFromLocation(startLocation);
    endPosition = document.positionFromLocation(endLocation);
    range = normalizeRange([startPosition, endPosition]);
    return {
      document,
      range
    };
  }
  convertLineBreaksToBlockBreaksInRange(range) {
    range = normalizeRange(range);
    let [position] = range;
    const string = this.getStringAtRange(range).slice(0, -1);
    let document = this;
    string.replace(/.*?\n/g, function (match) {
      position += match.length;
      document = document.insertBlockBreakAtRange([position - 1, position]);
    });
    return {
      document,
      range
    };
  }
  consolidateBlocksAtRange(range) {
    range = normalizeRange(range);
    const [startPosition, endPosition] = range;
    const startIndex = this.locationFromPosition(startPosition).index;
    const endIndex = this.locationFromPosition(endPosition).index;
    return new this.constructor(this.blockList.consolidateFromIndexToIndex(startIndex, endIndex));
  }
  getDocumentAtRange(range) {
    range = normalizeRange(range);
    const blocks = this.blockList.getSplittableListInRange(range).toArray();
    return new this.constructor(blocks);
  }
  getStringAtRange(range) {
    let endIndex;
    const array = range = normalizeRange(range),
      endPosition = array[array.length - 1];
    if (endPosition !== this.getLength()) {
      endIndex = -1;
    }
    return this.getDocumentAtRange(range).toString().slice(0, endIndex);
  }
  getBlockAtIndex(index) {
    return this.blockList.getObjectAtIndex(index);
  }
  getBlockAtPosition(position) {
    const {
      index
    } = this.locationFromPosition(position);
    return this.getBlockAtIndex(index);
  }
  getTextAtIndex(index) {
    var _this$getBlockAtIndex;
    return (_this$getBlockAtIndex = this.getBlockAtIndex(index)) === null || _this$getBlockAtIndex === void 0 ? void 0 : _this$getBlockAtIndex.text;
  }
  getTextAtPosition(position) {
    const {
      index
    } = this.locationFromPosition(position);
    return this.getTextAtIndex(index);
  }
  getPieceAtPosition(position) {
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    return this.getTextAtIndex(index).getPieceAtPosition(offset);
  }
  getCharacterAtPosition(position) {
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    return this.getTextAtIndex(index).getStringAtRange([offset, offset + 1]);
  }
  getLength() {
    return this.blockList.getEndPosition();
  }
  getBlocks() {
    return this.blockList.toArray();
  }
  getBlockCount() {
    return this.blockList.length;
  }
  getEditCount() {
    return this.editCount;
  }
  eachBlock(callback) {
    return this.blockList.eachObject(callback);
  }
  eachBlockAtRange(range, callback) {
    let block, textRange;
    range = normalizeRange(range);
    const [startPosition, endPosition] = range;
    const startLocation = this.locationFromPosition(startPosition);
    const endLocation = this.locationFromPosition(endPosition);
    if (startLocation.index === endLocation.index) {
      block = this.getBlockAtIndex(startLocation.index);
      textRange = [startLocation.offset, endLocation.offset];
      return callback(block, textRange, startLocation.index);
    } else {
      for (let index = startLocation.index; index <= endLocation.index; index++) {
        block = this.getBlockAtIndex(index);
        if (block) {
          switch (index) {
            case startLocation.index:
              textRange = [startLocation.offset, block.text.getLength()];
              break;
            case endLocation.index:
              textRange = [0, endLocation.offset];
              break;
            default:
              textRange = [0, block.text.getLength()];
          }
          callback(block, textRange, index);
        }
      }
    }
  }
  getCommonAttributesAtRange(range) {
    range = normalizeRange(range);
    const [startPosition] = range;
    if (rangeIsCollapsed(range)) {
      return this.getCommonAttributesAtPosition(startPosition);
    } else {
      const textAttributes = [];
      const blockAttributes = [];
      this.eachBlockAtRange(range, function (block, textRange) {
        if (textRange[0] !== textRange[1]) {
          textAttributes.push(block.text.getCommonAttributesAtRange(textRange));
          return blockAttributes.push(attributesForBlock(block));
        }
      });
      return Hash.fromCommonAttributesOfObjects(textAttributes).merge(Hash.fromCommonAttributesOfObjects(blockAttributes)).toObject();
    }
  }
  getCommonAttributesAtPosition(position) {
    let key, value;
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    const block = this.getBlockAtIndex(index);
    if (!block) {
      return {};
    }
    const commonAttributes = attributesForBlock(block);
    const attributes = block.text.getAttributesAtPosition(offset);
    const attributesLeft = block.text.getAttributesAtPosition(offset - 1);
    const inheritableAttributes = Object.keys(text_attributes).filter(key => {
      return text_attributes[key].inheritable;
    });
    for (key in attributesLeft) {
      value = attributesLeft[key];
      if (value === attributes[key] || inheritableAttributes.includes(key)) {
        commonAttributes[key] = value;
      }
    }
    return commonAttributes;
  }
  getRangeOfCommonAttributeAtPosition(attributeName, position) {
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    const text = this.getTextAtIndex(index);
    const [startOffset, endOffset] = Array.from(text.getExpandedRangeForAttributeAtOffset(attributeName, offset));
    const start = this.positionFromLocation({
      index,
      offset: startOffset
    });
    const end = this.positionFromLocation({
      index,
      offset: endOffset
    });
    return normalizeRange([start, end]);
  }
  getBaseBlockAttributes() {
    let baseBlockAttributes = this.getBlockAtIndex(0).getAttributes();
    for (let blockIndex = 1; blockIndex < this.getBlockCount(); blockIndex++) {
      const blockAttributes = this.getBlockAtIndex(blockIndex).getAttributes();
      const lastAttributeIndex = Math.min(baseBlockAttributes.length, blockAttributes.length);
      baseBlockAttributes = (() => {
        const result = [];
        for (let index = 0; index < lastAttributeIndex; index++) {
          if (blockAttributes[index] !== baseBlockAttributes[index]) {
            break;
          }
          result.push(blockAttributes[index]);
        }
        return result;
      })();
    }
    return baseBlockAttributes;
  }
  getAttachmentById(attachmentId) {
    for (const attachment of this.getAttachments()) {
      if (attachment.id === attachmentId) {
        return attachment;
      }
    }
  }
  getAttachmentPieces() {
    let attachmentPieces = [];
    this.blockList.eachObject(_ref => {
      let {
        text
      } = _ref;
      return attachmentPieces = attachmentPieces.concat(text.getAttachmentPieces());
    });
    return attachmentPieces;
  }
  getAttachments() {
    return this.getAttachmentPieces().map(piece => piece.attachment);
  }
  getRangeOfAttachment(attachment) {
    let position = 0;
    const iterable = this.blockList.toArray();
    for (let index = 0; index < iterable.length; index++) {
      const {
        text
      } = iterable[index];
      const textRange = text.getRangeOfAttachment(attachment);
      if (textRange) {
        return normalizeRange([position + textRange[0], position + textRange[1]]);
      }
      position += text.getLength();
    }
  }
  getLocationRangeOfAttachment(attachment) {
    const range = this.getRangeOfAttachment(attachment);
    return this.locationRangeFromRange(range);
  }
  getAttachmentPieceForAttachment(attachment) {
    for (const piece of this.getAttachmentPieces()) {
      if (piece.attachment === attachment) {
        return piece;
      }
    }
  }
  findRangesForBlockAttribute(attributeName) {
    let position = 0;
    const ranges = [];
    this.getBlocks().forEach(block => {
      const length = block.getLength();
      if (block.hasAttribute(attributeName)) {
        ranges.push([position, position + length]);
      }
      position += length;
    });
    return ranges;
  }
  findRangesForTextAttribute(attributeName) {
    let {
      withValue
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let position = 0;
    let range = [];
    const ranges = [];
    const match = function (piece) {
      if (withValue) {
        return piece.getAttribute(attributeName) === withValue;
      } else {
        return piece.hasAttribute(attributeName);
      }
    };
    this.getPieces().forEach(piece => {
      const length = piece.getLength();
      if (match(piece)) {
        if (range[1] === position) {
          range[1] = position + length;
        } else {
          ranges.push(range = [position, position + length]);
        }
      }
      position += length;
    });
    return ranges;
  }
  locationFromPosition(position) {
    const location = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, position));
    if (location.index != null) {
      return location;
    } else {
      const blocks = this.getBlocks();
      return {
        index: blocks.length - 1,
        offset: blocks[blocks.length - 1].getLength()
      };
    }
  }
  positionFromLocation(location) {
    return this.blockList.findPositionAtIndexAndOffset(location.index, location.offset);
  }
  locationRangeFromPosition(position) {
    return normalizeRange(this.locationFromPosition(position));
  }
  locationRangeFromRange(range) {
    range = normalizeRange(range);
    if (!range) return;
    const [startPosition, endPosition] = Array.from(range);
    const startLocation = this.locationFromPosition(startPosition);
    const endLocation = this.locationFromPosition(endPosition);
    return normalizeRange([startLocation, endLocation]);
  }
  rangeFromLocationRange(locationRange) {
    let rightPosition;
    locationRange = normalizeRange(locationRange);
    const leftPosition = this.positionFromLocation(locationRange[0]);
    if (!rangeIsCollapsed(locationRange)) {
      rightPosition = this.positionFromLocation(locationRange[1]);
    }
    return normalizeRange([leftPosition, rightPosition]);
  }
  isEqualTo(document) {
    return this.blockList.isEqualTo(document === null || document === void 0 ? void 0 : document.blockList);
  }
  getTexts() {
    return this.getBlocks().map(block => block.text);
  }
  getPieces() {
    const pieces = [];
    Array.from(this.getTexts()).forEach(text => {
      pieces.push(...Array.from(text.getPieces() || []));
    });
    return pieces;
  }
  getObjects() {
    return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
  }
  toSerializableDocument() {
    const blocks = [];
    this.blockList.eachObject(block => blocks.push(block.copyWithText(block.text.toSerializableText())));
    return new this.constructor(blocks);
  }
  toString() {
    return this.blockList.toString();
  }
  toJSON() {
    return this.blockList.toJSON();
  }
  toConsole() {
    return JSON.stringify(this.blockList.toArray().map(block => JSON.parse(block.text.toConsole())));
  }
}
const attributesForBlock = function (block) {
  const attributes = {};
  const attributeName = block.getLastAttribute();
  if (attributeName) {
    attributes[attributeName] = true;
  }
  return attributes;
};

/* eslint-disable
    no-case-declarations,
    no-irregular-whitespace,
*/
const pieceForString = function (string) {
  let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const type = "string";
  string = normalizeSpaces(string);
  return {
    string,
    attributes,
    type
  };
};
const pieceForAttachment = function (attachment) {
  let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const type = "attachment";
  return {
    attachment,
    attributes,
    type
  };
};
const blockForAttributes = function () {
  let attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let htmlAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const text = [];
  return {
    text,
    attributes,
    htmlAttributes
  };
};
const parseTrixDataAttribute = (element, name) => {
  try {
    return JSON.parse(element.getAttribute("data-trix-".concat(name)));
  } catch (error) {
    return {};
  }
};
const getImageDimensions = element => {
  const width = element.getAttribute("width");
  const height = element.getAttribute("height");
  const dimensions = {};
  if (width) {
    dimensions.width = parseInt(width, 10);
  }
  if (height) {
    dimensions.height = parseInt(height, 10);
  }
  return dimensions;
};
class HTMLParser extends BasicObject {
  static parse(html, options) {
    const parser = new this(html, options);
    parser.parse();
    return parser;
  }
  constructor(html) {
    let {
      referenceElement
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.html = html;
    this.referenceElement = referenceElement;
    this.blocks = [];
    this.blockElements = [];
    this.processedElements = [];
  }
  getDocument() {
    return Document.fromJSON(this.blocks);
  }

  // HTML parsing

  parse() {
    try {
      this.createHiddenContainer();
      HTMLSanitizer.setHTML(this.containerElement, this.html);
      const walker = walkTree(this.containerElement, {
        usingFilter: nodeFilter
      });
      while (walker.nextNode()) {
        this.processNode(walker.currentNode);
      }
      return this.translateBlockElementMarginsToNewlines();
    } finally {
      this.removeHiddenContainer();
    }
  }
  createHiddenContainer() {
    if (this.referenceElement) {
      this.containerElement = this.referenceElement.cloneNode(false);
      this.containerElement.removeAttribute("id");
      this.containerElement.setAttribute("data-trix-internal", "");
      this.containerElement.style.display = "none";
      return this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling);
    } else {
      this.containerElement = makeElement({
        tagName: "div",
        style: {
          display: "none"
        }
      });
      return document.body.appendChild(this.containerElement);
    }
  }
  removeHiddenContainer() {
    return removeNode(this.containerElement);
  }
  processNode(node) {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        if (!this.isInsignificantTextNode(node)) {
          this.appendBlockForTextNode(node);
          return this.processTextNode(node);
        }
        break;
      case Node.ELEMENT_NODE:
        this.appendBlockForElement(node);
        return this.processElement(node);
    }
  }
  appendBlockForTextNode(node) {
    const element = node.parentNode;
    if (element === this.currentBlockElement && this.isBlockElement(node.previousSibling)) {
      return this.appendStringWithAttributes("\n");
    } else if (element === this.containerElement || this.isBlockElement(element)) {
      var _this$currentBlock;
      const attributes = this.getBlockAttributes(element);
      const htmlAttributes = this.getBlockHTMLAttributes(element);
      if (!arraysAreEqual(attributes, (_this$currentBlock = this.currentBlock) === null || _this$currentBlock === void 0 ? void 0 : _this$currentBlock.attributes)) {
        this.currentBlock = this.appendBlockForAttributesWithElement(attributes, element, htmlAttributes);
        this.currentBlockElement = element;
      }
    }
  }
  appendBlockForElement(element) {
    const elementIsBlockElement = this.isBlockElement(element);
    const currentBlockContainsElement = elementContainsNode(this.currentBlockElement, element);
    if (elementIsBlockElement && !this.isBlockElement(element.firstChild)) {
      if (!this.isInsignificantTextNode(element.firstChild) || !this.isBlockElement(element.firstElementChild)) {
        const attributes = this.getBlockAttributes(element);
        const htmlAttributes = this.getBlockHTMLAttributes(element);
        if (element.firstChild) {
          if (!(currentBlockContainsElement && arraysAreEqual(attributes, this.currentBlock.attributes))) {
            this.currentBlock = this.appendBlockForAttributesWithElement(attributes, element, htmlAttributes);
            this.currentBlockElement = element;
          } else {
            return this.appendStringWithAttributes("\n");
          }
        }
      }
    } else if (this.currentBlockElement && !currentBlockContainsElement && !elementIsBlockElement) {
      const parentBlockElement = this.findParentBlockElement(element);
      if (parentBlockElement) {
        return this.appendBlockForElement(parentBlockElement);
      } else {
        this.currentBlock = this.appendEmptyBlock();
        this.currentBlockElement = null;
      }
    }
  }
  findParentBlockElement(element) {
    let {
      parentElement
    } = element;
    while (parentElement && parentElement !== this.containerElement) {
      if (this.isBlockElement(parentElement) && this.blockElements.includes(parentElement)) {
        return parentElement;
      } else {
        parentElement = parentElement.parentElement;
      }
    }
    return null;
  }
  processTextNode(node) {
    let string = node.data;
    if (!elementCanDisplayPreformattedText(node.parentNode)) {
      var _node$previousSibling;
      string = squishBreakableWhitespace(string);
      if (stringEndsWithWhitespace((_node$previousSibling = node.previousSibling) === null || _node$previousSibling === void 0 ? void 0 : _node$previousSibling.textContent)) {
        string = leftTrimBreakableWhitespace(string);
      }
    }
    return this.appendStringWithAttributes(string, this.getTextAttributes(node.parentNode));
  }
  processElement(element) {
    let attributes;
    if (nodeIsAttachmentElement(element)) {
      attributes = parseTrixDataAttribute(element, "attachment");
      if (Object.keys(attributes).length) {
        const textAttributes = this.getTextAttributes(element);
        this.appendAttachmentWithAttributes(attributes, textAttributes);
        // We have everything we need so avoid processing inner nodes
        element.innerHTML = "";
      }
      return this.processedElements.push(element);
    } else {
      switch (tagName(element)) {
        case "br":
          if (!this.isExtraBR(element) && !this.isBlockElement(element.nextSibling)) {
            this.appendStringWithAttributes("\n", this.getTextAttributes(element));
          }
          return this.processedElements.push(element);
        case "img":
          attributes = {
            url: element.getAttribute("src"),
            contentType: "image"
          };
          const object = getImageDimensions(element);
          for (const key in object) {
            const value = object[key];
            attributes[key] = value;
          }
          this.appendAttachmentWithAttributes(attributes, this.getTextAttributes(element));
          return this.processedElements.push(element);
        case "tr":
          if (this.needsTableSeparator(element)) {
            return this.appendStringWithAttributes(parser.tableRowSeparator);
          }
          break;
        case "td":
          if (this.needsTableSeparator(element)) {
            return this.appendStringWithAttributes(parser.tableCellSeparator);
          }
          break;
      }
    }
  }

  // Document construction

  appendBlockForAttributesWithElement(attributes, element) {
    let htmlAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.blockElements.push(element);
    const block = blockForAttributes(attributes, htmlAttributes);
    this.blocks.push(block);
    return block;
  }
  appendEmptyBlock() {
    return this.appendBlockForAttributesWithElement([], null);
  }
  appendStringWithAttributes(string, attributes) {
    return this.appendPiece(pieceForString(string, attributes));
  }
  appendAttachmentWithAttributes(attachment, attributes) {
    return this.appendPiece(pieceForAttachment(attachment, attributes));
  }
  appendPiece(piece) {
    if (this.blocks.length === 0) {
      this.appendEmptyBlock();
    }
    return this.blocks[this.blocks.length - 1].text.push(piece);
  }
  appendStringToTextAtIndex(string, index) {
    const {
      text
    } = this.blocks[index];
    const piece = text[text.length - 1];
    if ((piece === null || piece === void 0 ? void 0 : piece.type) === "string") {
      piece.string += string;
    } else {
      return text.push(pieceForString(string));
    }
  }
  prependStringToTextAtIndex(string, index) {
    const {
      text
    } = this.blocks[index];
    const piece = text[0];
    if ((piece === null || piece === void 0 ? void 0 : piece.type) === "string") {
      piece.string = string + piece.string;
    } else {
      return text.unshift(pieceForString(string));
    }
  }

  // Attribute parsing

  getTextAttributes(element) {
    let value;
    const attributes = {};
    for (const attribute in text_attributes) {
      const configAttr = text_attributes[attribute];
      if (configAttr.tagName && findClosestElementFromNode(element, {
        matchingSelector: configAttr.tagName,
        untilNode: this.containerElement
      })) {
        attributes[attribute] = true;
      } else if (configAttr.parser) {
        value = configAttr.parser(element);
        if (value) {
          let attributeInheritedFromBlock = false;
          for (const blockElement of this.findBlockElementAncestors(element)) {
            if (configAttr.parser(blockElement) === value) {
              attributeInheritedFromBlock = true;
              break;
            }
          }
          if (!attributeInheritedFromBlock) {
            attributes[attribute] = value;
          }
        }
      } else if (configAttr.styleProperty) {
        value = element.style[configAttr.styleProperty];
        if (value) {
          attributes[attribute] = value;
        }
      }
    }
    if (nodeIsAttachmentElement(element)) {
      const object = parseTrixDataAttribute(element, "attributes");
      for (const key in object) {
        value = object[key];
        attributes[key] = value;
      }
    }
    return attributes;
  }
  getBlockAttributes(element) {
    const attributes$1 = [];
    while (element && element !== this.containerElement) {
      for (const attribute in attributes) {
        const attrConfig = attributes[attribute];
        if (attrConfig.parse !== false) {
          if (tagName(element) === attrConfig.tagName) {
            if (!attrConfig.className || element.classList.contains(attrConfig.className)) {
              var _attrConfig$test;
              if ((_attrConfig$test = attrConfig.test) !== null && _attrConfig$test !== void 0 && _attrConfig$test.call(attrConfig, element) || !attrConfig.test) {
                attributes$1.push(attribute);
                if (attrConfig.listAttribute) {
                  attributes$1.push(attrConfig.listAttribute);
                }
              }
            }
          }
        }
      }
      element = element.parentNode;
    }
    return attributes$1.reverse();
  }
  getBlockHTMLAttributes(element) {
    const attributes$1 = {};
    const blockConfig = Object.values(attributes).find(settings => settings.tagName === tagName(element));
    const allowedAttributes = (blockConfig === null || blockConfig === void 0 ? void 0 : blockConfig.htmlAttributes) || [];
    allowedAttributes.forEach(attribute => {
      if (element.hasAttribute(attribute)) {
        attributes$1[attribute] = element.getAttribute(attribute);
      }
    });
    return attributes$1;
  }
  findBlockElementAncestors(element) {
    const ancestors = [];
    while (element && element !== this.containerElement) {
      const tag = tagName(element);
      if (getBlockTagNames().includes(tag)) {
        ancestors.push(element);
      }
      element = element.parentNode;
    }
    return ancestors;
  }

  // Element inspection

  isBlockElement(element) {
    if ((element === null || element === void 0 ? void 0 : element.nodeType) !== Node.ELEMENT_NODE) return;
    if (nodeIsAttachmentElement(element)) return;
    if (findClosestElementFromNode(element, {
      matchingSelector: "td",
      untilNode: this.containerElement
    })) return;
    return getBlockTagNames().includes(tagName(element)) || window.getComputedStyle(element).display === "block";
  }
  isInsignificantTextNode(node) {
    if ((node === null || node === void 0 ? void 0 : node.nodeType) !== Node.TEXT_NODE) return;
    if (!stringIsAllBreakableWhitespace(node.data)) return;
    const {
      parentNode,
      previousSibling,
      nextSibling
    } = node;
    if (nodeEndsWithNonWhitespace(parentNode.previousSibling) && !this.isBlockElement(parentNode.previousSibling)) return;
    if (elementCanDisplayPreformattedText(parentNode)) return;
    return !previousSibling || this.isBlockElement(previousSibling) || !nextSibling || this.isBlockElement(nextSibling);
  }
  isExtraBR(element) {
    return tagName(element) === "br" && this.isBlockElement(element.parentNode) && element.parentNode.lastChild === element;
  }
  needsTableSeparator(element) {
    if (parser.removeBlankTableCells) {
      var _element$previousSibl;
      const content = (_element$previousSibl = element.previousSibling) === null || _element$previousSibl === void 0 ? void 0 : _element$previousSibl.textContent;
      return content && /\S/.test(content);
    } else {
      return element.previousSibling;
    }
  }

  // Margin translation

  translateBlockElementMarginsToNewlines() {
    const defaultMargin = this.getMarginOfDefaultBlockElement();
    for (let index = 0; index < this.blocks.length; index++) {
      const margin = this.getMarginOfBlockElementAtIndex(index);
      if (margin) {
        if (margin.top > defaultMargin.top * 2) {
          this.prependStringToTextAtIndex("\n", index);
        }
        if (margin.bottom > defaultMargin.bottom * 2) {
          this.appendStringToTextAtIndex("\n", index);
        }
      }
    }
  }
  getMarginOfBlockElementAtIndex(index) {
    const element = this.blockElements[index];
    if (element) {
      if (element.textContent) {
        if (!getBlockTagNames().includes(tagName(element)) && !this.processedElements.includes(element)) {
          return getBlockElementMargin(element);
        }
      }
    }
  }
  getMarginOfDefaultBlockElement() {
    const element = makeElement(attributes.default.tagName);
    this.containerElement.appendChild(element);
    return getBlockElementMargin(element);
  }
}

// Helpers

const elementCanDisplayPreformattedText = function (element) {
  const {
    whiteSpace
  } = window.getComputedStyle(element);
  return ["pre", "pre-wrap", "pre-line"].includes(whiteSpace);
};
const nodeEndsWithNonWhitespace = node => node && !stringEndsWithWhitespace(node.textContent);
const getBlockElementMargin = function (element) {
  const style = window.getComputedStyle(element);
  if (style.display === "block") {
    return {
      top: parseInt(style.marginTop),
      bottom: parseInt(style.marginBottom)
    };
  }
};
const nodeFilter = function (node) {
  if (tagName(node) === "style") {
    return NodeFilter.FILTER_REJECT;
  } else {
    return NodeFilter.FILTER_ACCEPT;
  }
};

// Whitespace

const leftTrimBreakableWhitespace = string => string.replace(new RegExp("^".concat(breakableWhitespacePattern.source, "+")), "");
const stringIsAllBreakableWhitespace = string => new RegExp("^".concat(breakableWhitespacePattern.source, "*$")).test(string);
const stringEndsWithWhitespace = string => /\s$/.test(string);

/* eslint-disable
    no-empty,
*/
const unserializableElementSelector = "[data-trix-serialize=false]";
const unserializableAttributeNames = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"];
const serializedAttributesAttribute = "data-trix-serialized-attributes";
const serializedAttributesSelector = "[".concat(serializedAttributesAttribute, "]");
const blockCommentPattern = new RegExp("<!--block-->", "g");
const serializers = {
  "application/json": function (serializable) {
    let document;
    if (serializable instanceof Document) {
      document = serializable;
    } else if (serializable instanceof HTMLElement) {
      document = HTMLParser.parse(serializable.innerHTML).getDocument();
    } else {
      throw new Error("unserializable object");
    }
    return document.toSerializableDocument().toJSONString();
  },
  "text/html": function (serializable) {
    let element;
    if (serializable instanceof Document) {
      element = DocumentView.render(serializable);
    } else if (serializable instanceof HTMLElement) {
      element = serializable.cloneNode(true);
    } else {
      throw new Error("unserializable object");
    }

    // Remove unserializable elements
    Array.from(element.querySelectorAll(unserializableElementSelector)).forEach(el => {
      removeNode(el);
    });

    // Remove unserializable attributes
    unserializableAttributeNames.forEach(attribute => {
      Array.from(element.querySelectorAll("[".concat(attribute, "]"))).forEach(el => {
        el.removeAttribute(attribute);
      });
    });

    // Rewrite elements with serialized attribute overrides
    Array.from(element.querySelectorAll(serializedAttributesSelector)).forEach(el => {
      try {
        const attributes = JSON.parse(el.getAttribute(serializedAttributesAttribute));
        el.removeAttribute(serializedAttributesAttribute);
        for (const name in attributes) {
          const value = attributes[name];
          el.setAttribute(name, value);
        }
      } catch (error) {}
    });
    return element.innerHTML.replace(blockCommentPattern, "");
  }
};
const deserializers = {
  "application/json": function (string) {
    return Document.fromJSONString(string);
  },
  "text/html": function (string) {
    return HTMLParser.parse(string).getDocument();
  }
};
const serializeToContentType = function (serializable, contentType) {
  const serializer = serializers[contentType];
  if (serializer) {
    return serializer(serializable);
  } else {
    throw new Error("unknown content type: ".concat(contentType));
  }
};
const deserializeFromContentType = function (string, contentType) {
  const deserializer = deserializers[contentType];
  if (deserializer) {
    return deserializer(string);
  } else {
    throw new Error("unknown content type: ".concat(contentType));
  }
};

var core = /*#__PURE__*/Object.freeze({
  __proto__: null
});

class ManagedAttachment extends BasicObject {
  constructor(attachmentManager, attachment) {
    super(...arguments);
    this.attachmentManager = attachmentManager;
    this.attachment = attachment;
    this.id = this.attachment.id;
    this.file = this.attachment.file;
  }
  remove() {
    return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
  }
}
ManagedAttachment.proxyMethod("attachment.getAttribute");
ManagedAttachment.proxyMethod("attachment.hasAttribute");
ManagedAttachment.proxyMethod("attachment.setAttribute");
ManagedAttachment.proxyMethod("attachment.getAttributes");
ManagedAttachment.proxyMethod("attachment.setAttributes");
ManagedAttachment.proxyMethod("attachment.isPending");
ManagedAttachment.proxyMethod("attachment.isPreviewable");
ManagedAttachment.proxyMethod("attachment.getURL");
ManagedAttachment.proxyMethod("attachment.getHref");
ManagedAttachment.proxyMethod("attachment.getFilename");
ManagedAttachment.proxyMethod("attachment.getFilesize");
ManagedAttachment.proxyMethod("attachment.getFormattedFilesize");
ManagedAttachment.proxyMethod("attachment.getExtension");
ManagedAttachment.proxyMethod("attachment.getContentType");
ManagedAttachment.proxyMethod("attachment.getFile");
ManagedAttachment.proxyMethod("attachment.setFile");
ManagedAttachment.proxyMethod("attachment.releaseFile");
ManagedAttachment.proxyMethod("attachment.getUploadProgress");
ManagedAttachment.proxyMethod("attachment.setUploadProgress");

class AttachmentManager extends BasicObject {
  constructor() {
    let attachments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    this.managedAttachments = {};
    Array.from(attachments).forEach(attachment => {
      this.manageAttachment(attachment);
    });
  }
  getAttachments() {
    const result = [];
    for (const id in this.managedAttachments) {
      const attachment = this.managedAttachments[id];
      result.push(attachment);
    }
    return result;
  }
  manageAttachment(attachment) {
    if (!this.managedAttachments[attachment.id]) {
      this.managedAttachments[attachment.id] = new ManagedAttachment(this, attachment);
    }
    return this.managedAttachments[attachment.id];
  }
  attachmentIsManaged(attachment) {
    return attachment.id in this.managedAttachments;
  }
  requestRemovalOfAttachment(attachment) {
    if (this.attachmentIsManaged(attachment)) {
      var _this$delegate, _this$delegate$attach;
      return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$attach = _this$delegate.attachmentManagerDidRequestRemovalOfAttachment) === null || _this$delegate$attach === void 0 ? void 0 : _this$delegate$attach.call(_this$delegate, attachment);
    }
  }
  unmanageAttachment(attachment) {
    const managedAttachment = this.managedAttachments[attachment.id];
    delete this.managedAttachments[attachment.id];
    return managedAttachment;
  }
}

class LineBreakInsertion {
  constructor(composition) {
    this.composition = composition;
    this.document = this.composition.document;
    const selectedRange = this.composition.getSelectedRange();
    this.startPosition = selectedRange[0];
    this.endPosition = selectedRange[1];
    this.startLocation = this.document.locationFromPosition(this.startPosition);
    this.endLocation = this.document.locationFromPosition(this.endPosition);
    this.block = this.document.getBlockAtIndex(this.endLocation.index);
    this.breaksOnReturn = this.block.breaksOnReturn();
    this.previousCharacter = this.block.text.getStringAtPosition(this.endLocation.offset - 1);
    this.nextCharacter = this.block.text.getStringAtPosition(this.endLocation.offset);
  }
  shouldInsertBlockBreak() {
    if (this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty()) {
      return this.startLocation.offset !== 0;
    } else {
      return this.breaksOnReturn && this.nextCharacter !== "\n";
    }
  }
  shouldBreakFormattedBlock() {
    return this.block.hasAttributes() && !this.block.isListItem() && (this.breaksOnReturn && this.nextCharacter === "\n" || this.previousCharacter === "\n");
  }
  shouldDecreaseListLevel() {
    return this.block.hasAttributes() && this.block.isListItem() && this.block.isEmpty();
  }
  shouldPrependListItem() {
    return this.block.isListItem() && this.startLocation.offset === 0 && !this.block.isEmpty();
  }
  shouldRemoveLastBlockAttribute() {
    return this.block.hasAttributes() && !this.block.isListItem() && this.block.isEmpty();
  }
}

const PLACEHOLDER = " ";
class Composition extends BasicObject {
  constructor() {
    super(...arguments);
    this.document = new Document();
    this.attachments = [];
    this.currentAttributes = {};
    this.revision = 0;
  }
  setDocument(document) {
    if (!document.isEqualTo(this.document)) {
      var _this$delegate, _this$delegate$compos;
      this.document = document;
      this.refreshAttachments();
      this.revision++;
      return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$compos = _this$delegate.compositionDidChangeDocument) === null || _this$delegate$compos === void 0 ? void 0 : _this$delegate$compos.call(_this$delegate, document);
    }
  }

  // Snapshots

  getSnapshot() {
    return {
      document: this.document,
      selectedRange: this.getSelectedRange()
    };
  }
  loadSnapshot(_ref) {
    var _this$delegate2, _this$delegate2$compo, _this$delegate3, _this$delegate3$compo;
    let {
      document,
      selectedRange
    } = _ref;
    (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 || (_this$delegate2$compo = _this$delegate2.compositionWillLoadSnapshot) === null || _this$delegate2$compo === void 0 || _this$delegate2$compo.call(_this$delegate2);
    this.setDocument(document != null ? document : new Document());
    this.setSelection(selectedRange != null ? selectedRange : [0, 0]);
    return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 || (_this$delegate3$compo = _this$delegate3.compositionDidLoadSnapshot) === null || _this$delegate3$compo === void 0 ? void 0 : _this$delegate3$compo.call(_this$delegate3);
  }

  // Responder protocol

  insertText(text) {
    let {
      updatePosition
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      updatePosition: true
    };
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.insertTextAtRange(text, selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + text.getLength();
    if (updatePosition) {
      this.setSelection(endPosition);
    }
    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }
  insertBlock() {
    let block = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Block();
    const document = new Document([block]);
    return this.insertDocument(document);
  }
  insertDocument() {
    let document = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Document();
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.insertDocumentAtRange(document, selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + document.getLength();
    this.setSelection(endPosition);
    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }
  insertString(string, options) {
    const attributes = this.getCurrentTextAttributes();
    const text = Text.textForStringWithAttributes(string, attributes);
    return this.insertText(text, options);
  }
  insertBlockBreak() {
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.insertBlockBreakAtRange(selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + 1;
    this.setSelection(endPosition);
    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }
  insertLineBreak() {
    const insertion = new LineBreakInsertion(this);
    if (insertion.shouldDecreaseListLevel()) {
      this.decreaseListLevel();
      return this.setSelection(insertion.startPosition);
    } else if (insertion.shouldPrependListItem()) {
      const document = new Document([insertion.block.copyWithoutText()]);
      return this.insertDocument(document);
    } else if (insertion.shouldInsertBlockBreak()) {
      return this.insertBlockBreak();
    } else if (insertion.shouldRemoveLastBlockAttribute()) {
      return this.removeLastBlockAttribute();
    } else if (insertion.shouldBreakFormattedBlock()) {
      return this.breakFormattedBlock(insertion);
    } else {
      return this.insertString("\n");
    }
  }
  insertHTML(html) {
    const document = HTMLParser.parse(html).getDocument();
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.mergeDocumentAtRange(document, selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + document.getLength() - 1;
    this.setSelection(endPosition);
    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }
  replaceHTML(html) {
    const document = HTMLParser.parse(html).getDocument().copyUsingObjectsFromDocument(this.document);
    const locationRange = this.getLocationRange({
      strict: false
    });
    const selectedRange = this.document.rangeFromLocationRange(locationRange);
    this.setDocument(document);
    return this.setSelection(selectedRange);
  }
  insertFile(file) {
    return this.insertFiles([file]);
  }
  insertFiles(files) {
    const attachments = [];
    Array.from(files).forEach(file => {
      var _this$delegate4;
      if ((_this$delegate4 = this.delegate) !== null && _this$delegate4 !== void 0 && _this$delegate4.compositionShouldAcceptFile(file)) {
        const attachment = Attachment.attachmentForFile(file);
        attachments.push(attachment);
      }
    });
    return this.insertAttachments(attachments);
  }
  insertAttachment(attachment) {
    return this.insertAttachments([attachment]);
  }
  insertAttachments(attachments$1) {
    let text = new Text();
    Array.from(attachments$1).forEach(attachment => {
      var _config$attachments$t;
      const type = attachment.getType();
      const presentation = (_config$attachments$t = attachments[type]) === null || _config$attachments$t === void 0 ? void 0 : _config$attachments$t.presentation;
      const attributes = this.getCurrentTextAttributes();
      if (presentation) {
        attributes.presentation = presentation;
      }
      const attachmentText = Text.textForAttachmentWithAttributes(attachment, attributes);
      text = text.appendText(attachmentText);
    });
    return this.insertText(text);
  }
  shouldManageDeletingInDirection(direction) {
    const locationRange = this.getLocationRange();
    if (rangeIsCollapsed(locationRange)) {
      if (direction === "backward" && locationRange[0].offset === 0) {
        return true;
      }
      if (this.shouldManageMovingCursorInDirection(direction)) {
        return true;
      }
    } else {
      if (locationRange[0].index !== locationRange[1].index) {
        return true;
      }
    }
    return false;
  }
  deleteInDirection(direction) {
    let {
      length
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let attachment, deletingIntoPreviousBlock, selectionSpansBlocks;
    const locationRange = this.getLocationRange();
    let range = this.getSelectedRange();
    const selectionIsCollapsed = rangeIsCollapsed(range);
    if (selectionIsCollapsed) {
      deletingIntoPreviousBlock = direction === "backward" && locationRange[0].offset === 0;
    } else {
      selectionSpansBlocks = locationRange[0].index !== locationRange[1].index;
    }
    if (deletingIntoPreviousBlock) {
      if (this.canDecreaseBlockAttributeLevel()) {
        const block = this.getBlock();
        if (block.isListItem()) {
          this.decreaseListLevel();
        } else {
          this.decreaseBlockAttributeLevel();
        }
        this.setSelection(range[0]);
        if (block.isEmpty()) {
          return false;
        }
      }
    }
    if (selectionIsCollapsed) {
      range = this.getExpandedRangeInDirection(direction, {
        length
      });
      if (direction === "backward") {
        attachment = this.getAttachmentAtRange(range);
      }
    }
    if (attachment) {
      this.editAttachment(attachment);
      return false;
    } else {
      this.setDocument(this.document.removeTextAtRange(range));
      this.setSelection(range[0]);
      if (deletingIntoPreviousBlock || selectionSpansBlocks) {
        return false;
      }
    }
  }
  moveTextFromRange(range) {
    const [position] = Array.from(this.getSelectedRange());
    this.setDocument(this.document.moveTextFromRangeToPosition(range, position));
    return this.setSelection(position);
  }
  removeAttachment(attachment) {
    const range = this.document.getRangeOfAttachment(attachment);
    if (range) {
      this.stopEditingAttachment();
      this.setDocument(this.document.removeTextAtRange(range));
      return this.setSelection(range[0]);
    }
  }
  removeLastBlockAttribute() {
    const [startPosition, endPosition] = Array.from(this.getSelectedRange());
    const block = this.document.getBlockAtPosition(endPosition);
    this.removeCurrentAttribute(block.getLastAttribute());
    return this.setSelection(startPosition);
  }
  insertPlaceholder() {
    this.placeholderPosition = this.getPosition();
    return this.insertString(PLACEHOLDER);
  }
  selectPlaceholder() {
    if (this.placeholderPosition != null) {
      this.setSelectedRange([this.placeholderPosition, this.placeholderPosition + PLACEHOLDER.length]);
      return this.getSelectedRange();
    }
  }
  forgetPlaceholder() {
    this.placeholderPosition = null;
  }

  // Current attributes

  hasCurrentAttribute(attributeName) {
    const value = this.currentAttributes[attributeName];
    return value != null && value !== false;
  }
  toggleCurrentAttribute(attributeName) {
    const value = !this.currentAttributes[attributeName];
    if (value) {
      return this.setCurrentAttribute(attributeName, value);
    } else {
      return this.removeCurrentAttribute(attributeName);
    }
  }
  canSetCurrentAttribute(attributeName) {
    if (getBlockConfig(attributeName)) {
      return this.canSetCurrentBlockAttribute(attributeName);
    } else {
      return this.canSetCurrentTextAttribute(attributeName);
    }
  }
  canSetCurrentTextAttribute(attributeName) {
    const document = this.getSelectedDocument();
    if (!document) return;
    for (const attachment of Array.from(document.getAttachments())) {
      if (!attachment.hasContent()) {
        return false;
      }
    }
    return true;
  }
  canSetCurrentBlockAttribute(attributeName) {
    const block = this.getBlock();
    if (!block) return;
    return !block.isTerminalBlock();
  }
  setCurrentAttribute(attributeName, value) {
    if (getBlockConfig(attributeName)) {
      return this.setBlockAttribute(attributeName, value);
    } else {
      this.setTextAttribute(attributeName, value);
      this.currentAttributes[attributeName] = value;
      return this.notifyDelegateOfCurrentAttributesChange();
    }
  }
  setHTMLAtributeAtPosition(position, attributeName, value) {
    var _getBlockConfig;
    const block = this.document.getBlockAtPosition(position);
    const allowedHTMLAttributes = (_getBlockConfig = getBlockConfig(block.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.htmlAttributes;
    if (block && allowedHTMLAttributes !== null && allowedHTMLAttributes !== void 0 && allowedHTMLAttributes.includes(attributeName)) {
      const newDocument = this.document.setHTMLAttributeAtPosition(position, attributeName, value);
      this.setDocument(newDocument);
    }
  }
  setTextAttribute(attributeName, value) {
    const selectedRange = this.getSelectedRange();
    if (!selectedRange) return;
    const [startPosition, endPosition] = Array.from(selectedRange);
    if (startPosition === endPosition) {
      if (attributeName === "href") {
        const text = Text.textForStringWithAttributes(value, {
          href: value
        });
        return this.insertText(text);
      }
    } else {
      return this.setDocument(this.document.addAttributeAtRange(attributeName, value, selectedRange));
    }
  }
  setBlockAttribute(attributeName, value) {
    const selectedRange = this.getSelectedRange();
    if (this.canSetCurrentAttribute(attributeName)) {
      this.setDocument(this.document.applyBlockAttributeAtRange(attributeName, value, selectedRange));
      return this.setSelection(selectedRange);
    }
  }
  removeCurrentAttribute(attributeName) {
    if (getBlockConfig(attributeName)) {
      this.removeBlockAttribute(attributeName);
      return this.updateCurrentAttributes();
    } else {
      this.removeTextAttribute(attributeName);
      delete this.currentAttributes[attributeName];
      return this.notifyDelegateOfCurrentAttributesChange();
    }
  }
  removeTextAttribute(attributeName) {
    const selectedRange = this.getSelectedRange();
    if (!selectedRange) return;
    return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange));
  }
  removeBlockAttribute(attributeName) {
    const selectedRange = this.getSelectedRange();
    if (!selectedRange) return;
    return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange));
  }
  canDecreaseNestingLevel() {
    var _this$getBlock;
    return ((_this$getBlock = this.getBlock()) === null || _this$getBlock === void 0 ? void 0 : _this$getBlock.getNestingLevel()) > 0;
  }
  canIncreaseNestingLevel() {
    var _getBlockConfig2;
    const block = this.getBlock();
    if (!block) return;
    if ((_getBlockConfig2 = getBlockConfig(block.getLastNestableAttribute())) !== null && _getBlockConfig2 !== void 0 && _getBlockConfig2.listAttribute) {
      const previousBlock = this.getPreviousBlock();
      if (previousBlock) {
        return arrayStartsWith(previousBlock.getListItemAttributes(), block.getListItemAttributes());
      }
    } else {
      return block.getNestingLevel() > 0;
    }
  }
  decreaseNestingLevel() {
    const block = this.getBlock();
    if (!block) return;
    return this.setDocument(this.document.replaceBlock(block, block.decreaseNestingLevel()));
  }
  increaseNestingLevel() {
    const block = this.getBlock();
    if (!block) return;
    return this.setDocument(this.document.replaceBlock(block, block.increaseNestingLevel()));
  }
  canDecreaseBlockAttributeLevel() {
    var _this$getBlock2;
    return ((_this$getBlock2 = this.getBlock()) === null || _this$getBlock2 === void 0 ? void 0 : _this$getBlock2.getAttributeLevel()) > 0;
  }
  decreaseBlockAttributeLevel() {
    var _this$getBlock3;
    const attribute = (_this$getBlock3 = this.getBlock()) === null || _this$getBlock3 === void 0 ? void 0 : _this$getBlock3.getLastAttribute();
    if (attribute) {
      return this.removeCurrentAttribute(attribute);
    }
  }
  decreaseListLevel() {
    let [startPosition] = Array.from(this.getSelectedRange());
    const {
      index
    } = this.document.locationFromPosition(startPosition);
    let endIndex = index;
    const attributeLevel = this.getBlock().getAttributeLevel();
    let block = this.document.getBlockAtIndex(endIndex + 1);
    while (block) {
      if (!block.isListItem() || block.getAttributeLevel() <= attributeLevel) {
        break;
      }
      endIndex++;
      block = this.document.getBlockAtIndex(endIndex + 1);
    }
    startPosition = this.document.positionFromLocation({
      index,
      offset: 0
    });
    const endPosition = this.document.positionFromLocation({
      index: endIndex,
      offset: 0
    });
    return this.setDocument(this.document.removeLastListAttributeAtRange([startPosition, endPosition]));
  }
  updateCurrentAttributes() {
    const selectedRange = this.getSelectedRange({
      ignoreLock: true
    });
    if (selectedRange) {
      const currentAttributes = this.document.getCommonAttributesAtRange(selectedRange);
      Array.from(getAllAttributeNames()).forEach(attributeName => {
        if (!currentAttributes[attributeName]) {
          if (!this.canSetCurrentAttribute(attributeName)) {
            currentAttributes[attributeName] = false;
          }
        }
      });
      if (!objectsAreEqual(currentAttributes, this.currentAttributes)) {
        this.currentAttributes = currentAttributes;
        return this.notifyDelegateOfCurrentAttributesChange();
      }
    }
  }
  getCurrentAttributes() {
    return extend$1.call({}, this.currentAttributes);
  }
  getCurrentTextAttributes() {
    const attributes = {};
    for (const key in this.currentAttributes) {
      const value = this.currentAttributes[key];
      if (value !== false) {
        if (getTextConfig(key)) {
          attributes[key] = value;
        }
      }
    }
    return attributes;
  }

  // Selection freezing

  freezeSelection() {
    return this.setCurrentAttribute("frozen", true);
  }
  thawSelection() {
    return this.removeCurrentAttribute("frozen");
  }
  hasFrozenSelection() {
    return this.hasCurrentAttribute("frozen");
  }
  setSelection(selectedRange) {
    var _this$delegate5;
    const locationRange = this.document.locationRangeFromRange(selectedRange);
    return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : _this$delegate5.compositionDidRequestChangingSelectionToLocationRange(locationRange);
  }
  getSelectedRange() {
    const locationRange = this.getLocationRange();
    if (locationRange) {
      return this.document.rangeFromLocationRange(locationRange);
    }
  }
  setSelectedRange(selectedRange) {
    const locationRange = this.document.locationRangeFromRange(selectedRange);
    return this.getSelectionManager().setLocationRange(locationRange);
  }
  getPosition() {
    const locationRange = this.getLocationRange();
    if (locationRange) {
      return this.document.positionFromLocation(locationRange[0]);
    }
  }
  getLocationRange(options) {
    if (this.targetLocationRange) {
      return this.targetLocationRange;
    } else {
      return this.getSelectionManager().getLocationRange(options) || normalizeRange({
        index: 0,
        offset: 0
      });
    }
  }
  withTargetLocationRange(locationRange, fn) {
    let result;
    this.targetLocationRange = locationRange;
    try {
      result = fn();
    } finally {
      this.targetLocationRange = null;
    }
    return result;
  }
  withTargetRange(range, fn) {
    const locationRange = this.document.locationRangeFromRange(range);
    return this.withTargetLocationRange(locationRange, fn);
  }
  withTargetDOMRange(domRange, fn) {
    const locationRange = this.createLocationRangeFromDOMRange(domRange, {
      strict: false
    });
    return this.withTargetLocationRange(locationRange, fn);
  }
  getExpandedRangeInDirection(direction) {
    let {
      length
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let [startPosition, endPosition] = Array.from(this.getSelectedRange());
    if (direction === "backward") {
      if (length) {
        startPosition -= length;
      } else {
        startPosition = this.translateUTF16PositionFromOffset(startPosition, -1);
      }
    } else {
      if (length) {
        endPosition += length;
      } else {
        endPosition = this.translateUTF16PositionFromOffset(endPosition, 1);
      }
    }
    return normalizeRange([startPosition, endPosition]);
  }
  shouldManageMovingCursorInDirection(direction) {
    if (this.editingAttachment) {
      return true;
    }
    const range = this.getExpandedRangeInDirection(direction);
    return this.getAttachmentAtRange(range) != null;
  }
  moveCursorInDirection(direction) {
    let canEditAttachment, range;
    if (this.editingAttachment) {
      range = this.document.getRangeOfAttachment(this.editingAttachment);
    } else {
      const selectedRange = this.getSelectedRange();
      range = this.getExpandedRangeInDirection(direction);
      canEditAttachment = !rangesAreEqual(selectedRange, range);
    }
    if (direction === "backward") {
      this.setSelectedRange(range[0]);
    } else {
      this.setSelectedRange(range[1]);
    }
    if (canEditAttachment) {
      const attachment = this.getAttachmentAtRange(range);
      if (attachment) {
        return this.editAttachment(attachment);
      }
    }
  }
  expandSelectionInDirection(direction) {
    let {
      length
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const range = this.getExpandedRangeInDirection(direction, {
      length
    });
    return this.setSelectedRange(range);
  }
  expandSelectionForEditing() {
    if (this.hasCurrentAttribute("href")) {
      return this.expandSelectionAroundCommonAttribute("href");
    }
  }
  expandSelectionAroundCommonAttribute(attributeName) {
    const position = this.getPosition();
    const range = this.document.getRangeOfCommonAttributeAtPosition(attributeName, position);
    return this.setSelectedRange(range);
  }
  selectionContainsAttachments() {
    var _this$getSelectedAtta;
    return ((_this$getSelectedAtta = this.getSelectedAttachments()) === null || _this$getSelectedAtta === void 0 ? void 0 : _this$getSelectedAtta.length) > 0;
  }
  selectionIsInCursorTarget() {
    return this.editingAttachment || this.positionIsCursorTarget(this.getPosition());
  }
  positionIsCursorTarget(position) {
    const location = this.document.locationFromPosition(position);
    if (location) {
      return this.locationIsCursorTarget(location);
    }
  }
  positionIsBlockBreak(position) {
    var _this$document$getPie;
    return (_this$document$getPie = this.document.getPieceAtPosition(position)) === null || _this$document$getPie === void 0 ? void 0 : _this$document$getPie.isBlockBreak();
  }
  getSelectedDocument() {
    const selectedRange = this.getSelectedRange();
    if (selectedRange) {
      return this.document.getDocumentAtRange(selectedRange);
    }
  }
  getSelectedAttachments() {
    var _this$getSelectedDocu;
    return (_this$getSelectedDocu = this.getSelectedDocument()) === null || _this$getSelectedDocu === void 0 ? void 0 : _this$getSelectedDocu.getAttachments();
  }

  // Attachments

  getAttachments() {
    return this.attachments.slice(0);
  }
  refreshAttachments() {
    const attachments = this.document.getAttachments();
    const {
      added,
      removed
    } = summarizeArrayChange(this.attachments, attachments);
    this.attachments = attachments;
    Array.from(removed).forEach(attachment => {
      var _this$delegate6, _this$delegate6$compo;
      attachment.delegate = null;
      (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 || (_this$delegate6$compo = _this$delegate6.compositionDidRemoveAttachment) === null || _this$delegate6$compo === void 0 || _this$delegate6$compo.call(_this$delegate6, attachment);
    });
    return (() => {
      const result = [];
      Array.from(added).forEach(attachment => {
        var _this$delegate7, _this$delegate7$compo;
        attachment.delegate = this;
        result.push((_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 || (_this$delegate7$compo = _this$delegate7.compositionDidAddAttachment) === null || _this$delegate7$compo === void 0 ? void 0 : _this$delegate7$compo.call(_this$delegate7, attachment));
      });
      return result;
    })();
  }

  // Attachment delegate

  attachmentDidChangeAttributes(attachment) {
    var _this$delegate8, _this$delegate8$compo;
    this.revision++;
    return (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 || (_this$delegate8$compo = _this$delegate8.compositionDidEditAttachment) === null || _this$delegate8$compo === void 0 ? void 0 : _this$delegate8$compo.call(_this$delegate8, attachment);
  }
  attachmentDidChangePreviewURL(attachment) {
    var _this$delegate9, _this$delegate9$compo;
    this.revision++;
    return (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 || (_this$delegate9$compo = _this$delegate9.compositionDidChangeAttachmentPreviewURL) === null || _this$delegate9$compo === void 0 ? void 0 : _this$delegate9$compo.call(_this$delegate9, attachment);
  }

  // Attachment editing

  editAttachment(attachment, options) {
    var _this$delegate10, _this$delegate10$comp;
    if (attachment === this.editingAttachment) return;
    this.stopEditingAttachment();
    this.editingAttachment = attachment;
    return (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 || (_this$delegate10$comp = _this$delegate10.compositionDidStartEditingAttachment) === null || _this$delegate10$comp === void 0 ? void 0 : _this$delegate10$comp.call(_this$delegate10, this.editingAttachment, options);
  }
  stopEditingAttachment() {
    var _this$delegate11, _this$delegate11$comp;
    if (!this.editingAttachment) return;
    (_this$delegate11 = this.delegate) === null || _this$delegate11 === void 0 || (_this$delegate11$comp = _this$delegate11.compositionDidStopEditingAttachment) === null || _this$delegate11$comp === void 0 || _this$delegate11$comp.call(_this$delegate11, this.editingAttachment);
    this.editingAttachment = null;
  }
  updateAttributesForAttachment(attributes, attachment) {
    return this.setDocument(this.document.updateAttributesForAttachment(attributes, attachment));
  }
  removeAttributeForAttachment(attribute, attachment) {
    return this.setDocument(this.document.removeAttributeForAttachment(attribute, attachment));
  }

  // Private

  breakFormattedBlock(insertion) {
    let {
      document
    } = insertion;
    const {
      block
    } = insertion;
    let position = insertion.startPosition;
    let range = [position - 1, position];
    if (block.getBlockBreakPosition() === insertion.startLocation.offset) {
      if (block.breaksOnReturn() && insertion.nextCharacter === "\n") {
        position += 1;
      } else {
        document = document.removeTextAtRange(range);
      }
      range = [position, position];
    } else if (insertion.nextCharacter === "\n") {
      if (insertion.previousCharacter === "\n") {
        range = [position - 1, position + 1];
      } else {
        range = [position, position + 1];
        position += 1;
      }
    } else if (insertion.startLocation.offset - 1 !== 0) {
      position += 1;
    }
    const newDocument = new Document([block.removeLastAttribute().copyWithoutText()]);
    this.setDocument(document.insertDocumentAtRange(newDocument, range));
    return this.setSelection(position);
  }
  getPreviousBlock() {
    const locationRange = this.getLocationRange();
    if (locationRange) {
      const {
        index
      } = locationRange[0];
      if (index > 0) {
        return this.document.getBlockAtIndex(index - 1);
      }
    }
  }
  getBlock() {
    const locationRange = this.getLocationRange();
    if (locationRange) {
      return this.document.getBlockAtIndex(locationRange[0].index);
    }
  }
  getAttachmentAtRange(range) {
    const document = this.document.getDocumentAtRange(range);
    if (document.toString() === "".concat(OBJECT_REPLACEMENT_CHARACTER, "\n")) {
      return document.getAttachments()[0];
    }
  }
  notifyDelegateOfCurrentAttributesChange() {
    var _this$delegate12, _this$delegate12$comp;
    return (_this$delegate12 = this.delegate) === null || _this$delegate12 === void 0 || (_this$delegate12$comp = _this$delegate12.compositionDidChangeCurrentAttributes) === null || _this$delegate12$comp === void 0 ? void 0 : _this$delegate12$comp.call(_this$delegate12, this.currentAttributes);
  }
  notifyDelegateOfInsertionAtRange(range) {
    var _this$delegate13, _this$delegate13$comp;
    return (_this$delegate13 = this.delegate) === null || _this$delegate13 === void 0 || (_this$delegate13$comp = _this$delegate13.compositionDidPerformInsertionAtRange) === null || _this$delegate13$comp === void 0 ? void 0 : _this$delegate13$comp.call(_this$delegate13, range);
  }
  translateUTF16PositionFromOffset(position, offset) {
    const utf16string = this.document.toUTF16String();
    const utf16position = utf16string.offsetFromUCS2Offset(position);
    return utf16string.offsetToUCS2Offset(utf16position + offset);
  }
}
Composition.proxyMethod("getSelectionManager().getPointRange");
Composition.proxyMethod("getSelectionManager().setLocationRangeFromPointRange");
Composition.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange");
Composition.proxyMethod("getSelectionManager().locationIsCursorTarget");
Composition.proxyMethod("getSelectionManager().selectionIsExpanded");
Composition.proxyMethod("delegate?.getSelectionManager");

class UndoManager extends BasicObject {
  constructor(composition) {
    super(...arguments);
    this.composition = composition;
    this.undoEntries = [];
    this.redoEntries = [];
  }
  recordUndoEntry(description) {
    let {
      context,
      consolidatable
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const previousEntry = this.undoEntries.slice(-1)[0];
    if (!consolidatable || !entryHasDescriptionAndContext(previousEntry, description, context)) {
      const undoEntry = this.createEntry({
        description,
        context
      });
      this.undoEntries.push(undoEntry);
      this.redoEntries = [];
    }
  }
  undo() {
    const undoEntry = this.undoEntries.pop();
    if (undoEntry) {
      const redoEntry = this.createEntry(undoEntry);
      this.redoEntries.push(redoEntry);
      return this.composition.loadSnapshot(undoEntry.snapshot);
    }
  }
  redo() {
    const redoEntry = this.redoEntries.pop();
    if (redoEntry) {
      const undoEntry = this.createEntry(redoEntry);
      this.undoEntries.push(undoEntry);
      return this.composition.loadSnapshot(redoEntry.snapshot);
    }
  }
  canUndo() {
    return this.undoEntries.length > 0;
  }
  canRedo() {
    return this.redoEntries.length > 0;
  }

  // Private

  createEntry() {
    let {
      description,
      context
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      description: description === null || description === void 0 ? void 0 : description.toString(),
      context: JSON.stringify(context),
      snapshot: this.composition.getSnapshot()
    };
  }
}
const entryHasDescriptionAndContext = (entry, description, context) => (entry === null || entry === void 0 ? void 0 : entry.description) === (description === null || description === void 0 ? void 0 : description.toString()) && (entry === null || entry === void 0 ? void 0 : entry.context) === JSON.stringify(context);

const BLOCK_ATTRIBUTE_NAME = "attachmentGallery";
const TEXT_ATTRIBUTE_NAME = "presentation";
const TEXT_ATTRIBUTE_VALUE = "gallery";
class Filter {
  constructor(snapshot) {
    this.document = snapshot.document;
    this.selectedRange = snapshot.selectedRange;
  }
  perform() {
    this.removeBlockAttribute();
    return this.applyBlockAttribute();
  }
  getSnapshot() {
    return {
      document: this.document,
      selectedRange: this.selectedRange
    };
  }

  // Private

  removeBlockAttribute() {
    return this.findRangesOfBlocks().map(range => this.document = this.document.removeAttributeAtRange(BLOCK_ATTRIBUTE_NAME, range));
  }
  applyBlockAttribute() {
    let offset = 0;
    this.findRangesOfPieces().forEach(range => {
      if (range[1] - range[0] > 1) {
        range[0] += offset;
        range[1] += offset;
        if (this.document.getCharacterAtPosition(range[1]) !== "\n") {
          this.document = this.document.insertBlockBreakAtRange(range[1]);
          if (range[1] < this.selectedRange[1]) {
            this.moveSelectedRangeForward();
          }
          range[1]++;
          offset++;
        }
        if (range[0] !== 0) {
          if (this.document.getCharacterAtPosition(range[0] - 1) !== "\n") {
            this.document = this.document.insertBlockBreakAtRange(range[0]);
            if (range[0] < this.selectedRange[0]) {
              this.moveSelectedRangeForward();
            }
            range[0]++;
            offset++;
          }
        }
        this.document = this.document.applyBlockAttributeAtRange(BLOCK_ATTRIBUTE_NAME, true, range);
      }
    });
  }
  findRangesOfBlocks() {
    return this.document.findRangesForBlockAttribute(BLOCK_ATTRIBUTE_NAME);
  }
  findRangesOfPieces() {
    return this.document.findRangesForTextAttribute(TEXT_ATTRIBUTE_NAME, {
      withValue: TEXT_ATTRIBUTE_VALUE
    });
  }
  moveSelectedRangeForward() {
    this.selectedRange[0] += 1;
    this.selectedRange[1] += 1;
  }
}

const attachmentGalleryFilter = function (snapshot) {
  const filter = new Filter(snapshot);
  filter.perform();
  return filter.getSnapshot();
};

const DEFAULT_FILTERS = [attachmentGalleryFilter];
class Editor {
  constructor(composition, selectionManager, element) {
    this.insertFiles = this.insertFiles.bind(this);
    this.composition = composition;
    this.selectionManager = selectionManager;
    this.element = element;
    this.undoManager = new UndoManager(this.composition);
    this.filters = DEFAULT_FILTERS.slice(0);
  }
  loadDocument(document) {
    return this.loadSnapshot({
      document,
      selectedRange: [0, 0]
    });
  }
  loadHTML() {
    let html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    const document = HTMLParser.parse(html, {
      referenceElement: this.element
    }).getDocument();
    return this.loadDocument(document);
  }
  loadJSON(_ref) {
    let {
      document,
      selectedRange
    } = _ref;
    document = Document.fromJSON(document);
    return this.loadSnapshot({
      document,
      selectedRange
    });
  }
  loadSnapshot(snapshot) {
    this.undoManager = new UndoManager(this.composition);
    return this.composition.loadSnapshot(snapshot);
  }
  getDocument() {
    return this.composition.document;
  }
  getSelectedDocument() {
    return this.composition.getSelectedDocument();
  }
  getSnapshot() {
    return this.composition.getSnapshot();
  }
  toJSON() {
    return this.getSnapshot();
  }

  // Document manipulation

  deleteInDirection(direction) {
    return this.composition.deleteInDirection(direction);
  }
  insertAttachment(attachment) {
    return this.composition.insertAttachment(attachment);
  }
  insertAttachments(attachments) {
    return this.composition.insertAttachments(attachments);
  }
  insertDocument(document) {
    return this.composition.insertDocument(document);
  }
  insertFile(file) {
    return this.composition.insertFile(file);
  }
  insertFiles(files) {
    return this.composition.insertFiles(files);
  }
  insertHTML(html) {
    return this.composition.insertHTML(html);
  }
  insertString(string) {
    return this.composition.insertString(string);
  }
  insertText(text) {
    return this.composition.insertText(text);
  }
  insertLineBreak() {
    return this.composition.insertLineBreak();
  }

  // Selection

  getSelectedRange() {
    return this.composition.getSelectedRange();
  }
  getPosition() {
    return this.composition.getPosition();
  }
  getClientRectAtPosition(position) {
    const locationRange = this.getDocument().locationRangeFromRange([position, position + 1]);
    return this.selectionManager.getClientRectAtLocationRange(locationRange);
  }
  expandSelectionInDirection(direction) {
    return this.composition.expandSelectionInDirection(direction);
  }
  moveCursorInDirection(direction) {
    return this.composition.moveCursorInDirection(direction);
  }
  setSelectedRange(selectedRange) {
    return this.composition.setSelectedRange(selectedRange);
  }

  // Attributes

  activateAttribute(name) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return this.composition.setCurrentAttribute(name, value);
  }
  attributeIsActive(name) {
    return this.composition.hasCurrentAttribute(name);
  }
  canActivateAttribute(name) {
    return this.composition.canSetCurrentAttribute(name);
  }
  deactivateAttribute(name) {
    return this.composition.removeCurrentAttribute(name);
  }

  // HTML attributes
  setHTMLAtributeAtPosition(position, name, value) {
    this.composition.setHTMLAtributeAtPosition(position, name, value);
  }

  // Nesting level

  canDecreaseNestingLevel() {
    return this.composition.canDecreaseNestingLevel();
  }
  canIncreaseNestingLevel() {
    return this.composition.canIncreaseNestingLevel();
  }
  decreaseNestingLevel() {
    if (this.canDecreaseNestingLevel()) {
      return this.composition.decreaseNestingLevel();
    }
  }
  increaseNestingLevel() {
    if (this.canIncreaseNestingLevel()) {
      return this.composition.increaseNestingLevel();
    }
  }

  // Undo/redo

  canRedo() {
    return this.undoManager.canRedo();
  }
  canUndo() {
    return this.undoManager.canUndo();
  }
  recordUndoEntry(description) {
    let {
      context,
      consolidatable
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.undoManager.recordUndoEntry(description, {
      context,
      consolidatable
    });
  }
  redo() {
    if (this.canRedo()) {
      return this.undoManager.redo();
    }
  }
  undo() {
    if (this.canUndo()) {
      return this.undoManager.undo();
    }
  }
}

/* eslint-disable
    no-var,
    prefer-const,
*/
class LocationMapper {
  constructor(element) {
    this.element = element;
  }
  findLocationFromContainerAndOffset(container, offset) {
    let {
      strict
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      strict: true
    };
    let childIndex = 0;
    let foundBlock = false;
    const location = {
      index: 0,
      offset: 0
    };
    const attachmentElement = this.findAttachmentElementParentForNode(container);
    if (attachmentElement) {
      container = attachmentElement.parentNode;
      offset = findChildIndexOfNode(attachmentElement);
    }
    const walker = walkTree(this.element, {
      usingFilter: rejectAttachmentContents
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node === container && nodeIsTextNode(container)) {
        if (!nodeIsCursorTarget(node)) {
          location.offset += offset;
        }
        break;
      } else {
        if (node.parentNode === container) {
          if (childIndex++ === offset) {
            break;
          }
        } else if (!elementContainsNode(container, node)) {
          if (childIndex > 0) {
            break;
          }
        }
        if (nodeIsBlockStart(node, {
          strict
        })) {
          if (foundBlock) {
            location.index++;
          }
          location.offset = 0;
          foundBlock = true;
        } else {
          location.offset += nodeLength(node);
        }
      }
    }
    return location;
  }
  findContainerAndOffsetFromLocation(location) {
    let container, offset;
    if (location.index === 0 && location.offset === 0) {
      container = this.element;
      offset = 0;
      while (container.firstChild) {
        container = container.firstChild;
        if (nodeIsBlockContainer(container)) {
          offset = 1;
          break;
        }
      }
      return [container, offset];
    }
    let [node, nodeOffset] = this.findNodeAndOffsetFromLocation(location);
    if (!node) return;
    if (nodeIsTextNode(node)) {
      if (nodeLength(node) === 0) {
        container = node.parentNode.parentNode;
        offset = findChildIndexOfNode(node.parentNode);
        if (nodeIsCursorTarget(node, {
          name: "right"
        })) {
          offset++;
        }
      } else {
        container = node;
        offset = location.offset - nodeOffset;
      }
    } else {
      container = node.parentNode;
      if (!nodeIsBlockStart(node.previousSibling)) {
        if (!nodeIsBlockContainer(container)) {
          while (node === container.lastChild) {
            node = container;
            container = container.parentNode;
            if (nodeIsBlockContainer(container)) {
              break;
            }
          }
        }
      }
      offset = findChildIndexOfNode(node);
      if (location.offset !== 0) {
        offset++;
      }
    }
    return [container, offset];
  }
  findNodeAndOffsetFromLocation(location) {
    let node, nodeOffset;
    let offset = 0;
    for (const currentNode of this.getSignificantNodesForIndex(location.index)) {
      const length = nodeLength(currentNode);
      if (location.offset <= offset + length) {
        if (nodeIsTextNode(currentNode)) {
          node = currentNode;
          nodeOffset = offset;
          if (location.offset === nodeOffset && nodeIsCursorTarget(node)) {
            break;
          }
        } else if (!node) {
          node = currentNode;
          nodeOffset = offset;
        }
      }
      offset += length;
      if (offset > location.offset) {
        break;
      }
    }
    return [node, nodeOffset];
  }

  // Private

  findAttachmentElementParentForNode(node) {
    while (node && node !== this.element) {
      if (nodeIsAttachmentElement(node)) {
        return node;
      }
      node = node.parentNode;
    }
  }
  getSignificantNodesForIndex(index) {
    const nodes = [];
    const walker = walkTree(this.element, {
      usingFilter: acceptSignificantNodes
    });
    let recordingNodes = false;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (nodeIsBlockStartComment(node)) {
        var blockIndex;
        if (blockIndex != null) {
          blockIndex++;
        } else {
          blockIndex = 0;
        }
        if (blockIndex === index) {
          recordingNodes = true;
        } else if (recordingNodes) {
          break;
        }
      } else if (recordingNodes) {
        nodes.push(node);
      }
    }
    return nodes;
  }
}
const nodeLength = function (node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (nodeIsCursorTarget(node)) {
      return 0;
    } else {
      const string = node.textContent;
      return string.length;
    }
  } else if (tagName(node) === "br" || nodeIsAttachmentElement(node)) {
    return 1;
  } else {
    return 0;
  }
};
const acceptSignificantNodes = function (node) {
  if (rejectEmptyTextNodes(node) === NodeFilter.FILTER_ACCEPT) {
    return rejectAttachmentContents(node);
  } else {
    return NodeFilter.FILTER_REJECT;
  }
};
const rejectEmptyTextNodes = function (node) {
  if (nodeIsEmptyTextNode(node)) {
    return NodeFilter.FILTER_REJECT;
  } else {
    return NodeFilter.FILTER_ACCEPT;
  }
};
const rejectAttachmentContents = function (node) {
  if (nodeIsAttachmentElement(node.parentNode)) {
    return NodeFilter.FILTER_REJECT;
  } else {
    return NodeFilter.FILTER_ACCEPT;
  }
};

/* eslint-disable
    id-length,
    no-empty,
*/
class PointMapper {
  createDOMRangeFromPoint(_ref) {
    let {
      x,
      y
    } = _ref;
    let domRange;
    if (document.caretPositionFromPoint) {
      const {
        offsetNode,
        offset
      } = document.caretPositionFromPoint(x, y);
      domRange = document.createRange();
      domRange.setStart(offsetNode, offset);
      return domRange;
    } else if (document.caretRangeFromPoint) {
      return document.caretRangeFromPoint(x, y);
    } else if (document.body.createTextRange) {
      const originalDOMRange = getDOMRange();
      try {
        // IE 11 throws "Unspecified error" when using moveToPoint
        // during a drag-and-drop operation.
        const textRange = document.body.createTextRange();
        textRange.moveToPoint(x, y);
        textRange.select();
      } catch (error) {}
      domRange = getDOMRange();
      setDOMRange(originalDOMRange);
      return domRange;
    }
  }
  getClientRectsForDOMRange(domRange) {
    const array = Array.from(domRange.getClientRects());
    const start = array[0];
    const end = array[array.length - 1];
    return [start, end];
  }
}

/* eslint-disable
*/
class SelectionManager extends BasicObject {
  constructor(element) {
    super(...arguments);
    this.didMouseDown = this.didMouseDown.bind(this);
    this.selectionDidChange = this.selectionDidChange.bind(this);
    this.element = element;
    this.locationMapper = new LocationMapper(this.element);
    this.pointMapper = new PointMapper();
    this.lockCount = 0;
    handleEvent("mousedown", {
      onElement: this.element,
      withCallback: this.didMouseDown
    });
  }
  getLocationRange() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (options.strict === false) {
      return this.createLocationRangeFromDOMRange(getDOMRange());
    } else if (options.ignoreLock) {
      return this.currentLocationRange;
    } else if (this.lockedLocationRange) {
      return this.lockedLocationRange;
    } else {
      return this.currentLocationRange;
    }
  }
  setLocationRange(locationRange) {
    if (this.lockedLocationRange) return;
    locationRange = normalizeRange(locationRange);
    const domRange = this.createDOMRangeFromLocationRange(locationRange);
    if (domRange) {
      setDOMRange(domRange);
      this.updateCurrentLocationRange(locationRange);
    }
  }
  setLocationRangeFromPointRange(pointRange) {
    pointRange = normalizeRange(pointRange);
    const startLocation = this.getLocationAtPoint(pointRange[0]);
    const endLocation = this.getLocationAtPoint(pointRange[1]);
    this.setLocationRange([startLocation, endLocation]);
  }
  getClientRectAtLocationRange(locationRange) {
    const domRange = this.createDOMRangeFromLocationRange(locationRange);
    if (domRange) {
      return this.getClientRectsForDOMRange(domRange)[1];
    }
  }
  locationIsCursorTarget(location) {
    const node = Array.from(this.findNodeAndOffsetFromLocation(location))[0];
    return nodeIsCursorTarget(node);
  }
  lock() {
    if (this.lockCount++ === 0) {
      this.updateCurrentLocationRange();
      this.lockedLocationRange = this.getLocationRange();
    }
  }
  unlock() {
    if (--this.lockCount === 0) {
      const {
        lockedLocationRange
      } = this;
      this.lockedLocationRange = null;
      if (lockedLocationRange != null) {
        return this.setLocationRange(lockedLocationRange);
      }
    }
  }
  clearSelection() {
    var _getDOMSelection;
    return (_getDOMSelection = getDOMSelection()) === null || _getDOMSelection === void 0 ? void 0 : _getDOMSelection.removeAllRanges();
  }
  selectionIsCollapsed() {
    var _getDOMRange;
    return ((_getDOMRange = getDOMRange()) === null || _getDOMRange === void 0 ? void 0 : _getDOMRange.collapsed) === true;
  }
  selectionIsExpanded() {
    return !this.selectionIsCollapsed();
  }
  createLocationRangeFromDOMRange(domRange, options) {
    if (domRange == null || !this.domRangeWithinElement(domRange)) return;
    const start = this.findLocationFromContainerAndOffset(domRange.startContainer, domRange.startOffset, options);
    if (!start) return;
    const end = domRange.collapsed ? undefined : this.findLocationFromContainerAndOffset(domRange.endContainer, domRange.endOffset, options);
    return normalizeRange([start, end]);
  }
  didMouseDown() {
    return this.pauseTemporarily();
  }
  pauseTemporarily() {
    let resumeHandlers;
    this.paused = true;
    const resume = () => {
      this.paused = false;
      clearTimeout(resumeTimeout);
      Array.from(resumeHandlers).forEach(handler => {
        handler.destroy();
      });
      if (elementContainsNode(document, this.element)) {
        return this.selectionDidChange();
      }
    };
    const resumeTimeout = setTimeout(resume, 200);
    resumeHandlers = ["mousemove", "keydown"].map(eventName => handleEvent(eventName, {
      onElement: document,
      withCallback: resume
    }));
  }
  selectionDidChange() {
    if (!this.paused && !innerElementIsActive(this.element)) {
      return this.updateCurrentLocationRange();
    }
  }
  updateCurrentLocationRange(locationRange) {
    if (locationRange != null ? locationRange : locationRange = this.createLocationRangeFromDOMRange(getDOMRange())) {
      if (!rangesAreEqual(locationRange, this.currentLocationRange)) {
        var _this$delegate, _this$delegate$locati;
        this.currentLocationRange = locationRange;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$locati = _this$delegate.locationRangeDidChange) === null || _this$delegate$locati === void 0 ? void 0 : _this$delegate$locati.call(_this$delegate, this.currentLocationRange.slice(0));
      }
    }
  }
  createDOMRangeFromLocationRange(locationRange) {
    const rangeStart = this.findContainerAndOffsetFromLocation(locationRange[0]);
    const rangeEnd = rangeIsCollapsed(locationRange) ? rangeStart : this.findContainerAndOffsetFromLocation(locationRange[1]) || rangeStart;
    if (rangeStart != null && rangeEnd != null) {
      const domRange = document.createRange();
      domRange.setStart(...Array.from(rangeStart || []));
      domRange.setEnd(...Array.from(rangeEnd || []));
      return domRange;
    }
  }
  getLocationAtPoint(point) {
    const domRange = this.createDOMRangeFromPoint(point);
    if (domRange) {
      var _this$createLocationR;
      return (_this$createLocationR = this.createLocationRangeFromDOMRange(domRange)) === null || _this$createLocationR === void 0 ? void 0 : _this$createLocationR[0];
    }
  }
  domRangeWithinElement(domRange) {
    if (domRange.collapsed) {
      return elementContainsNode(this.element, domRange.startContainer);
    } else {
      return elementContainsNode(this.element, domRange.startContainer) && elementContainsNode(this.element, domRange.endContainer);
    }
  }
}
SelectionManager.proxyMethod("locationMapper.findLocationFromContainerAndOffset");
SelectionManager.proxyMethod("locationMapper.findContainerAndOffsetFromLocation");
SelectionManager.proxyMethod("locationMapper.findNodeAndOffsetFromLocation");
SelectionManager.proxyMethod("pointMapper.createDOMRangeFromPoint");
SelectionManager.proxyMethod("pointMapper.getClientRectsForDOMRange");

var models = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Attachment: Attachment,
  AttachmentManager: AttachmentManager,
  AttachmentPiece: AttachmentPiece,
  Block: Block,
  Composition: Composition,
  Document: Document,
  Editor: Editor,
  HTMLParser: HTMLParser,
  HTMLSanitizer: HTMLSanitizer,
  LineBreakInsertion: LineBreakInsertion,
  LocationMapper: LocationMapper,
  ManagedAttachment: ManagedAttachment,
  Piece: Piece,
  PointMapper: PointMapper,
  SelectionManager: SelectionManager,
  SplittableList: SplittableList,
  StringPiece: StringPiece,
  Text: Text,
  UndoManager: UndoManager
});

var views = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ObjectView: ObjectView,
  AttachmentView: AttachmentView,
  BlockView: BlockView,
  DocumentView: DocumentView,
  PieceView: PieceView,
  PreviewableAttachmentView: PreviewableAttachmentView,
  TextView: TextView
});

const {
  lang,
  css: css$1,
  keyNames: keyNames$1
} = config;
const undoable = function (fn) {
  return function () {
    const commands = fn.apply(this, arguments);
    commands.do();
    if (!this.undos) {
      this.undos = [];
    }
    this.undos.push(commands.undo);
  };
};
class AttachmentEditorController extends BasicObject {
  constructor(attachmentPiece, _element, container) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    super(...arguments);
    // Installing and uninstalling
    _defineProperty(this, "makeElementMutable", undoable(() => {
      return {
        do: () => {
          this.element.dataset.trixMutable = true;
        },
        undo: () => delete this.element.dataset.trixMutable
      };
    }));
    _defineProperty(this, "addToolbar", undoable(() => {
      // <div class="#{css.attachmentMetadataContainer}" data-trix-mutable="true">
      //   <div class="trix-button-row">
      //     <span class="trix-button-group trix-button-group--actions">
      //       <button type="button" class="trix-button trix-button--remove" title="#{lang.remove}" data-trix-action="remove">#{lang.remove}</button>
      //     </span>
      //   </div>
      // </div>
      const element = makeElement({
        tagName: "div",
        className: css$1.attachmentToolbar,
        data: {
          trixMutable: true
        },
        childNodes: makeElement({
          tagName: "div",
          className: "trix-button-row",
          childNodes: makeElement({
            tagName: "span",
            className: "trix-button-group trix-button-group--actions",
            childNodes: makeElement({
              tagName: "button",
              className: "trix-button trix-button--remove",
              textContent: lang.remove,
              attributes: {
                title: lang.remove
              },
              data: {
                trixAction: "remove"
              }
            })
          })
        })
      });
      if (this.attachment.isPreviewable()) {
        // <div class="#{css.attachmentMetadataContainer}">
        //   <span class="#{css.attachmentMetadata}">
        //     <span class="#{css.attachmentName}" title="#{name}">#{name}</span>
        //     <span class="#{css.attachmentSize}">#{size}</span>
        //   </span>
        // </div>
        element.appendChild(makeElement({
          tagName: "div",
          className: css$1.attachmentMetadataContainer,
          childNodes: makeElement({
            tagName: "span",
            className: css$1.attachmentMetadata,
            childNodes: [makeElement({
              tagName: "span",
              className: css$1.attachmentName,
              textContent: this.attachment.getFilename(),
              attributes: {
                title: this.attachment.getFilename()
              }
            }), makeElement({
              tagName: "span",
              className: css$1.attachmentSize,
              textContent: this.attachment.getFormattedFilesize()
            })]
          })
        }));
      }
      handleEvent("click", {
        onElement: element,
        withCallback: this.didClickToolbar
      });
      handleEvent("click", {
        onElement: element,
        matchingSelector: "[data-trix-action]",
        withCallback: this.didClickActionButton
      });
      triggerEvent$1("trix-attachment-before-toolbar", {
        onElement: this.element,
        attributes: {
          toolbar: element,
          attachment: this.attachment
        }
      });
      return {
        do: () => this.element.appendChild(element),
        undo: () => removeNode(element)
      };
    }));
    _defineProperty(this, "installCaptionEditor", undoable(() => {
      const textarea = makeElement({
        tagName: "textarea",
        className: css$1.attachmentCaptionEditor,
        attributes: {
          placeholder: lang.captionPlaceholder
        },
        data: {
          trixMutable: true
        }
      });
      textarea.value = this.attachmentPiece.getCaption();
      const textareaClone = textarea.cloneNode();
      textareaClone.classList.add("trix-autoresize-clone");
      textareaClone.tabIndex = -1;
      const autoresize = function () {
        textareaClone.value = textarea.value;
        textarea.style.height = textareaClone.scrollHeight + "px";
      };
      handleEvent("input", {
        onElement: textarea,
        withCallback: autoresize
      });
      handleEvent("input", {
        onElement: textarea,
        withCallback: this.didInputCaption
      });
      handleEvent("keydown", {
        onElement: textarea,
        withCallback: this.didKeyDownCaption
      });
      handleEvent("change", {
        onElement: textarea,
        withCallback: this.didChangeCaption
      });
      handleEvent("blur", {
        onElement: textarea,
        withCallback: this.didBlurCaption
      });
      const figcaption = this.element.querySelector("figcaption");
      const editingFigcaption = figcaption.cloneNode();
      return {
        do: () => {
          figcaption.style.display = "none";
          editingFigcaption.appendChild(textarea);
          editingFigcaption.appendChild(textareaClone);
          editingFigcaption.classList.add("".concat(css$1.attachmentCaption, "--editing"));
          figcaption.parentElement.insertBefore(editingFigcaption, figcaption);
          autoresize();
          if (this.options.editCaption) {
            return defer(() => textarea.focus());
          }
        },
        undo() {
          removeNode(editingFigcaption);
          figcaption.style.display = null;
        }
      };
    }));
    this.didClickToolbar = this.didClickToolbar.bind(this);
    this.didClickActionButton = this.didClickActionButton.bind(this);
    this.didKeyDownCaption = this.didKeyDownCaption.bind(this);
    this.didInputCaption = this.didInputCaption.bind(this);
    this.didChangeCaption = this.didChangeCaption.bind(this);
    this.didBlurCaption = this.didBlurCaption.bind(this);
    this.attachmentPiece = attachmentPiece;
    this.element = _element;
    this.container = container;
    this.options = options;
    this.attachment = this.attachmentPiece.attachment;
    if (tagName(this.element) === "a") {
      this.element = this.element.firstChild;
    }
    this.install();
  }
  install() {
    this.makeElementMutable();
    this.addToolbar();
    if (this.attachment.isPreviewable()) {
      this.installCaptionEditor();
    }
  }
  uninstall() {
    var _this$delegate;
    let undo = this.undos.pop();
    this.savePendingCaption();
    while (undo) {
      undo();
      undo = this.undos.pop();
    }
    (_this$delegate = this.delegate) === null || _this$delegate === void 0 || _this$delegate.didUninstallAttachmentEditor(this);
  }

  // Private

  savePendingCaption() {
    if (this.pendingCaption != null) {
      const caption = this.pendingCaption;
      this.pendingCaption = null;
      if (caption) {
        var _this$delegate2, _this$delegate2$attac;
        (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 || (_this$delegate2$attac = _this$delegate2.attachmentEditorDidRequestUpdatingAttributesForAttachment) === null || _this$delegate2$attac === void 0 || _this$delegate2$attac.call(_this$delegate2, {
          caption
        }, this.attachment);
      } else {
        var _this$delegate3, _this$delegate3$attac;
        (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 || (_this$delegate3$attac = _this$delegate3.attachmentEditorDidRequestRemovingAttributeForAttachment) === null || _this$delegate3$attac === void 0 || _this$delegate3$attac.call(_this$delegate3, "caption", this.attachment);
      }
    }
  }
  // Event handlers

  didClickToolbar(event) {
    event.preventDefault();
    return event.stopPropagation();
  }
  didClickActionButton(event) {
    var _this$delegate4;
    const action = event.target.getAttribute("data-trix-action");
    switch (action) {
      case "remove":
        return (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.attachmentEditorDidRequestRemovalOfAttachment(this.attachment);
    }
  }
  didKeyDownCaption(event) {
    if (keyNames$1[event.keyCode] === "return") {
      var _this$delegate5, _this$delegate5$attac;
      event.preventDefault();
      this.savePendingCaption();
      return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 || (_this$delegate5$attac = _this$delegate5.attachmentEditorDidRequestDeselectingAttachment) === null || _this$delegate5$attac === void 0 ? void 0 : _this$delegate5$attac.call(_this$delegate5, this.attachment);
    }
  }
  didInputCaption(event) {
    this.pendingCaption = event.target.value.replace(/\s/g, " ").trim();
  }
  didChangeCaption(event) {
    return this.savePendingCaption();
  }
  didBlurCaption(event) {
    return this.savePendingCaption();
  }
}

class CompositionController extends BasicObject {
  constructor(element, composition) {
    super(...arguments);
    this.didFocus = this.didFocus.bind(this);
    this.didBlur = this.didBlur.bind(this);
    this.didClickAttachment = this.didClickAttachment.bind(this);
    this.element = element;
    this.composition = composition;
    this.documentView = new DocumentView(this.composition.document, {
      element: this.element
    });
    handleEvent("focus", {
      onElement: this.element,
      withCallback: this.didFocus
    });
    handleEvent("blur", {
      onElement: this.element,
      withCallback: this.didBlur
    });
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: "a[contenteditable=false]",
      preventDefault: true
    });
    handleEvent("mousedown", {
      onElement: this.element,
      matchingSelector: attachmentSelector,
      withCallback: this.didClickAttachment
    });
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: "a".concat(attachmentSelector),
      preventDefault: true
    });
  }
  didFocus(event) {
    var _this$blurPromise;
    const perform = () => {
      if (!this.focused) {
        var _this$delegate, _this$delegate$compos;
        this.focused = true;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$compos = _this$delegate.compositionControllerDidFocus) === null || _this$delegate$compos === void 0 ? void 0 : _this$delegate$compos.call(_this$delegate);
      }
    };
    return ((_this$blurPromise = this.blurPromise) === null || _this$blurPromise === void 0 ? void 0 : _this$blurPromise.then(perform)) || perform();
  }
  didBlur(event) {
    this.blurPromise = new Promise(resolve => {
      return defer(() => {
        if (!innerElementIsActive(this.element)) {
          var _this$delegate2, _this$delegate2$compo;
          this.focused = null;
          (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 || (_this$delegate2$compo = _this$delegate2.compositionControllerDidBlur) === null || _this$delegate2$compo === void 0 || _this$delegate2$compo.call(_this$delegate2);
        }
        this.blurPromise = null;
        return resolve();
      });
    });
  }
  didClickAttachment(event, target) {
    var _this$delegate3, _this$delegate3$compo;
    const attachment = this.findAttachmentForElement(target);
    const editCaption = !!findClosestElementFromNode(event.target, {
      matchingSelector: "figcaption"
    });
    return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 || (_this$delegate3$compo = _this$delegate3.compositionControllerDidSelectAttachment) === null || _this$delegate3$compo === void 0 ? void 0 : _this$delegate3$compo.call(_this$delegate3, attachment, {
      editCaption
    });
  }
  getSerializableElement() {
    if (this.isEditingAttachment()) {
      return this.documentView.shadowElement;
    } else {
      return this.element;
    }
  }
  render() {
    var _this$delegate6, _this$delegate6$compo;
    if (this.revision !== this.composition.revision) {
      this.documentView.setDocument(this.composition.document);
      this.documentView.render();
      this.revision = this.composition.revision;
    }
    if (this.canSyncDocumentView() && !this.documentView.isSynced()) {
      var _this$delegate4, _this$delegate4$compo, _this$delegate5, _this$delegate5$compo;
      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 || (_this$delegate4$compo = _this$delegate4.compositionControllerWillSyncDocumentView) === null || _this$delegate4$compo === void 0 || _this$delegate4$compo.call(_this$delegate4);
      this.documentView.sync();
      (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 || (_this$delegate5$compo = _this$delegate5.compositionControllerDidSyncDocumentView) === null || _this$delegate5$compo === void 0 || _this$delegate5$compo.call(_this$delegate5);
    }
    return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 || (_this$delegate6$compo = _this$delegate6.compositionControllerDidRender) === null || _this$delegate6$compo === void 0 ? void 0 : _this$delegate6$compo.call(_this$delegate6);
  }
  rerenderViewForObject(object) {
    this.invalidateViewForObject(object);
    return this.render();
  }
  invalidateViewForObject(object) {
    return this.documentView.invalidateViewForObject(object);
  }
  isViewCachingEnabled() {
    return this.documentView.isViewCachingEnabled();
  }
  enableViewCaching() {
    return this.documentView.enableViewCaching();
  }
  disableViewCaching() {
    return this.documentView.disableViewCaching();
  }
  refreshViewCache() {
    return this.documentView.garbageCollectCachedViews();
  }

  // Attachment editor management

  isEditingAttachment() {
    return !!this.attachmentEditor;
  }
  installAttachmentEditorForAttachment(attachment, options) {
    var _this$attachmentEdito;
    if (((_this$attachmentEdito = this.attachmentEditor) === null || _this$attachmentEdito === void 0 ? void 0 : _this$attachmentEdito.attachment) === attachment) return;
    const element = this.documentView.findElementForObject(attachment);
    if (!element) return;
    this.uninstallAttachmentEditor();
    const attachmentPiece = this.composition.document.getAttachmentPieceForAttachment(attachment);
    this.attachmentEditor = new AttachmentEditorController(attachmentPiece, element, this.element, options);
    this.attachmentEditor.delegate = this;
  }
  uninstallAttachmentEditor() {
    var _this$attachmentEdito2;
    return (_this$attachmentEdito2 = this.attachmentEditor) === null || _this$attachmentEdito2 === void 0 ? void 0 : _this$attachmentEdito2.uninstall();
  }

  // Attachment controller delegate

  didUninstallAttachmentEditor() {
    this.attachmentEditor = null;
    return this.render();
  }
  attachmentEditorDidRequestUpdatingAttributesForAttachment(attributes, attachment) {
    var _this$delegate7, _this$delegate7$compo;
    (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 || (_this$delegate7$compo = _this$delegate7.compositionControllerWillUpdateAttachment) === null || _this$delegate7$compo === void 0 || _this$delegate7$compo.call(_this$delegate7, attachment);
    return this.composition.updateAttributesForAttachment(attributes, attachment);
  }
  attachmentEditorDidRequestRemovingAttributeForAttachment(attribute, attachment) {
    var _this$delegate8, _this$delegate8$compo;
    (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 || (_this$delegate8$compo = _this$delegate8.compositionControllerWillUpdateAttachment) === null || _this$delegate8$compo === void 0 || _this$delegate8$compo.call(_this$delegate8, attachment);
    return this.composition.removeAttributeForAttachment(attribute, attachment);
  }
  attachmentEditorDidRequestRemovalOfAttachment(attachment) {
    var _this$delegate9, _this$delegate9$compo;
    return (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 || (_this$delegate9$compo = _this$delegate9.compositionControllerDidRequestRemovalOfAttachment) === null || _this$delegate9$compo === void 0 ? void 0 : _this$delegate9$compo.call(_this$delegate9, attachment);
  }
  attachmentEditorDidRequestDeselectingAttachment(attachment) {
    var _this$delegate10, _this$delegate10$comp;
    return (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 || (_this$delegate10$comp = _this$delegate10.compositionControllerDidRequestDeselectingAttachment) === null || _this$delegate10$comp === void 0 ? void 0 : _this$delegate10$comp.call(_this$delegate10, attachment);
  }

  // Private

  canSyncDocumentView() {
    return !this.isEditingAttachment();
  }
  findAttachmentForElement(element) {
    return this.composition.document.getAttachmentById(parseInt(element.dataset.trixId, 10));
  }
}

class Controller extends BasicObject {}

const mutableAttributeName = "data-trix-mutable";
const mutableSelector = "[".concat(mutableAttributeName, "]");
const options = {
  attributes: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true
};
class MutationObserver extends BasicObject {
  constructor(element) {
    super(element);
    this.didMutate = this.didMutate.bind(this);
    this.element = element;
    this.observer = new window.MutationObserver(this.didMutate);
    this.start();
  }
  start() {
    this.reset();
    return this.observer.observe(this.element, options);
  }
  stop() {
    return this.observer.disconnect();
  }
  didMutate(mutations) {
    this.mutations.push(...Array.from(this.findSignificantMutations(mutations) || []));
    if (this.mutations.length) {
      var _this$delegate, _this$delegate$elemen;
      (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$elemen = _this$delegate.elementDidMutate) === null || _this$delegate$elemen === void 0 || _this$delegate$elemen.call(_this$delegate, this.getMutationSummary());
      return this.reset();
    }
  }

  // Private

  reset() {
    this.mutations = [];
  }
  findSignificantMutations(mutations) {
    return mutations.filter(mutation => {
      return this.mutationIsSignificant(mutation);
    });
  }
  mutationIsSignificant(mutation) {
    if (this.nodeIsMutable(mutation.target)) {
      return false;
    }
    for (const node of Array.from(this.nodesModifiedByMutation(mutation))) {
      if (this.nodeIsSignificant(node)) return true;
    }
    return false;
  }
  nodeIsSignificant(node) {
    return node !== this.element && !this.nodeIsMutable(node) && !nodeIsEmptyTextNode(node);
  }
  nodeIsMutable(node) {
    return findClosestElementFromNode(node, {
      matchingSelector: mutableSelector
    });
  }
  nodesModifiedByMutation(mutation) {
    const nodes = [];
    switch (mutation.type) {
      case "attributes":
        if (mutation.attributeName !== mutableAttributeName) {
          nodes.push(mutation.target);
        }
        break;
      case "characterData":
        // Changes to text nodes should consider the parent element
        nodes.push(mutation.target.parentNode);
        nodes.push(mutation.target);
        break;
      case "childList":
        // Consider each added or removed node
        nodes.push(...Array.from(mutation.addedNodes || []));
        nodes.push(...Array.from(mutation.removedNodes || []));
        break;
    }
    return nodes;
  }
  getMutationSummary() {
    return this.getTextMutationSummary();
  }
  getTextMutationSummary() {
    const {
      additions,
      deletions
    } = this.getTextChangesFromCharacterData();
    const textChanges = this.getTextChangesFromChildList();
    Array.from(textChanges.additions).forEach(addition => {
      if (!Array.from(additions).includes(addition)) {
        additions.push(addition);
      }
    });
    deletions.push(...Array.from(textChanges.deletions || []));
    const summary = {};
    const added = additions.join("");
    if (added) {
      summary.textAdded = added;
    }
    const deleted = deletions.join("");
    if (deleted) {
      summary.textDeleted = deleted;
    }
    return summary;
  }
  getMutationsByType(type) {
    return Array.from(this.mutations).filter(mutation => mutation.type === type);
  }
  getTextChangesFromChildList() {
    let textAdded, textRemoved;
    const addedNodes = [];
    const removedNodes = [];
    Array.from(this.getMutationsByType("childList")).forEach(mutation => {
      addedNodes.push(...Array.from(mutation.addedNodes || []));
      removedNodes.push(...Array.from(mutation.removedNodes || []));
    });
    const singleBlockCommentRemoved = addedNodes.length === 0 && removedNodes.length === 1 && nodeIsBlockStartComment(removedNodes[0]);
    if (singleBlockCommentRemoved) {
      textAdded = [];
      textRemoved = ["\n"];
    } else {
      textAdded = getTextForNodes(addedNodes);
      textRemoved = getTextForNodes(removedNodes);
    }
    const additions = textAdded.filter((text, index) => text !== textRemoved[index]).map(normalizeSpaces);
    const deletions = textRemoved.filter((text, index) => text !== textAdded[index]).map(normalizeSpaces);
    return {
      additions,
      deletions
    };
  }
  getTextChangesFromCharacterData() {
    let added, removed;
    const characterMutations = this.getMutationsByType("characterData");
    if (characterMutations.length) {
      const startMutation = characterMutations[0],
        endMutation = characterMutations[characterMutations.length - 1];
      const oldString = normalizeSpaces(startMutation.oldValue);
      const newString = normalizeSpaces(endMutation.target.data);
      const summarized = summarizeStringChange(oldString, newString);
      added = summarized.added;
      removed = summarized.removed;
    }
    return {
      additions: added ? [added] : [],
      deletions: removed ? [removed] : []
    };
  }
}
const getTextForNodes = function () {
  let nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const text = [];
  for (const node of Array.from(nodes)) {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        text.push(node.data);
        break;
      case Node.ELEMENT_NODE:
        if (tagName(node) === "br") {
          text.push("\n");
        } else {
          text.push(...Array.from(getTextForNodes(node.childNodes) || []));
        }
        break;
    }
  }
  return text;
};

/* eslint-disable
    no-empty,
*/
class FileVerificationOperation extends Operation {
  constructor(file) {
    super(...arguments);
    this.file = file;
  }
  perform(callback) {
    const reader = new FileReader();
    reader.onerror = () => callback(false);
    reader.onload = () => {
      reader.onerror = null;
      try {
        reader.abort();
      } catch (error) {}
      return callback(true, this.file);
    };
    return reader.readAsArrayBuffer(this.file);
  }
}

// Each software keyboard on Android emits its own set of events and some of them can be buggy.
// This class detects when some buggy events are being emitted and lets know the input controller
// that they should be ignored.
class FlakyAndroidKeyboardDetector {
  constructor(element) {
    this.element = element;
  }
  shouldIgnore(event) {
    if (!browser$1.samsungAndroid) return false;
    this.previousEvent = this.event;
    this.event = event;
    this.checkSamsungKeyboardBuggyModeStart();
    this.checkSamsungKeyboardBuggyModeEnd();
    return this.buggyMode;
  }

  // private

  // The Samsung keyboard on Android can enter a buggy state in which it emits a flurry of confused events that,
  // if processed, corrupts the editor. The buggy mode always starts with an insertText event, right after a
  // keydown event with for an "Unidentified" key, with the same text as the editor element, except for a few
  // extra whitespace, or exotic utf8, characters.
  checkSamsungKeyboardBuggyModeStart() {
    if (this.insertingLongTextAfterUnidentifiedChar() && differsInWhitespace(this.element.innerText, this.event.data)) {
      this.buggyMode = true;
      this.event.preventDefault();
    }
  }

  // The flurry of buggy events are always insertText. If we see any other type, it means it's over.
  checkSamsungKeyboardBuggyModeEnd() {
    if (this.buggyMode && this.event.inputType !== "insertText") {
      this.buggyMode = false;
    }
  }
  insertingLongTextAfterUnidentifiedChar() {
    var _this$event$data;
    return this.isBeforeInputInsertText() && this.previousEventWasUnidentifiedKeydown() && ((_this$event$data = this.event.data) === null || _this$event$data === void 0 ? void 0 : _this$event$data.length) > 50;
  }
  isBeforeInputInsertText() {
    return this.event.type === "beforeinput" && this.event.inputType === "insertText";
  }
  previousEventWasUnidentifiedKeydown() {
    var _this$previousEvent, _this$previousEvent2;
    return ((_this$previousEvent = this.previousEvent) === null || _this$previousEvent === void 0 ? void 0 : _this$previousEvent.type) === "keydown" && ((_this$previousEvent2 = this.previousEvent) === null || _this$previousEvent2 === void 0 ? void 0 : _this$previousEvent2.key) === "Unidentified";
  }
}
const differsInWhitespace = (text1, text2) => {
  return normalize(text1) === normalize(text2);
};
const whiteSpaceNormalizerRegexp = new RegExp("(".concat(OBJECT_REPLACEMENT_CHARACTER, "|").concat(ZERO_WIDTH_SPACE, "|").concat(NON_BREAKING_SPACE, "|\\s)+"), "g");
const normalize = text => text.replace(whiteSpaceNormalizerRegexp, " ").trim();

class InputController extends BasicObject {
  constructor(element) {
    super(...arguments);
    this.element = element;
    this.mutationObserver = new MutationObserver(this.element);
    this.mutationObserver.delegate = this;
    this.flakyKeyboardDetector = new FlakyAndroidKeyboardDetector(this.element);
    for (const eventName in this.constructor.events) {
      handleEvent(eventName, {
        onElement: this.element,
        withCallback: this.handlerFor(eventName)
      });
    }
  }
  elementDidMutate(mutationSummary) {}
  editorWillSyncDocumentView() {
    return this.mutationObserver.stop();
  }
  editorDidSyncDocumentView() {
    return this.mutationObserver.start();
  }
  requestRender() {
    var _this$delegate, _this$delegate$inputC;
    return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$inputC = _this$delegate.inputControllerDidRequestRender) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
  }
  requestReparse() {
    var _this$delegate2, _this$delegate2$input;
    (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 || (_this$delegate2$input = _this$delegate2.inputControllerDidRequestReparse) === null || _this$delegate2$input === void 0 || _this$delegate2$input.call(_this$delegate2);
    return this.requestRender();
  }
  attachFiles(files) {
    const operations = Array.from(files).map(file => new FileVerificationOperation(file));
    return Promise.all(operations).then(files => {
      this.handleInput(function () {
        var _this$delegate3, _this$responder;
        (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 || _this$delegate3.inputControllerWillAttachFiles();
        (_this$responder = this.responder) === null || _this$responder === void 0 || _this$responder.insertFiles(files);
        return this.requestRender();
      });
    });
  }

  // Private

  handlerFor(eventName) {
    return event => {
      if (!event.defaultPrevented) {
        this.handleInput(() => {
          if (!innerElementIsActive(this.element)) {
            if (this.flakyKeyboardDetector.shouldIgnore(event)) return;
            this.eventName = eventName;
            this.constructor.events[eventName].call(this, event);
          }
        });
      }
    };
  }
  handleInput(callback) {
    try {
      var _this$delegate4;
      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 || _this$delegate4.inputControllerWillHandleInput();
      callback.call(this);
    } finally {
      var _this$delegate5;
      (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 || _this$delegate5.inputControllerDidHandleInput();
    }
  }
  createLinkHTML(href, text) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text ? text : href;
    return link.outerHTML;
  }
}
_defineProperty(InputController, "events", {});

var _$codePointAt, _;
const {
  browser,
  keyNames
} = config;
let pastedFileCount = 0;
class Level0InputController extends InputController {
  constructor() {
    super(...arguments);
    this.resetInputSummary();
  }
  setInputSummary() {
    let summary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.inputSummary.eventName = this.eventName;
    for (const key in summary) {
      const value = summary[key];
      this.inputSummary[key] = value;
    }
    return this.inputSummary;
  }
  resetInputSummary() {
    this.inputSummary = {};
  }
  reset() {
    this.resetInputSummary();
    return selectionChangeObserver.reset();
  }

  // Mutation observer delegate

  elementDidMutate(mutationSummary) {
    if (this.isComposing()) {
      var _this$delegate, _this$delegate$inputC;
      return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$inputC = _this$delegate.inputControllerDidAllowUnhandledInput) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
    } else {
      return this.handleInput(function () {
        if (this.mutationIsSignificant(mutationSummary)) {
          if (this.mutationIsExpected(mutationSummary)) {
            this.requestRender();
          } else {
            this.requestReparse();
          }
        }
        return this.reset();
      });
    }
  }
  mutationIsExpected(_ref) {
    let {
      textAdded,
      textDeleted
    } = _ref;
    if (this.inputSummary.preferDocument) {
      return true;
    }
    const mutationAdditionMatchesSummary = textAdded != null ? textAdded === this.inputSummary.textAdded : !this.inputSummary.textAdded;
    const mutationDeletionMatchesSummary = textDeleted != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete;
    const unexpectedNewlineAddition = ["\n", " \n"].includes(textAdded) && !mutationAdditionMatchesSummary;
    const unexpectedNewlineDeletion = textDeleted === "\n" && !mutationDeletionMatchesSummary;
    const singleUnexpectedNewline = unexpectedNewlineAddition && !unexpectedNewlineDeletion || unexpectedNewlineDeletion && !unexpectedNewlineAddition;
    if (singleUnexpectedNewline) {
      const range = this.getSelectedRange();
      if (range) {
        var _this$responder;
        const offset = unexpectedNewlineAddition ? textAdded.replace(/\n$/, "").length || -1 : (textAdded === null || textAdded === void 0 ? void 0 : textAdded.length) || 1;
        if ((_this$responder = this.responder) !== null && _this$responder !== void 0 && _this$responder.positionIsBlockBreak(range[1] + offset)) {
          return true;
        }
      }
    }
    return mutationAdditionMatchesSummary && mutationDeletionMatchesSummary;
  }
  mutationIsSignificant(mutationSummary) {
    var _this$compositionInpu;
    const textChanged = Object.keys(mutationSummary).length > 0;
    const composedEmptyString = ((_this$compositionInpu = this.compositionInput) === null || _this$compositionInpu === void 0 ? void 0 : _this$compositionInpu.getEndData()) === "";
    return textChanged || !composedEmptyString;
  }

  // Private

  getCompositionInput() {
    if (this.isComposing()) {
      return this.compositionInput;
    } else {
      this.compositionInput = new CompositionInput(this);
    }
  }
  isComposing() {
    return this.compositionInput && !this.compositionInput.isEnded();
  }
  deleteInDirection(direction, event) {
    var _this$responder2;
    if (((_this$responder2 = this.responder) === null || _this$responder2 === void 0 ? void 0 : _this$responder2.deleteInDirection(direction)) === false) {
      if (event) {
        event.preventDefault();
        return this.requestRender();
      }
    } else {
      return this.setInputSummary({
        didDelete: true
      });
    }
  }
  serializeSelectionToDataTransfer(dataTransfer) {
    var _this$responder3;
    if (!dataTransferIsWritable(dataTransfer)) return;
    const document = (_this$responder3 = this.responder) === null || _this$responder3 === void 0 ? void 0 : _this$responder3.getSelectedDocument().toSerializableDocument();
    dataTransfer.setData("application/x-trix-document", JSON.stringify(document));
    dataTransfer.setData("text/html", DocumentView.render(document).innerHTML);
    dataTransfer.setData("text/plain", document.toString().replace(/\n$/, ""));
    return true;
  }
  canAcceptDataTransfer(dataTransfer) {
    const types = {};
    Array.from((dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.types) || []).forEach(type => {
      types[type] = true;
    });
    return types.Files || types["application/x-trix-document"] || types["text/html"] || types["text/plain"];
  }
  getPastedHTMLUsingHiddenElement(callback) {
    const selectedRange = this.getSelectedRange();
    const style = {
      position: "absolute",
      left: "".concat(window.pageXOffset, "px"),
      top: "".concat(window.pageYOffset, "px"),
      opacity: 0
    };
    const element = makeElement({
      style,
      tagName: "div",
      editable: true
    });
    document.body.appendChild(element);
    element.focus();
    return requestAnimationFrame(() => {
      const html = element.innerHTML;
      removeNode(element);
      this.setSelectedRange(selectedRange);
      return callback(html);
    });
  }
}
_defineProperty(Level0InputController, "events", {
  keydown(event) {
    if (!this.isComposing()) {
      this.resetInputSummary();
    }
    this.inputSummary.didInput = true;
    const keyName = keyNames[event.keyCode];
    if (keyName) {
      var _context2;
      let context = this.keys;
      ["ctrl", "alt", "shift", "meta"].forEach(modifier => {
        if (event["".concat(modifier, "Key")]) {
          var _context;
          if (modifier === "ctrl") {
            modifier = "control";
          }
          context = (_context = context) === null || _context === void 0 ? void 0 : _context[modifier];
        }
      });
      if (((_context2 = context) === null || _context2 === void 0 ? void 0 : _context2[keyName]) != null) {
        this.setInputSummary({
          keyName
        });
        selectionChangeObserver.reset();
        context[keyName].call(this, event);
      }
    }
    if (keyEventIsKeyboardCommand(event)) {
      const character = String.fromCharCode(event.keyCode).toLowerCase();
      if (character) {
        var _this$delegate3;
        const keys = ["alt", "shift"].map(modifier => {
          if (event["".concat(modifier, "Key")]) {
            return modifier;
          }
        }).filter(key => key);
        keys.push(character);
        if ((_this$delegate3 = this.delegate) !== null && _this$delegate3 !== void 0 && _this$delegate3.inputControllerDidReceiveKeyboardCommand(keys)) {
          event.preventDefault();
        }
      }
    }
  },
  keypress(event) {
    if (this.inputSummary.eventName != null) return;
    if (event.metaKey) return;
    if (event.ctrlKey && !event.altKey) return;
    const string = stringFromKeyEvent(event);
    if (string) {
      var _this$delegate4, _this$responder9;
      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 || _this$delegate4.inputControllerWillPerformTyping();
      (_this$responder9 = this.responder) === null || _this$responder9 === void 0 || _this$responder9.insertString(string);
      return this.setInputSummary({
        textAdded: string,
        didDelete: this.selectionIsExpanded()
      });
    }
  },
  textInput(event) {
    // Handle autocapitalization
    const {
      data
    } = event;
    const {
      textAdded
    } = this.inputSummary;
    if (textAdded && textAdded !== data && textAdded.toUpperCase() === data) {
      var _this$responder10;
      const range = this.getSelectedRange();
      this.setSelectedRange([range[0], range[1] + textAdded.length]);
      (_this$responder10 = this.responder) === null || _this$responder10 === void 0 || _this$responder10.insertString(data);
      this.setInputSummary({
        textAdded: data
      });
      return this.setSelectedRange(range);
    }
  },
  dragenter(event) {
    event.preventDefault();
  },
  dragstart(event) {
    var _this$delegate5, _this$delegate5$input;
    this.serializeSelectionToDataTransfer(event.dataTransfer);
    this.draggedRange = this.getSelectedRange();
    return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 || (_this$delegate5$input = _this$delegate5.inputControllerDidStartDrag) === null || _this$delegate5$input === void 0 ? void 0 : _this$delegate5$input.call(_this$delegate5);
  },
  dragover(event) {
    if (this.draggedRange || this.canAcceptDataTransfer(event.dataTransfer)) {
      event.preventDefault();
      const draggingPoint = {
        x: event.clientX,
        y: event.clientY
      };
      if (!objectsAreEqual(draggingPoint, this.draggingPoint)) {
        var _this$delegate6, _this$delegate6$input;
        this.draggingPoint = draggingPoint;
        return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 || (_this$delegate6$input = _this$delegate6.inputControllerDidReceiveDragOverPoint) === null || _this$delegate6$input === void 0 ? void 0 : _this$delegate6$input.call(_this$delegate6, this.draggingPoint);
      }
    }
  },
  dragend(event) {
    var _this$delegate7, _this$delegate7$input;
    (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 || (_this$delegate7$input = _this$delegate7.inputControllerDidCancelDrag) === null || _this$delegate7$input === void 0 || _this$delegate7$input.call(_this$delegate7);
    this.draggedRange = null;
    this.draggingPoint = null;
  },
  drop(event) {
    var _event$dataTransfer, _this$responder11;
    event.preventDefault();
    const files = (_event$dataTransfer = event.dataTransfer) === null || _event$dataTransfer === void 0 ? void 0 : _event$dataTransfer.files;
    const documentJSON = event.dataTransfer.getData("application/x-trix-document");
    const point = {
      x: event.clientX,
      y: event.clientY
    };
    (_this$responder11 = this.responder) === null || _this$responder11 === void 0 || _this$responder11.setLocationRangeFromPointRange(point);
    if (files !== null && files !== void 0 && files.length) {
      this.attachFiles(files);
    } else if (this.draggedRange) {
      var _this$delegate8, _this$responder12;
      (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 || _this$delegate8.inputControllerWillMoveText();
      (_this$responder12 = this.responder) === null || _this$responder12 === void 0 || _this$responder12.moveTextFromRange(this.draggedRange);
      this.draggedRange = null;
      this.requestRender();
    } else if (documentJSON) {
      var _this$responder13;
      const document = Document.fromJSONString(documentJSON);
      (_this$responder13 = this.responder) === null || _this$responder13 === void 0 || _this$responder13.insertDocument(document);
      this.requestRender();
    }
    this.draggedRange = null;
    this.draggingPoint = null;
  },
  cut(event) {
    var _this$responder14;
    if ((_this$responder14 = this.responder) !== null && _this$responder14 !== void 0 && _this$responder14.selectionIsExpanded()) {
      var _this$delegate9;
      if (this.serializeSelectionToDataTransfer(event.clipboardData)) {
        event.preventDefault();
      }
      (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 || _this$delegate9.inputControllerWillCutText();
      this.deleteInDirection("backward");
      if (event.defaultPrevented) {
        return this.requestRender();
      }
    }
  },
  copy(event) {
    var _this$responder15;
    if ((_this$responder15 = this.responder) !== null && _this$responder15 !== void 0 && _this$responder15.selectionIsExpanded()) {
      if (this.serializeSelectionToDataTransfer(event.clipboardData)) {
        event.preventDefault();
      }
    }
  },
  paste(event) {
    const clipboard = event.clipboardData || event.testClipboardData;
    const paste = {
      clipboard
    };
    if (!clipboard || pasteEventIsCrippledSafariHTMLPaste(event)) {
      this.getPastedHTMLUsingHiddenElement(html => {
        var _this$delegate10, _this$responder16, _this$delegate11;
        paste.type = "text/html";
        paste.html = html;
        (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 || _this$delegate10.inputControllerWillPaste(paste);
        (_this$responder16 = this.responder) === null || _this$responder16 === void 0 || _this$responder16.insertHTML(paste.html);
        this.requestRender();
        return (_this$delegate11 = this.delegate) === null || _this$delegate11 === void 0 ? void 0 : _this$delegate11.inputControllerDidPaste(paste);
      });
      return;
    }
    const href = clipboard.getData("URL");
    const html = clipboard.getData("text/html");
    const name = clipboard.getData("public.url-name");
    if (href) {
      var _this$delegate12, _this$responder17, _this$delegate13;
      let string;
      paste.type = "text/html";
      if (name) {
        string = squishBreakableWhitespace(name).trim();
      } else {
        string = href;
      }
      paste.html = this.createLinkHTML(href, string);
      (_this$delegate12 = this.delegate) === null || _this$delegate12 === void 0 || _this$delegate12.inputControllerWillPaste(paste);
      this.setInputSummary({
        textAdded: string,
        didDelete: this.selectionIsExpanded()
      });
      (_this$responder17 = this.responder) === null || _this$responder17 === void 0 || _this$responder17.insertHTML(paste.html);
      this.requestRender();
      (_this$delegate13 = this.delegate) === null || _this$delegate13 === void 0 || _this$delegate13.inputControllerDidPaste(paste);
    } else if (dataTransferIsPlainText(clipboard)) {
      var _this$delegate14, _this$responder18, _this$delegate15;
      paste.type = "text/plain";
      paste.string = clipboard.getData("text/plain");
      (_this$delegate14 = this.delegate) === null || _this$delegate14 === void 0 || _this$delegate14.inputControllerWillPaste(paste);
      this.setInputSummary({
        textAdded: paste.string,
        didDelete: this.selectionIsExpanded()
      });
      (_this$responder18 = this.responder) === null || _this$responder18 === void 0 || _this$responder18.insertString(paste.string);
      this.requestRender();
      (_this$delegate15 = this.delegate) === null || _this$delegate15 === void 0 || _this$delegate15.inputControllerDidPaste(paste);
    } else if (html) {
      var _this$delegate16, _this$responder19, _this$delegate17;
      paste.type = "text/html";
      paste.html = html;
      (_this$delegate16 = this.delegate) === null || _this$delegate16 === void 0 || _this$delegate16.inputControllerWillPaste(paste);
      (_this$responder19 = this.responder) === null || _this$responder19 === void 0 || _this$responder19.insertHTML(paste.html);
      this.requestRender();
      (_this$delegate17 = this.delegate) === null || _this$delegate17 === void 0 || _this$delegate17.inputControllerDidPaste(paste);
    } else if (Array.from(clipboard.types).includes("Files")) {
      var _clipboard$items, _clipboard$items$getA;
      const file = (_clipboard$items = clipboard.items) === null || _clipboard$items === void 0 || (_clipboard$items = _clipboard$items[0]) === null || _clipboard$items === void 0 || (_clipboard$items$getA = _clipboard$items.getAsFile) === null || _clipboard$items$getA === void 0 ? void 0 : _clipboard$items$getA.call(_clipboard$items);
      if (file) {
        var _this$delegate18, _this$responder20, _this$delegate19;
        const extension = extensionForFile(file);
        if (!file.name && extension) {
          file.name = "pasted-file-".concat(++pastedFileCount, ".").concat(extension);
        }
        paste.type = "File";
        paste.file = file;
        (_this$delegate18 = this.delegate) === null || _this$delegate18 === void 0 || _this$delegate18.inputControllerWillAttachFiles();
        (_this$responder20 = this.responder) === null || _this$responder20 === void 0 || _this$responder20.insertFile(paste.file);
        this.requestRender();
        (_this$delegate19 = this.delegate) === null || _this$delegate19 === void 0 || _this$delegate19.inputControllerDidPaste(paste);
      }
    }
    event.preventDefault();
  },
  compositionstart(event) {
    return this.getCompositionInput().start(event.data);
  },
  compositionupdate(event) {
    return this.getCompositionInput().update(event.data);
  },
  compositionend(event) {
    return this.getCompositionInput().end(event.data);
  },
  beforeinput(event) {
    this.inputSummary.didInput = true;
  },
  input(event) {
    this.inputSummary.didInput = true;
    return event.stopPropagation();
  }
});
_defineProperty(Level0InputController, "keys", {
  backspace(event) {
    var _this$delegate20;
    (_this$delegate20 = this.delegate) === null || _this$delegate20 === void 0 || _this$delegate20.inputControllerWillPerformTyping();
    return this.deleteInDirection("backward", event);
  },
  delete(event) {
    var _this$delegate21;
    (_this$delegate21 = this.delegate) === null || _this$delegate21 === void 0 || _this$delegate21.inputControllerWillPerformTyping();
    return this.deleteInDirection("forward", event);
  },
  return(event) {
    var _this$delegate22, _this$responder21;
    this.setInputSummary({
      preferDocument: true
    });
    (_this$delegate22 = this.delegate) === null || _this$delegate22 === void 0 || _this$delegate22.inputControllerWillPerformTyping();
    return (_this$responder21 = this.responder) === null || _this$responder21 === void 0 ? void 0 : _this$responder21.insertLineBreak();
  },
  tab(event) {
    var _this$responder22;
    if ((_this$responder22 = this.responder) !== null && _this$responder22 !== void 0 && _this$responder22.canIncreaseNestingLevel()) {
      var _this$responder23;
      (_this$responder23 = this.responder) === null || _this$responder23 === void 0 || _this$responder23.increaseNestingLevel();
      this.requestRender();
      event.preventDefault();
    }
  },
  left(event) {
    if (this.selectionIsInCursorTarget()) {
      var _this$responder24;
      event.preventDefault();
      return (_this$responder24 = this.responder) === null || _this$responder24 === void 0 ? void 0 : _this$responder24.moveCursorInDirection("backward");
    }
  },
  right(event) {
    if (this.selectionIsInCursorTarget()) {
      var _this$responder25;
      event.preventDefault();
      return (_this$responder25 = this.responder) === null || _this$responder25 === void 0 ? void 0 : _this$responder25.moveCursorInDirection("forward");
    }
  },
  control: {
    d(event) {
      var _this$delegate23;
      (_this$delegate23 = this.delegate) === null || _this$delegate23 === void 0 || _this$delegate23.inputControllerWillPerformTyping();
      return this.deleteInDirection("forward", event);
    },
    h(event) {
      var _this$delegate24;
      (_this$delegate24 = this.delegate) === null || _this$delegate24 === void 0 || _this$delegate24.inputControllerWillPerformTyping();
      return this.deleteInDirection("backward", event);
    },
    o(event) {
      var _this$delegate25, _this$responder26;
      event.preventDefault();
      (_this$delegate25 = this.delegate) === null || _this$delegate25 === void 0 || _this$delegate25.inputControllerWillPerformTyping();
      (_this$responder26 = this.responder) === null || _this$responder26 === void 0 || _this$responder26.insertString("\n", {
        updatePosition: false
      });
      return this.requestRender();
    }
  },
  shift: {
    return(event) {
      var _this$delegate26, _this$responder27;
      (_this$delegate26 = this.delegate) === null || _this$delegate26 === void 0 || _this$delegate26.inputControllerWillPerformTyping();
      (_this$responder27 = this.responder) === null || _this$responder27 === void 0 || _this$responder27.insertString("\n");
      this.requestRender();
      event.preventDefault();
    },
    tab(event) {
      var _this$responder28;
      if ((_this$responder28 = this.responder) !== null && _this$responder28 !== void 0 && _this$responder28.canDecreaseNestingLevel()) {
        var _this$responder29;
        (_this$responder29 = this.responder) === null || _this$responder29 === void 0 || _this$responder29.decreaseNestingLevel();
        this.requestRender();
        event.preventDefault();
      }
    },
    left(event) {
      if (this.selectionIsInCursorTarget()) {
        event.preventDefault();
        return this.expandSelectionInDirection("backward");
      }
    },
    right(event) {
      if (this.selectionIsInCursorTarget()) {
        event.preventDefault();
        return this.expandSelectionInDirection("forward");
      }
    }
  },
  alt: {
    backspace(event) {
      var _this$delegate27;
      this.setInputSummary({
        preferDocument: false
      });
      return (_this$delegate27 = this.delegate) === null || _this$delegate27 === void 0 ? void 0 : _this$delegate27.inputControllerWillPerformTyping();
    }
  },
  meta: {
    backspace(event) {
      var _this$delegate28;
      this.setInputSummary({
        preferDocument: false
      });
      return (_this$delegate28 = this.delegate) === null || _this$delegate28 === void 0 ? void 0 : _this$delegate28.inputControllerWillPerformTyping();
    }
  }
});
Level0InputController.proxyMethod("responder?.getSelectedRange");
Level0InputController.proxyMethod("responder?.setSelectedRange");
Level0InputController.proxyMethod("responder?.expandSelectionInDirection");
Level0InputController.proxyMethod("responder?.selectionIsInCursorTarget");
Level0InputController.proxyMethod("responder?.selectionIsExpanded");
const extensionForFile = file => {
  var _file$type;
  return (_file$type = file.type) === null || _file$type === void 0 || (_file$type = _file$type.match(/\/(\w+)$/)) === null || _file$type === void 0 ? void 0 : _file$type[1];
};
const hasStringCodePointAt = !!((_$codePointAt = (_ = " ").codePointAt) !== null && _$codePointAt !== void 0 && _$codePointAt.call(_, 0));
const stringFromKeyEvent = function (event) {
  if (event.key && hasStringCodePointAt && event.key.codePointAt(0) === event.keyCode) {
    return event.key;
  } else {
    let code;
    if (event.which === null) {
      code = event.keyCode;
    } else if (event.which !== 0 && event.charCode !== 0) {
      code = event.charCode;
    }
    if (code != null && keyNames[code] !== "escape") {
      return UTF16String.fromCodepoints([code]).toString();
    }
  }
};
const pasteEventIsCrippledSafariHTMLPaste = function (event) {
  const paste = event.clipboardData;
  if (paste) {
    if (paste.types.includes("text/html")) {
      // Answer is yes if there's any possibility of Paste and Match Style in Safari,
      // which is nearly impossible to detect confidently: https://bugs.webkit.org/show_bug.cgi?id=174165
      for (const type of paste.types) {
        const hasPasteboardFlavor = /^CorePasteboardFlavorType/.test(type);
        const hasReadableDynamicData = /^dyn\./.test(type) && paste.getData(type);
        const mightBePasteAndMatchStyle = hasPasteboardFlavor || hasReadableDynamicData;
        if (mightBePasteAndMatchStyle) {
          return true;
        }
      }
      return false;
    } else {
      const isExternalHTMLPaste = paste.types.includes("com.apple.webarchive");
      const isExternalRichTextPaste = paste.types.includes("com.apple.flat-rtfd");
      return isExternalHTMLPaste || isExternalRichTextPaste;
    }
  }
};
class CompositionInput extends BasicObject {
  constructor(inputController) {
    super(...arguments);
    this.inputController = inputController;
    this.responder = this.inputController.responder;
    this.delegate = this.inputController.delegate;
    this.inputSummary = this.inputController.inputSummary;
    this.data = {};
  }
  start(data) {
    this.data.start = data;
    if (this.isSignificant()) {
      var _this$responder5;
      if (this.inputSummary.eventName === "keypress" && this.inputSummary.textAdded) {
        var _this$responder4;
        (_this$responder4 = this.responder) === null || _this$responder4 === void 0 || _this$responder4.deleteInDirection("left");
      }
      if (!this.selectionIsExpanded()) {
        this.insertPlaceholder();
        this.requestRender();
      }
      this.range = (_this$responder5 = this.responder) === null || _this$responder5 === void 0 ? void 0 : _this$responder5.getSelectedRange();
    }
  }
  update(data) {
    this.data.update = data;
    if (this.isSignificant()) {
      const range = this.selectPlaceholder();
      if (range) {
        this.forgetPlaceholder();
        this.range = range;
      }
    }
  }
  end(data) {
    this.data.end = data;
    if (this.isSignificant()) {
      this.forgetPlaceholder();
      if (this.canApplyToDocument()) {
        var _this$delegate2, _this$responder6, _this$responder7, _this$responder8;
        this.setInputSummary({
          preferDocument: true,
          didInput: false
        });
        (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 || _this$delegate2.inputControllerWillPerformTyping();
        (_this$responder6 = this.responder) === null || _this$responder6 === void 0 || _this$responder6.setSelectedRange(this.range);
        (_this$responder7 = this.responder) === null || _this$responder7 === void 0 || _this$responder7.insertString(this.data.end);
        return (_this$responder8 = this.responder) === null || _this$responder8 === void 0 ? void 0 : _this$responder8.setSelectedRange(this.range[0] + this.data.end.length);
      } else if (this.data.start != null || this.data.update != null) {
        this.requestReparse();
        return this.inputController.reset();
      }
    } else {
      return this.inputController.reset();
    }
  }
  getEndData() {
    return this.data.end;
  }
  isEnded() {
    return this.getEndData() != null;
  }
  isSignificant() {
    if (browser.composesExistingText) {
      return this.inputSummary.didInput;
    } else {
      return true;
    }
  }

  // Private

  canApplyToDocument() {
    var _this$data$start, _this$data$end;
    return ((_this$data$start = this.data.start) === null || _this$data$start === void 0 ? void 0 : _this$data$start.length) === 0 && ((_this$data$end = this.data.end) === null || _this$data$end === void 0 ? void 0 : _this$data$end.length) > 0 && this.range;
  }
}
CompositionInput.proxyMethod("inputController.setInputSummary");
CompositionInput.proxyMethod("inputController.requestRender");
CompositionInput.proxyMethod("inputController.requestReparse");
CompositionInput.proxyMethod("responder?.selectionIsExpanded");
CompositionInput.proxyMethod("responder?.insertPlaceholder");
CompositionInput.proxyMethod("responder?.selectPlaceholder");
CompositionInput.proxyMethod("responder?.forgetPlaceholder");

class Level2InputController extends InputController {
  constructor() {
    super(...arguments);
    this.render = this.render.bind(this);
  }
  elementDidMutate() {
    if (this.scheduledRender) {
      if (this.composing) {
        var _this$delegate, _this$delegate$inputC;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 || (_this$delegate$inputC = _this$delegate.inputControllerDidAllowUnhandledInput) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
      }
    } else {
      return this.reparse();
    }
  }
  scheduleRender() {
    return this.scheduledRender ? this.scheduledRender : this.scheduledRender = requestAnimationFrame(this.render);
  }
  render() {
    var _this$afterRender;
    cancelAnimationFrame(this.scheduledRender);
    this.scheduledRender = null;
    if (!this.composing) {
      var _this$delegate2;
      (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 || _this$delegate2.render();
    }
    (_this$afterRender = this.afterRender) === null || _this$afterRender === void 0 || _this$afterRender.call(this);
    this.afterRender = null;
  }
  reparse() {
    var _this$delegate3;
    return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : _this$delegate3.reparse();
  }

  // Responder helpers

  insertString() {
    var _this$delegate4;
    let string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    let options = arguments.length > 1 ? arguments[1] : undefined;
    (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 || _this$delegate4.inputControllerWillPerformTyping();
    return this.withTargetDOMRange(function () {
      var _this$responder;
      return (_this$responder = this.responder) === null || _this$responder === void 0 ? void 0 : _this$responder.insertString(string, options);
    });
  }
  toggleAttributeIfSupported(attributeName) {
    if (getAllAttributeNames().includes(attributeName)) {
      var _this$delegate5;
      (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 || _this$delegate5.inputControllerWillPerformFormatting(attributeName);
      return this.withTargetDOMRange(function () {
        var _this$responder2;
        return (_this$responder2 = this.responder) === null || _this$responder2 === void 0 ? void 0 : _this$responder2.toggleCurrentAttribute(attributeName);
      });
    }
  }
  activateAttributeIfSupported(attributeName, value) {
    if (getAllAttributeNames().includes(attributeName)) {
      var _this$delegate6;
      (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 || _this$delegate6.inputControllerWillPerformFormatting(attributeName);
      return this.withTargetDOMRange(function () {
        var _this$responder3;
        return (_this$responder3 = this.responder) === null || _this$responder3 === void 0 ? void 0 : _this$responder3.setCurrentAttribute(attributeName, value);
      });
    }
  }
  deleteInDirection(direction) {
    let {
      recordUndoEntry
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      recordUndoEntry: true
    };
    if (recordUndoEntry) {
      var _this$delegate7;
      (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 || _this$delegate7.inputControllerWillPerformTyping();
    }
    const perform = () => {
      var _this$responder4;
      return (_this$responder4 = this.responder) === null || _this$responder4 === void 0 ? void 0 : _this$responder4.deleteInDirection(direction);
    };
    const domRange = this.getTargetDOMRange({
      minLength: this.composing ? 1 : 2
    });
    if (domRange) {
      return this.withTargetDOMRange(domRange, perform);
    } else {
      return perform();
    }
  }

  // Selection helpers

  withTargetDOMRange(domRange, fn) {
    if (typeof domRange === "function") {
      fn = domRange;
      domRange = this.getTargetDOMRange();
    }
    if (domRange) {
      var _this$responder5;
      return (_this$responder5 = this.responder) === null || _this$responder5 === void 0 ? void 0 : _this$responder5.withTargetDOMRange(domRange, fn.bind(this));
    } else {
      selectionChangeObserver.reset();
      return fn.call(this);
    }
  }
  getTargetDOMRange() {
    var _this$event$getTarget, _this$event;
    let {
      minLength
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      minLength: 0
    };
    const targetRanges = (_this$event$getTarget = (_this$event = this.event).getTargetRanges) === null || _this$event$getTarget === void 0 ? void 0 : _this$event$getTarget.call(_this$event);
    if (targetRanges) {
      if (targetRanges.length) {
        const domRange = staticRangeToRange(targetRanges[0]);
        if (minLength === 0 || domRange.toString().length >= minLength) {
          return domRange;
        }
      }
    }
  }
  withEvent(event, fn) {
    let result;
    this.event = event;
    try {
      result = fn.call(this);
    } finally {
      this.event = null;
    }
    return result;
  }
}
_defineProperty(Level2InputController, "events", {
  keydown(event) {
    if (keyEventIsKeyboardCommand(event)) {
      var _this$delegate8;
      const command = keyboardCommandFromKeyEvent(event);
      if ((_this$delegate8 = this.delegate) !== null && _this$delegate8 !== void 0 && _this$delegate8.inputControllerDidReceiveKeyboardCommand(command)) {
        event.preventDefault();
      }
    } else {
      let name = event.key;
      if (event.altKey) {
        name += "+Alt";
      }
      if (event.shiftKey) {
        name += "+Shift";
      }
      const handler = this.constructor.keys[name];
      if (handler) {
        return this.withEvent(event, handler);
      }
    }
  },
  // Handle paste event to work around beforeinput.insertFromPaste browser bugs.
  // Safe to remove each condition once fixed upstream.
  paste(event) {
    var _event$clipboardData;
    // https://bugs.webkit.org/show_bug.cgi?id=194921
    let paste;
    const href = (_event$clipboardData = event.clipboardData) === null || _event$clipboardData === void 0 ? void 0 : _event$clipboardData.getData("URL");
    if (pasteEventHasFilesOnly(event)) {
      event.preventDefault();
      return this.attachFiles(event.clipboardData.files);

      // https://bugs.chromium.org/p/chromium/issues/detail?id=934448
    } else if (pasteEventHasPlainTextOnly(event)) {
      var _this$delegate9, _this$responder6, _this$delegate10;
      event.preventDefault();
      paste = {
        type: "text/plain",
        string: event.clipboardData.getData("text/plain")
      };
      (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 || _this$delegate9.inputControllerWillPaste(paste);
      (_this$responder6 = this.responder) === null || _this$responder6 === void 0 || _this$responder6.insertString(paste.string);
      this.render();
      return (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 ? void 0 : _this$delegate10.inputControllerDidPaste(paste);

      // https://bugs.webkit.org/show_bug.cgi?id=196702
    } else if (href) {
      var _this$delegate11, _this$responder7, _this$delegate12;
      event.preventDefault();
      paste = {
        type: "text/html",
        html: this.createLinkHTML(href)
      };
      (_this$delegate11 = this.delegate) === null || _this$delegate11 === void 0 || _this$delegate11.inputControllerWillPaste(paste);
      (_this$responder7 = this.responder) === null || _this$responder7 === void 0 || _this$responder7.insertHTML(paste.html);
      this.render();
      return (_this$delegate12 = this.delegate) === null || _this$delegate12 === void 0 ? void 0 : _this$delegate12.inputControllerDidPaste(paste);
    }
  },
  beforeinput(event) {
    const handler = this.constructor.inputTypes[event.inputType];
    const immmediateRender = shouldRenderInmmediatelyToDealWithIOSDictation(event);
    if (handler) {
      this.withEvent(event, handler);
      if (!immmediateRender) {
        this.scheduleRender();
      }
    }
    if (immmediateRender) {
      this.render();
    }
  },
  input(event) {
    selectionChangeObserver.reset();
  },
  dragstart(event) {
    var _this$responder8;
    if ((_this$responder8 = this.responder) !== null && _this$responder8 !== void 0 && _this$responder8.selectionContainsAttachments()) {
      var _this$responder9;
      event.dataTransfer.setData("application/x-trix-dragging", true);
      this.dragging = {
        range: (_this$responder9 = this.responder) === null || _this$responder9 === void 0 ? void 0 : _this$responder9.getSelectedRange(),
        point: pointFromEvent(event)
      };
    }
  },
  dragenter(event) {
    if (dragEventHasFiles(event)) {
      event.preventDefault();
    }
  },
  dragover(event) {
    if (this.dragging) {
      event.preventDefault();
      const point = pointFromEvent(event);
      if (!objectsAreEqual(point, this.dragging.point)) {
        var _this$responder10;
        this.dragging.point = point;
        return (_this$responder10 = this.responder) === null || _this$responder10 === void 0 ? void 0 : _this$responder10.setLocationRangeFromPointRange(point);
      }
    } else if (dragEventHasFiles(event)) {
      event.preventDefault();
    }
  },
  drop(event) {
    if (this.dragging) {
      var _this$delegate13, _this$responder11;
      event.preventDefault();
      (_this$delegate13 = this.delegate) === null || _this$delegate13 === void 0 || _this$delegate13.inputControllerWillMoveText();
      (_this$responder11 = this.responder) === null || _this$responder11 === void 0 || _this$responder11.moveTextFromRange(this.dragging.range);
      this.dragging = null;
      return this.scheduleRender();
    } else if (dragEventHasFiles(event)) {
      var _this$responder12;
      event.preventDefault();
      const point = pointFromEvent(event);
      (_this$responder12 = this.responder) === null || _this$responder12 === void 0 || _this$responder12.setLocationRangeFromPointRange(point);
      return this.attachFiles(event.dataTransfer.files);
    }
  },
  dragend() {
    if (this.dragging) {
      var _this$responder13;
      (_this$responder13 = this.responder) === null || _this$responder13 === void 0 || _this$responder13.setSelectedRange(this.dragging.range);
      this.dragging = null;
    }
  },
  compositionend(event) {
    if (this.composing) {
      this.composing = false;
      if (!browser$1.recentAndroid) this.scheduleRender();
    }
  }
});
_defineProperty(Level2InputController, "keys", {
  ArrowLeft() {
    var _this$responder14;
    if ((_this$responder14 = this.responder) !== null && _this$responder14 !== void 0 && _this$responder14.shouldManageMovingCursorInDirection("backward")) {
      var _this$responder15;
      this.event.preventDefault();
      return (_this$responder15 = this.responder) === null || _this$responder15 === void 0 ? void 0 : _this$responder15.moveCursorInDirection("backward");
    }
  },
  ArrowRight() {
    var _this$responder16;
    if ((_this$responder16 = this.responder) !== null && _this$responder16 !== void 0 && _this$responder16.shouldManageMovingCursorInDirection("forward")) {
      var _this$responder17;
      this.event.preventDefault();
      return (_this$responder17 = this.responder) === null || _this$responder17 === void 0 ? void 0 : _this$responder17.moveCursorInDirection("forward");
    }
  },
  Backspace() {
    var _this$responder18;
    if ((_this$responder18 = this.responder) !== null && _this$responder18 !== void 0 && _this$responder18.shouldManageDeletingInDirection("backward")) {
      var _this$delegate14, _this$responder19;
      this.event.preventDefault();
      (_this$delegate14 = this.delegate) === null || _this$delegate14 === void 0 || _this$delegate14.inputControllerWillPerformTyping();
      (_this$responder19 = this.responder) === null || _this$responder19 === void 0 || _this$responder19.deleteInDirection("backward");
      return this.render();
    }
  },
  Tab() {
    var _this$responder20;
    if ((_this$responder20 = this.responder) !== null && _this$responder20 !== void 0 && _this$responder20.canIncreaseNestingLevel()) {
      var _this$responder21;
      this.event.preventDefault();
      (_this$responder21 = this.responder) === null || _this$responder21 === void 0 || _this$responder21.increaseNestingLevel();
      return this.render();
    }
  },
  "Tab+Shift"() {
    var _this$responder22;
    if ((_this$responder22 = this.responder) !== null && _this$responder22 !== void 0 && _this$responder22.canDecreaseNestingLevel()) {
      var _this$responder23;
      this.event.preventDefault();
      (_this$responder23 = this.responder) === null || _this$responder23 === void 0 || _this$responder23.decreaseNestingLevel();
      return this.render();
    }
  }
});
_defineProperty(Level2InputController, "inputTypes", {
  deleteByComposition() {
    return this.deleteInDirection("backward", {
      recordUndoEntry: false
    });
  },
  deleteByCut() {
    return this.deleteInDirection("backward");
  },
  deleteByDrag() {
    this.event.preventDefault();
    return this.withTargetDOMRange(function () {
      var _this$responder24;
      this.deleteByDragRange = (_this$responder24 = this.responder) === null || _this$responder24 === void 0 ? void 0 : _this$responder24.getSelectedRange();
    });
  },
  deleteCompositionText() {
    return this.deleteInDirection("backward", {
      recordUndoEntry: false
    });
  },
  deleteContent() {
    return this.deleteInDirection("backward");
  },
  deleteContentBackward() {
    return this.deleteInDirection("backward");
  },
  deleteContentForward() {
    return this.deleteInDirection("forward");
  },
  deleteEntireSoftLine() {
    return this.deleteInDirection("forward");
  },
  deleteHardLineBackward() {
    return this.deleteInDirection("backward");
  },
  deleteHardLineForward() {
    return this.deleteInDirection("forward");
  },
  deleteSoftLineBackward() {
    return this.deleteInDirection("backward");
  },
  deleteSoftLineForward() {
    return this.deleteInDirection("forward");
  },
  deleteWordBackward() {
    return this.deleteInDirection("backward");
  },
  deleteWordForward() {
    return this.deleteInDirection("forward");
  },
  formatBackColor() {
    return this.activateAttributeIfSupported("backgroundColor", this.event.data);
  },
  formatBold() {
    return this.toggleAttributeIfSupported("bold");
  },
  formatFontColor() {
    return this.activateAttributeIfSupported("color", this.event.data);
  },
  formatFontName() {
    return this.activateAttributeIfSupported("font", this.event.data);
  },
  formatIndent() {
    var _this$responder25;
    if ((_this$responder25 = this.responder) !== null && _this$responder25 !== void 0 && _this$responder25.canIncreaseNestingLevel()) {
      return this.withTargetDOMRange(function () {
        var _this$responder26;
        return (_this$responder26 = this.responder) === null || _this$responder26 === void 0 ? void 0 : _this$responder26.increaseNestingLevel();
      });
    }
  },
  formatItalic() {
    return this.toggleAttributeIfSupported("italic");
  },
  formatJustifyCenter() {
    return this.toggleAttributeIfSupported("justifyCenter");
  },
  formatJustifyFull() {
    return this.toggleAttributeIfSupported("justifyFull");
  },
  formatJustifyLeft() {
    return this.toggleAttributeIfSupported("justifyLeft");
  },
  formatJustifyRight() {
    return this.toggleAttributeIfSupported("justifyRight");
  },
  formatOutdent() {
    var _this$responder27;
    if ((_this$responder27 = this.responder) !== null && _this$responder27 !== void 0 && _this$responder27.canDecreaseNestingLevel()) {
      return this.withTargetDOMRange(function () {
        var _this$responder28;
        return (_this$responder28 = this.responder) === null || _this$responder28 === void 0 ? void 0 : _this$responder28.decreaseNestingLevel();
      });
    }
  },
  formatRemove() {
    this.withTargetDOMRange(function () {
      for (const attributeName in (_this$responder29 = this.responder) === null || _this$responder29 === void 0 ? void 0 : _this$responder29.getCurrentAttributes()) {
        var _this$responder29, _this$responder30;
        (_this$responder30 = this.responder) === null || _this$responder30 === void 0 || _this$responder30.removeCurrentAttribute(attributeName);
      }
    });
  },
  formatSetBlockTextDirection() {
    return this.activateAttributeIfSupported("blockDir", this.event.data);
  },
  formatSetInlineTextDirection() {
    return this.activateAttributeIfSupported("textDir", this.event.data);
  },
  formatStrikeThrough() {
    return this.toggleAttributeIfSupported("strike");
  },
  formatSubscript() {
    return this.toggleAttributeIfSupported("sub");
  },
  formatSuperscript() {
    return this.toggleAttributeIfSupported("sup");
  },
  formatUnderline() {
    return this.toggleAttributeIfSupported("underline");
  },
  historyRedo() {
    var _this$delegate15;
    return (_this$delegate15 = this.delegate) === null || _this$delegate15 === void 0 ? void 0 : _this$delegate15.inputControllerWillPerformRedo();
  },
  historyUndo() {
    var _this$delegate16;
    return (_this$delegate16 = this.delegate) === null || _this$delegate16 === void 0 ? void 0 : _this$delegate16.inputControllerWillPerformUndo();
  },
  insertCompositionText() {
    this.composing = true;
    return this.insertString(this.event.data);
  },
  insertFromComposition() {
    this.composing = false;
    return this.insertString(this.event.data);
  },
  insertFromDrop() {
    const range = this.deleteByDragRange;
    if (range) {
      var _this$delegate17;
      this.deleteByDragRange = null;
      (_this$delegate17 = this.delegate) === null || _this$delegate17 === void 0 || _this$delegate17.inputControllerWillMoveText();
      return this.withTargetDOMRange(function () {
        var _this$responder31;
        return (_this$responder31 = this.responder) === null || _this$responder31 === void 0 ? void 0 : _this$responder31.moveTextFromRange(range);
      });
    }
  },
  insertFromPaste() {
    const {
      dataTransfer
    } = this.event;
    const paste = {
      dataTransfer
    };
    const href = dataTransfer.getData("URL");
    const html = dataTransfer.getData("text/html");
    if (href) {
      var _this$delegate18;
      let string;
      this.event.preventDefault();
      paste.type = "text/html";
      const name = dataTransfer.getData("public.url-name");
      if (name) {
        string = squishBreakableWhitespace(name).trim();
      } else {
        string = href;
      }
      paste.html = this.createLinkHTML(href, string);
      (_this$delegate18 = this.delegate) === null || _this$delegate18 === void 0 || _this$delegate18.inputControllerWillPaste(paste);
      this.withTargetDOMRange(function () {
        var _this$responder32;
        return (_this$responder32 = this.responder) === null || _this$responder32 === void 0 ? void 0 : _this$responder32.insertHTML(paste.html);
      });
      this.afterRender = () => {
        var _this$delegate19;
        return (_this$delegate19 = this.delegate) === null || _this$delegate19 === void 0 ? void 0 : _this$delegate19.inputControllerDidPaste(paste);
      };
    } else if (dataTransferIsPlainText(dataTransfer)) {
      var _this$delegate20;
      paste.type = "text/plain";
      paste.string = dataTransfer.getData("text/plain");
      (_this$delegate20 = this.delegate) === null || _this$delegate20 === void 0 || _this$delegate20.inputControllerWillPaste(paste);
      this.withTargetDOMRange(function () {
        var _this$responder33;
        return (_this$responder33 = this.responder) === null || _this$responder33 === void 0 ? void 0 : _this$responder33.insertString(paste.string);
      });
      this.afterRender = () => {
        var _this$delegate21;
        return (_this$delegate21 = this.delegate) === null || _this$delegate21 === void 0 ? void 0 : _this$delegate21.inputControllerDidPaste(paste);
      };
    } else if (processableFilePaste(this.event)) {
      var _this$delegate22;
      paste.type = "File";
      paste.file = dataTransfer.files[0];
      (_this$delegate22 = this.delegate) === null || _this$delegate22 === void 0 || _this$delegate22.inputControllerWillPaste(paste);
      this.withTargetDOMRange(function () {
        var _this$responder34;
        return (_this$responder34 = this.responder) === null || _this$responder34 === void 0 ? void 0 : _this$responder34.insertFile(paste.file);
      });
      this.afterRender = () => {
        var _this$delegate23;
        return (_this$delegate23 = this.delegate) === null || _this$delegate23 === void 0 ? void 0 : _this$delegate23.inputControllerDidPaste(paste);
      };
    } else if (html) {
      var _this$delegate24;
      this.event.preventDefault();
      paste.type = "text/html";
      paste.html = html;
      (_this$delegate24 = this.delegate) === null || _this$delegate24 === void 0 || _this$delegate24.inputControllerWillPaste(paste);
      this.withTargetDOMRange(function () {
        var _this$responder35;
        return (_this$responder35 = this.responder) === null || _this$responder35 === void 0 ? void 0 : _this$responder35.insertHTML(paste.html);
      });
      this.afterRender = () => {
        var _this$delegate25;
        return (_this$delegate25 = this.delegate) === null || _this$delegate25 === void 0 ? void 0 : _this$delegate25.inputControllerDidPaste(paste);
      };
    }
  },
  insertFromYank() {
    return this.insertString(this.event.data);
  },
  insertLineBreak() {
    return this.insertString("\n");
  },
  insertLink() {
    return this.activateAttributeIfSupported("href", this.event.data);
  },
  insertOrderedList() {
    return this.toggleAttributeIfSupported("number");
  },
  insertParagraph() {
    var _this$delegate26;
    (_this$delegate26 = this.delegate) === null || _this$delegate26 === void 0 || _this$delegate26.inputControllerWillPerformTyping();
    return this.withTargetDOMRange(function () {
      var _this$responder36;
      return (_this$responder36 = this.responder) === null || _this$responder36 === void 0 ? void 0 : _this$responder36.insertLineBreak();
    });
  },
  insertReplacementText() {
    const replacement = this.event.dataTransfer.getData("text/plain");
    const domRange = this.event.getTargetRanges()[0];
    this.withTargetDOMRange(domRange, () => {
      this.insertString(replacement, {
        updatePosition: false
      });
    });
  },
  insertText() {
    var _this$event$dataTrans;
    return this.insertString(this.event.data || ((_this$event$dataTrans = this.event.dataTransfer) === null || _this$event$dataTrans === void 0 ? void 0 : _this$event$dataTrans.getData("text/plain")));
  },
  insertTranspose() {
    return this.insertString(this.event.data);
  },
  insertUnorderedList() {
    return this.toggleAttributeIfSupported("bullet");
  }
});
const staticRangeToRange = function (staticRange) {
  const range = document.createRange();
  range.setStart(staticRange.startContainer, staticRange.startOffset);
  range.setEnd(staticRange.endContainer, staticRange.endOffset);
  return range;
};

// Event helpers

const dragEventHasFiles = event => {
  var _event$dataTransfer;
  return Array.from(((_event$dataTransfer = event.dataTransfer) === null || _event$dataTransfer === void 0 ? void 0 : _event$dataTransfer.types) || []).includes("Files");
};
const processableFilePaste = event => {
  var _event$dataTransfer$f;
  // Paste events that only have files are handled by the paste event handler,
  // to work around Safari not supporting beforeinput.insertFromPaste for files.

  // MS Office text pastes include a file with a screenshot of the text, but we should
  // handle them as text pastes.
  return ((_event$dataTransfer$f = event.dataTransfer.files) === null || _event$dataTransfer$f === void 0 ? void 0 : _event$dataTransfer$f[0]) && !pasteEventHasFilesOnly(event) && !dataTransferIsMsOfficePaste(event);
};
const pasteEventHasFilesOnly = function (event) {
  const clipboard = event.clipboardData;
  if (clipboard) {
    const fileTypes = Array.from(clipboard.types).filter(type => type.match(/file/i)); // "Files", "application/x-moz-file"
    return fileTypes.length === clipboard.types.length && clipboard.files.length >= 1;
  }
};
const pasteEventHasPlainTextOnly = function (event) {
  const clipboard = event.clipboardData;
  if (clipboard) {
    return clipboard.types.includes("text/plain") && clipboard.types.length === 1;
  }
};
const keyboardCommandFromKeyEvent = function (event) {
  const command = [];
  if (event.altKey) {
    command.push("alt");
  }
  if (event.shiftKey) {
    command.push("shift");
  }
  command.push(event.key);
  return command;
};
const pointFromEvent = event => ({
  x: event.clientX,
  y: event.clientY
});

const attributeButtonSelector = "[data-trix-attribute]";
const actionButtonSelector = "[data-trix-action]";
const toolbarButtonSelector = "".concat(attributeButtonSelector, ", ").concat(actionButtonSelector);
const dialogSelector = "[data-trix-dialog]";
const activeDialogSelector = "".concat(dialogSelector, "[data-trix-active]");
const dialogButtonSelector = "".concat(dialogSelector, " [data-trix-method]");
const dialogInputSelector = "".concat(dialogSelector, " [data-trix-input]");
const getInputForDialog = (element, attributeName) => {
  if (!attributeName) {
    attributeName = getAttributeName(element);
  }
  return element.querySelector("[data-trix-input][name='".concat(attributeName, "']"));
};
const getActionName = element => element.getAttribute("data-trix-action");
const getAttributeName = element => {
  return element.getAttribute("data-trix-attribute") || element.getAttribute("data-trix-dialog-attribute");
};
const getDialogName = element => element.getAttribute("data-trix-dialog");
class ToolbarController extends BasicObject {
  constructor(element) {
    super(element);
    this.didClickActionButton = this.didClickActionButton.bind(this);
    this.didClickAttributeButton = this.didClickAttributeButton.bind(this);
    this.didClickDialogButton = this.didClickDialogButton.bind(this);
    this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this);
    this.element = element;
    this.attributes = {};
    this.actions = {};
    this.resetDialogInputs();
    handleEvent("mousedown", {
      onElement: this.element,
      matchingSelector: actionButtonSelector,
      withCallback: this.didClickActionButton
    });
    handleEvent("mousedown", {
      onElement: this.element,
      matchingSelector: attributeButtonSelector,
      withCallback: this.didClickAttributeButton
    });
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: toolbarButtonSelector,
      preventDefault: true
    });
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: dialogButtonSelector,
      withCallback: this.didClickDialogButton
    });
    handleEvent("keydown", {
      onElement: this.element,
      matchingSelector: dialogInputSelector,
      withCallback: this.didKeyDownDialogInput
    });
  }

  // Event handlers

  didClickActionButton(event, element) {
    var _this$delegate;
    (_this$delegate = this.delegate) === null || _this$delegate === void 0 || _this$delegate.toolbarDidClickButton();
    event.preventDefault();
    const actionName = getActionName(element);
    if (this.getDialog(actionName)) {
      return this.toggleDialog(actionName);
    } else {
      var _this$delegate2;
      return (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : _this$delegate2.toolbarDidInvokeAction(actionName, element);
    }
  }
  didClickAttributeButton(event, element) {
    var _this$delegate3;
    (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 || _this$delegate3.toolbarDidClickButton();
    event.preventDefault();
    const attributeName = getAttributeName(element);
    if (this.getDialog(attributeName)) {
      this.toggleDialog(attributeName);
    } else {
      var _this$delegate4;
      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 || _this$delegate4.toolbarDidToggleAttribute(attributeName);
    }
    return this.refreshAttributeButtons();
  }
  didClickDialogButton(event, element) {
    const dialogElement = findClosestElementFromNode(element, {
      matchingSelector: dialogSelector
    });
    const method = element.getAttribute("data-trix-method");
    return this[method].call(this, dialogElement);
  }
  didKeyDownDialogInput(event, element) {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      const attribute = element.getAttribute("name");
      const dialog = this.getDialog(attribute);
      this.setAttribute(dialog);
    }
    if (event.keyCode === 27) {
      // Escape key
      event.preventDefault();
      return this.hideDialog();
    }
  }

  // Action buttons

  updateActions(actions) {
    this.actions = actions;
    return this.refreshActionButtons();
  }
  refreshActionButtons() {
    return this.eachActionButton((element, actionName) => {
      element.disabled = this.actions[actionName] === false;
    });
  }
  eachActionButton(callback) {
    return Array.from(this.element.querySelectorAll(actionButtonSelector)).map(element => callback(element, getActionName(element)));
  }

  // Attribute buttons

  updateAttributes(attributes) {
    this.attributes = attributes;
    return this.refreshAttributeButtons();
  }
  refreshAttributeButtons() {
    return this.eachAttributeButton((element, attributeName) => {
      element.disabled = this.attributes[attributeName] === false;
      if (this.attributes[attributeName] || this.dialogIsVisible(attributeName)) {
        element.setAttribute("data-trix-active", "");
        return element.classList.add("trix-active");
      } else {
        element.removeAttribute("data-trix-active");
        return element.classList.remove("trix-active");
      }
    });
  }
  eachAttributeButton(callback) {
    return Array.from(this.element.querySelectorAll(attributeButtonSelector)).map(element => callback(element, getAttributeName(element)));
  }
  applyKeyboardCommand(keys) {
    const keyString = JSON.stringify(keys.sort());
    for (const button of Array.from(this.element.querySelectorAll("[data-trix-key]"))) {
      const buttonKeys = button.getAttribute("data-trix-key").split("+");
      const buttonKeyString = JSON.stringify(buttonKeys.sort());
      if (buttonKeyString === keyString) {
        triggerEvent$1("mousedown", {
          onElement: button
        });
        return true;
      }
    }
    return false;
  }

  // Dialogs

  dialogIsVisible(dialogName) {
    const element = this.getDialog(dialogName);
    if (element) {
      return element.hasAttribute("data-trix-active");
    }
  }
  toggleDialog(dialogName) {
    if (this.dialogIsVisible(dialogName)) {
      return this.hideDialog();
    } else {
      return this.showDialog(dialogName);
    }
  }
  showDialog(dialogName) {
    var _this$delegate5, _this$delegate6;
    this.hideDialog();
    (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 || _this$delegate5.toolbarWillShowDialog();
    const element = this.getDialog(dialogName);
    element.setAttribute("data-trix-active", "");
    element.classList.add("trix-active");
    Array.from(element.querySelectorAll("input[disabled]")).forEach(disabledInput => {
      disabledInput.removeAttribute("disabled");
    });
    const attributeName = getAttributeName(element);
    if (attributeName) {
      const input = getInputForDialog(element, dialogName);
      if (input) {
        input.value = this.attributes[attributeName] || "";
        input.select();
      }
    }
    return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : _this$delegate6.toolbarDidShowDialog(dialogName);
  }
  setAttribute(dialogElement) {
    var _this$delegate7;
    const attributeName = getAttributeName(dialogElement);
    const input = getInputForDialog(dialogElement, attributeName);
    if (input.willValidate) {
      input.setCustomValidity("");
      if (!input.checkValidity() || !this.isSafeAttribute(input)) {
        input.setCustomValidity("Invalid value");
        input.setAttribute("data-trix-validate", "");
        input.classList.add("trix-validate");
        return input.focus();
      }
    }
    (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 || _this$delegate7.toolbarDidUpdateAttribute(attributeName, input.value);
    return this.hideDialog();
  }
  isSafeAttribute(input) {
    if (input.hasAttribute("data-trix-validate-href")) {
      return purify.isValidAttribute("a", "href", input.value);
    } else {
      return true;
    }
  }
  removeAttribute(dialogElement) {
    var _this$delegate8;
    const attributeName = getAttributeName(dialogElement);
    (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 || _this$delegate8.toolbarDidRemoveAttribute(attributeName);
    return this.hideDialog();
  }
  hideDialog() {
    const element = this.element.querySelector(activeDialogSelector);
    if (element) {
      var _this$delegate9;
      element.removeAttribute("data-trix-active");
      element.classList.remove("trix-active");
      this.resetDialogInputs();
      return (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : _this$delegate9.toolbarDidHideDialog(getDialogName(element));
    }
  }
  resetDialogInputs() {
    Array.from(this.element.querySelectorAll(dialogInputSelector)).forEach(input => {
      input.setAttribute("disabled", "disabled");
      input.removeAttribute("data-trix-validate");
      input.classList.remove("trix-validate");
    });
  }
  getDialog(dialogName) {
    return this.element.querySelector("[data-trix-dialog=".concat(dialogName, "]"));
  }
}

const snapshotsAreEqual = (a, b) => rangesAreEqual(a.selectedRange, b.selectedRange) && a.document.isEqualTo(b.document);
class EditorController extends Controller {
  constructor(_ref) {
    let {
      editorElement,
      document,
      html
    } = _ref;
    super(...arguments);
    this.editorElement = editorElement;
    this.selectionManager = new SelectionManager(this.editorElement);
    this.selectionManager.delegate = this;
    this.composition = new Composition();
    this.composition.delegate = this;
    this.attachmentManager = new AttachmentManager(this.composition.getAttachments());
    this.attachmentManager.delegate = this;
    this.inputController = input.getLevel() === 2 ? new Level2InputController(this.editorElement) : new Level0InputController(this.editorElement);
    this.inputController.delegate = this;
    this.inputController.responder = this.composition;
    this.compositionController = new CompositionController(this.editorElement, this.composition);
    this.compositionController.delegate = this;
    this.toolbarController = new ToolbarController(this.editorElement.toolbarElement);
    this.toolbarController.delegate = this;
    this.editor = new Editor(this.composition, this.selectionManager, this.editorElement);
    if (document) {
      this.editor.loadDocument(document);
    } else {
      this.editor.loadHTML(html);
    }
  }
  registerSelectionManager() {
    return selectionChangeObserver.registerSelectionManager(this.selectionManager);
  }
  unregisterSelectionManager() {
    return selectionChangeObserver.unregisterSelectionManager(this.selectionManager);
  }
  render() {
    return this.compositionController.render();
  }
  reparse() {
    return this.composition.replaceHTML(this.editorElement.innerHTML);
  }

  // Composition delegate

  compositionDidChangeDocument(document) {
    this.notifyEditorElement("document-change");
    if (!this.handlingInput) {
      return this.render();
    }
  }
  compositionDidChangeCurrentAttributes(currentAttributes) {
    this.currentAttributes = currentAttributes;
    this.toolbarController.updateAttributes(this.currentAttributes);
    this.updateCurrentActions();
    return this.notifyEditorElement("attributes-change", {
      attributes: this.currentAttributes
    });
  }
  compositionDidPerformInsertionAtRange(range) {
    if (this.pasting) {
      this.pastedRange = range;
    }
  }
  compositionShouldAcceptFile(file) {
    return this.notifyEditorElement("file-accept", {
      file
    });
  }
  compositionDidAddAttachment(attachment) {
    const managedAttachment = this.attachmentManager.manageAttachment(attachment);
    return this.notifyEditorElement("attachment-add", {
      attachment: managedAttachment
    });
  }
  compositionDidEditAttachment(attachment) {
    this.compositionController.rerenderViewForObject(attachment);
    const managedAttachment = this.attachmentManager.manageAttachment(attachment);
    this.notifyEditorElement("attachment-edit", {
      attachment: managedAttachment
    });
    return this.notifyEditorElement("change");
  }
  compositionDidChangeAttachmentPreviewURL(attachment) {
    this.compositionController.invalidateViewForObject(attachment);
    return this.notifyEditorElement("change");
  }
  compositionDidRemoveAttachment(attachment) {
    const managedAttachment = this.attachmentManager.unmanageAttachment(attachment);
    return this.notifyEditorElement("attachment-remove", {
      attachment: managedAttachment
    });
  }
  compositionDidStartEditingAttachment(attachment, options) {
    this.attachmentLocationRange = this.composition.document.getLocationRangeOfAttachment(attachment);
    this.compositionController.installAttachmentEditorForAttachment(attachment, options);
    return this.selectionManager.setLocationRange(this.attachmentLocationRange);
  }
  compositionDidStopEditingAttachment(attachment) {
    this.compositionController.uninstallAttachmentEditor();
    this.attachmentLocationRange = null;
  }
  compositionDidRequestChangingSelectionToLocationRange(locationRange) {
    if (this.loadingSnapshot && !this.isFocused()) return;
    this.requestedLocationRange = locationRange;
    this.compositionRevisionWhenLocationRangeRequested = this.composition.revision;
    if (!this.handlingInput) {
      return this.render();
    }
  }
  compositionWillLoadSnapshot() {
    this.loadingSnapshot = true;
  }
  compositionDidLoadSnapshot() {
    this.compositionController.refreshViewCache();
    this.render();
    this.loadingSnapshot = false;
  }
  getSelectionManager() {
    return this.selectionManager;
  }

  // Attachment manager delegate

  attachmentManagerDidRequestRemovalOfAttachment(attachment) {
    return this.removeAttachment(attachment);
  }

  // Document controller delegate

  compositionControllerWillSyncDocumentView() {
    this.inputController.editorWillSyncDocumentView();
    this.selectionManager.lock();
    return this.selectionManager.clearSelection();
  }
  compositionControllerDidSyncDocumentView() {
    this.inputController.editorDidSyncDocumentView();
    this.selectionManager.unlock();
    this.updateCurrentActions();
    return this.notifyEditorElement("sync");
  }
  compositionControllerDidRender() {
    if (this.requestedLocationRange) {
      if (this.compositionRevisionWhenLocationRangeRequested === this.composition.revision) {
        this.selectionManager.setLocationRange(this.requestedLocationRange);
      }
      this.requestedLocationRange = null;
      this.compositionRevisionWhenLocationRangeRequested = null;
    }
    if (this.renderedCompositionRevision !== this.composition.revision) {
      this.runEditorFilters();
      this.composition.updateCurrentAttributes();
      this.notifyEditorElement("render");
    }
    this.renderedCompositionRevision = this.composition.revision;
  }
  compositionControllerDidFocus() {
    if (this.isFocusedInvisibly()) {
      this.setLocationRange({
        index: 0,
        offset: 0
      });
    }
    this.toolbarController.hideDialog();
    return this.notifyEditorElement("focus");
  }
  compositionControllerDidBlur() {
    return this.notifyEditorElement("blur");
  }
  compositionControllerDidSelectAttachment(attachment, options) {
    this.toolbarController.hideDialog();
    return this.composition.editAttachment(attachment, options);
  }
  compositionControllerDidRequestDeselectingAttachment(attachment) {
    const locationRange = this.attachmentLocationRange || this.composition.document.getLocationRangeOfAttachment(attachment);
    return this.selectionManager.setLocationRange(locationRange[1]);
  }
  compositionControllerWillUpdateAttachment(attachment) {
    return this.editor.recordUndoEntry("Edit Attachment", {
      context: attachment.id,
      consolidatable: true
    });
  }
  compositionControllerDidRequestRemovalOfAttachment(attachment) {
    return this.removeAttachment(attachment);
  }

  // Input controller delegate

  inputControllerWillHandleInput() {
    this.handlingInput = true;
    this.requestedRender = false;
  }
  inputControllerDidRequestRender() {
    this.requestedRender = true;
  }
  inputControllerDidHandleInput() {
    this.handlingInput = false;
    if (this.requestedRender) {
      this.requestedRender = false;
      return this.render();
    }
  }
  inputControllerDidAllowUnhandledInput() {
    return this.notifyEditorElement("change");
  }
  inputControllerDidRequestReparse() {
    return this.reparse();
  }
  inputControllerWillPerformTyping() {
    return this.recordTypingUndoEntry();
  }
  inputControllerWillPerformFormatting(attributeName) {
    return this.recordFormattingUndoEntry(attributeName);
  }
  inputControllerWillCutText() {
    return this.editor.recordUndoEntry("Cut");
  }
  inputControllerWillPaste(paste) {
    this.editor.recordUndoEntry("Paste");
    this.pasting = true;
    return this.notifyEditorElement("before-paste", {
      paste
    });
  }
  inputControllerDidPaste(paste) {
    paste.range = this.pastedRange;
    this.pastedRange = null;
    this.pasting = null;
    return this.notifyEditorElement("paste", {
      paste
    });
  }
  inputControllerWillMoveText() {
    return this.editor.recordUndoEntry("Move");
  }
  inputControllerWillAttachFiles() {
    return this.editor.recordUndoEntry("Drop Files");
  }
  inputControllerWillPerformUndo() {
    return this.editor.undo();
  }
  inputControllerWillPerformRedo() {
    return this.editor.redo();
  }
  inputControllerDidReceiveKeyboardCommand(keys) {
    return this.toolbarController.applyKeyboardCommand(keys);
  }
  inputControllerDidStartDrag() {
    this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
  }
  inputControllerDidReceiveDragOverPoint(point) {
    return this.selectionManager.setLocationRangeFromPointRange(point);
  }
  inputControllerDidCancelDrag() {
    this.selectionManager.setLocationRange(this.locationRangeBeforeDrag);
    this.locationRangeBeforeDrag = null;
  }

  // Selection manager delegate

  locationRangeDidChange(locationRange) {
    this.composition.updateCurrentAttributes();
    this.updateCurrentActions();
    if (this.attachmentLocationRange && !rangesAreEqual(this.attachmentLocationRange, locationRange)) {
      this.composition.stopEditingAttachment();
    }
    return this.notifyEditorElement("selection-change");
  }

  // Toolbar controller delegate

  toolbarDidClickButton() {
    if (!this.getLocationRange()) {
      return this.setLocationRange({
        index: 0,
        offset: 0
      });
    }
  }
  toolbarDidInvokeAction(actionName, invokingElement) {
    return this.invokeAction(actionName, invokingElement);
  }
  toolbarDidToggleAttribute(attributeName) {
    this.recordFormattingUndoEntry(attributeName);
    this.composition.toggleCurrentAttribute(attributeName);
    this.render();
    if (!this.selectionFrozen) {
      return this.editorElement.focus();
    }
  }
  toolbarDidUpdateAttribute(attributeName, value) {
    this.recordFormattingUndoEntry(attributeName);
    this.composition.setCurrentAttribute(attributeName, value);
    this.render();
    if (!this.selectionFrozen) {
      return this.editorElement.focus();
    }
  }
  toolbarDidRemoveAttribute(attributeName) {
    this.recordFormattingUndoEntry(attributeName);
    this.composition.removeCurrentAttribute(attributeName);
    this.render();
    if (!this.selectionFrozen) {
      return this.editorElement.focus();
    }
  }
  toolbarWillShowDialog(dialogElement) {
    this.composition.expandSelectionForEditing();
    return this.freezeSelection();
  }
  toolbarDidShowDialog(dialogName) {
    return this.notifyEditorElement("toolbar-dialog-show", {
      dialogName
    });
  }
  toolbarDidHideDialog(dialogName) {
    this.thawSelection();
    this.editorElement.focus();
    return this.notifyEditorElement("toolbar-dialog-hide", {
      dialogName
    });
  }

  // Selection

  freezeSelection() {
    if (!this.selectionFrozen) {
      this.selectionManager.lock();
      this.composition.freezeSelection();
      this.selectionFrozen = true;
      return this.render();
    }
  }
  thawSelection() {
    if (this.selectionFrozen) {
      this.composition.thawSelection();
      this.selectionManager.unlock();
      this.selectionFrozen = false;
      return this.render();
    }
  }
  canInvokeAction(actionName) {
    if (this.actionIsExternal(actionName)) {
      return true;
    } else {
      var _this$actions$actionN;
      return !!((_this$actions$actionN = this.actions[actionName]) !== null && _this$actions$actionN !== void 0 && (_this$actions$actionN = _this$actions$actionN.test) !== null && _this$actions$actionN !== void 0 && _this$actions$actionN.call(this));
    }
  }
  invokeAction(actionName, invokingElement) {
    if (this.actionIsExternal(actionName)) {
      return this.notifyEditorElement("action-invoke", {
        actionName,
        invokingElement
      });
    } else {
      var _this$actions$actionN2;
      return (_this$actions$actionN2 = this.actions[actionName]) === null || _this$actions$actionN2 === void 0 || (_this$actions$actionN2 = _this$actions$actionN2.perform) === null || _this$actions$actionN2 === void 0 ? void 0 : _this$actions$actionN2.call(this);
    }
  }
  actionIsExternal(actionName) {
    return /^x-./.test(actionName);
  }
  getCurrentActions() {
    const result = {};
    for (const actionName in this.actions) {
      result[actionName] = this.canInvokeAction(actionName);
    }
    return result;
  }
  updateCurrentActions() {
    const currentActions = this.getCurrentActions();
    if (!objectsAreEqual(currentActions, this.currentActions)) {
      this.currentActions = currentActions;
      this.toolbarController.updateActions(this.currentActions);
      return this.notifyEditorElement("actions-change", {
        actions: this.currentActions
      });
    }
  }

  // Editor filters

  runEditorFilters() {
    let snapshot = this.composition.getSnapshot();
    Array.from(this.editor.filters).forEach(filter => {
      const {
        document,
        selectedRange
      } = snapshot;
      snapshot = filter.call(this.editor, snapshot) || {};
      if (!snapshot.document) {
        snapshot.document = document;
      }
      if (!snapshot.selectedRange) {
        snapshot.selectedRange = selectedRange;
      }
    });
    if (!snapshotsAreEqual(snapshot, this.composition.getSnapshot())) {
      return this.composition.loadSnapshot(snapshot);
    }
  }

  // Private

  updateInputElement() {
    const element = this.compositionController.getSerializableElement();
    const value = serializeToContentType(element, "text/html");
    return this.editorElement.setFormValue(value);
  }
  notifyEditorElement(message, data) {
    switch (message) {
      case "document-change":
        this.documentChangedSinceLastRender = true;
        break;
      case "render":
        if (this.documentChangedSinceLastRender) {
          this.documentChangedSinceLastRender = false;
          this.notifyEditorElement("change");
        }
        break;
      case "change":
      case "attachment-add":
      case "attachment-edit":
      case "attachment-remove":
        this.updateInputElement();
        break;
    }
    return this.editorElement.notify(message, data);
  }
  removeAttachment(attachment) {
    this.editor.recordUndoEntry("Delete Attachment");
    this.composition.removeAttachment(attachment);
    return this.render();
  }
  recordFormattingUndoEntry(attributeName) {
    const blockConfig = getBlockConfig(attributeName);
    const locationRange = this.selectionManager.getLocationRange();
    if (blockConfig || !rangeIsCollapsed(locationRange)) {
      return this.editor.recordUndoEntry("Formatting", {
        context: this.getUndoContext(),
        consolidatable: true
      });
    }
  }
  recordTypingUndoEntry() {
    return this.editor.recordUndoEntry("Typing", {
      context: this.getUndoContext(this.currentAttributes),
      consolidatable: true
    });
  }
  getUndoContext() {
    for (var _len = arguments.length, context = new Array(_len), _key = 0; _key < _len; _key++) {
      context[_key] = arguments[_key];
    }
    return [this.getLocationContext(), this.getTimeContext(), ...Array.from(context)];
  }
  getLocationContext() {
    const locationRange = this.selectionManager.getLocationRange();
    if (rangeIsCollapsed(locationRange)) {
      return locationRange[0].index;
    } else {
      return locationRange;
    }
  }
  getTimeContext() {
    if (undo.interval > 0) {
      return Math.floor(new Date().getTime() / undo.interval);
    } else {
      return 0;
    }
  }
  isFocused() {
    var _this$editorElement$o;
    return this.editorElement === ((_this$editorElement$o = this.editorElement.ownerDocument) === null || _this$editorElement$o === void 0 ? void 0 : _this$editorElement$o.activeElement);
  }

  // Detect "Cursor disappears sporadically" Firefox bug.
  // - https://bugzilla.mozilla.org/show_bug.cgi?id=226301
  isFocusedInvisibly() {
    return this.isFocused() && !this.getLocationRange();
  }
  get actions() {
    return this.constructor.actions;
  }
}
_defineProperty(EditorController, "actions", {
  undo: {
    test() {
      return this.editor.canUndo();
    },
    perform() {
      return this.editor.undo();
    }
  },
  redo: {
    test() {
      return this.editor.canRedo();
    },
    perform() {
      return this.editor.redo();
    }
  },
  link: {
    test() {
      return this.editor.canActivateAttribute("href");
    }
  },
  increaseNestingLevel: {
    test() {
      return this.editor.canIncreaseNestingLevel();
    },
    perform() {
      return this.editor.increaseNestingLevel() && this.render();
    }
  },
  decreaseNestingLevel: {
    test() {
      return this.editor.canDecreaseNestingLevel();
    },
    perform() {
      return this.editor.decreaseNestingLevel() && this.render();
    }
  },
  attachFiles: {
    test() {
      return true;
    },
    perform() {
      return input.pickFiles(this.editor.insertFiles);
    }
  }
});
EditorController.proxyMethod("getSelectionManager().setLocationRange");
EditorController.proxyMethod("getSelectionManager().getLocationRange");

var controllers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AttachmentEditorController: AttachmentEditorController,
  CompositionController: CompositionController,
  Controller: Controller,
  EditorController: EditorController,
  InputController: InputController,
  Level0InputController: Level0InputController,
  Level2InputController: Level2InputController,
  ToolbarController: ToolbarController
});

var observers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MutationObserver: MutationObserver,
  SelectionChangeObserver: SelectionChangeObserver
});

var operations = /*#__PURE__*/Object.freeze({
  __proto__: null,
  FileVerificationOperation: FileVerificationOperation,
  ImagePreloadOperation: ImagePreloadOperation
});

installDefaultCSSForTagName("trix-toolbar", "%t {\n  display: block;\n}\n\n%t {\n  white-space: nowrap;\n}\n\n%t [data-trix-dialog] {\n  display: none;\n}\n\n%t [data-trix-dialog][data-trix-active] {\n  display: block;\n}\n\n%t [data-trix-dialog] [data-trix-validate]:invalid {\n  background-color: #ffdddd;\n}");
class TrixToolbarElement extends HTMLElement {
  // Element lifecycle

  connectedCallback() {
    if (this.innerHTML === "") {
      this.innerHTML = toolbar.getDefaultHTML();
    }
  }
}

let id = 0;

// Contenteditable support helpers

const autofocus = function (element) {
  if (!document.querySelector(":focus")) {
    if (element.hasAttribute("autofocus") && document.querySelector("[autofocus]") === element) {
      return element.focus();
    }
  }
};
const makeEditable = function (element) {
  if (element.hasAttribute("contenteditable")) {
    return;
  }
  element.setAttribute("contenteditable", "");
  return handleEventOnce("focus", {
    onElement: element,
    withCallback() {
      return configureContentEditable(element);
    }
  });
};
const configureContentEditable = function (element) {
  disableObjectResizing(element);
  return setDefaultParagraphSeparator(element);
};
const disableObjectResizing = function (element) {
  var _document$queryComman, _document;
  if ((_document$queryComman = (_document = document).queryCommandSupported) !== null && _document$queryComman !== void 0 && _document$queryComman.call(_document, "enableObjectResizing")) {
    document.execCommand("enableObjectResizing", false, false);
    return handleEvent("mscontrolselect", {
      onElement: element,
      preventDefault: true
    });
  }
};
const setDefaultParagraphSeparator = function (element) {
  var _document$queryComman2, _document2;
  if ((_document$queryComman2 = (_document2 = document).queryCommandSupported) !== null && _document$queryComman2 !== void 0 && _document$queryComman2.call(_document2, "DefaultParagraphSeparator")) {
    const {
      tagName
    } = attributes.default;
    if (["div", "p"].includes(tagName)) {
      return document.execCommand("DefaultParagraphSeparator", false, tagName);
    }
  }
};

// Accessibility helpers

const addAccessibilityRole = function (element) {
  if (element.hasAttribute("role")) {
    return;
  }
  return element.setAttribute("role", "textbox");
};
const ensureAriaLabel = function (element) {
  if (element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby")) {
    return;
  }
  const update = function () {
    const texts = Array.from(element.labels).map(label => {
      if (!label.contains(element)) return label.textContent;
    }).filter(text => text);
    const text = texts.join(" ");
    if (text) {
      return element.setAttribute("aria-label", text);
    } else {
      return element.removeAttribute("aria-label");
    }
  };
  update();
  return handleEvent("focus", {
    onElement: element,
    withCallback: update
  });
};

// Style

const cursorTargetStyles = function () {
  if (browser$1.forcesObjectResizing) {
    return {
      display: "inline",
      width: "auto"
    };
  } else {
    return {
      display: "inline-block",
      width: "1px"
    };
  }
}();
installDefaultCSSForTagName("trix-editor", "%t {\n    display: block;\n}\n\n%t:empty::before {\n    content: attr(placeholder);\n    color: graytext;\n    cursor: text;\n    pointer-events: none;\n    white-space: pre-line;\n}\n\n%t a[contenteditable=false] {\n    cursor: text;\n}\n\n%t img {\n    max-width: 100%;\n    height: auto;\n}\n\n%t ".concat(attachmentSelector, " figcaption textarea {\n    resize: none;\n}\n\n%t ").concat(attachmentSelector, " figcaption textarea.trix-autoresize-clone {\n    position: absolute;\n    left: -9999px;\n    max-height: 0px;\n}\n\n%t ").concat(attachmentSelector, " figcaption[data-trix-placeholder]:empty::before {\n    content: attr(data-trix-placeholder);\n    color: graytext;\n}\n\n%t [data-trix-cursor-target] {\n    display: ").concat(cursorTargetStyles.display, " !important;\n    width: ").concat(cursorTargetStyles.width, " !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border: none !important;\n}\n\n%t [data-trix-cursor-target=left] {\n    vertical-align: top !important;\n    margin-left: -1px !important;\n}\n\n%t [data-trix-cursor-target=right] {\n    vertical-align: bottom !important;\n    margin-right: -1px !important;\n}"));
var _internals = /*#__PURE__*/new WeakMap();
var _validate = /*#__PURE__*/new WeakSet();
class ElementInternalsDelegate {
  constructor(element) {
    _classPrivateMethodInitSpec(this, _validate);
    _classPrivateFieldInitSpec(this, _internals, {
      writable: true,
      value: void 0
    });
    this.element = element;
    _classPrivateFieldSet(this, _internals, element.attachInternals());
  }
  connectedCallback() {
    _classPrivateMethodGet(this, _validate, _validate2).call(this);
  }
  disconnectedCallback() {}
  get labels() {
    return _classPrivateFieldGet(this, _internals).labels;
  }
  get disabled() {
    var _this$element$inputEl;
    return (_this$element$inputEl = this.element.inputElement) === null || _this$element$inputEl === void 0 ? void 0 : _this$element$inputEl.disabled;
  }
  set disabled(value) {
    this.element.toggleAttribute("disabled", value);
  }
  get required() {
    return this.element.hasAttribute("required");
  }
  set required(value) {
    this.element.toggleAttribute("required", value);
    _classPrivateMethodGet(this, _validate, _validate2).call(this);
  }
  get validity() {
    return _classPrivateFieldGet(this, _internals).validity;
  }
  get validationMessage() {
    return _classPrivateFieldGet(this, _internals).validationMessage;
  }
  get willValidate() {
    return _classPrivateFieldGet(this, _internals).willValidate;
  }
  setFormValue(value) {
    _classPrivateMethodGet(this, _validate, _validate2).call(this);
  }
  checkValidity() {
    return _classPrivateFieldGet(this, _internals).checkValidity();
  }
  reportValidity() {
    return _classPrivateFieldGet(this, _internals).reportValidity();
  }
  setCustomValidity(validationMessage) {
    _classPrivateMethodGet(this, _validate, _validate2).call(this, validationMessage);
  }
}
function _validate2() {
  let customValidationMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  const {
    required,
    value
  } = this.element;
  const valueMissing = required && !value;
  const customError = !!customValidationMessage;
  const input = makeElement("input", {
    required
  });
  const validationMessage = customValidationMessage || input.validationMessage;
  _classPrivateFieldGet(this, _internals).setValidity({
    valueMissing,
    customError
  }, validationMessage);
}
var _focusHandler = /*#__PURE__*/new WeakMap();
var _resetBubbled = /*#__PURE__*/new WeakMap();
var _clickBubbled = /*#__PURE__*/new WeakMap();
class LegacyDelegate {
  constructor(element) {
    _classPrivateFieldInitSpec(this, _focusHandler, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _resetBubbled, {
      writable: true,
      value: event => {
        if (event.defaultPrevented) return;
        if (event.target !== this.element.form) return;
        this.element.reset();
      }
    });
    _classPrivateFieldInitSpec(this, _clickBubbled, {
      writable: true,
      value: event => {
        if (event.defaultPrevented) return;
        if (this.element.contains(event.target)) return;
        const label = findClosestElementFromNode(event.target, {
          matchingSelector: "label"
        });
        if (!label) return;
        if (!Array.from(this.labels).includes(label)) return;
        this.element.focus();
      }
    });
    this.element = element;
  }
  connectedCallback() {
    _classPrivateFieldSet(this, _focusHandler, ensureAriaLabel(this.element));
    window.addEventListener("reset", _classPrivateFieldGet(this, _resetBubbled), false);
    window.addEventListener("click", _classPrivateFieldGet(this, _clickBubbled), false);
  }
  disconnectedCallback() {
    var _classPrivateFieldGet2;
    (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _focusHandler)) === null || _classPrivateFieldGet2 === void 0 || _classPrivateFieldGet2.destroy();
    window.removeEventListener("reset", _classPrivateFieldGet(this, _resetBubbled), false);
    window.removeEventListener("click", _classPrivateFieldGet(this, _clickBubbled), false);
  }
  get labels() {
    const labels = [];
    if (this.element.id && this.element.ownerDocument) {
      labels.push(...Array.from(this.element.ownerDocument.querySelectorAll("label[for='".concat(this.element.id, "']")) || []));
    }
    const label = findClosestElementFromNode(this.element, {
      matchingSelector: "label"
    });
    if (label) {
      if ([this.element, null].includes(label.control)) {
        labels.push(label);
      }
    }
    return labels;
  }
  get disabled() {
    console.warn("This browser does not support the [disabled] attribute for trix-editor elements.");
    return false;
  }
  set disabled(value) {
    console.warn("This browser does not support the [disabled] attribute for trix-editor elements.");
  }
  get required() {
    console.warn("This browser does not support the [required] attribute for trix-editor elements.");
    return false;
  }
  set required(value) {
    console.warn("This browser does not support the [required] attribute for trix-editor elements.");
  }
  get validity() {
    console.warn("This browser does not support the validity property for trix-editor elements.");
    return null;
  }
  get validationMessage() {
    console.warn("This browser does not support the validationMessage property for trix-editor elements.");
    return "";
  }
  get willValidate() {
    console.warn("This browser does not support the willValidate property for trix-editor elements.");
    return false;
  }
  setFormValue(value) {}
  checkValidity() {
    console.warn("This browser does not support checkValidity() for trix-editor elements.");
    return true;
  }
  reportValidity() {
    console.warn("This browser does not support reportValidity() for trix-editor elements.");
    return true;
  }
  setCustomValidity(validationMessage) {
    console.warn("This browser does not support setCustomValidity(validationMessage) for trix-editor elements.");
  }
}
var _delegate = /*#__PURE__*/new WeakMap();
class TrixEditorElement extends HTMLElement {
  constructor() {
    super();
    _classPrivateFieldInitSpec(this, _delegate, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _delegate, this.constructor.formAssociated ? new ElementInternalsDelegate(this) : new LegacyDelegate(this));
  }

  // Properties

  get trixId() {
    if (this.hasAttribute("trix-id")) {
      return this.getAttribute("trix-id");
    } else {
      this.setAttribute("trix-id", ++id);
      return this.trixId;
    }
  }
  get labels() {
    return _classPrivateFieldGet(this, _delegate).labels;
  }
  get disabled() {
    return _classPrivateFieldGet(this, _delegate).disabled;
  }
  set disabled(value) {
    _classPrivateFieldGet(this, _delegate).disabled = value;
  }
  get required() {
    return _classPrivateFieldGet(this, _delegate).required;
  }
  set required(value) {
    _classPrivateFieldGet(this, _delegate).required = value;
  }
  get validity() {
    return _classPrivateFieldGet(this, _delegate).validity;
  }
  get validationMessage() {
    return _classPrivateFieldGet(this, _delegate).validationMessage;
  }
  get willValidate() {
    return _classPrivateFieldGet(this, _delegate).willValidate;
  }
  get type() {
    return this.localName;
  }
  get toolbarElement() {
    if (this.hasAttribute("toolbar")) {
      var _this$ownerDocument;
      return (_this$ownerDocument = this.ownerDocument) === null || _this$ownerDocument === void 0 ? void 0 : _this$ownerDocument.getElementById(this.getAttribute("toolbar"));
    } else if (this.parentNode) {
      const toolbarId = "trix-toolbar-".concat(this.trixId);
      this.setAttribute("toolbar", toolbarId);
      const element = makeElement("trix-toolbar", {
        id: toolbarId
      });
      this.parentNode.insertBefore(element, this);
      return element;
    } else {
      return undefined;
    }
  }
  get form() {
    var _this$inputElement;
    return (_this$inputElement = this.inputElement) === null || _this$inputElement === void 0 ? void 0 : _this$inputElement.form;
  }
  get inputElement() {
    if (this.hasAttribute("input")) {
      var _this$ownerDocument2;
      return (_this$ownerDocument2 = this.ownerDocument) === null || _this$ownerDocument2 === void 0 ? void 0 : _this$ownerDocument2.getElementById(this.getAttribute("input"));
    } else if (this.parentNode) {
      const inputId = "trix-input-".concat(this.trixId);
      this.setAttribute("input", inputId);
      const element = makeElement("input", {
        type: "hidden",
        id: inputId
      });
      this.parentNode.insertBefore(element, this.nextElementSibling);
      return element;
    } else {
      return undefined;
    }
  }
  get editor() {
    var _this$editorControlle;
    return (_this$editorControlle = this.editorController) === null || _this$editorControlle === void 0 ? void 0 : _this$editorControlle.editor;
  }
  get name() {
    var _this$inputElement2;
    return (_this$inputElement2 = this.inputElement) === null || _this$inputElement2 === void 0 ? void 0 : _this$inputElement2.name;
  }
  get value() {
    var _this$inputElement3;
    return (_this$inputElement3 = this.inputElement) === null || _this$inputElement3 === void 0 ? void 0 : _this$inputElement3.value;
  }
  set value(defaultValue) {
    var _this$editor;
    this.defaultValue = defaultValue;
    (_this$editor = this.editor) === null || _this$editor === void 0 || _this$editor.loadHTML(this.defaultValue);
  }

  // Controller delegate methods

  notify(message, data) {
    if (this.editorController) {
      return triggerEvent$1("trix-".concat(message), {
        onElement: this,
        attributes: data
      });
    }
  }
  setFormValue(value) {
    if (this.inputElement) {
      this.inputElement.value = value;
      _classPrivateFieldGet(this, _delegate).setFormValue(value);
    }
  }

  // Element lifecycle

  connectedCallback() {
    if (!this.hasAttribute("data-trix-internal")) {
      makeEditable(this);
      addAccessibilityRole(this);
      if (!this.editorController) {
        triggerEvent$1("trix-before-initialize", {
          onElement: this
        });
        this.editorController = new EditorController({
          editorElement: this,
          html: this.defaultValue = this.value
        });
        requestAnimationFrame(() => triggerEvent$1("trix-initialize", {
          onElement: this
        }));
      }
      this.editorController.registerSelectionManager();
      _classPrivateFieldGet(this, _delegate).connectedCallback();
      autofocus(this);
    }
  }
  disconnectedCallback() {
    var _this$editorControlle2;
    (_this$editorControlle2 = this.editorController) === null || _this$editorControlle2 === void 0 || _this$editorControlle2.unregisterSelectionManager();
    _classPrivateFieldGet(this, _delegate).disconnectedCallback();
  }

  // Form support

  checkValidity() {
    return _classPrivateFieldGet(this, _delegate).checkValidity();
  }
  reportValidity() {
    return _classPrivateFieldGet(this, _delegate).reportValidity();
  }
  setCustomValidity(validationMessage) {
    _classPrivateFieldGet(this, _delegate).setCustomValidity(validationMessage);
  }
  formDisabledCallback(disabled) {
    if (this.inputElement) {
      this.inputElement.disabled = disabled;
    }
    this.toggleAttribute("contenteditable", !disabled);
  }
  formResetCallback() {
    this.reset();
  }
  reset() {
    this.value = this.defaultValue;
  }
}
_defineProperty(TrixEditorElement, "formAssociated", "ElementInternals" in window);

var elements = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TrixEditorElement: TrixEditorElement,
  TrixToolbarElement: TrixToolbarElement
});

var filters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Filter: Filter,
  attachmentGalleryFilter: attachmentGalleryFilter
});

const Trix = {
  VERSION: version,
  config,
  core,
  models,
  views,
  controllers,
  observers,
  operations,
  elements,
  filters
};

// Expose models under the Trix constant for compatibility with v1
Object.assign(Trix, models);
function start() {
  if (!customElements.get("trix-toolbar")) {
    customElements.define("trix-toolbar", TrixToolbarElement);
  }
  if (!customElements.get("trix-editor")) {
    customElements.define("trix-editor", TrixEditorElement);
  }
}
window.Trix = Trix;
setTimeout(start, 0);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

function getAugmentedNamespace(n) {
  var f = n.default;
	if (typeof f == "function") {
		var a = function () {
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var global$1 = {};

// Explicitly require this file (not included in the main
// Trix bundle) to install the following global helpers.

commonjsGlobal.getEditorElement = () => document.querySelector("trix-editor");
commonjsGlobal.getToolbarElement = () => getEditorElement().toolbarElement;
commonjsGlobal.getEditorController = () => getEditorElement().editorController;
commonjsGlobal.getEditor = () => getEditorController().editor;
commonjsGlobal.getComposition = () => getEditorController().composition;
commonjsGlobal.getDocument = () => getComposition().document;
commonjsGlobal.getSelectionManager = () => getEditorController().selectionManager;

const createEvent$1 = function (type) {
  let properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const event = document.createEvent("Events");
  event.initEvent(type, true, true);
  for (const key in properties) {
    const value = properties[key];
    event[key] = value;
  }
  return event;
};
const triggerEvent = (element, type, properties) => element.dispatchEvent(createEvent$1(type, properties));

const {
  assert
} = QUnit;
assert.locationRange = function (start, end) {
  const expectedLocationRange = normalizeRange([start, end]);
  const actualLocationRange = getEditorController().getLocationRange();
  this.deepEqual(actualLocationRange, expectedLocationRange);
};
assert.selectedRange = function (range) {
  const expectedRange = normalizeRange(range);
  const actualRange = getEditor().getSelectedRange();
  this.deepEqual(actualRange, expectedRange);
};
assert.textAttributes = function (range, attributes) {
  const document = window.getDocument().getDocumentAtRange(range);
  const blocks = document.getBlocks();
  if (blocks.length !== 1) {
    throw "range ".concat(JSON.stringify(range), " spans more than one block");
  }
  const locationRange = window.getDocument().locationRangeFromRange(range);
  const textIndex = locationRange[0].index;
  const textRange = [locationRange[0].offset, locationRange[1].offset];
  const text = window.getDocument().getTextAtIndex(textIndex).getTextAtRange(textRange);
  const pieces = text.getPieces();
  if (pieces.length !== 1) {
    throw "range ".concat(JSON.stringify(range), " must only span one piece");
  }
  const piece = pieces[0];
  this.deepEqual(piece.getAttributes(), attributes);
};
assert.blockAttributes = function (range, attributes) {
  const document = window.getDocument().getDocumentAtRange(range);
  const blocks = document.getBlocks();
  if (blocks.length !== 1) {
    throw "range ".concat(JSON.stringify(range), " spans more than one block");
  }
  const block = blocks[0];
  this.deepEqual(block.getAttributes(), attributes);
};
assert.documentHTMLEqual = function (trixDocument, html) {
  this.equal(getHTML(trixDocument), html);
};
const getHTML = trixDocument => DocumentView.render(trixDocument).innerHTML;
const expectDocument = (expectedDocumentValue, element) => {
  if (!element) element = getEditorElement();
  assert.equal(element.editor.getDocument().toString(), expectedDocumentValue);
};

var editorDefaultAriaLabel = (() => "<trix-editor id=\"editor-without-labels\"></trix-editor>\n\n  <label for=\"editor-with-aria-label\"><span>Label text</span></label>\n  <trix-editor id=\"editor-with-aria-label\" aria-label=\"ARIA Label text\"></trix-editor>\n\n  <span id=\"aria-labelledby-id\">ARIA Labelledby</span>\n  <label for=\"editor-with-aria-labelledby\"><span>Label text</span></label>\n  <trix-editor id=\"editor-with-aria-labelledby\" aria-labelledby=\"aria-labelledby-id\"></trix-editor>\n\n  <label for=\"editor-with-labels\"><span>Label 1</span></label>\n  <label for=\"editor-with-labels\"><span>Label 2</span></label>\n  <label for=\"editor-with-labels\"><span>Label 3</span></label>\n  <label>\n    <span>Label 4</span>\n    <trix-editor id=\"editor-with-labels\"></trix-editor>\n  </label>\n\n  <label id=\"modified-label\" for=\"editor-with-modified-label\">Original Value</label>\n  <trix-editor id=\"editor-with-modified-label\"></trix-editor>");

var editorEmpty = (() => "<trix-editor autofocus placeholder=\"Say hello...\"></trix-editor>");

var editorHtml = (() => "<input id=\"my_input\" type=\"hidden\" value=\"&lt;div&gt;Hello world&lt;/div&gt;\">\n  <trix-editor input=\"my_input\" autofocus placeholder=\"Say hello...\"></trix-editor>");

var editorInTable = (() => "<table>\n    <tr>\n      <td>\n        <trix-editor></trix-editor>\n      </td>\n    </tr>\n  </table>");

var editorWithBlockStyles = (() => "<style type=\"text/css\">\n    blockquote { font-style: italic; }\n    li { font-weight: bold; }\n  </style>\n\n  <trix-editor class=\"trix-content\"></trix-editor>");

var editorWithBoldStyles = (() => "<style type=\"text/css\">\n    strong { font-weight: 500; }\n    span { font-weight: 600; }\n    article { font-weight: bold; }\n  </style>\n\n  <trix-editor class=\"trix-content\"></trix-editor>");

const TEST_IMAGE_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

var editorWithImage = (() => "<trix-editor input=\"my_input\" autofocus placeholder=\"Say hello...\"></trix-editor>\n  <input id=\"my_input\" type=\"hidden\" value=\"ab&lt;img src=&quot;".concat(TEST_IMAGE_URL, "&quot; width=&quot;10&quot; height=&quot;10&quot;&gt;\">"));

var editorWithLabels = (() => "<label id=\"label-1\" for=\"editor\"><span>Label 1</span></label>\n   <label id=\"label-2\">Label 2</label>\n   <trix-editor id=\"editor\"></trix-editor>\n   <label id=\"label-3\" for=\"editor\">Label 3</label>");

var editorWithStyledContent = (() => "<style type=\"text/css\">\n    .trix-content figure.attachment {\n      display: inline-block;\n    }\n  </style>\n\n  <trix-editor class=\"trix-content\"></trix-editor>");

var editorWithToolbarAndInput = (() => "<ul id=\"my_editor\">\n    <li><trix-toolbar id=\"my_toolbar\"></trix-toolbar></li>\n    <li><trix-editor toolbar=\"my_toolbar\" input=\"my_input\" autofocus placeholder=\"Say hello...\"></trix-editor></li>\n    <li><input id=\"my_input\" type=\"hidden\" value=\"&lt;div&gt;Hello world&lt;/div&gt;\"></li>\n  </ul>");

var editorsWithForms = (() => "<form id=\"ancestor-form\">\n    <trix-editor id=\"editor-with-ancestor-form\" name=\"editor-with-ancestor-form\"></trix-editor>\n  </form>\n\n  <form id=\"input-form\">\n    <input type=\"hidden\" id=\"hidden-input\">\n  </form>\n  <trix-editor id=\"editor-with-input-form\" input=\"hidden-input\"></trix-editor>\n\n  <trix-editor id=\"editor-with-no-form\"></trix-editor>\n  <fieldset id=\"fieldset\"><trix-editor id=\"editor-within-fieldset\"></fieldset>");

const fixtureTemplates = {
  "editor_default_aria_label": editorDefaultAriaLabel,
  "editor_empty": editorEmpty,
  "editor_html": editorHtml,
  "editor_in_table": editorInTable,
  "editor_with_block_styles": editorWithBlockStyles,
  "editor_with_bold_styles": editorWithBoldStyles,
  "editor_with_image": editorWithImage,
  "editor_with_labels": editorWithLabels,
  "editor_with_styled_content": editorWithStyledContent,
  "editor_with_toolbar_and_input": editorWithToolbarAndInput,
  "editors_with_forms": editorsWithForms
};
const {
  css
} = config;
const createDocument = function () {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }
  const blocks = parts.map(part => {
    const [string, textAttributes, blockAttributes, htmlAttributes = {}] = Array.from(part);
    const text = Text.textForStringWithAttributes(string, textAttributes);
    return new Block(text, blockAttributes, htmlAttributes);
  });
  return new Document(blocks);
};
const createCursorTarget = name => makeElement({
  tagName: "span",
  textContent: ZERO_WIDTH_SPACE,
  data: {
    trixCursorTarget: name,
    trixSerialize: false
  }
});
const cursorTargetLeft$1 = createCursorTarget("left").outerHTML;
const cursorTargetRight$1 = createCursorTarget("right").outerHTML;
const blockComment = "<!--block-->";
const removeWhitespace = string => string.replace(/\s/g, "");
const fixtures = {
  "bold text": {
    document: createDocument(["abc", {
      bold: true
    }]),
    html: "<div>".concat(blockComment, "<strong>abc</strong></div>"),
    serializedHTML: "<div><strong>abc</strong></div>"
  },
  "bold, italic text": {
    document: createDocument(["abc", {
      bold: true,
      italic: true
    }]),
    html: "<div>".concat(blockComment, "<strong><em>abc</em></strong></div>")
  },
  "text with newline": {
    document: createDocument(["ab\nc"]),
    html: "<div>".concat(blockComment, "ab<br>c</div>")
  },
  "text with link": {
    document: createDocument(["abc", {
      href: "http://example.com"
    }]),
    html: "<div>".concat(blockComment, "<a href=\"http://example.com\">abc</a></div>")
  },
  "text with link and formatting": {
    document: createDocument(["abc", {
      italic: true,
      href: "http://example.com"
    }]),
    html: "<div>".concat(blockComment, "<a href=\"http://example.com\"><em>abc</em></a></div>")
  },
  "partially formatted link": {
    document: new Document([new Block(new Text([new StringPiece("ab", {
      href: "http://example.com"
    }), new StringPiece("c", {
      href: "http://example.com",
      italic: true
    })]))]),
    html: "<div>".concat(blockComment, "<a href=\"http://example.com\">ab<em>c</em></a></div>")
  },
  "spaces 1": {
    document: createDocument([" a"]),
    html: "<div>".concat(blockComment, "&nbsp;a</div>")
  },
  "spaces 2": {
    document: createDocument(["  a"]),
    html: "<div>".concat(blockComment, "&nbsp; a</div>")
  },
  "spaces 3": {
    document: createDocument(["   a"]),
    html: "<div>".concat(blockComment, "&nbsp; &nbsp;a</div>")
  },
  "spaces 4": {
    document: createDocument([" a "]),
    html: "<div>".concat(blockComment, "&nbsp;a&nbsp;</div>")
  },
  "spaces 5": {
    document: createDocument(["a  b"]),
    html: "<div>".concat(blockComment, "a&nbsp; b</div>")
  },
  "spaces 6": {
    document: createDocument(["a   b"]),
    html: "<div>".concat(blockComment, "a &nbsp; b</div>")
  },
  "spaces 7": {
    document: createDocument(["a    b"]),
    html: "<div>".concat(blockComment, "a&nbsp; &nbsp; b</div>")
  },
  "spaces 8": {
    document: createDocument(["a b "]),
    html: "<div>".concat(blockComment, "a b&nbsp;</div>")
  },
  "spaces 9": {
    document: createDocument(["a b c"]),
    html: "<div>".concat(blockComment, "a b c</div>")
  },
  "spaces 10": {
    document: createDocument(["a "]),
    html: "<div>".concat(blockComment, "a&nbsp;</div>")
  },
  "spaces 11": {
    document: createDocument(["a  "]),
    html: "<div>".concat(blockComment, "a &nbsp;</div>")
  },
  "spaces and formatting": {
    document: new Document([new Block(new Text([new StringPiece(" a "), new StringPiece("b", {
      href: "http://b.com"
    }), new StringPiece(" "), new StringPiece("c", {
      bold: true
    }), new StringPiece(" d"), new StringPiece(" e ", {
      italic: true
    }), new StringPiece(" f  ")]))]),
    html: "<div>".concat(blockComment, "&nbsp;a <a href=\"http://b.com\">b</a> <strong>c</strong> d<em> e </em>&nbsp;f &nbsp;</div>")
  },
  "quote formatted block": {
    document: createDocument(["abc", {}, ["quote"]]),
    html: "<blockquote>".concat(blockComment, "abc</blockquote>")
  },
  "code formatted block": {
    document: createDocument(["123", {}, ["code"]]),
    html: "<pre>".concat(blockComment, "123</pre>")
  },
  "code with newline": {
    document: createDocument(["12\n3", {}, ["code"]]),
    html: "<pre>".concat(blockComment, "12\n3</pre>")
  },
  "code with custom language": {
    document: createDocument(["puts \"Hello world!\"", {}, ["code"], {
      "language": "ruby"
    }]),
    html: "<pre language=\"ruby\">".concat(blockComment, "puts \"Hello world!\"</pre>"),
    serializedHTML: "<pre language=\"ruby\">puts \"Hello world!\"</pre>"
  },
  "multiple blocks with block comments in their text": {
    document: createDocument(["a".concat(blockComment, "b"), {}, ["quote"]], ["".concat(blockComment, "c"), {}, ["code"]]),
    html: "<blockquote>".concat(blockComment, "a&lt;!--block--&gt;b</blockquote><pre>").concat(blockComment, "&lt;!--block--&gt;c</pre>"),
    serializedHTML: "<blockquote>a&lt;!--block--&gt;b</blockquote><pre>&lt;!--block--&gt;c</pre>"
  },
  "unordered list with one item": {
    document: createDocument(["a", {}, ["bulletList", "bullet"]]),
    html: "<ul><li>".concat(blockComment, "a</li></ul>")
  },
  "unordered list with bold text": {
    document: createDocument(["a", {
      bold: true
    }, ["bulletList", "bullet"]]),
    html: "<ul><li>".concat(blockComment, "<strong>a</strong></li></ul>")
  },
  "unordered list with partially formatted text": {
    document: new Document([new Block(new Text([new StringPiece("a"), new StringPiece("b", {
      italic: true
    })]), ["bulletList", "bullet"])]),
    html: "<ul><li>".concat(blockComment, "a<em>b</em></li></ul>")
  },
  "unordered list with two items": {
    document: createDocument(["a", {}, ["bulletList", "bullet"]], ["b", {}, ["bulletList", "bullet"]]),
    html: "<ul><li>".concat(blockComment, "a</li><li>").concat(blockComment, "b</li></ul>")
  },
  "unordered list surrounded by unformatted blocks": {
    document: createDocument(["a"], ["b", {}, ["bulletList", "bullet"]], ["c"]),
    html: "<div>".concat(blockComment, "a</div><ul><li>").concat(blockComment, "b</li></ul><div>").concat(blockComment, "c</div>")
  },
  "ordered list": {
    document: createDocument(["a", {}, ["numberList", "number"]]),
    html: "<ol><li>".concat(blockComment, "a</li></ol>")
  },
  "ordered list and an unordered list": {
    document: createDocument(["a", {}, ["bulletList", "bullet"]], ["b", {}, ["numberList", "number"]]),
    html: "<ul><li>".concat(blockComment, "a</li></ul><ol><li>").concat(blockComment, "b</li></ol>")
  },
  "empty block with attributes": {
    document: createDocument(["", {}, ["quote"]]),
    html: "<blockquote>".concat(blockComment, "<br></blockquote>")
  },
  "image attachment": (() => {
    const attrs = {
      url: TEST_IMAGE_URL,
      filename: "example.png",
      filesize: 98203,
      contentType: "image/png",
      width: 1,
      height: 1
    };
    const attachment = new Attachment(attrs);
    const text = Text.textForAttachmentWithAttributes(attachment);
    const image = makeElement("img", {
      src: attrs.url,
      "data-trix-mutable": true,
      width: 1,
      height: 1
    });
    image.dataset.trixStoreKey = ["imageElement", attachment.id, image.src, image.width, image.height].join("/");
    const caption = makeElement({
      tagName: "figcaption",
      className: css.attachmentCaption
    });
    caption.innerHTML = "<span class=\"".concat(css.attachmentName, "\">").concat(attrs.filename, "</span> <span class=\"").concat(css.attachmentSize, "\">95.9 KB</span>");
    const figure = makeElement({
      tagName: "figure",
      className: "attachment attachment--preview attachment--png",
      editable: false,
      data: {
        trixAttachment: JSON.stringify(attachment),
        trixContentType: "image/png",
        trixId: attachment.id
      }
    });
    figure.setAttribute("contenteditable", false);
    figure.appendChild(image);
    figure.appendChild(caption);
    const serializedFigure = figure.cloneNode(true);
    ["data-trix-id", "data-trix-mutable", "data-trix-store-key", "contenteditable"].forEach(attribute => {
      serializedFigure.removeAttribute(attribute);
      Array.from(serializedFigure.querySelectorAll("[".concat(attribute, "]"))).forEach(element => {
        element.removeAttribute(attribute);
      });
    });
    return {
      html: "<div>".concat(blockComment).concat(cursorTargetLeft$1).concat(figure.outerHTML).concat(cursorTargetRight$1, "</div>"),
      serializedHTML: "<div>".concat(serializedFigure.outerHTML, "</div>"),
      document: new Document([new Block(text)])
    };
  })(),
  "text with newlines and image attachment": (() => {
    const stringText = Text.textForStringWithAttributes("a\nb");
    const attrs = {
      url: TEST_IMAGE_URL,
      filename: "example.png",
      filesize: 98203,
      contentType: "image/png",
      width: 1,
      height: 1
    };
    const attachment = new Attachment(attrs);
    const attachmentText = Text.textForAttachmentWithAttributes(attachment);
    const image = makeElement("img", {
      src: attrs.url,
      "data-trix-mutable": true,
      width: 1,
      height: 1
    });
    image.dataset.trixStoreKey = ["imageElement", attachment.id, image.src, image.width, image.height].join("/");
    const caption = makeElement({
      tagName: "figcaption",
      className: css.attachmentCaption
    });
    caption.innerHTML = "<span class=\"".concat(css.attachmentName, "\">").concat(attrs.filename, "</span> <span class=\"").concat(css.attachmentSize, "\">95.9 KB</span>");
    const figure = makeElement({
      tagName: "figure",
      className: "attachment attachment--preview attachment--png",
      editable: false,
      data: {
        trixAttachment: JSON.stringify(attachment),
        trixContentType: "image/png",
        trixId: attachment.id
      }
    });
    figure.appendChild(image);
    figure.appendChild(caption);
    const serializedFigure = figure.cloneNode(true);
    ["data-trix-id", "data-trix-mutable", "data-trix-store-key", "contenteditable"].forEach(attribute => {
      serializedFigure.removeAttribute(attribute);
      Array.from(serializedFigure.querySelectorAll("[".concat(attribute, "]"))).forEach(element => {
        element.removeAttribute(attribute);
      });
    });
    const text = stringText.appendText(attachmentText);
    return {
      html: "<div>".concat(blockComment, "a<br>b").concat(cursorTargetLeft$1).concat(figure.outerHTML).concat(cursorTargetRight$1, "</div>"),
      serializedHTML: "<div>a<br>b".concat(serializedFigure.outerHTML, "</div>"),
      document: new Document([new Block(text)])
    };
  })(),
  "image attachment with edited caption": (() => {
    const attrs = {
      url: TEST_IMAGE_URL,
      filename: "example.png",
      filesize: 123,
      contentType: "image/png",
      width: 1,
      height: 1
    };
    const attachment = new Attachment(attrs);
    const textAttrs = {
      caption: "Example"
    };
    const text = Text.textForAttachmentWithAttributes(attachment, textAttrs);
    const image = makeElement("img", {
      src: attrs.url,
      "data-trix-mutable": true,
      width: 1,
      height: 1
    });
    image.dataset.trixStoreKey = ["imageElement", attachment.id, image.src, image.width, image.height].join("/");
    const caption = makeElement({
      tagName: "figcaption",
      className: "".concat(css.attachmentCaption, " ").concat(css.attachmentCaption, "--edited"),
      textContent: "Example"
    });
    const figure = makeElement({
      tagName: "figure",
      className: "attachment attachment--preview attachment--png",
      editable: false,
      data: {
        trixAttachment: JSON.stringify(attachment),
        trixContentType: "image/png",
        trixId: attachment.id,
        trixAttributes: JSON.stringify(textAttrs)
      }
    });
    figure.appendChild(image);
    figure.appendChild(caption);
    return {
      html: "<div>".concat(blockComment).concat(cursorTargetLeft$1).concat(figure.outerHTML).concat(cursorTargetRight$1, "</div>"),
      document: new Document([new Block(text)])
    };
  })(),
  "file attachment": (() => {
    const attrs = {
      href: "http://example.com/example.pdf",
      filename: "example.pdf",
      filesize: 34038769,
      contentType: "application/pdf"
    };
    const attachment = new Attachment(attrs);
    const text = Text.textForAttachmentWithAttributes(attachment);
    const figure = makeElement({
      tagName: "figure",
      className: "attachment attachment--file attachment--pdf",
      editable: false,
      data: {
        trixAttachment: JSON.stringify(attachment),
        trixContentType: "application/pdf",
        trixId: attachment.id
      }
    });
    const caption = "<figcaption class=\"".concat(css.attachmentCaption, "\"><span class=\"").concat(css.attachmentName, "\">").concat(attrs.filename, "</span> <span class=\"").concat(css.attachmentSize, "\">32.46 MB</span></figcaption>");
    figure.innerHTML = caption;
    const link = makeElement({
      tagName: "a",
      editable: false,
      attributes: {
        href: attrs.href,
        tabindex: -1
      }
    });
    Array.from(figure.childNodes).forEach(node => {
      link.appendChild(node);
    });
    figure.appendChild(link);
    return {
      html: "<div>".concat(blockComment).concat(cursorTargetLeft$1).concat(figure.outerHTML).concat(cursorTargetRight$1, "</div>"),
      document: new Document([new Block(text)])
    };
  })(),
  "pending file attachment": (() => {
    const attrs = {
      filename: "example.pdf",
      filesize: 34038769,
      contentType: "application/pdf"
    };
    const attachment = new Attachment(attrs);
    attachment.file = {};
    const text = Text.textForAttachmentWithAttributes(attachment);
    const figure = makeElement({
      tagName: "figure",
      className: "attachment attachment--file attachment--pdf",
      editable: false,
      data: {
        trixAttachment: JSON.stringify(attachment),
        trixContentType: "application/pdf",
        trixId: attachment.id,
        trixSerialize: false
      }
    });
    const progress = makeElement({
      tagName: "progress",
      attributes: {
        class: "attachment__progress",
        value: 0,
        max: 100
      },
      data: {
        trixMutable: true,
        trixStoreKey: ["progressElement", attachment.id].join("/")
      }
    });
    const caption = "<figcaption class=\"".concat(css.attachmentCaption, "\"><span class=\"").concat(css.attachmentName, "\">").concat(attrs.filename, "</span> <span class=\"").concat(css.attachmentSize, "\">32.46 MB</span></figcaption>");
    figure.innerHTML = caption + progress.outerHTML;
    return {
      html: "<div>".concat(blockComment).concat(cursorTargetLeft$1).concat(figure.outerHTML).concat(cursorTargetRight$1, "</div>"),
      document: new Document([new Block(text)])
    };
  })(),
  "content attachment": (() => {
    const content = "<blockquote class=\"twitter-tweet\"><p>ruby-build 20150413 is out, with definitions for 2.2.2, 2.1.6, and 2.0.0-p645 to address recent security issues: <a href=\"https://t.co/YEwV6NtRD8\">https://t.co/YEwV6NtRD8</a></p>&mdash; Sam Stephenson (@sstephenson) <a href=\"https://twitter.com/sstephenson/status/587715996783218688\">April 13, 2015</a></blockquote>";
    const href = "https://twitter.com/sstephenson/status/587715996783218688";
    const contentType = "embed/twitter";
    const attachment = new Attachment({
      content,
      contentType,
      href
    });
    const text = Text.textForAttachmentWithAttributes(attachment);
    const figure = makeElement({
      tagName: "figure",
      className: "attachment attachment--content",
      editable: false,
      data: {
        trixAttachment: JSON.stringify(attachment),
        trixContentType: contentType,
        trixId: attachment.id
      }
    });
    figure.innerHTML = content;
    const caption = makeElement({
      tagName: "figcaption",
      className: css.attachmentCaption
    });
    figure.appendChild(caption);
    return {
      html: "<div>".concat(blockComment).concat(cursorTargetLeft$1).concat(figure.outerHTML).concat(cursorTargetRight$1, "</div>"),
      document: new Document([new Block(text)])
    };
  })(),
  "nested quote and code formatted block": {
    document: createDocument(["ab3", {}, ["quote", "code"]]),
    html: "<blockquote><pre>".concat(blockComment, "ab3</pre></blockquote>")
  },
  "nested code and quote formatted block": {
    document: createDocument(["ab3", {}, ["code", "quote"]]),
    html: "<pre><blockquote>".concat(blockComment, "ab3</blockquote></pre>")
  },
  "nested code blocks in quote": {
    document: createDocument(["a\n", {}, ["quote"]], ["b", {}, ["quote", "code"]], ["\nc\n", {}, ["quote"]], ["d", {}, ["quote", "code"]]),
    html: removeWhitespace("<blockquote>\n        ".concat(blockComment, "\n        a\n        <br>\n        <br>\n        <pre>\n          ").concat(blockComment, "\n          b\n        </pre>\n        ").concat(blockComment, "\n        <br>\n        c\n        <br>\n        <br>\n        <pre>\n          ").concat(blockComment, "\n          d\n        </pre>\n      </blockquote>")),
    serializedHTML: removeWhitespace("<blockquote>\n        a\n        <br>\n        <br>\n        <pre>\n          b\n        </pre>\n        <br>\n        c\n        <br>\n        <br>\n        <pre>\n          d\n        </pre>\n      </blockquote>")
  },
  "nested code, quote, and list in quote": {
    document: createDocument(["a\n", {}, ["quote"]], ["b", {}, ["quote", "code"]], ["\nc\n", {}, ["quote"]], ["d", {}, ["quote", "quote"]], ["\ne\n", {}, ["quote"]], ["f", {}, ["quote", "bulletList", "bullet"]]),
    html: removeWhitespace("<blockquote>\n        ".concat(blockComment, "\n        a\n        <br>\n        <br>\n        <pre>\n          ").concat(blockComment, "\n          b\n        </pre>\n        ").concat(blockComment, "\n        <br>\n        c\n        <br>\n        <br>\n        <blockquote>\n          ").concat(blockComment, "\n          d\n        </blockquote>\n        ").concat(blockComment, "\n        <br>\n        e\n        <br>\n        <br>\n        <ul>\n          <li>\n            ").concat(blockComment, "\n            f\n          </li>\n        </ul>\n      </blockquote>")),
    serializedHTML: removeWhitespace("<blockquote>\n        a\n        <br>\n        <br>\n        <pre>\n          b\n        </pre>\n        <br>\n        c\n        <br>\n        <br>\n        <blockquote>\n          d\n        </blockquote>\n        <br>\n        e\n        <br>\n        <br>\n        <ul>\n          <li>\n            f\n          </li>\n        </ul>\n      </blockquote>")
  },
  "nested quotes at different nesting levels": {
    document: createDocument(["a", {}, ["quote", "quote", "quote"]], ["b", {}, ["quote", "quote"]], ["c", {}, ["quote"]], ["d", {}, ["quote", "quote"]]),
    html: removeWhitespace("<blockquote>\n        <blockquote>\n          <blockquote>\n            ".concat(blockComment, "\n            a\n          </blockquote>\n          ").concat(blockComment, "\n          b\n        </blockquote>\n        ").concat(blockComment, "\n        c\n        <blockquote>\n          ").concat(blockComment, "\n          d\n        </blockquote>\n      </blockquote>")),
    serializedHTML: removeWhitespace("<blockquote>\n        <blockquote>\n          <blockquote>\n            a\n          </blockquote>\n          b\n        </blockquote>\n        c\n        <blockquote>\n          d\n        </blockquote>\n      </blockquote>")
  },
  "nested quote and list": {
    document: createDocument(["ab3", {}, ["quote", "bulletList", "bullet"]]),
    html: "<blockquote><ul><li>".concat(blockComment, "ab3</li></ul></blockquote>")
  },
  "nested list and quote": {
    document: createDocument(["ab3", {}, ["bulletList", "bullet", "quote"]]),
    html: "<ul><li><blockquote>".concat(blockComment, "ab3</blockquote></li></ul>")
  },
  "nested lists and quotes": {
    document: createDocument(["a", {}, ["bulletList", "bullet", "quote"]], ["b", {}, ["bulletList", "bullet", "quote"]]),
    html: "<ul><li><blockquote>".concat(blockComment, "a</blockquote></li><li><blockquote>").concat(blockComment, "b</blockquote></li></ul>")
  },
  "nested quote and list with two items": {
    document: createDocument(["a", {}, ["quote", "bulletList", "bullet"]], ["b", {}, ["quote", "bulletList", "bullet"]]),
    html: "<blockquote><ul><li>".concat(blockComment, "a</li><li>").concat(blockComment, "b</li></ul></blockquote>")
  },
  "nested unordered lists": {
    document: createDocument(["a", {}, ["bulletList", "bullet"]], ["b", {}, ["bulletList", "bullet", "bulletList", "bullet"]], ["c", {}, ["bulletList", "bullet", "bulletList", "bullet"]]),
    html: "<ul><li>".concat(blockComment, "a<ul><li>").concat(blockComment, "b</li><li>").concat(blockComment, "c</li></ul></li></ul>")
  },
  "nested lists": {
    document: createDocument(["a", {}, ["numberList", "number"]], ["b", {}, ["numberList", "number", "bulletList", "bullet"]], ["c", {}, ["numberList", "number", "bulletList", "bullet"]]),
    html: "<ol><li>".concat(blockComment, "a<ul><li>").concat(blockComment, "b</li><li>").concat(blockComment, "c</li></ul></li></ol>")
  },
  "blocks beginning with newlines": {
    document: createDocument(["\na", {}, ["quote"]], ["\nb", {}, []], ["\nc", {}, ["quote"]]),
    html: "<blockquote>".concat(blockComment, "<br>a</blockquote><div>").concat(blockComment, "<br>b</div><blockquote>").concat(blockComment, "<br>c</blockquote>")
  },
  "blocks beginning with formatted text": {
    document: createDocument(["a", {
      bold: true
    }, ["quote"]], ["b", {
      italic: true
    }, []], ["c", {
      bold: true
    }, ["quote"]]),
    html: "<blockquote>".concat(blockComment, "<strong>a</strong></blockquote><div>").concat(blockComment, "<em>b</em></div><blockquote>").concat(blockComment, "<strong>c</strong></blockquote>")
  },
  "text with newlines before block": {
    document: createDocument(["a\nb"], ["c", {}, ["quote"]]),
    html: "<div>".concat(blockComment, "a<br>b</div><blockquote>").concat(blockComment, "c</blockquote>")
  },
  "empty heading block": {
    document: createDocument(["", {}, ["heading1"]]),
    html: "<h1>".concat(blockComment, "<br></h1>")
  },
  "two adjacent headings": {
    document: createDocument(["a", {}, ["heading1"]], ["b", {}, ["heading1"]]),
    html: "<h1>".concat(blockComment, "a</h1><h1>").concat(blockComment, "b</h1>")
  },
  "heading in ordered list": {
    document: createDocument(["a", {}, ["numberList", "number", "heading1"]]),
    html: "<ol><li><h1>".concat(blockComment, "a</h1></li></ol>")
  },
  "headings with formatted text": {
    document: createDocument(["a", {
      bold: true
    }, ["heading1"]], ["b", {
      italic: true,
      bold: true
    }, ["heading1"]]),
    html: "<h1>".concat(blockComment, "<strong>a</strong></h1><h1>").concat(blockComment, "<strong><em>b</em></strong></h1>")
  },
  "bidrectional text": {
    document: createDocument(["a"], ["ل", {}, ["quote"]], ["b", {}, ["bulletList", "bullet"]], ["ל", {}, ["bulletList", "bullet"]], ["", {}, ["bulletList", "bullet"]], ["cید"], ["\n گ"]),
    html: "<div>".concat(blockComment, "a</div><blockquote dir=\"rtl\">").concat(blockComment, "\u0644</blockquote><ul><li>").concat(blockComment, "b</li></ul><ul dir=\"rtl\"><li>").concat(blockComment, "\u05DC</li><li>").concat(blockComment, "<br></li></ul><div>").concat(blockComment, "c\u06CC\u062F</div><div dir=\"rtl\">").concat(blockComment, "<br>&nbsp;\u06AF</div>"),
    serializedHTML: "\
<div>a</div>\
<blockquote dir=\"rtl\">ل</blockquote>\
<ul><li>b</li></ul>\
<ul dir=\"rtl\"><li>ל</li><li><br></li></ul>\
<div>cید</div>\
<div dir=\"rtl\"><br>&nbsp;گ</div>\
"
  }
};
const eachFixture = callback => {
  for (const name in fixtures) {
    const details = fixtures[name];
    callback(name, details);
  }
};

const setFixtureHTML = function (html) {
  let container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "form";
  let element = document.getElementById("trix-container");
  if (element != null) removeNode(element);
  element = document.createElement(container);
  element.id = "trix-container";
  element.innerHTML = html;
  return document.body.insertAdjacentElement("afterbegin", element);
};
const testGroup = function (name, options, callback) {
  let container, setup, teardown, template;
  if (callback != null) {
    ({
      container,
      template,
      setup,
      teardown
    } = options);
  } else {
    callback = options;
  }
  const beforeEach = async () => {
    // Ensure window is active on CI so focus and blur events are natively dispatched
    window.focus();
    if (template != null) {
      setFixtureHTML(fixtureTemplates[template](), container);
      await waitForTrixInit();
    }
    if (setup) setup();
  };
  const afterEach = () => {
    var _teardown;
    if (template != null) setFixtureHTML("");
    return (_teardown = teardown) === null || _teardown === void 0 ? void 0 : _teardown();
  };
  if (callback != null) {
    return QUnit.module(name, function (hooks) {
      hooks.beforeEach(beforeEach);
      hooks.afterEach(afterEach);
      callback();
    });
  } else {
    return QUnit.module(name, {
      beforeEach,
      afterEach
    });
  }
};
const skipIf = function (condition) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  testIf(!condition, ...args);
};
const testIf = function (condition) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  if (condition) {
    test$3(...Array.from(args || []));
  } else {
    skip(...Array.from(args || []));
  }
};
const {
  skip,
  test: test$3
} = QUnit;
const waitForTrixInit = async () => {
  return new Promise(resolve => {
    addEventListener("trix-initialize", _ref => {
      let {
        target
      } = _ref;
      if (target.hasAttribute("autofocus")) target.editor.setSelectedRange(0);
      resolve(target);
    }, {
      once: true
    });
  });
};

// const isAsync = (func) => func.constructor.name === "AsyncFunction"

class TestCompositionDelegate {
  compositionDidRequestChangingSelectionToLocationRange() {
    return this.getSelectionManager().setLocationRange(...arguments);
  }
  getSelectionManager() {
    if (!this.selectionManager) this.selectionManager = new TestSelectionManager();
    return this.selectionManager;
  }
}
class TestSelectionManager {
  constructor() {
    this.setLocationRange({
      index: 0,
      offset: 0
    });
  }
  getLocationRange() {
    return this.locationRange;
  }
  setLocationRange(locationRange) {
    this.locationRange = normalizeRange(locationRange);
  }
  preserveSelection(block) {
    const locationRange = this.getLocationRange();
    block();
    this.locationRange = locationRange;
  }
  setLocationRangeFromPoint(point) {}
  locationIsCursorTarget() {
    return false;
  }
  selectionIsExpanded() {
    return !rangeIsCollapsed(this.getLocationRange());
  }
}

const extend = function (properties) {
  for (const key in properties) {
    const value = properties[key];
    this[key] = value;
  }
  return this;
};
const after = (delay, callback) => setTimeout(callback, delay);

function nextFrame() {
  return new Promise(requestAnimationFrame);
}
function nextIdle() {
  return new Promise(window.requestIdleCallback || setTimeout);
}
function delay() {
  let ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return new Promise(resolve => setTimeout(resolve, ms));
}

var rangyCore = {exports: {}};

/**
 * Rangy, a cross-browser JavaScript range and selection library
 * https://github.com/timdown/rangy
 *
 * Copyright 2022, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3.1
 * Build date: 17 August 2022
 */
(function (module, exports) {
  (function (factory, root) {
    if (typeof undefined == "function" && undefined.amd) {
      // AMD. Register as an anonymous module.
      undefined(factory);
    } else if ('object' != "undefined" && 'object' == "object") {
      // Node/CommonJS style
      module.exports = factory();
    } else {
      // No AMD or CommonJS support so we place Rangy in (probably) the global variable
      root.rangy = factory();
    }
  })(function () {
    var OBJECT = "object",
      FUNCTION = "function",
      UNDEFINED = "undefined";

    // Minimal set of properties required for DOM Level 2 Range compliance. Comparison constants such as START_TO_START
    // are omitted because ranges in KHTML do not have them but otherwise work perfectly well. See issue 113.
    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"];

    // Minimal set of methods required for DOM Level 2 Range compliance
    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore", "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents", "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];
    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "moveToElementText", "parentElement", "select", "setEndPoint", "getBoundingClientRect"];

    /*----------------------------------------------------------------------------------------------------------------*/

    // Trio of functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(o, p) {
      var t = typeof o[p];
      return t == FUNCTION || !!(t == OBJECT && o[p]) || t == "unknown";
    }
    function isHostObject(o, p) {
      return !!(typeof o[p] == OBJECT && o[p]);
    }
    function isHostProperty(o, p) {
      return typeof o[p] != UNDEFINED;
    }

    // Creates a convenience function to save verbose repeated calls to tests functions
    function createMultiplePropertyTest(testFunc) {
      return function (o, props) {
        var i = props.length;
        while (i--) {
          if (!testFunc(o, props[i])) {
            return false;
          }
        }
        return true;
      };
    }

    // Next trio of functions are a convenience to save verbose repeated calls to previous two functions
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);
    function isTextRange(range) {
      return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }
    function getBody(doc) {
      return isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }
    var forEach = [].forEach ? function (arr, func) {
      arr.forEach(func);
    } : function (arr, func) {
      for (var i = 0, len = arr.length; i < len; ++i) {
        func(arr[i], i);
      }
    };
    var modules = {};
    var isBrowser = typeof window != UNDEFINED && typeof document != UNDEFINED;
    var util = {
      isHostMethod: isHostMethod,
      isHostObject: isHostObject,
      isHostProperty: isHostProperty,
      areHostMethods: areHostMethods,
      areHostObjects: areHostObjects,
      areHostProperties: areHostProperties,
      isTextRange: isTextRange,
      getBody: getBody,
      forEach: forEach
    };
    var api = {
      version: "1.3.1",
      initialized: false,
      isBrowser: isBrowser,
      supported: true,
      util: util,
      features: {},
      modules: modules,
      config: {
        alertOnFail: false,
        alertOnWarn: false,
        preferTextRange: false,
        autoInitialize: typeof rangyAutoInitialize == UNDEFINED ? true : rangyAutoInitialize
      }
    };
    function consoleLog(msg) {
      if (typeof console != UNDEFINED && isHostMethod(console, "log")) {
        console.log(msg);
      }
    }
    function alertOrLog(msg, shouldAlert) {
      if (isBrowser && shouldAlert) {
        alert(msg);
      } else {
        consoleLog(msg);
      }
    }
    function fail(reason) {
      api.initialized = true;
      api.supported = false;
      alertOrLog("Rangy is not supported in this environment. Reason: " + reason, api.config.alertOnFail);
    }
    api.fail = fail;
    function warn(msg) {
      alertOrLog("Rangy warning: " + msg, api.config.alertOnWarn);
    }
    api.warn = warn;

    // Add utility extend() method
    var extend;
    if ({}.hasOwnProperty) {
      util.extend = extend = function (obj, props, deep) {
        var o, p;
        for (var i in props) {
          if (props.hasOwnProperty(i)) {
            o = obj[i];
            p = props[i];
            if (deep && o !== null && typeof o == "object" && p !== null && typeof p == "object") {
              extend(o, p, true);
            }
            obj[i] = p;
          }
        }
        // Special case for toString, which does not show up in for...in loops in IE <= 8
        if (props.hasOwnProperty("toString")) {
          obj.toString = props.toString;
        }
        return obj;
      };
      util.createOptions = function (optionsParam, defaults) {
        var options = {};
        extend(options, defaults);
        if (optionsParam) {
          extend(options, optionsParam);
        }
        return options;
      };
    } else {
      fail("hasOwnProperty not supported");
    }

    // Test whether we're in a browser and bail out if not
    if (!isBrowser) {
      fail("Rangy can only run in a browser");
    }

    // Test whether Array.prototype.slice can be relied on for NodeLists and use an alternative toArray() if not
    (function () {
      var toArray;
      if (isBrowser) {
        var el = document.createElement("div");
        el.appendChild(document.createElement("span"));
        var slice = [].slice;
        try {
          if (slice.call(el.childNodes, 0)[0].nodeType == 1) {
            toArray = function (arrayLike) {
              return slice.call(arrayLike, 0);
            };
          }
        } catch (e) {}
      }
      if (!toArray) {
        toArray = function (arrayLike) {
          var arr = [];
          for (var i = 0, len = arrayLike.length; i < len; ++i) {
            arr[i] = arrayLike[i];
          }
          return arr;
        };
      }
      util.toArray = toArray;
    })();

    // Very simple event handler wrapper function that doesn't attempt to solve issues such as "this" handling or
    // normalization of event properties because we don't need this.
    var addListener;
    if (isBrowser) {
      if (isHostMethod(document, "addEventListener")) {
        addListener = function (obj, eventType, listener) {
          obj.addEventListener(eventType, listener, false);
        };
      } else if (isHostMethod(document, "attachEvent")) {
        addListener = function (obj, eventType, listener) {
          obj.attachEvent("on" + eventType, listener);
        };
      } else {
        fail("Document does not have required addEventListener or attachEvent method");
      }
      util.addListener = addListener;
    }
    var initListeners = [];
    function getErrorDesc(ex) {
      return ex.message || ex.description || String(ex);
    }

    // Initialization
    function init() {
      if (!isBrowser || api.initialized) {
        return;
      }
      var testRange;
      var implementsDomRange = false,
        implementsTextRange = false;

      // First, perform basic feature tests

      if (isHostMethod(document, "createRange")) {
        testRange = document.createRange();
        if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
          implementsDomRange = true;
        }
      }
      var body = getBody(document);
      if (!body || body.nodeName.toLowerCase() != "body") {
        fail("No body element found");
        return;
      }
      if (body && isHostMethod(body, "createTextRange")) {
        testRange = body.createTextRange();
        if (isTextRange(testRange)) {
          implementsTextRange = true;
        }
      }
      if (!implementsDomRange && !implementsTextRange) {
        fail("Neither Range nor TextRange are available");
        return;
      }
      api.initialized = true;
      api.features = {
        implementsDomRange: implementsDomRange,
        implementsTextRange: implementsTextRange
      };

      // Initialize modules
      var module, errorMessage;
      for (var moduleName in modules) {
        if ((module = modules[moduleName]) instanceof Module) {
          module.init(module, api);
        }
      }

      // Call init listeners
      for (var i = 0, len = initListeners.length; i < len; ++i) {
        try {
          initListeners[i](api);
        } catch (ex) {
          errorMessage = "Rangy init listener threw an exception. Continuing. Detail: " + getErrorDesc(ex);
          consoleLog(errorMessage);
        }
      }
    }
    function deprecationNotice(deprecated, replacement, module) {
      if (module) {
        deprecated += " in module " + module.name;
      }
      api.warn("DEPRECATED: " + deprecated + " is deprecated. Please use " + replacement + " instead.");
    }
    function createAliasForDeprecatedMethod(owner, deprecated, replacement, module) {
      owner[deprecated] = function () {
        deprecationNotice(deprecated, replacement, module);
        return owner[replacement].apply(owner, util.toArray(arguments));
      };
    }
    util.deprecationNotice = deprecationNotice;
    util.createAliasForDeprecatedMethod = createAliasForDeprecatedMethod;

    // Allow external scripts to initialize this library in case it's loaded after the document has loaded
    api.init = init;

    // Execute listener immediately if already initialized
    api.addInitListener = function (listener) {
      if (api.initialized) {
        listener(api);
      } else {
        initListeners.push(listener);
      }
    };
    var shimListeners = [];
    api.addShimListener = function (listener) {
      shimListeners.push(listener);
    };
    function shim(win) {
      win = win || window;
      init();

      // Notify listeners
      for (var i = 0, len = shimListeners.length; i < len; ++i) {
        shimListeners[i](win);
      }
    }
    if (isBrowser) {
      api.shim = api.createMissingNativeApi = shim;
      createAliasForDeprecatedMethod(api, "createMissingNativeApi", "shim");
    }
    function Module(name, dependencies, initializer) {
      this.name = name;
      this.dependencies = dependencies;
      this.initialized = false;
      this.supported = false;
      this.initializer = initializer;
    }
    Module.prototype = {
      init: function () {
        var requiredModuleNames = this.dependencies || [];
        for (var i = 0, len = requiredModuleNames.length, requiredModule, moduleName; i < len; ++i) {
          moduleName = requiredModuleNames[i];
          requiredModule = modules[moduleName];
          if (!requiredModule || !(requiredModule instanceof Module)) {
            throw new Error("required module '" + moduleName + "' not found");
          }
          requiredModule.init();
          if (!requiredModule.supported) {
            throw new Error("required module '" + moduleName + "' not supported");
          }
        }

        // Now run initializer
        this.initializer(this);
      },
      fail: function (reason) {
        this.initialized = true;
        this.supported = false;
        throw new Error(reason);
      },
      warn: function (msg) {
        api.warn("Module " + this.name + ": " + msg);
      },
      deprecationNotice: function (deprecated, replacement) {
        api.warn("DEPRECATED: " + deprecated + " in module " + this.name + " is deprecated. Please use " + replacement + " instead");
      },
      createError: function (msg) {
        return new Error("Error in Rangy " + this.name + " module: " + msg);
      }
    };
    function createModule(name, dependencies, initFunc) {
      var newModule = new Module(name, dependencies, function (module) {
        if (!module.initialized) {
          module.initialized = true;
          try {
            initFunc(api, module);
            module.supported = true;
          } catch (ex) {
            var errorMessage = "Module '" + name + "' failed to load: " + getErrorDesc(ex);
            consoleLog(errorMessage);
            if (ex.stack) {
              consoleLog(ex.stack);
            }
          }
        }
      });
      modules[name] = newModule;
      return newModule;
    }
    api.createModule = function (name) {
      // Allow 2 or 3 arguments (second argument is an optional array of dependencies)
      var initFunc, dependencies;
      if (arguments.length == 2) {
        initFunc = arguments[1];
        dependencies = [];
      } else {
        initFunc = arguments[2];
        dependencies = arguments[1];
      }
      var module = createModule(name, dependencies, initFunc);

      // Initialize the module immediately if the core is already initialized
      if (api.initialized && api.supported) {
        module.init();
      }
    };
    api.createCoreModule = function (name, dependencies, initFunc) {
      createModule(name, dependencies, initFunc);
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Ensure rangy.rangePrototype and rangy.selectionPrototype are available immediately

    function RangePrototype() {}
    api.RangePrototype = RangePrototype;
    api.rangePrototype = new RangePrototype();
    function SelectionPrototype() {}
    api.selectionPrototype = new SelectionPrototype();

    /*----------------------------------------------------------------------------------------------------------------*/

    // DOM utility methods used by Rangy
    api.createCoreModule("DomUtil", [], function (api, module) {
      var UNDEF = "undefined";
      var util = api.util;
      var getBody = util.getBody;

      // Perform feature tests
      if (!util.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
        module.fail("document missing a Node creation method");
      }
      if (!util.isHostMethod(document, "getElementsByTagName")) {
        module.fail("document missing getElementsByTagName method");
      }
      var el = document.createElement("div");
      if (!util.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"] || !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
        module.fail("Incomplete Element implementation");
      }

      // innerHTML is required for Range's createContextualFragment method
      if (!util.isHostProperty(el, "innerHTML")) {
        module.fail("Element is missing innerHTML property");
      }
      var textNode = document.createTextNode("test");
      if (!util.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] || !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) || !util.areHostProperties(textNode, ["data"]))) {
        module.fail("Incomplete Text Node implementation");
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // Removed use of indexOf because of a bizarre bug in Opera that is thrown in one of the Acid3 tests. I haven't been
      // able to replicate it outside of the test. The bug is that indexOf returns -1 when called on an Array that
      // contains just the document as a single element and the value searched for is the document.
      var arrayContains =
      /*Array.prototype.indexOf ?
      function(arr, val) {
      return arr.indexOf(val) > -1;
      }:*/

      function (arr, val) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === val) {
            return true;
          }
        }
        return false;
      };

      // Opera 11 puts HTML elements in the null namespace, it seems, and IE 7 has undefined namespaceURI
      function isHtmlNamespace(node) {
        var ns;
        return typeof node.namespaceURI == UNDEF || (ns = node.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml";
      }
      function parentElement(node) {
        var parent = node.parentNode;
        return parent.nodeType == 1 ? parent : null;
      }
      function getNodeIndex(node) {
        var i = 0;
        while (node = node.previousSibling) {
          ++i;
        }
        return i;
      }
      function getNodeLength(node) {
        switch (node.nodeType) {
          case 7:
          case 10:
            return 0;
          case 3:
          case 8:
            return node.length;
          default:
            return node.childNodes.length;
        }
      }
      function getCommonAncestor(node1, node2) {
        var ancestors = [],
          n;
        for (n = node1; n; n = n.parentNode) {
          ancestors.push(n);
        }
        for (n = node2; n; n = n.parentNode) {
          if (arrayContains(ancestors, n)) {
            return n;
          }
        }
        return null;
      }
      function isAncestorOf(ancestor, descendant, selfIsAncestor) {
        var n = selfIsAncestor ? descendant : descendant.parentNode;
        while (n) {
          if (n === ancestor) {
            return true;
          } else {
            n = n.parentNode;
          }
        }
        return false;
      }
      function isOrIsAncestorOf(ancestor, descendant) {
        return isAncestorOf(ancestor, descendant, true);
      }
      function getClosestAncestorIn(node, ancestor, selfIsAncestor) {
        var p,
          n = selfIsAncestor ? node : node.parentNode;
        while (n) {
          p = n.parentNode;
          if (p === ancestor) {
            return n;
          }
          n = p;
        }
        return null;
      }
      function isCharacterDataNode(node) {
        var t = node.nodeType;
        return t == 3 || t == 4 || t == 8; // Text, CDataSection or Comment
      }

      function isTextOrCommentNode(node) {
        if (!node) {
          return false;
        }
        var t = node.nodeType;
        return t == 3 || t == 8; // Text or Comment
      }

      function insertAfter(node, precedingNode) {
        var nextNode = precedingNode.nextSibling,
          parent = precedingNode.parentNode;
        if (nextNode) {
          parent.insertBefore(node, nextNode);
        } else {
          parent.appendChild(node);
        }
        return node;
      }

      // Note that we cannot use splitText() because it is bugridden in IE 9.
      function splitDataNode(node, index, positionsToPreserve) {
        var newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        insertAfter(newNode, node);

        // Preserve positions
        if (positionsToPreserve) {
          for (var i = 0, position; position = positionsToPreserve[i++];) {
            // Handle case where position was inside the portion of node after the split point
            if (position.node == node && position.offset > index) {
              position.node = newNode;
              position.offset -= index;
            }
            // Handle the case where the position is a node offset within node's parent
            else if (position.node == node.parentNode && position.offset > getNodeIndex(node)) {
              ++position.offset;
            }
          }
        }
        return newNode;
      }
      function getDocument(node) {
        if (node.nodeType == 9) {
          return node;
        } else if (typeof node.ownerDocument != UNDEF) {
          return node.ownerDocument;
        } else if (typeof node.document != UNDEF) {
          return node.document;
        } else if (node.parentNode) {
          return getDocument(node.parentNode);
        } else {
          throw module.createError("getDocument: no document found for node");
        }
      }
      function getWindow(node) {
        var doc = getDocument(node);
        if (typeof doc.defaultView != UNDEF) {
          return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
          return doc.parentWindow;
        } else {
          throw module.createError("Cannot get a window object for node");
        }
      }
      function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
          return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
          return iframeEl.contentWindow.document;
        } else {
          throw module.createError("getIframeDocument: No Document object found for iframe element");
        }
      }
      function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
          return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
          return iframeEl.contentDocument.defaultView;
        } else {
          throw module.createError("getIframeWindow: No Window object found for iframe element");
        }
      }

      // This looks bad. Is it worth it?
      function isWindow(obj) {
        return obj && util.isHostMethod(obj, "setTimeout") && util.isHostObject(obj, "document");
      }
      function getContentDocument(obj, module, methodName) {
        var doc;
        if (!obj) {
          doc = document;
        }

        // Test if a DOM node has been passed and obtain a document object for it if so
        else if (util.isHostProperty(obj, "nodeType")) {
          doc = obj.nodeType == 1 && obj.tagName.toLowerCase() == "iframe" ? getIframeDocument(obj) : getDocument(obj);
        }

        // Test if the doc parameter appears to be a Window object
        else if (isWindow(obj)) {
          doc = obj.document;
        }
        if (!doc) {
          throw module.createError(methodName + "(): Parameter must be a Window object or DOM node");
        }
        return doc;
      }
      function getRootContainer(node) {
        var parent;
        while (parent = node.parentNode) {
          node = parent;
        }
        return node;
      }
      function comparePoints(nodeA, offsetA, nodeB, offsetB) {
        // See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Comparing
        var nodeC, root, childA, childB, n;
        if (nodeA == nodeB) {
          // Case 1: nodes are the same
          return offsetA === offsetB ? 0 : offsetA < offsetB ? -1 : 1;
        } else if (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) {
          // Case 2: node C (container B or an ancestor) is a child node of A
          return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
        } else if (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) {
          // Case 3: node C (container A or an ancestor) is a child node of B
          return getNodeIndex(nodeC) < offsetB ? -1 : 1;
        } else {
          root = getCommonAncestor(nodeA, nodeB);
          if (!root) {
            throw new Error("comparePoints error: nodes have no common ancestor");
          }

          // Case 4: containers are siblings or descendants of siblings
          childA = nodeA === root ? root : getClosestAncestorIn(nodeA, root, true);
          childB = nodeB === root ? root : getClosestAncestorIn(nodeB, root, true);
          if (childA === childB) {
            // This shouldn't be possible
            throw module.createError("comparePoints got to case 4 and childA and childB are the same!");
          } else {
            n = root.firstChild;
            while (n) {
              if (n === childA) {
                return -1;
              } else if (n === childB) {
                return 1;
              }
              n = n.nextSibling;
            }
          }
        }
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // Test for IE's crash (IE 6/7) or exception (IE >= 8) when a reference to garbage-collected text node is queried
      var crashyTextNodes = false;
      function isBrokenNode(node) {
        var n;
        try {
          n = node.parentNode;
          return false;
        } catch (e) {
          return true;
        }
      }
      (function () {
        var el = document.createElement("b");
        el.innerHTML = "1";
        var textNode = el.firstChild;
        el.innerHTML = "<br />";
        crashyTextNodes = isBrokenNode(textNode);
        api.features.crashyTextNodes = crashyTextNodes;
      })();

      /*----------------------------------------------------------------------------------------------------------------*/

      function inspectNode(node) {
        if (!node) {
          return "[No node]";
        }
        if (crashyTextNodes && isBrokenNode(node)) {
          return "[Broken node]";
        }
        if (isCharacterDataNode(node)) {
          return '"' + node.data + '"';
        }
        if (node.nodeType == 1) {
          var idAttr = node.id ? ' id="' + node.id + '"' : "";
          return "<" + node.nodeName + idAttr + ">[index:" + getNodeIndex(node) + ",length:" + node.childNodes.length + "][" + (node.innerHTML || "[innerHTML not supported]").slice(0, 25) + "]";
        }
        return node.nodeName;
      }
      function fragmentFromNodeChildren(node) {
        var fragment = getDocument(node).createDocumentFragment(),
          child;
        while (child = node.firstChild) {
          fragment.appendChild(child);
        }
        return fragment;
      }
      var getComputedStyleProperty;
      if (typeof window.getComputedStyle != UNDEF) {
        getComputedStyleProperty = function (el, propName) {
          return getWindow(el).getComputedStyle(el, null)[propName];
        };
      } else if (typeof document.documentElement.currentStyle != UNDEF) {
        getComputedStyleProperty = function (el, propName) {
          return el.currentStyle ? el.currentStyle[propName] : "";
        };
      } else {
        module.fail("No means of obtaining computed style properties found");
      }
      function createTestElement(doc, html, contentEditable) {
        var body = getBody(doc);
        var el = doc.createElement("div");
        el.contentEditable = "" + !!contentEditable;
        if (html) {
          el.innerHTML = html;
        }

        // Insert the test element at the start of the body to prevent scrolling to the bottom in iOS (issue #292)
        var bodyFirstChild = body.firstChild;
        if (bodyFirstChild) {
          body.insertBefore(el, bodyFirstChild);
        } else {
          body.appendChild(el);
        }
        return el;
      }
      function removeNode(node) {
        return node.parentNode.removeChild(node);
      }
      function NodeIterator(root) {
        this.root = root;
        this._next = root;
      }
      NodeIterator.prototype = {
        _current: null,
        hasNext: function () {
          return !!this._next;
        },
        next: function () {
          var n = this._current = this._next;
          var child, next;
          if (this._current) {
            child = n.firstChild;
            if (child) {
              this._next = child;
            } else {
              next = null;
              while (n !== this.root && !(next = n.nextSibling)) {
                n = n.parentNode;
              }
              this._next = next;
            }
          }
          return this._current;
        },
        detach: function () {
          this._current = this._next = this.root = null;
        }
      };
      function createIterator(root) {
        return new NodeIterator(root);
      }
      function DomPosition(node, offset) {
        this.node = node;
        this.offset = offset;
      }
      DomPosition.prototype = {
        equals: function (pos) {
          return !!pos && this.node === pos.node && this.offset == pos.offset;
        },
        inspect: function () {
          return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        },
        toString: function () {
          return this.inspect();
        }
      };
      function DOMException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "DOMException: " + this.codeName;
      }
      DOMException.prototype = {
        INDEX_SIZE_ERR: 1,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INVALID_STATE_ERR: 11,
        INVALID_NODE_TYPE_ERR: 24
      };
      DOMException.prototype.toString = function () {
        return this.message;
      };
      api.dom = {
        arrayContains: arrayContains,
        isHtmlNamespace: isHtmlNamespace,
        parentElement: parentElement,
        getNodeIndex: getNodeIndex,
        getNodeLength: getNodeLength,
        getCommonAncestor: getCommonAncestor,
        isAncestorOf: isAncestorOf,
        isOrIsAncestorOf: isOrIsAncestorOf,
        getClosestAncestorIn: getClosestAncestorIn,
        isCharacterDataNode: isCharacterDataNode,
        isTextOrCommentNode: isTextOrCommentNode,
        insertAfter: insertAfter,
        splitDataNode: splitDataNode,
        getDocument: getDocument,
        getWindow: getWindow,
        getIframeWindow: getIframeWindow,
        getIframeDocument: getIframeDocument,
        getBody: getBody,
        isWindow: isWindow,
        getContentDocument: getContentDocument,
        getRootContainer: getRootContainer,
        comparePoints: comparePoints,
        isBrokenNode: isBrokenNode,
        inspectNode: inspectNode,
        getComputedStyleProperty: getComputedStyleProperty,
        createTestElement: createTestElement,
        removeNode: removeNode,
        fragmentFromNodeChildren: fragmentFromNodeChildren,
        createIterator: createIterator,
        DomPosition: DomPosition
      };
      api.DOMException = DOMException;
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    // Pure JavaScript implementation of DOM Range
    api.createCoreModule("DomRange", ["DomUtil"], function (api, module) {
      var dom = api.dom;
      var util = api.util;
      var DomPosition = dom.DomPosition;
      var DOMException = api.DOMException;
      var isCharacterDataNode = dom.isCharacterDataNode;
      var getNodeIndex = dom.getNodeIndex;
      var isOrIsAncestorOf = dom.isOrIsAncestorOf;
      var getDocument = dom.getDocument;
      var comparePoints = dom.comparePoints;
      var splitDataNode = dom.splitDataNode;
      var getClosestAncestorIn = dom.getClosestAncestorIn;
      var getNodeLength = dom.getNodeLength;
      var arrayContains = dom.arrayContains;
      var getRootContainer = dom.getRootContainer;
      var crashyTextNodes = api.features.crashyTextNodes;
      var removeNode = dom.removeNode;

      /*----------------------------------------------------------------------------------------------------------------*/

      // Utility functions

      function isNonTextPartiallySelected(node, range) {
        return node.nodeType != 3 && (isOrIsAncestorOf(node, range.startContainer) || isOrIsAncestorOf(node, range.endContainer));
      }
      function getRangeDocument(range) {
        return range.document || getDocument(range.startContainer);
      }
      function getRangeRoot(range) {
        return getRootContainer(range.startContainer);
      }
      function getBoundaryBeforeNode(node) {
        return new DomPosition(node.parentNode, getNodeIndex(node));
      }
      function getBoundaryAfterNode(node) {
        return new DomPosition(node.parentNode, getNodeIndex(node) + 1);
      }
      function insertNodeAtPosition(node, n, o) {
        var firstNodeInserted = node.nodeType == 11 ? node.firstChild : node;
        if (isCharacterDataNode(n)) {
          if (o == n.length) {
            dom.insertAfter(node, n);
          } else {
            n.parentNode.insertBefore(node, o == 0 ? n : splitDataNode(n, o));
          }
        } else if (o >= n.childNodes.length) {
          n.appendChild(node);
        } else {
          n.insertBefore(node, n.childNodes[o]);
        }
        return firstNodeInserted;
      }
      function rangesIntersect(rangeA, rangeB, touchingIsIntersecting) {
        assertRangeValid(rangeA);
        assertRangeValid(rangeB);
        if (getRangeDocument(rangeB) != getRangeDocument(rangeA)) {
          throw new DOMException("WRONG_DOCUMENT_ERR");
        }
        var startComparison = comparePoints(rangeA.startContainer, rangeA.startOffset, rangeB.endContainer, rangeB.endOffset),
          endComparison = comparePoints(rangeA.endContainer, rangeA.endOffset, rangeB.startContainer, rangeB.startOffset);
        return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
      }
      function cloneSubtree(iterator) {
        var partiallySelected;
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next();) {
          partiallySelected = iterator.isPartiallySelectedSubtree();
          node = node.cloneNode(!partiallySelected);
          if (partiallySelected) {
            subIterator = iterator.getSubtreeIterator();
            node.appendChild(cloneSubtree(subIterator));
            subIterator.detach();
          }
          if (node.nodeType == 10) {
            // DocumentType
            throw new DOMException("HIERARCHY_REQUEST_ERR");
          }
          frag.appendChild(node);
        }
        return frag;
      }
      function iterateSubtree(rangeIterator, func, iteratorState) {
        var it, n;
        iteratorState = iteratorState || {
          stop: false
        };
        for (var node, subRangeIterator; node = rangeIterator.next();) {
          if (rangeIterator.isPartiallySelectedSubtree()) {
            if (func(node) === false) {
              iteratorState.stop = true;
              return;
            } else {
              // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of
              // the node selected by the Range.
              subRangeIterator = rangeIterator.getSubtreeIterator();
              iterateSubtree(subRangeIterator, func, iteratorState);
              subRangeIterator.detach();
              if (iteratorState.stop) {
                return;
              }
            }
          } else {
            // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
            // descendants
            it = dom.createIterator(node);
            while (n = it.next()) {
              if (func(n) === false) {
                iteratorState.stop = true;
                return;
              }
            }
          }
        }
      }
      function deleteSubtree(iterator) {
        var subIterator;
        while (iterator.next()) {
          if (iterator.isPartiallySelectedSubtree()) {
            subIterator = iterator.getSubtreeIterator();
            deleteSubtree(subIterator);
            subIterator.detach();
          } else {
            iterator.remove();
          }
        }
      }
      function extractSubtree(iterator) {
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next();) {
          if (iterator.isPartiallySelectedSubtree()) {
            node = node.cloneNode(false);
            subIterator = iterator.getSubtreeIterator();
            node.appendChild(extractSubtree(subIterator));
            subIterator.detach();
          } else {
            iterator.remove();
          }
          if (node.nodeType == 10) {
            // DocumentType
            throw new DOMException("HIERARCHY_REQUEST_ERR");
          }
          frag.appendChild(node);
        }
        return frag;
      }
      function getNodesInRange(range, nodeTypes, filter) {
        var filterNodeTypes = !!(nodeTypes && nodeTypes.length),
          regex;
        var filterExists = !!filter;
        if (filterNodeTypes) {
          regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
        }
        var nodes = [];
        iterateSubtree(new RangeIterator(range, false), function (node) {
          if (filterNodeTypes && !regex.test(node.nodeType)) {
            return;
          }
          if (filterExists && !filter(node)) {
            return;
          }
          // Don't include a boundary container if it is a character data node and the range does not contain any
          // of its character data. See issue 190.
          var sc = range.startContainer;
          if (node == sc && isCharacterDataNode(sc) && range.startOffset == sc.length) {
            return;
          }
          var ec = range.endContainer;
          if (node == ec && isCharacterDataNode(ec) && range.endOffset == 0) {
            return;
          }
          nodes.push(node);
        });
        return nodes;
      }
      function inspect(range) {
        var name = typeof range.getName == "undefined" ? "Range" : range.getName();
        return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " + dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // RangeIterator code partially borrows from IERange by Tim Ryan (http://github.com/timcameronryan/IERange)

      function RangeIterator(range, clonePartiallySelectedTextNodes) {
        this.range = range;
        this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;
        if (!range.collapsed) {
          this.sc = range.startContainer;
          this.so = range.startOffset;
          this.ec = range.endContainer;
          this.eo = range.endOffset;
          var root = range.commonAncestorContainer;
          if (this.sc === this.ec && isCharacterDataNode(this.sc)) {
            this.isSingleCharacterDataNode = true;
            this._first = this._last = this._next = this.sc;
          } else {
            this._first = this._next = this.sc === root && !isCharacterDataNode(this.sc) ? this.sc.childNodes[this.so] : getClosestAncestorIn(this.sc, root, true);
            this._last = this.ec === root && !isCharacterDataNode(this.ec) ? this.ec.childNodes[this.eo - 1] : getClosestAncestorIn(this.ec, root, true);
          }
        }
      }
      RangeIterator.prototype = {
        _current: null,
        _next: null,
        _first: null,
        _last: null,
        isSingleCharacterDataNode: false,
        reset: function () {
          this._current = null;
          this._next = this._first;
        },
        hasNext: function () {
          return !!this._next;
        },
        next: function () {
          // Move to next node
          var current = this._current = this._next;
          if (current) {
            this._next = current !== this._last ? current.nextSibling : null;

            // Check for partially selected text nodes
            if (isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
              if (current === this.ec) {
                (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
              }
              if (this._current === this.sc) {
                (current = current.cloneNode(true)).deleteData(0, this.so);
              }
            }
          }
          return current;
        },
        remove: function () {
          var current = this._current,
            start,
            end;
          if (isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
            start = current === this.sc ? this.so : 0;
            end = current === this.ec ? this.eo : current.length;
            if (start != end) {
              current.deleteData(start, end - start);
            }
          } else {
            if (current.parentNode) {
              removeNode(current);
            } else {}
          }
        },
        // Checks if the current node is partially selected
        isPartiallySelectedSubtree: function () {
          var current = this._current;
          return isNonTextPartiallySelected(current, this.range);
        },
        getSubtreeIterator: function () {
          var subRange;
          if (this.isSingleCharacterDataNode) {
            subRange = this.range.cloneRange();
            subRange.collapse(false);
          } else {
            subRange = new Range(getRangeDocument(this.range));
            var current = this._current;
            var startContainer = current,
              startOffset = 0,
              endContainer = current,
              endOffset = getNodeLength(current);
            if (isOrIsAncestorOf(current, this.sc)) {
              startContainer = this.sc;
              startOffset = this.so;
            }
            if (isOrIsAncestorOf(current, this.ec)) {
              endContainer = this.ec;
              endOffset = this.eo;
            }
            updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
          }
          return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
        },
        detach: function () {
          this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
        }
      };

      /*----------------------------------------------------------------------------------------------------------------*/

      var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
      var rootContainerNodeTypes = [2, 9, 11];
      var readonlyNodeTypes = [5, 6, 10, 12];
      var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
      var surroundNodeTypes = [1, 3, 4, 5, 7, 8];
      function createAncestorFinder(nodeTypes) {
        return function (node, selfIsAncestor) {
          var t,
            n = selfIsAncestor ? node : node.parentNode;
          while (n) {
            t = n.nodeType;
            if (arrayContains(nodeTypes, t)) {
              return n;
            }
            n = n.parentNode;
          }
          return null;
        };
      }
      var getDocumentOrFragmentContainer = createAncestorFinder([9, 11]);
      var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
      var getDocTypeNotationEntityAncestor = createAncestorFinder([6, 10, 12]);
      var getElementAncestor = createAncestorFinder([1]);
      function assertNoDocTypeNotationEntityAncestor(node, allowSelf) {
        if (getDocTypeNotationEntityAncestor(node, allowSelf)) {
          throw new DOMException("INVALID_NODE_TYPE_ERR");
        }
      }
      function assertValidNodeType(node, invalidTypes) {
        if (!arrayContains(invalidTypes, node.nodeType)) {
          throw new DOMException("INVALID_NODE_TYPE_ERR");
        }
      }
      function assertValidOffset(node, offset) {
        if (offset < 0 || offset > (isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
          throw new DOMException("INDEX_SIZE_ERR");
        }
      }
      function assertSameDocumentOrFragment(node1, node2) {
        if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
          throw new DOMException("WRONG_DOCUMENT_ERR");
        }
      }
      function assertNodeNotReadOnly(node) {
        if (getReadonlyAncestor(node, true)) {
          throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
        }
      }
      function assertNode(node, codeName) {
        if (!node) {
          throw new DOMException(codeName);
        }
      }
      function isValidOffset(node, offset) {
        return offset <= (isCharacterDataNode(node) ? node.length : node.childNodes.length);
      }
      function isRangeValid(range) {
        return !!range.startContainer && !!range.endContainer && !(crashyTextNodes && (dom.isBrokenNode(range.startContainer) || dom.isBrokenNode(range.endContainer))) && getRootContainer(range.startContainer) == getRootContainer(range.endContainer) && isValidOffset(range.startContainer, range.startOffset) && isValidOffset(range.endContainer, range.endOffset);
      }
      function assertRangeValid(range) {
        if (!isRangeValid(range)) {
          throw new Error("Range error: Range is not valid. This usually happens after DOM mutation. Range: (" + range.inspect() + ")");
        }
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // Test the browser's innerHTML support to decide how to implement createContextualFragment
      var styleEl = document.createElement("style");
      var htmlParsingConforms = false;
      try {
        styleEl.innerHTML = "<b>x</b>";
        htmlParsingConforms = styleEl.firstChild.nodeType == 3; // Pre-Blink Opera incorrectly creates an element node
      } catch (e) {
        // IE 6 and 7 throw
      }
      api.features.htmlParsingConforms = htmlParsingConforms;
      var createContextualFragment = htmlParsingConforms ?
      // Implementation as per HTML parsing spec, trusting in the browser's implementation of innerHTML. See
      // discussion and base code for this implementation at issue 67.
      // Spec: http://html5.org/specs/dom-parsing.html#extensions-to-the-range-interface
      // Thanks to Aleks Williams.
      function (fragmentStr) {
        // "Let node the context object's start's node."
        var node = this.startContainer;
        var doc = getDocument(node);

        // "If the context object's start's node is null, raise an INVALID_STATE_ERR
        // exception and abort these steps."
        if (!node) {
          throw new DOMException("INVALID_STATE_ERR");
        }

        // "Let element be as follows, depending on node's interface:"
        // Document, Document Fragment: null
        var el = null;

        // "Element: node"
        if (node.nodeType == 1) {
          el = node;

          // "Text, Comment: node's parentElement"
        } else if (isCharacterDataNode(node)) {
          el = dom.parentElement(node);
        }

        // "If either element is null or element's ownerDocument is an HTML document
        // and element's local name is "html" and element's namespace is the HTML
        // namespace"
        if (el === null || el.nodeName == "HTML" && dom.isHtmlNamespace(getDocument(el).documentElement) && dom.isHtmlNamespace(el)) {
          // "let element be a new Element with "body" as its local name and the HTML
          // namespace as its namespace.""
          el = doc.createElement("body");
        } else {
          el = el.cloneNode(false);
        }

        // "If the node's document is an HTML document: Invoke the HTML fragment parsing algorithm."
        // "If the node's document is an XML document: Invoke the XML fragment parsing algorithm."
        // "In either case, the algorithm must be invoked with fragment as the input
        // and element as the context element."
        el.innerHTML = fragmentStr;

        // "If this raises an exception, then abort these steps. Otherwise, let new
        // children be the nodes returned."

        // "Let fragment be a new DocumentFragment."
        // "Append all new children to fragment."
        // "Return fragment."
        return dom.fragmentFromNodeChildren(el);
      } :
      // In this case, innerHTML cannot be trusted, so fall back to a simpler, non-conformant implementation that
      // previous versions of Rangy used (with the exception of using a body element rather than a div)
      function (fragmentStr) {
        var doc = getRangeDocument(this);
        var el = doc.createElement("body");
        el.innerHTML = fragmentStr;
        return dom.fragmentFromNodeChildren(el);
      };
      function splitRangeBoundaries(range, positionsToPreserve) {
        assertRangeValid(range);
        var sc = range.startContainer,
          so = range.startOffset,
          ec = range.endContainer,
          eo = range.endOffset;
        var startEndSame = sc === ec;
        if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
          splitDataNode(ec, eo, positionsToPreserve);
        }
        if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
          sc = splitDataNode(sc, so, positionsToPreserve);
          if (startEndSame) {
            eo -= so;
            ec = sc;
          } else if (ec == sc.parentNode && eo >= getNodeIndex(sc)) {
            eo++;
          }
          so = 0;
        }
        range.setStartAndEnd(sc, so, ec, eo);
      }
      function rangeToHtml(range) {
        assertRangeValid(range);
        var container = range.commonAncestorContainer.parentNode.cloneNode(false);
        container.appendChild(range.cloneContents());
        return container.innerHTML;
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"];
      var s2s = 0,
        s2e = 1,
        e2e = 2,
        e2s = 3;
      var n_b = 0,
        n_a = 1,
        n_b_a = 2,
        n_i = 3;
      util.extend(api.rangePrototype, {
        compareBoundaryPoints: function (how, range) {
          assertRangeValid(this);
          assertSameDocumentOrFragment(this.startContainer, range.startContainer);
          var nodeA, offsetA, nodeB, offsetB;
          var prefixA = how == e2s || how == s2s ? "start" : "end";
          var prefixB = how == s2e || how == s2s ? "start" : "end";
          nodeA = this[prefixA + "Container"];
          offsetA = this[prefixA + "Offset"];
          nodeB = range[prefixB + "Container"];
          offsetB = range[prefixB + "Offset"];
          return comparePoints(nodeA, offsetA, nodeB, offsetB);
        },
        insertNode: function (node) {
          assertRangeValid(this);
          assertValidNodeType(node, insertableNodeTypes);
          assertNodeNotReadOnly(this.startContainer);
          if (isOrIsAncestorOf(node, this.startContainer)) {
            throw new DOMException("HIERARCHY_REQUEST_ERR");
          }

          // No check for whether the container of the start of the Range is of a type that does not allow
          // children of the type of node: the browser's DOM implementation should do this for us when we attempt
          // to add the node

          var firstNodeInserted = insertNodeAtPosition(node, this.startContainer, this.startOffset);
          this.setStartBefore(firstNodeInserted);
        },
        cloneContents: function () {
          assertRangeValid(this);
          var clone, frag;
          if (this.collapsed) {
            return getRangeDocument(this).createDocumentFragment();
          } else {
            if (this.startContainer === this.endContainer && isCharacterDataNode(this.startContainer)) {
              clone = this.startContainer.cloneNode(true);
              clone.data = clone.data.slice(this.startOffset, this.endOffset);
              frag = getRangeDocument(this).createDocumentFragment();
              frag.appendChild(clone);
              return frag;
            } else {
              var iterator = new RangeIterator(this, true);
              clone = cloneSubtree(iterator);
              iterator.detach();
            }
            return clone;
          }
        },
        canSurroundContents: function () {
          assertRangeValid(this);
          assertNodeNotReadOnly(this.startContainer);
          assertNodeNotReadOnly(this.endContainer);

          // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
          // no non-text nodes.
          var iterator = new RangeIterator(this, true);
          var boundariesInvalid = iterator._first && isNonTextPartiallySelected(iterator._first, this) || iterator._last && isNonTextPartiallySelected(iterator._last, this);
          iterator.detach();
          return !boundariesInvalid;
        },
        surroundContents: function (node) {
          assertValidNodeType(node, surroundNodeTypes);
          if (!this.canSurroundContents()) {
            throw new DOMException("INVALID_STATE_ERR");
          }

          // Extract the contents
          var content = this.extractContents();

          // Clear the children of the node
          if (node.hasChildNodes()) {
            while (node.lastChild) {
              node.removeChild(node.lastChild);
            }
          }

          // Insert the new node and add the extracted contents
          insertNodeAtPosition(node, this.startContainer, this.startOffset);
          node.appendChild(content);
          this.selectNode(node);
        },
        cloneRange: function () {
          assertRangeValid(this);
          var range = new Range(getRangeDocument(this));
          var i = rangeProperties.length,
            prop;
          while (i--) {
            prop = rangeProperties[i];
            range[prop] = this[prop];
          }
          return range;
        },
        toString: function () {
          assertRangeValid(this);
          var sc = this.startContainer;
          if (sc === this.endContainer && isCharacterDataNode(sc)) {
            return sc.nodeType == 3 || sc.nodeType == 4 ? sc.data.slice(this.startOffset, this.endOffset) : "";
          } else {
            var textParts = [],
              iterator = new RangeIterator(this, true);
            iterateSubtree(iterator, function (node) {
              // Accept only text or CDATA nodes, not comments
              if (node.nodeType == 3 || node.nodeType == 4) {
                textParts.push(node.data);
              }
            });
            iterator.detach();
            return textParts.join("");
          }
        },
        // The methods below are all non-standard. The following batch were introduced by Mozilla but have since
        // been removed from Mozilla.

        compareNode: function (node) {
          assertRangeValid(this);
          var parent = node.parentNode;
          var nodeIndex = getNodeIndex(node);
          if (!parent) {
            throw new DOMException("NOT_FOUND_ERR");
          }
          var startComparison = this.comparePoint(parent, nodeIndex),
            endComparison = this.comparePoint(parent, nodeIndex + 1);
          if (startComparison < 0) {
            // Node starts before
            return endComparison > 0 ? n_b_a : n_b;
          } else {
            return endComparison > 0 ? n_a : n_i;
          }
        },
        comparePoint: function (node, offset) {
          assertRangeValid(this);
          assertNode(node, "HIERARCHY_REQUEST_ERR");
          assertSameDocumentOrFragment(node, this.startContainer);
          if (comparePoints(node, offset, this.startContainer, this.startOffset) < 0) {
            return -1;
          } else if (comparePoints(node, offset, this.endContainer, this.endOffset) > 0) {
            return 1;
          }
          return 0;
        },
        createContextualFragment: createContextualFragment,
        toHtml: function () {
          return rangeToHtml(this);
        },
        // touchingIsIntersecting determines whether this method considers a node that borders a range intersects
        // with it (as in WebKit) or not (as in Gecko pre-1.9, and the default)
        intersectsNode: function (node, touchingIsIntersecting) {
          assertRangeValid(this);
          if (getRootContainer(node) != getRangeRoot(this)) {
            return false;
          }
          var parent = node.parentNode,
            offset = getNodeIndex(node);
          if (!parent) {
            return true;
          }
          var startComparison = comparePoints(parent, offset, this.endContainer, this.endOffset),
            endComparison = comparePoints(parent, offset + 1, this.startContainer, this.startOffset);
          return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },
        isPointInRange: function (node, offset) {
          assertRangeValid(this);
          assertNode(node, "HIERARCHY_REQUEST_ERR");
          assertSameDocumentOrFragment(node, this.startContainer);
          return comparePoints(node, offset, this.startContainer, this.startOffset) >= 0 && comparePoints(node, offset, this.endContainer, this.endOffset) <= 0;
        },
        // The methods below are non-standard and invented by me.

        // Sharing a boundary start-to-end or end-to-start does not count as intersection.
        intersectsRange: function (range) {
          return rangesIntersect(this, range, false);
        },
        // Sharing a boundary start-to-end or end-to-start does count as intersection.
        intersectsOrTouchesRange: function (range) {
          return rangesIntersect(this, range, true);
        },
        intersection: function (range) {
          if (this.intersectsRange(range)) {
            var startComparison = comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset),
              endComparison = comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);
            var intersectionRange = this.cloneRange();
            if (startComparison == -1) {
              intersectionRange.setStart(range.startContainer, range.startOffset);
            }
            if (endComparison == 1) {
              intersectionRange.setEnd(range.endContainer, range.endOffset);
            }
            return intersectionRange;
          }
          return null;
        },
        union: function (range) {
          if (this.intersectsOrTouchesRange(range)) {
            var unionRange = this.cloneRange();
            if (comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
              unionRange.setStart(range.startContainer, range.startOffset);
            }
            if (comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
              unionRange.setEnd(range.endContainer, range.endOffset);
            }
            return unionRange;
          } else {
            throw new DOMException("Ranges do not intersect");
          }
        },
        containsNode: function (node, allowPartial) {
          if (allowPartial) {
            return this.intersectsNode(node, false);
          } else {
            return this.compareNode(node) == n_i;
          }
        },
        containsNodeContents: function (node) {
          return this.comparePoint(node, 0) >= 0 && this.comparePoint(node, getNodeLength(node)) <= 0;
        },
        containsRange: function (range) {
          var intersection = this.intersection(range);
          return intersection !== null && range.equals(intersection);
        },
        containsNodeText: function (node) {
          var nodeRange = this.cloneRange();
          nodeRange.selectNode(node);
          var textNodes = nodeRange.getNodes([3]);
          if (textNodes.length > 0) {
            nodeRange.setStart(textNodes[0], 0);
            var lastTextNode = textNodes.pop();
            nodeRange.setEnd(lastTextNode, lastTextNode.length);
            return this.containsRange(nodeRange);
          } else {
            return this.containsNodeContents(node);
          }
        },
        getNodes: function (nodeTypes, filter) {
          assertRangeValid(this);
          return getNodesInRange(this, nodeTypes, filter);
        },
        getDocument: function () {
          return getRangeDocument(this);
        },
        collapseBefore: function (node) {
          this.setEndBefore(node);
          this.collapse(false);
        },
        collapseAfter: function (node) {
          this.setStartAfter(node);
          this.collapse(true);
        },
        getBookmark: function (containerNode) {
          var doc = getRangeDocument(this);
          var preSelectionRange = api.createRange(doc);
          containerNode = containerNode || dom.getBody(doc);
          preSelectionRange.selectNodeContents(containerNode);
          var range = this.intersection(preSelectionRange);
          var start = 0,
            end = 0;
          if (range) {
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            start = preSelectionRange.toString().length;
            end = start + range.toString().length;
          }
          return {
            start: start,
            end: end,
            containerNode: containerNode
          };
        },
        moveToBookmark: function (bookmark) {
          var containerNode = bookmark.containerNode;
          var charIndex = 0;
          this.setStart(containerNode, 0);
          this.collapse(true);
          var nodeStack = [containerNode],
            node,
            foundStart = false,
            stop = false;
          var nextCharIndex, i, childNodes;
          while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
              nextCharIndex = charIndex + node.length;
              if (!foundStart && bookmark.start >= charIndex && bookmark.start <= nextCharIndex) {
                this.setStart(node, bookmark.start - charIndex);
                foundStart = true;
              }
              if (foundStart && bookmark.end >= charIndex && bookmark.end <= nextCharIndex) {
                this.setEnd(node, bookmark.end - charIndex);
                stop = true;
              }
              charIndex = nextCharIndex;
            } else {
              childNodes = node.childNodes;
              i = childNodes.length;
              while (i--) {
                nodeStack.push(childNodes[i]);
              }
            }
          }
        },
        getName: function () {
          return "DomRange";
        },
        equals: function (range) {
          return Range.rangesEqual(this, range);
        },
        isValid: function () {
          return isRangeValid(this);
        },
        inspect: function () {
          return inspect(this);
        },
        detach: function () {
          // In DOM4, detach() is now a no-op.
        }
      });
      function copyComparisonConstantsToObject(obj) {
        obj.START_TO_START = s2s;
        obj.START_TO_END = s2e;
        obj.END_TO_END = e2e;
        obj.END_TO_START = e2s;
        obj.NODE_BEFORE = n_b;
        obj.NODE_AFTER = n_a;
        obj.NODE_BEFORE_AND_AFTER = n_b_a;
        obj.NODE_INSIDE = n_i;
      }
      function copyComparisonConstants(constructor) {
        copyComparisonConstantsToObject(constructor);
        copyComparisonConstantsToObject(constructor.prototype);
      }
      function createRangeContentRemover(remover, boundaryUpdater) {
        return function () {
          assertRangeValid(this);
          var sc = this.startContainer,
            so = this.startOffset,
            root = this.commonAncestorContainer;
          var iterator = new RangeIterator(this, true);

          // Work out where to position the range after content removal
          var node, boundary;
          if (sc !== root) {
            node = getClosestAncestorIn(sc, root, true);
            boundary = getBoundaryAfterNode(node);
            sc = boundary.node;
            so = boundary.offset;
          }

          // Check none of the range is read-only
          iterateSubtree(iterator, assertNodeNotReadOnly);
          iterator.reset();

          // Remove the content
          var returnValue = remover(iterator);
          iterator.detach();

          // Move to the new position
          boundaryUpdater(this, sc, so, sc, so);
          return returnValue;
        };
      }
      function createPrototypeRange(constructor, boundaryUpdater) {
        function createBeforeAfterNodeSetter(isBefore, isStart) {
          return function (node) {
            assertValidNodeType(node, beforeAfterNodeTypes);
            assertValidNodeType(getRootContainer(node), rootContainerNodeTypes);
            var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node);
            (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
          };
        }
        function setRangeStart(range, node, offset) {
          var ec = range.endContainer,
            eo = range.endOffset;
          if (node !== range.startContainer || offset !== range.startOffset) {
            // Check the root containers of the range and the new boundary, and also check whether the new boundary
            // is after the current end. In either case, collapse the range to the new position
            if (getRootContainer(node) != getRootContainer(ec) || comparePoints(node, offset, ec, eo) == 1) {
              ec = node;
              eo = offset;
            }
            boundaryUpdater(range, node, offset, ec, eo);
          }
        }
        function setRangeEnd(range, node, offset) {
          var sc = range.startContainer,
            so = range.startOffset;
          if (node !== range.endContainer || offset !== range.endOffset) {
            // Check the root containers of the range and the new boundary, and also check whether the new boundary
            // is after the current end. In either case, collapse the range to the new position
            if (getRootContainer(node) != getRootContainer(sc) || comparePoints(node, offset, sc, so) == -1) {
              sc = node;
              so = offset;
            }
            boundaryUpdater(range, sc, so, node, offset);
          }
        }

        // Set up inheritance
        var F = function () {};
        F.prototype = api.rangePrototype;
        constructor.prototype = new F();
        util.extend(constructor.prototype, {
          setStart: function (node, offset) {
            assertNoDocTypeNotationEntityAncestor(node, true);
            assertValidOffset(node, offset);
            setRangeStart(this, node, offset);
          },
          setEnd: function (node, offset) {
            assertNoDocTypeNotationEntityAncestor(node, true);
            assertValidOffset(node, offset);
            setRangeEnd(this, node, offset);
          },
          /**
           * Convenience method to set a range's start and end boundaries. Overloaded as follows:
           * - Two parameters (node, offset) creates a collapsed range at that position
           * - Three parameters (node, startOffset, endOffset) creates a range contained with node starting at
           *   startOffset and ending at endOffset
           * - Four parameters (startNode, startOffset, endNode, endOffset) creates a range starting at startOffset in
           *   startNode and ending at endOffset in endNode
           */
          setStartAndEnd: function () {
            var args = arguments;
            var sc = args[0],
              so = args[1],
              ec = sc,
              eo = so;
            switch (args.length) {
              case 3:
                eo = args[2];
                break;
              case 4:
                ec = args[2];
                eo = args[3];
                break;
            }
            assertNoDocTypeNotationEntityAncestor(sc, true);
            assertValidOffset(sc, so);
            assertNoDocTypeNotationEntityAncestor(ec, true);
            assertValidOffset(ec, eo);
            boundaryUpdater(this, sc, so, ec, eo);
          },
          setBoundary: function (node, offset, isStart) {
            this["set" + (isStart ? "Start" : "End")](node, offset);
          },
          setStartBefore: createBeforeAfterNodeSetter(true, true),
          setStartAfter: createBeforeAfterNodeSetter(false, true),
          setEndBefore: createBeforeAfterNodeSetter(true, false),
          setEndAfter: createBeforeAfterNodeSetter(false, false),
          collapse: function (isStart) {
            assertRangeValid(this);
            if (isStart) {
              boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
            } else {
              boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
            }
          },
          selectNodeContents: function (node) {
            assertNoDocTypeNotationEntityAncestor(node, true);
            boundaryUpdater(this, node, 0, node, getNodeLength(node));
          },
          selectNode: function (node) {
            assertNoDocTypeNotationEntityAncestor(node, false);
            assertValidNodeType(node, beforeAfterNodeTypes);
            var start = getBoundaryBeforeNode(node),
              end = getBoundaryAfterNode(node);
            boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
          },
          extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),
          deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),
          canSurroundContents: function () {
            assertRangeValid(this);
            assertNodeNotReadOnly(this.startContainer);
            assertNodeNotReadOnly(this.endContainer);

            // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
            // no non-text nodes.
            var iterator = new RangeIterator(this, true);
            var boundariesInvalid = iterator._first && isNonTextPartiallySelected(iterator._first, this) || iterator._last && isNonTextPartiallySelected(iterator._last, this);
            iterator.detach();
            return !boundariesInvalid;
          },
          splitBoundaries: function () {
            splitRangeBoundaries(this);
          },
          splitBoundariesPreservingPositions: function (positionsToPreserve) {
            splitRangeBoundaries(this, positionsToPreserve);
          },
          normalizeBoundaries: function () {
            assertRangeValid(this);
            var sc = this.startContainer,
              so = this.startOffset,
              ec = this.endContainer,
              eo = this.endOffset;
            var mergeForward = function (node) {
              var sibling = node.nextSibling;
              if (sibling && sibling.nodeType == node.nodeType) {
                ec = node;
                eo = node.length;
                node.appendData(sibling.data);
                removeNode(sibling);
              }
            };
            var mergeBackward = function (node) {
              var sibling = node.previousSibling;
              if (sibling && sibling.nodeType == node.nodeType) {
                sc = node;
                var nodeLength = node.length;
                so = sibling.length;
                node.insertData(0, sibling.data);
                removeNode(sibling);
                if (sc == ec) {
                  eo += so;
                  ec = sc;
                } else if (ec == node.parentNode) {
                  var nodeIndex = getNodeIndex(node);
                  if (eo == nodeIndex) {
                    ec = node;
                    eo = nodeLength;
                  } else if (eo > nodeIndex) {
                    eo--;
                  }
                }
              }
            };
            var normalizeStart = true;
            var sibling;
            if (isCharacterDataNode(ec)) {
              if (eo == ec.length) {
                mergeForward(ec);
              } else if (eo == 0) {
                sibling = ec.previousSibling;
                if (sibling && sibling.nodeType == ec.nodeType) {
                  eo = sibling.length;
                  if (sc == ec) {
                    normalizeStart = false;
                  }
                  sibling.appendData(ec.data);
                  removeNode(ec);
                  ec = sibling;
                }
              }
            } else {
              if (eo > 0) {
                var endNode = ec.childNodes[eo - 1];
                if (endNode && isCharacterDataNode(endNode)) {
                  mergeForward(endNode);
                }
              }
              normalizeStart = !this.collapsed;
            }
            if (normalizeStart) {
              if (isCharacterDataNode(sc)) {
                if (so == 0) {
                  mergeBackward(sc);
                } else if (so == sc.length) {
                  sibling = sc.nextSibling;
                  if (sibling && sibling.nodeType == sc.nodeType) {
                    if (ec == sibling) {
                      ec = sc;
                      eo += sc.length;
                    }
                    sc.appendData(sibling.data);
                    removeNode(sibling);
                  }
                }
              } else {
                if (so < sc.childNodes.length) {
                  var startNode = sc.childNodes[so];
                  if (startNode && isCharacterDataNode(startNode)) {
                    mergeBackward(startNode);
                  }
                }
              }
            } else {
              sc = ec;
              so = eo;
            }
            boundaryUpdater(this, sc, so, ec, eo);
          },
          collapseToPoint: function (node, offset) {
            assertNoDocTypeNotationEntityAncestor(node, true);
            assertValidOffset(node, offset);
            this.setStartAndEnd(node, offset);
          },
          parentElement: function () {
            assertRangeValid(this);
            var parentNode = this.commonAncestorContainer;
            return parentNode ? getElementAncestor(this.commonAncestorContainer, true) : null;
          }
        });
        copyComparisonConstants(constructor);
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // Updates commonAncestorContainer and collapsed after boundary change
      function updateCollapsedAndCommonAncestor(range) {
        range.collapsed = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        range.commonAncestorContainer = range.collapsed ? range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
      }
      function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;
        range.document = dom.getDocument(startContainer);
        updateCollapsedAndCommonAncestor(range);
      }
      function Range(doc) {
        updateBoundaries(this, doc, 0, doc, 0);
      }
      createPrototypeRange(Range, updateBoundaries);
      util.extend(Range, {
        rangeProperties: rangeProperties,
        RangeIterator: RangeIterator,
        copyComparisonConstants: copyComparisonConstants,
        createPrototypeRange: createPrototypeRange,
        inspect: inspect,
        toHtml: rangeToHtml,
        getRangeDocument: getRangeDocument,
        rangesEqual: function (r1, r2) {
          return r1.startContainer === r2.startContainer && r1.startOffset === r2.startOffset && r1.endContainer === r2.endContainer && r1.endOffset === r2.endOffset;
        }
      });
      api.DomRange = Range;
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wrappers for the browser's native DOM Range and/or TextRange implementation
    api.createCoreModule("WrappedRange", ["DomRange"], function (api, module) {
      var WrappedRange, WrappedTextRange;
      var dom = api.dom;
      var util = api.util;
      var DomPosition = dom.DomPosition;
      var DomRange = api.DomRange;
      var getBody = dom.getBody;
      var getContentDocument = dom.getContentDocument;
      var isCharacterDataNode = dom.isCharacterDataNode;

      /*----------------------------------------------------------------------------------------------------------------*/

      if (api.features.implementsDomRange) {
        // This is a wrapper around the browser's native DOM Range. It has two aims:
        // - Provide workarounds for specific browser bugs
        // - provide convenient extensions, which are inherited from Rangy's DomRange

        (function () {
          var rangeProto;
          var rangeProperties = DomRange.rangeProperties;
          function updateRangeProperties(range) {
            var i = rangeProperties.length,
              prop;
            while (i--) {
              prop = rangeProperties[i];
              range[prop] = range.nativeRange[prop];
            }
            // Fix for broken collapsed property in IE 9.
            range.collapsed = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
          }
          function updateNativeRange(range, startContainer, startOffset, endContainer, endOffset) {
            var startMoved = range.startContainer !== startContainer || range.startOffset != startOffset;
            var endMoved = range.endContainer !== endContainer || range.endOffset != endOffset;
            var nativeRangeDifferent = !range.equals(range.nativeRange);

            // Always set both boundaries for the benefit of IE9 (see issue 35)
            if (startMoved || endMoved || nativeRangeDifferent) {
              range.setEnd(endContainer, endOffset);
              range.setStart(startContainer, startOffset);
            }
          }
          var createBeforeAfterNodeSetter;
          WrappedRange = function (range) {
            if (!range) {
              throw module.createError("WrappedRange: Range must be specified");
            }
            this.nativeRange = range;
            updateRangeProperties(this);
          };
          DomRange.createPrototypeRange(WrappedRange, updateNativeRange);
          rangeProto = WrappedRange.prototype;
          rangeProto.selectNode = function (node) {
            this.nativeRange.selectNode(node);
            updateRangeProperties(this);
          };
          rangeProto.cloneContents = function () {
            return this.nativeRange.cloneContents();
          };

          // Due to a long-standing Firefox bug that I have not been able to find a reliable way to detect,
          // insertNode() is never delegated to the native range.

          rangeProto.surroundContents = function (node) {
            this.nativeRange.surroundContents(node);
            updateRangeProperties(this);
          };
          rangeProto.collapse = function (isStart) {
            this.nativeRange.collapse(isStart);
            updateRangeProperties(this);
          };
          rangeProto.cloneRange = function () {
            return new WrappedRange(this.nativeRange.cloneRange());
          };
          rangeProto.refresh = function () {
            updateRangeProperties(this);
          };
          rangeProto.toString = function () {
            return this.nativeRange.toString();
          };

          // Create test range and node for feature detection

          var testTextNode = document.createTextNode("test");
          getBody(document).appendChild(testTextNode);
          var range = document.createRange();

          /*--------------------------------------------------------------------------------------------------------*/

          // Test for Firefox 2 bug that prevents moving the start of a Range to a point after its current end and
          // correct for it

          range.setStart(testTextNode, 0);
          range.setEnd(testTextNode, 0);
          try {
            range.setStart(testTextNode, 1);
            rangeProto.setStart = function (node, offset) {
              this.nativeRange.setStart(node, offset);
              updateRangeProperties(this);
            };
            rangeProto.setEnd = function (node, offset) {
              this.nativeRange.setEnd(node, offset);
              updateRangeProperties(this);
            };
            createBeforeAfterNodeSetter = function (name) {
              return function (node) {
                this.nativeRange[name](node);
                updateRangeProperties(this);
              };
            };
          } catch (ex) {
            rangeProto.setStart = function (node, offset) {
              try {
                this.nativeRange.setStart(node, offset);
              } catch (ex) {
                this.nativeRange.setEnd(node, offset);
                this.nativeRange.setStart(node, offset);
              }
              updateRangeProperties(this);
            };
            rangeProto.setEnd = function (node, offset) {
              try {
                this.nativeRange.setEnd(node, offset);
              } catch (ex) {
                this.nativeRange.setStart(node, offset);
                this.nativeRange.setEnd(node, offset);
              }
              updateRangeProperties(this);
            };
            createBeforeAfterNodeSetter = function (name, oppositeName) {
              return function (node) {
                try {
                  this.nativeRange[name](node);
                } catch (ex) {
                  this.nativeRange[oppositeName](node);
                  this.nativeRange[name](node);
                }
                updateRangeProperties(this);
              };
            };
          }
          rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
          rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
          rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
          rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");

          /*--------------------------------------------------------------------------------------------------------*/

          // Always use DOM4-compliant selectNodeContents implementation: it's simpler and less code than testing
          // whether the native implementation can be trusted
          rangeProto.selectNodeContents = function (node) {
            this.setStartAndEnd(node, 0, dom.getNodeLength(node));
          };

          /*--------------------------------------------------------------------------------------------------------*/

          // Test for and correct WebKit bug that has the behaviour of compareBoundaryPoints round the wrong way for
          // constants START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

          range.selectNodeContents(testTextNode);
          range.setEnd(testTextNode, 3);
          var range2 = document.createRange();
          range2.selectNodeContents(testTextNode);
          range2.setEnd(testTextNode, 4);
          range2.setStart(testTextNode, 2);
          if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 && range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
            // This is the wrong way round, so correct for it

            rangeProto.compareBoundaryPoints = function (type, range) {
              range = range.nativeRange || range;
              if (type == range.START_TO_END) {
                type = range.END_TO_START;
              } else if (type == range.END_TO_START) {
                type = range.START_TO_END;
              }
              return this.nativeRange.compareBoundaryPoints(type, range);
            };
          } else {
            rangeProto.compareBoundaryPoints = function (type, range) {
              return this.nativeRange.compareBoundaryPoints(type, range.nativeRange || range);
            };
          }

          /*--------------------------------------------------------------------------------------------------------*/

          // Test for IE deleteContents() and extractContents() bug and correct it. See issue 107.

          var el = document.createElement("div");
          el.innerHTML = "123";
          var textNode = el.firstChild;
          var body = getBody(document);
          body.appendChild(el);
          range.setStart(textNode, 1);
          range.setEnd(textNode, 2);
          range.deleteContents();
          if (textNode.data == "13") {
            // Behaviour is correct per DOM4 Range so wrap the browser's implementation of deleteContents() and
            // extractContents()
            rangeProto.deleteContents = function () {
              this.nativeRange.deleteContents();
              updateRangeProperties(this);
            };
            rangeProto.extractContents = function () {
              var frag = this.nativeRange.extractContents();
              updateRangeProperties(this);
              return frag;
            };
          } else {}
          body.removeChild(el);
          body = null;

          /*--------------------------------------------------------------------------------------------------------*/

          // Test for existence of createContextualFragment and delegate to it if it exists
          if (util.isHostMethod(range, "createContextualFragment")) {
            rangeProto.createContextualFragment = function (fragmentStr) {
              return this.nativeRange.createContextualFragment(fragmentStr);
            };
          }

          /*--------------------------------------------------------------------------------------------------------*/

          // Clean up
          getBody(document).removeChild(testTextNode);
          rangeProto.getName = function () {
            return "WrappedRange";
          };
          api.WrappedRange = WrappedRange;
          api.createNativeRange = function (doc) {
            doc = getContentDocument(doc, module, "createNativeRange");
            return doc.createRange();
          };
        })();
      }
      if (api.features.implementsTextRange) {
        /*
        This is a workaround for a bug where IE returns the wrong container element from the TextRange's parentElement()
        method. For example, in the following (where pipes denote the selection boundaries):
         <ul id="ul"><li id="a">| a </li><li id="b"> b |</li></ul>
         var range = document.selection.createRange();
        alert(range.parentElement().id); // Should alert "ul" but alerts "b"
         This method returns the common ancestor node of the following:
        - the parentElement() of the textRange
        - the parentElement() of the textRange after calling collapse(true)
        - the parentElement() of the textRange after calling collapse(false)
        */
        var getTextRangeContainerElement = function (textRange) {
          var parentEl = textRange.parentElement();
          var range = textRange.duplicate();
          range.collapse(true);
          var startEl = range.parentElement();
          range = textRange.duplicate();
          range.collapse(false);
          var endEl = range.parentElement();
          var startEndContainer = startEl == endEl ? startEl : dom.getCommonAncestor(startEl, endEl);
          return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
        };
        var textRangeIsCollapsed = function (textRange) {
          return textRange.compareEndPoints("StartToEnd", textRange) == 0;
        };

        // Gets the boundary of a TextRange expressed as a node and an offset within that node. This function started
        // out as an improved version of code found in Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/)
        // but has grown, fixing problems with line breaks in preformatted text, adding workaround for IE TextRange
        // bugs, handling for inputs and images, plus optimizations.
        var getTextRangeBoundaryPosition = function (textRange, wholeRangeContainerElement, isStart, isCollapsed, startInfo) {
          var workingRange = textRange.duplicate();
          workingRange.collapse(isStart);
          var containerElement = workingRange.parentElement();

          // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
          // check for that
          if (!dom.isOrIsAncestorOf(wholeRangeContainerElement, containerElement)) {
            containerElement = wholeRangeContainerElement;
          }

          // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
          // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
          if (!containerElement.canHaveHTML) {
            var pos = new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
            return {
              boundaryPosition: pos,
              nodeInfo: {
                nodeIndex: pos.offset,
                containerElement: pos.node
              }
            };
          }
          var workingNode = dom.getDocument(containerElement).createElement("span");

          // Workaround for HTML5 Shiv's insane violation of document.createElement(). See Rangy issue 104 and HTML5
          // Shiv issue 64: https://github.com/aFarkas/html5shiv/issues/64
          if (workingNode.parentNode) {
            dom.removeNode(workingNode);
          }
          var comparison,
            workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
          var previousNode, nextNode, boundaryPosition, boundaryNode;
          var start = startInfo && startInfo.containerElement == containerElement ? startInfo.nodeIndex : 0;
          var childNodeCount = containerElement.childNodes.length;
          var end = childNodeCount;

          // Check end first. Code within the loop assumes that the endth child node of the container is definitely
          // after the range boundary.
          var nodeIndex = end;
          while (true) {
            if (nodeIndex == childNodeCount) {
              containerElement.appendChild(workingNode);
            } else {
              containerElement.insertBefore(workingNode, containerElement.childNodes[nodeIndex]);
            }
            workingRange.moveToElementText(workingNode);
            comparison = workingRange.compareEndPoints(workingComparisonType, textRange);
            if (comparison == 0 || start == end) {
              break;
            } else if (comparison == -1) {
              if (end == start + 1) {
                // We know the endth child node is after the range boundary, so we must be done.
                break;
              } else {
                start = nodeIndex;
              }
            } else {
              end = end == start + 1 ? start : nodeIndex;
            }
            nodeIndex = Math.floor((start + end) / 2);
            containerElement.removeChild(workingNode);
          }

          // We've now reached or gone past the boundary of the text range we're interested in
          // so have identified the node we want
          boundaryNode = workingNode.nextSibling;
          if (comparison == -1 && boundaryNode && isCharacterDataNode(boundaryNode)) {
            // This is a character data node (text, comment, cdata). The working range is collapsed at the start of
            // the node containing the text range's boundary, so we move the end of the working range to the
            // boundary point and measure the length of its text to get the boundary's offset within the node.
            workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);
            var offset;
            if (/[\r\n]/.test(boundaryNode.data)) {
              /*
              For the particular case of a boundary within a text node containing rendered line breaks (within a
              <pre> element, for example), we need a slightly complicated approach to get the boundary's offset in
              IE. The facts:
               - Each line break is represented as \r in the text node's data/nodeValue properties
              - Each line break is represented as \r\n in the TextRange's 'text' property
              - The 'text' property of the TextRange does not contain trailing line breaks
               To get round the problem presented by the final fact above, we can use the fact that TextRange's
              moveStart() and moveEnd() methods return the actual number of characters moved, which is not
              necessarily the same as the number of characters it was instructed to move. The simplest approach is
              to use this to store the characters moved when moving both the start and end of the range to the
              start of the document body and subtracting the start offset from the end offset (the
              "move-negative-gazillion" method). However, this is extremely slow when the document is large and
              the range is near the end of it. Clearly doing the mirror image (i.e. moving the range boundaries to
              the end of the document) has the same problem.
               Another approach that works is to use moveStart() to move the start boundary of the range up to the
              end boundary one character at a time and incrementing a counter with the value returned by the
              moveStart() call. However, the check for whether the start boundary has reached the end boundary is
              expensive, so this method is slow (although unlike "move-negative-gazillion" is largely unaffected
              by the location of the range within the document).
               The approach used below is a hybrid of the two methods above. It uses the fact that a string
              containing the TextRange's 'text' property with each \r\n converted to a single \r character cannot
              be longer than the text of the TextRange, so the start of the range is moved that length initially
              and then a character at a time to make up for any trailing line breaks not contained in the 'text'
              property. This has good performance in most situations compared to the previous two methods.
              */
              var tempRange = workingRange.duplicate();
              var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;
              offset = tempRange.moveStart("character", rangeLength);
              while ((comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                offset++;
                tempRange.moveStart("character", 1);
              }
            } else {
              offset = workingRange.text.length;
            }
            boundaryPosition = new DomPosition(boundaryNode, offset);
          } else {
            // If the boundary immediately follows a character data node and this is the end boundary, we should favour
            // a position within that, and likewise for a start boundary preceding a character data node
            previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
            nextNode = (isCollapsed || isStart) && workingNode.nextSibling;
            if (nextNode && isCharacterDataNode(nextNode)) {
              boundaryPosition = new DomPosition(nextNode, 0);
            } else if (previousNode && isCharacterDataNode(previousNode)) {
              boundaryPosition = new DomPosition(previousNode, previousNode.data.length);
            } else {
              boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
          }

          // Clean up
          dom.removeNode(workingNode);
          return {
            boundaryPosition: boundaryPosition,
            nodeInfo: {
              nodeIndex: nodeIndex,
              containerElement: containerElement
            }
          };
        };

        // Returns a TextRange representing the boundary of a TextRange expressed as a node and an offset within that
        // node. This function started out as an optimized version of code found in Tim Cameron Ryan's IERange
        // (http://code.google.com/p/ierange/)
        var createBoundaryTextRange = function (boundaryPosition, isStart) {
          var boundaryNode,
            boundaryParent,
            boundaryOffset = boundaryPosition.offset;
          var doc = dom.getDocument(boundaryPosition.node);
          var workingNode,
            childNodes,
            workingRange = getBody(doc).createTextRange();
          var nodeIsDataNode = isCharacterDataNode(boundaryPosition.node);
          if (nodeIsDataNode) {
            boundaryNode = boundaryPosition.node;
            boundaryParent = boundaryNode.parentNode;
          } else {
            childNodes = boundaryPosition.node.childNodes;
            boundaryNode = boundaryOffset < childNodes.length ? childNodes[boundaryOffset] : null;
            boundaryParent = boundaryPosition.node;
          }

          // Position the range immediately before the node containing the boundary
          workingNode = doc.createElement("span");

          // Making the working element non-empty element persuades IE to consider the TextRange boundary to be within
          // the element rather than immediately before or after it
          workingNode.innerHTML = "&#feff;";

          // insertBefore is supposed to work like appendChild if the second parameter is null. However, a bug report
          // for IERange suggests that it can crash the browser: http://code.google.com/p/ierange/issues/detail?id=12
          if (boundaryNode) {
            boundaryParent.insertBefore(workingNode, boundaryNode);
          } else {
            boundaryParent.appendChild(workingNode);
          }
          workingRange.moveToElementText(workingNode);
          workingRange.collapse(!isStart);

          // Clean up
          boundaryParent.removeChild(workingNode);

          // Move the working range to the text offset, if required
          if (nodeIsDataNode) {
            workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
          }
          return workingRange;
        };

        /*------------------------------------------------------------------------------------------------------------*/

        // This is a wrapper around a TextRange, providing full DOM Range functionality using rangy's DomRange as a
        // prototype

        WrappedTextRange = function (textRange) {
          this.textRange = textRange;
          this.refresh();
        };
        WrappedTextRange.prototype = new DomRange(document);
        WrappedTextRange.prototype.refresh = function () {
          var start, end, startBoundary;

          // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
          var rangeContainerElement = getTextRangeContainerElement(this.textRange);
          if (textRangeIsCollapsed(this.textRange)) {
            end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, true).boundaryPosition;
          } else {
            startBoundary = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
            start = startBoundary.boundaryPosition;

            // An optimization used here is that if the start and end boundaries have the same parent element, the
            // search scope for the end boundary can be limited to exclude the portion of the element that precedes
            // the start boundary
            end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false, startBoundary.nodeInfo).boundaryPosition;
          }
          this.setStart(start.node, start.offset);
          this.setEnd(end.node, end.offset);
        };
        WrappedTextRange.prototype.getName = function () {
          return "WrappedTextRange";
        };
        DomRange.copyComparisonConstants(WrappedTextRange);
        var rangeToTextRange = function (range) {
          if (range.collapsed) {
            return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
          } else {
            var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
            var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
            var textRange = getBody(DomRange.getRangeDocument(range)).createTextRange();
            textRange.setEndPoint("StartToStart", startRange);
            textRange.setEndPoint("EndToEnd", endRange);
            return textRange;
          }
        };
        WrappedTextRange.rangeToTextRange = rangeToTextRange;
        WrappedTextRange.prototype.toTextRange = function () {
          return rangeToTextRange(this);
        };
        api.WrappedTextRange = WrappedTextRange;

        // IE 9 and above have both implementations and Rangy makes both available. The next few lines sets which
        // implementation to use by default.
        if (!api.features.implementsDomRange || api.config.preferTextRange) {
          // Add WrappedTextRange as the Range property of the global object to allow expression like Range.END_TO_END to work
          var globalObj = function (f) {
            return f("return this;")();
          }(Function);
          if (typeof globalObj.Range == "undefined") {
            globalObj.Range = WrappedTextRange;
          }
          api.createNativeRange = function (doc) {
            doc = getContentDocument(doc, module, "createNativeRange");
            return getBody(doc).createTextRange();
          };
          api.WrappedRange = WrappedTextRange;
        }
      }
      api.createRange = function (doc) {
        doc = getContentDocument(doc, module, "createRange");
        return new api.WrappedRange(api.createNativeRange(doc));
      };
      api.createRangyRange = function (doc) {
        doc = getContentDocument(doc, module, "createRangyRange");
        return new DomRange(doc);
      };
      util.createAliasForDeprecatedMethod(api, "createIframeRange", "createRange");
      util.createAliasForDeprecatedMethod(api, "createIframeRangyRange", "createRangyRange");
      api.addShimListener(function (win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
          doc.createRange = function () {
            return api.createRange(doc);
          };
        }
        doc = win = null;
      });
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    // This module creates a selection object wrapper that conforms as closely as possible to the Selection specification
    // in the W3C Selection API spec (https://www.w3.org/TR/selection-api)
    api.createCoreModule("WrappedSelection", ["DomRange", "WrappedRange"], function (api, module) {
      api.config.checkSelectionRanges = true;
      var BOOLEAN = "boolean";
      var NUMBER = "number";
      var dom = api.dom;
      var util = api.util;
      var isHostMethod = util.isHostMethod;
      var DomRange = api.DomRange;
      var WrappedRange = api.WrappedRange;
      var DOMException = api.DOMException;
      var DomPosition = dom.DomPosition;
      var getNativeSelection;
      var selectionIsCollapsed;
      var features = api.features;
      var CONTROL = "Control";
      var getDocument = dom.getDocument;
      var getBody = dom.getBody;
      var rangesEqual = DomRange.rangesEqual;

      // Utility function to support direction parameters in the API that may be a string ("backward", "backwards",
      // "forward" or "forwards") or a Boolean (true for backwards).
      function isDirectionBackward(dir) {
        return typeof dir == "string" ? /^backward(s)?$/i.test(dir) : !!dir;
      }
      function getWindow(win, methodName) {
        if (!win) {
          return window;
        } else if (dom.isWindow(win)) {
          return win;
        } else if (win instanceof WrappedSelection) {
          return win.win;
        } else {
          var doc = dom.getContentDocument(win, module, methodName);
          return dom.getWindow(doc);
        }
      }
      function getWinSelection(winParam) {
        return getWindow(winParam, "getWinSelection").getSelection();
      }
      function getDocSelection(winParam) {
        return getWindow(winParam, "getDocSelection").document.selection;
      }
      function winSelectionIsBackward(sel) {
        var backward = false;
        if (sel.anchorNode) {
          backward = dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1;
        }
        return backward;
      }

      // Test for the Range/TextRange and Selection features required
      // Test for ability to retrieve selection
      var implementsWinGetSelection = isHostMethod(window, "getSelection"),
        implementsDocSelection = util.isHostObject(document, "selection");
      features.implementsWinGetSelection = implementsWinGetSelection;
      features.implementsDocSelection = implementsDocSelection;
      var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);
      if (useDocumentSelection) {
        getNativeSelection = getDocSelection;
        api.isSelectionValid = function (winParam) {
          var doc = getWindow(winParam, "isSelectionValid").document,
            nativeSel = doc.selection;

          // Check whether the selection TextRange is actually contained within the correct document
          return nativeSel.type != "None" || getDocument(nativeSel.createRange().parentElement()) == doc;
        };
      } else if (implementsWinGetSelection) {
        getNativeSelection = getWinSelection;
        api.isSelectionValid = function () {
          return true;
        };
      } else {
        module.fail("Neither document.selection or window.getSelection() detected.");
        return false;
      }
      api.getNativeSelection = getNativeSelection;
      var testSelection = getNativeSelection();

      // In Firefox, the selection is null in an iframe with display: none. See issue #138.
      if (!testSelection) {
        module.fail("Native selection was null (possibly issue 138?)");
        return false;
      }
      var testRange = api.createNativeRange(document);
      var body = getBody(document);

      // Obtaining a range from a selection
      var selectionHasAnchorAndFocus = util.areHostProperties(testSelection, ["anchorNode", "focusNode", "anchorOffset", "focusOffset"]);
      features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;

      // Test for existence of native selection extend() method
      var selectionHasExtend = isHostMethod(testSelection, "extend");
      features.selectionHasExtend = selectionHasExtend;

      // Test for existence of native selection setBaseAndExtent() method
      var selectionHasSetBaseAndExtent = isHostMethod(testSelection, "setBaseAndExtent");
      features.selectionHasSetBaseAndExtent = selectionHasSetBaseAndExtent;

      // Test if rangeCount exists
      var selectionHasRangeCount = typeof testSelection.rangeCount == NUMBER;
      features.selectionHasRangeCount = selectionHasRangeCount;
      var selectionSupportsMultipleRanges = false;
      var collapsedNonEditableSelectionsSupported = true;
      var addRangeBackwardToNative = selectionHasExtend ? function (nativeSelection, range) {
        var doc = DomRange.getRangeDocument(range);
        var endRange = api.createRange(doc);
        endRange.collapseToPoint(range.endContainer, range.endOffset);
        nativeSelection.addRange(getNativeRange(endRange));
        nativeSelection.extend(range.startContainer, range.startOffset);
      } : null;
      if (util.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) && typeof testSelection.rangeCount == NUMBER && features.implementsDomRange) {
        (function () {
          // Previously an iframe was used but this caused problems in some circumstances in IE, so tests are
          // performed on the current document's selection. See issue 109.

          // Note also that if a selection previously existed, it is wiped and later restored by these tests. This
          // will result in the selection direction being reversed if the original selection was backwards and the
          // browser does not support setting backwards selections (Internet Explorer, I'm looking at you).
          var sel = window.getSelection();
          if (sel) {
            // Store the current selection
            var originalSelectionRangeCount = sel.rangeCount;
            var selectionHasMultipleRanges = originalSelectionRangeCount > 1;
            var originalSelectionRanges = [];
            var originalSelectionBackward = winSelectionIsBackward(sel);
            for (var i = 0; i < originalSelectionRangeCount; ++i) {
              originalSelectionRanges[i] = sel.getRangeAt(i);
            }

            // Create some test elements
            var testEl = dom.createTestElement(document, "", false);
            var textNode = testEl.appendChild(document.createTextNode("\u00a0\u00a0\u00a0"));

            // Test whether the native selection will allow a collapsed selection within a non-editable element
            var r1 = document.createRange();
            r1.setStart(textNode, 1);
            r1.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r1);
            collapsedNonEditableSelectionsSupported = sel.rangeCount == 1;
            sel.removeAllRanges();

            // Test whether the native selection is capable of supporting multiple ranges.
            if (!selectionHasMultipleRanges) {
              // Doing the original feature test here in Chrome 36 (and presumably later versions) prints a
              // console error of "Discontiguous selection is not supported." that cannot be suppressed. There's
              // nothing we can do about this while retaining the feature test so we have to resort to a browser
              // sniff. I'm not happy about it. See
              // https://code.google.com/p/chromium/issues/detail?id=399791
              var chromeMatch = window.navigator.appVersion.match(/Chrome\/(.*?) /);
              if (chromeMatch && parseInt(chromeMatch[1]) >= 36) {
                selectionSupportsMultipleRanges = false;
              } else {
                var r2 = r1.cloneRange();
                r1.setStart(textNode, 0);
                r2.setEnd(textNode, 3);
                r2.setStart(textNode, 2);
                sel.addRange(r1);
                sel.addRange(r2);
                selectionSupportsMultipleRanges = sel.rangeCount == 2;
              }
            }

            // Clean up
            dom.removeNode(testEl);
            sel.removeAllRanges();
            for (i = 0; i < originalSelectionRangeCount; ++i) {
              if (i == 0 && originalSelectionBackward) {
                if (addRangeBackwardToNative) {
                  addRangeBackwardToNative(sel, originalSelectionRanges[i]);
                } else {
                  api.warn("Rangy initialization: original selection was backwards but selection has been restored forwards because the browser does not support Selection.extend");
                  sel.addRange(originalSelectionRanges[i]);
                }
              } else {
                sel.addRange(originalSelectionRanges[i]);
              }
            }
          }
        })();
      }
      features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
      features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;

      // ControlRanges
      var implementsControlRange = false,
        testControlRange;
      if (body && isHostMethod(body, "createControlRange")) {
        testControlRange = body.createControlRange();
        if (util.areHostProperties(testControlRange, ["item", "add"])) {
          implementsControlRange = true;
        }
      }
      features.implementsControlRange = implementsControlRange;

      // Selection collapsedness
      if (selectionHasAnchorAndFocus) {
        selectionIsCollapsed = function (sel) {
          return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
        };
      } else {
        selectionIsCollapsed = function (sel) {
          return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
        };
      }
      function updateAnchorAndFocusFromRange(sel, range, backward) {
        var anchorPrefix = backward ? "end" : "start",
          focusPrefix = backward ? "start" : "end";
        sel.anchorNode = range[anchorPrefix + "Container"];
        sel.anchorOffset = range[anchorPrefix + "Offset"];
        sel.focusNode = range[focusPrefix + "Container"];
        sel.focusOffset = range[focusPrefix + "Offset"];
      }
      function updateAnchorAndFocusFromNativeSelection(sel) {
        var nativeSel = sel.nativeSelection;
        sel.anchorNode = nativeSel.anchorNode;
        sel.anchorOffset = nativeSel.anchorOffset;
        sel.focusNode = nativeSel.focusNode;
        sel.focusOffset = nativeSel.focusOffset;
      }
      function updateEmptySelection(sel) {
        sel.anchorNode = sel.focusNode = null;
        sel.anchorOffset = sel.focusOffset = 0;
        sel.rangeCount = 0;
        sel.isCollapsed = true;
        sel._ranges.length = 0;
        updateType(sel);
      }
      function updateType(sel) {
        sel.type = sel.rangeCount == 0 ? "None" : selectionIsCollapsed(sel) ? "Caret" : "Range";
      }
      function getNativeRange(range) {
        var nativeRange;
        if (range instanceof DomRange) {
          nativeRange = api.createNativeRange(range.getDocument());
          nativeRange.setEnd(range.endContainer, range.endOffset);
          nativeRange.setStart(range.startContainer, range.startOffset);
        } else if (range instanceof WrappedRange) {
          nativeRange = range.nativeRange;
        } else if (features.implementsDomRange && range instanceof dom.getWindow(range.startContainer).Range) {
          nativeRange = range;
        }
        return nativeRange;
      }
      function rangeContainsSingleElement(rangeNodes) {
        if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
          return false;
        }
        for (var i = 1, len = rangeNodes.length; i < len; ++i) {
          if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
            return false;
          }
        }
        return true;
      }
      function getSingleElementFromRange(range) {
        var nodes = range.getNodes();
        if (!rangeContainsSingleElement(nodes)) {
          throw module.createError("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
      }

      // Simple, quick test which only needs to distinguish between a TextRange and a ControlRange
      function isTextRange(range) {
        return !!range && typeof range.text != "undefined";
      }
      function updateFromTextRange(sel, range) {
        // Create a Range from the selected TextRange
        var wrappedRange = new WrappedRange(range);
        sel._ranges = [wrappedRange];
        updateAnchorAndFocusFromRange(sel, wrappedRange, false);
        sel.rangeCount = 1;
        sel.isCollapsed = wrappedRange.collapsed;
        updateType(sel);
      }
      function updateControlSelection(sel) {
        // Update the wrapped selection based on what's now in the native selection
        sel._ranges.length = 0;
        if (sel.docSelection.type == "None") {
          updateEmptySelection(sel);
        } else {
          var controlRange = sel.docSelection.createRange();
          if (isTextRange(controlRange)) {
            // This case (where the selection type is "Control" and calling createRange() on the selection returns
            // a TextRange) can happen in IE 9. It happens, for example, when all elements in the selected
            // ControlRange have been removed from the ControlRange and removed from the document.
            updateFromTextRange(sel, controlRange);
          } else {
            sel.rangeCount = controlRange.length;
            var range,
              doc = getDocument(controlRange.item(0));
            for (var i = 0; i < sel.rangeCount; ++i) {
              range = api.createRange(doc);
              range.selectNode(controlRange.item(i));
              sel._ranges.push(range);
            }
            sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
            updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            updateType(sel);
          }
        }
      }
      function addRangeToControlSelection(sel, range) {
        var controlRange = sel.docSelection.createRange();
        var rangeElement = getSingleElementFromRange(range);

        // Create a new ControlRange containing all the elements in the selected ControlRange plus the element
        // contained by the supplied range
        var doc = getDocument(controlRange.item(0));
        var newControlRange = getBody(doc).createControlRange();
        for (var i = 0, len = controlRange.length; i < len; ++i) {
          newControlRange.add(controlRange.item(i));
        }
        try {
          newControlRange.add(rangeElement);
        } catch (ex) {
          throw module.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
      }
      var getSelectionRangeAt;
      if (isHostMethod(testSelection, "getRangeAt")) {
        // try/catch is present because getRangeAt() must have thrown an error in some browser and some situation.
        // Unfortunately, I didn't write a comment about the specifics and am now scared to take it out. Let that be a
        // lesson to us all, especially me.
        getSelectionRangeAt = function (sel, index) {
          try {
            return sel.getRangeAt(index);
          } catch (ex) {
            return null;
          }
        };
      } else if (selectionHasAnchorAndFocus) {
        getSelectionRangeAt = function (sel) {
          var doc = getDocument(sel.anchorNode);
          var range = api.createRange(doc);
          range.setStartAndEnd(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset);

          // Handle the case when the selection was selected backwards (from the end to the start in the
          // document)
          if (range.collapsed !== this.isCollapsed) {
            range.setStartAndEnd(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset);
          }
          return range;
        };
      }
      function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
      }
      WrappedSelection.prototype = api.selectionPrototype;
      function deleteProperties(sel) {
        sel.win = sel.anchorNode = sel.focusNode = sel._ranges = null;
        sel.rangeCount = sel.anchorOffset = sel.focusOffset = 0;
        sel.detached = true;
        updateType(sel);
      }
      var cachedRangySelections = [];
      function actOnCachedSelection(win, action) {
        var i = cachedRangySelections.length,
          cached,
          sel;
        while (i--) {
          cached = cachedRangySelections[i];
          sel = cached.selection;
          if (action == "deleteAll") {
            deleteProperties(sel);
          } else if (cached.win == win) {
            if (action == "delete") {
              cachedRangySelections.splice(i, 1);
              return true;
            } else {
              return sel;
            }
          }
        }
        if (action == "deleteAll") {
          cachedRangySelections.length = 0;
        }
        return null;
      }
      var getSelection = function (win) {
        // Check if the parameter is a Rangy Selection object
        if (win && win instanceof WrappedSelection) {
          win.refresh();
          return win;
        }
        win = getWindow(win, "getNativeSelection");
        var sel = actOnCachedSelection(win);
        var nativeSel = getNativeSelection(win),
          docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
          sel.nativeSelection = nativeSel;
          sel.docSelection = docSel;
          sel.refresh();
        } else {
          sel = new WrappedSelection(nativeSel, docSel, win);
          cachedRangySelections.push({
            win: win,
            selection: sel
          });
        }
        return sel;
      };
      api.getSelection = getSelection;
      util.createAliasForDeprecatedMethod(api, "getIframeSelection", "getSelection");
      var selProto = WrappedSelection.prototype;
      function createControlSelection(sel, ranges) {
        // Ensure that the selection becomes of type "Control"
        var doc = getDocument(ranges[0].startContainer);
        var controlRange = getBody(doc).createControlRange();
        for (var i = 0, el, len = ranges.length; i < len; ++i) {
          el = getSingleElementFromRange(ranges[i]);
          try {
            controlRange.add(el);
          } catch (ex) {
            throw module.createError("setRanges(): Element within one of the specified Ranges could not be added to control selection (does it have layout?)");
          }
        }
        controlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
      }

      // Selecting a range
      if (!useDocumentSelection && selectionHasAnchorAndFocus && util.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
        selProto.removeAllRanges = function () {
          this.nativeSelection.removeAllRanges();
          updateEmptySelection(this);
        };
        var addRangeBackward = function (sel, range) {
          addRangeBackwardToNative(sel.nativeSelection, range);
          sel.refresh();
        };
        if (selectionHasRangeCount) {
          selProto.addRange = function (range, direction) {
            if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
              addRangeToControlSelection(this, range);
            } else {
              if (isDirectionBackward(direction) && selectionHasExtend) {
                addRangeBackward(this, range);
              } else {
                var previousRangeCount;
                if (selectionSupportsMultipleRanges) {
                  previousRangeCount = this.rangeCount;
                } else {
                  this.removeAllRanges();
                  previousRangeCount = 0;
                }
                // Clone the native range so that changing the selected range does not affect the selection.
                // This is contrary to the spec but is the only way to achieve consistency between browsers. See
                // issue 80.
                var clonedNativeRange = getNativeRange(range).cloneRange();
                try {
                  this.nativeSelection.addRange(clonedNativeRange);
                } catch (ex) {}

                // Check whether adding the range was successful
                this.rangeCount = this.nativeSelection.rangeCount;
                if (this.rangeCount == previousRangeCount + 1) {
                  // The range was added successfully

                  // Check whether the range that we added to the selection is reflected in the last range extracted from
                  // the selection
                  if (api.config.checkSelectionRanges) {
                    var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                    if (nativeRange && !rangesEqual(nativeRange, range)) {
                      // Happens in WebKit with, for example, a selection placed at the start of a text node
                      range = new WrappedRange(nativeRange);
                    }
                  }
                  this._ranges[this.rangeCount - 1] = range;
                  updateAnchorAndFocusFromRange(this, range, selectionIsBackward(this.nativeSelection));
                  this.isCollapsed = selectionIsCollapsed(this);
                  updateType(this);
                } else {
                  // The range was not added successfully. The simplest thing is to refresh
                  this.refresh();
                }
              }
            }
          };
        } else {
          selProto.addRange = function (range, direction) {
            if (isDirectionBackward(direction) && selectionHasExtend) {
              addRangeBackward(this, range);
            } else {
              this.nativeSelection.addRange(getNativeRange(range));
              this.refresh();
            }
          };
        }
        selProto.setRanges = function (ranges) {
          if (implementsControlRange && implementsDocSelection && ranges.length > 1) {
            createControlSelection(this, ranges);
          } else {
            this.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
              this.addRange(ranges[i]);
            }
          }
        };
      } else if (isHostMethod(testSelection, "empty") && isHostMethod(testRange, "select") && implementsControlRange && useDocumentSelection) {
        selProto.removeAllRanges = function () {
          // Added try/catch as fix for issue #21
          try {
            this.docSelection.empty();

            // Check for empty() not working (issue #24)
            if (this.docSelection.type != "None") {
              // Work around failure to empty a control selection by instead selecting a TextRange and then
              // calling empty()
              var doc;
              if (this.anchorNode) {
                doc = getDocument(this.anchorNode);
              } else if (this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                if (controlRange.length) {
                  doc = getDocument(controlRange.item(0));
                }
              }
              if (doc) {
                var textRange = getBody(doc).createTextRange();
                textRange.select();
                this.docSelection.empty();
              }
            }
          } catch (ex) {}
          updateEmptySelection(this);
        };
        selProto.addRange = function (range) {
          if (this.docSelection.type == CONTROL) {
            addRangeToControlSelection(this, range);
          } else {
            api.WrappedTextRange.rangeToTextRange(range).select();
            this._ranges[0] = range;
            this.rangeCount = 1;
            this.isCollapsed = this._ranges[0].collapsed;
            updateAnchorAndFocusFromRange(this, range, false);
            updateType(this);
          }
        };
        selProto.setRanges = function (ranges) {
          this.removeAllRanges();
          var rangeCount = ranges.length;
          if (rangeCount > 1) {
            createControlSelection(this, ranges);
          } else if (rangeCount) {
            this.addRange(ranges[0]);
          }
        };
      } else {
        module.fail("No means of selecting a Range or TextRange was found");
        return false;
      }
      selProto.getRangeAt = function (index) {
        if (index < 0 || index >= this.rangeCount) {
          throw new DOMException("INDEX_SIZE_ERR");
        } else {
          // Clone the range to preserve selection-range independence. See issue 80.
          return this._ranges[index].cloneRange();
        }
      };
      var refreshSelection;
      if (useDocumentSelection) {
        refreshSelection = function (sel) {
          var range;
          if (api.isSelectionValid(sel.win)) {
            range = sel.docSelection.createRange();
          } else {
            range = getBody(sel.win.document).createTextRange();
            range.collapse(true);
          }
          if (sel.docSelection.type == CONTROL) {
            updateControlSelection(sel);
          } else if (isTextRange(range)) {
            updateFromTextRange(sel, range);
          } else {
            updateEmptySelection(sel);
          }
        };
      } else if (isHostMethod(testSelection, "getRangeAt") && typeof testSelection.rangeCount == NUMBER) {
        refreshSelection = function (sel) {
          if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
            updateControlSelection(sel);
          } else {
            sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
            if (sel.rangeCount) {
              for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                sel._ranges[i] = new api.WrappedRange(sel.nativeSelection.getRangeAt(i));
              }
              updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackward(sel.nativeSelection));
              sel.isCollapsed = selectionIsCollapsed(sel);
              updateType(sel);
            } else {
              updateEmptySelection(sel);
            }
          }
        };
      } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && features.implementsDomRange) {
        refreshSelection = function (sel) {
          var range,
            nativeSel = sel.nativeSelection;
          if (nativeSel.anchorNode) {
            range = getSelectionRangeAt(nativeSel, 0);
            sel._ranges = [range];
            sel.rangeCount = 1;
            updateAnchorAndFocusFromNativeSelection(sel);
            sel.isCollapsed = selectionIsCollapsed(sel);
            updateType(sel);
          } else {
            updateEmptySelection(sel);
          }
        };
      } else {
        module.fail("No means of obtaining a Range or TextRange from the user's selection was found");
        return false;
      }
      selProto.refresh = function (checkForChanges) {
        var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
        var oldAnchorNode = this.anchorNode,
          oldAnchorOffset = this.anchorOffset;
        refreshSelection(this);
        if (checkForChanges) {
          // Check the range count first
          var i = oldRanges.length;
          if (i != this._ranges.length) {
            return true;
          }

          // Now check the direction. Checking the anchor position is the same is enough since we're checking all the
          // ranges after this
          if (this.anchorNode != oldAnchorNode || this.anchorOffset != oldAnchorOffset) {
            return true;
          }

          // Finally, compare each range in turn
          while (i--) {
            if (!rangesEqual(oldRanges[i], this._ranges[i])) {
              return true;
            }
          }
          return false;
        }
      };

      // Removal of a single range
      var removeRangeManually = function (sel, range) {
        var ranges = sel.getAllRanges();
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length; i < len; ++i) {
          if (!rangesEqual(range, ranges[i])) {
            sel.addRange(ranges[i]);
          }
        }
        if (!sel.rangeCount) {
          updateEmptySelection(sel);
        }
      };
      if (implementsControlRange && implementsDocSelection) {
        selProto.removeRange = function (range) {
          if (this.docSelection.type == CONTROL) {
            var controlRange = this.docSelection.createRange();
            var rangeElement = getSingleElementFromRange(range);

            // Create a new ControlRange containing all the elements in the selected ControlRange minus the
            // element contained by the supplied range
            var doc = getDocument(controlRange.item(0));
            var newControlRange = getBody(doc).createControlRange();
            var el,
              removed = false;
            for (var i = 0, len = controlRange.length; i < len; ++i) {
              el = controlRange.item(i);
              if (el !== rangeElement || removed) {
                newControlRange.add(controlRange.item(i));
              } else {
                removed = true;
              }
            }
            newControlRange.select();

            // Update the wrapped selection based on what's now in the native selection
            updateControlSelection(this);
          } else {
            removeRangeManually(this, range);
          }
        };
      } else {
        selProto.removeRange = function (range) {
          removeRangeManually(this, range);
        };
      }

      // Detecting if a selection is backward
      var selectionIsBackward;
      if (!useDocumentSelection && selectionHasAnchorAndFocus && features.implementsDomRange) {
        selectionIsBackward = winSelectionIsBackward;
        selProto.isBackward = function () {
          return selectionIsBackward(this);
        };
      } else {
        selectionIsBackward = selProto.isBackward = function () {
          return false;
        };
      }

      // Create an alias for backwards compatibility. From 1.3, everything is "backward" rather than "backwards"
      selProto.isBackwards = selProto.isBackward;

      // Selection stringifier
      // This is conformant to the old HTML5 selections draft spec but differs from WebKit and Mozilla's implementation.
      // The current spec does not yet define this method.
      selProto.toString = function () {
        var rangeTexts = [];
        for (var i = 0, len = this.rangeCount; i < len; ++i) {
          rangeTexts[i] = "" + this._ranges[i];
        }
        return rangeTexts.join("");
      };
      function assertNodeInSameDocument(sel, node) {
        if (sel.win.document != getDocument(node)) {
          throw new DOMException("WRONG_DOCUMENT_ERR");
        }
      }
      function assertValidOffset(node, offset) {
        if (offset < 0 || offset > (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
          throw new DOMException("INDEX_SIZE_ERR");
        }
      }

      // No current browser conforms fully to the spec for this method, so Rangy's own method is always used
      selProto.collapse = function (node, offset) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(node);
        range.collapseToPoint(node, offset);
        this.setSingleRange(range);
        this.isCollapsed = true;
      };
      selProto.collapseToStart = function () {
        if (this.rangeCount) {
          var range = this._ranges[0];
          this.collapse(range.startContainer, range.startOffset);
        } else {
          throw new DOMException("INVALID_STATE_ERR");
        }
      };
      selProto.collapseToEnd = function () {
        if (this.rangeCount) {
          var range = this._ranges[this.rangeCount - 1];
          this.collapse(range.endContainer, range.endOffset);
        } else {
          throw new DOMException("INVALID_STATE_ERR");
        }
      };

      // The spec is very specific on how selectAllChildren should be implemented and not all browsers implement it as
      // specified so the native implementation is never used by Rangy.
      selProto.selectAllChildren = function (node) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(node);
        range.selectNodeContents(node);
        this.setSingleRange(range);
      };
      if (selectionHasSetBaseAndExtent) {
        selProto.setBaseAndExtent = function (anchorNode, anchorOffset, focusNode, focusOffset) {
          this.nativeSelection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
          this.refresh();
        };
      } else if (selectionHasExtend) {
        selProto.setBaseAndExtent = function (anchorNode, anchorOffset, focusNode, focusOffset) {
          assertValidOffset(anchorNode, anchorOffset);
          assertValidOffset(focusNode, focusOffset);
          assertNodeInSameDocument(this, anchorNode);
          assertNodeInSameDocument(this, focusNode);
          var range = api.createRange(node);
          var isBackwards = dom.comparePoints(anchorNode, anchorOffset, focusNode, focusOffset) == -1;
          if (isBackwards) {
            range.setStartAndEnd(focusNode, focusOffset, anchorNode, anchorOffset);
          } else {
            range.setStartAndEnd(anchorNode, anchorOffset, focusNode, focusOffset);
          }
          this.setSingleRange(range, isBackwards);
        };
      }
      selProto.deleteFromDocument = function () {
        // Sepcial behaviour required for IE's control selections
        if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
          var controlRange = this.docSelection.createRange();
          var element;
          while (controlRange.length) {
            element = controlRange.item(0);
            controlRange.remove(element);
            dom.removeNode(element);
          }
          this.refresh();
        } else if (this.rangeCount) {
          var ranges = this.getAllRanges();
          if (ranges.length) {
            this.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
              ranges[i].deleteContents();
            }
            // The spec says nothing about what the selection should contain after calling deleteContents on each
            // range. Firefox moves the selection to where the final selected range was, so we emulate that
            this.addRange(ranges[len - 1]);
          }
        }
      };

      // The following are non-standard extensions
      selProto.eachRange = function (func, returnValue) {
        for (var i = 0, len = this._ranges.length; i < len; ++i) {
          if (func(this.getRangeAt(i))) {
            return returnValue;
          }
        }
      };
      selProto.getAllRanges = function () {
        var ranges = [];
        this.eachRange(function (range) {
          ranges.push(range);
        });
        return ranges;
      };
      selProto.setSingleRange = function (range, direction) {
        this.removeAllRanges();
        this.addRange(range, direction);
      };
      selProto.callMethodOnEachRange = function (methodName, params) {
        var results = [];
        this.eachRange(function (range) {
          results.push(range[methodName].apply(range, params || []));
        });
        return results;
      };
      function createStartOrEndSetter(isStart) {
        return function (node, offset) {
          var range;
          if (this.rangeCount) {
            range = this.getRangeAt(0);
            range["set" + (isStart ? "Start" : "End")](node, offset);
          } else {
            range = api.createRange(this.win.document);
            range.setStartAndEnd(node, offset);
          }
          this.setSingleRange(range, this.isBackward());
        };
      }
      selProto.setStart = createStartOrEndSetter(true);
      selProto.setEnd = createStartOrEndSetter(false);

      // Add select() method to Range prototype. Any existing selection will be removed.
      api.rangePrototype.select = function (direction) {
        getSelection(this.getDocument()).setSingleRange(this, direction);
      };
      selProto.changeEachRange = function (func) {
        var ranges = [];
        var backward = this.isBackward();
        this.eachRange(function (range) {
          func(range);
          ranges.push(range);
        });
        this.removeAllRanges();
        if (backward && ranges.length == 1) {
          this.addRange(ranges[0], "backward");
        } else {
          this.setRanges(ranges);
        }
      };
      selProto.containsNode = function (node, allowPartial) {
        return this.eachRange(function (range) {
          return range.containsNode(node, allowPartial);
        }, true) || false;
      };
      selProto.getBookmark = function (containerNode) {
        return {
          backward: this.isBackward(),
          rangeBookmarks: this.callMethodOnEachRange("getBookmark", [containerNode])
        };
      };
      selProto.moveToBookmark = function (bookmark) {
        var selRanges = [];
        for (var i = 0, rangeBookmark, range; rangeBookmark = bookmark.rangeBookmarks[i++];) {
          range = api.createRange(this.win);
          range.moveToBookmark(rangeBookmark);
          selRanges.push(range);
        }
        if (bookmark.backward) {
          this.setSingleRange(selRanges[0], "backward");
        } else {
          this.setRanges(selRanges);
        }
      };
      selProto.saveRanges = function () {
        return {
          backward: this.isBackward(),
          ranges: this.callMethodOnEachRange("cloneRange")
        };
      };
      selProto.restoreRanges = function (selRanges) {
        this.removeAllRanges();
        for (var i = 0, range; range = selRanges.ranges[i]; ++i) {
          this.addRange(range, selRanges.backward && i == 0);
        }
      };
      selProto.toHtml = function () {
        var rangeHtmls = [];
        this.eachRange(function (range) {
          rangeHtmls.push(DomRange.toHtml(range));
        });
        return rangeHtmls.join("");
      };
      if (features.implementsTextRange) {
        selProto.getNativeTextRange = function () {
          var sel, textRange;
          if (sel = this.docSelection) {
            var range = sel.createRange();
            if (isTextRange(range)) {
              return range;
            } else {
              throw module.createError("getNativeTextRange: selection is a control selection");
            }
          } else if (this.rangeCount > 0) {
            return api.WrappedTextRange.rangeToTextRange(this.getRangeAt(0));
          } else {
            throw module.createError("getNativeTextRange: selection contains no range");
          }
        };
      }
      function inspect(sel) {
        var rangeInspects = [];
        var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
        var focus = new DomPosition(sel.focusNode, sel.focusOffset);
        var name = typeof sel.getName == "function" ? sel.getName() : "Selection";
        if (typeof sel.rangeCount != "undefined") {
          for (var i = 0, len = sel.rangeCount; i < len; ++i) {
            rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
          }
        }
        return "[" + name + "(Ranges: " + rangeInspects.join(", ") + ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";
      }
      selProto.getName = function () {
        return "WrappedSelection";
      };
      selProto.inspect = function () {
        return inspect(this);
      };
      selProto.detach = function () {
        actOnCachedSelection(this.win, "delete");
        deleteProperties(this);
      };
      WrappedSelection.detachAll = function () {
        actOnCachedSelection(null, "deleteAll");
      };
      WrappedSelection.inspect = inspect;
      WrappedSelection.isDirectionBackward = isDirectionBackward;
      api.Selection = WrappedSelection;
      api.selectionPrototype = selProto;
      api.addShimListener(function (win) {
        if (typeof win.getSelection == "undefined") {
          win.getSelection = function () {
            return getSelection(win);
          };
        }
        win = null;
      });
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wait for document to load before initializing
    var docReady = false;
    var loadHandler = function (e) {
      if (!docReady) {
        docReady = true;
        if (!api.initialized && api.config.autoInitialize) {
          init();
        }
      }
    };
    if (isBrowser) {
      // Test whether the document has already been loaded and initialize immediately if so
      if (document.readyState == "complete") {
        loadHandler();
      } else {
        if (isHostMethod(document, "addEventListener")) {
          document.addEventListener("DOMContentLoaded", loadHandler, false);
        }

        // Add a fallback in case the DOMContentLoaded event isn't supported
        addListener(window, "load", loadHandler);
      }
    }
    return api;
  }, commonjsGlobal);
})(rangyCore, rangyCore.exports);
var rangy$1 = rangyCore.exports;

var rangyTextrange$1 = {exports: {}};

/**
 * Text range module for Rangy.
 * Text-based manipulation and searching of ranges and selections.
 *
 * Features
 *
 * - Ability to move range boundaries by character or word offsets
 * - Customizable word tokenizer
 * - Ignores text nodes inside <script> or <style> elements or those hidden by CSS display and visibility properties
 * - Range findText method to search for text or regex within the page or within a range. Flags for whole words and case
 *   sensitivity
 * - Selection and range save/restore as text offsets within a node
 * - Methods to return visible text within a range or selection
 * - innerText method for elements
 *
 * References
 *
 * https://www.w3.org/Bugs/Public/show_bug.cgi?id=13145
 * http://aryeh.name/spec/innertext/innertext.html
 * http://dvcs.w3.org/hg/editing/raw-file/tip/editing.html
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * https://github.com/timdown/rangy
 *
 * Depends on Rangy core.
 *
 * Copyright 2022, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3.1
 * Build date: 17 August 2022
 */
(function (module, exports) {
  /**
   * Problem: handling of trailing spaces before line breaks is handled inconsistently between browsers.
   *
   * First, a <br>: this is relatively simple. For the following HTML:
   *
   * 1 <br>2
   *
   * - IE and WebKit render the space, include it in the selection (i.e. when the content is selected and pasted into a
   *   textarea, the space is present) and allow the caret to be placed after it.
   * - Firefox does not acknowledge the space in the selection but it is possible to place the caret after it.
   * - Opera does not render the space but has two separate caret positions on either side of the space (left and right
   *   arrow keys show this) and includes the space in the selection.
   *
   * The other case is the line break or breaks implied by block elements. For the following HTML:
   *
   * <p>1 </p><p>2<p>
   *
   * - WebKit does not acknowledge the space in any way
   * - Firefox, IE and Opera as per <br>
   *
   * One more case is trailing spaces before line breaks in elements with white-space: pre-line. For the following HTML:
   *
   * <p style="white-space: pre-line">1
   * 2</p>
   *
   * - Firefox and WebKit include the space in caret positions
   * - IE does not support pre-line up to and including version 9
   * - Opera ignores the space
   * - Trailing space only renders if there is a non-collapsed character in the line
   *
   * Problem is whether Rangy should ever acknowledge the space and if so, when. Another problem is whether this can be
   * feature-tested
   */
  (function (factory, root) {
    if (typeof undefined == "function" && undefined.amd) {
      // AMD. Register as an anonymous module with a dependency on Rangy.
      undefined(["./rangy-core"], factory);
    } else if ('object' != "undefined" && 'object' == "object") {
      // Node/CommonJS style
      module.exports = factory(rangyCore.exports);
    } else {
      // No AMD or CommonJS support so we use the rangy property of root (probably the global variable)
      factory(root.rangy);
    }
  })(function (rangy) {
    rangy.createModule("TextRange", ["WrappedSelection"], function (api, module) {
      var UNDEF = "undefined";
      var CHARACTER = "character",
        WORD = "word";
      var dom = api.dom,
        util = api.util;
      var extend = util.extend;
      var createOptions = util.createOptions;
      var getBody = dom.getBody;
      var spacesRegex = /^[ \t\f\r\n]+$/;
      var spacesMinusLineBreaksRegex = /^[ \t\f\r]+$/;
      var allWhiteSpaceRegex = /^[\t-\r \u0085\u00A0\u1680\u180E\u2000-\u200B\u2028\u2029\u202F\u205F\u3000]+$/;
      var nonLineBreakWhiteSpaceRegex = /^[\t \u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]+$/;
      var lineBreakRegex = /^[\n-\r\u0085\u2028\u2029]$/;
      var defaultLanguage = "en";
      var isDirectionBackward = api.Selection.isDirectionBackward;

      // Properties representing whether trailing spaces inside blocks are completely collapsed (as they are in WebKit,
      // but not other browsers). Also test whether trailing spaces before <br> elements are collapsed.
      var trailingSpaceInBlockCollapses = false;
      var trailingSpaceBeforeBrCollapses = false;
      var trailingSpaceBeforeBlockCollapses = false;
      var trailingSpaceBeforeLineBreakInPreLineCollapses = true;
      (function () {
        var el = dom.createTestElement(document, "<p>1 </p><p></p>", true);
        var p = el.firstChild;
        var sel = api.getSelection();
        sel.collapse(p.lastChild, 2);
        sel.setStart(p.firstChild, 0);
        trailingSpaceInBlockCollapses = ("" + sel).length == 1;
        el.innerHTML = "1 <br />";
        sel.collapse(el, 2);
        sel.setStart(el.firstChild, 0);
        trailingSpaceBeforeBrCollapses = ("" + sel).length == 1;
        el.innerHTML = "1 <p>1</p>";
        sel.collapse(el, 2);
        sel.setStart(el.firstChild, 0);
        trailingSpaceBeforeBlockCollapses = ("" + sel).length == 1;
        dom.removeNode(el);
        sel.removeAllRanges();
      })();

      /*----------------------------------------------------------------------------------------------------------------*/

      // This function must create word and non-word tokens for the whole of the text supplied to it
      function defaultTokenizer(chars, wordOptions) {
        var word = chars.join(""),
          result,
          tokenRanges = [];
        function createTokenRange(start, end, isWord) {
          tokenRanges.push({
            start: start,
            end: end,
            isWord: isWord
          });
        }

        // Match words and mark characters
        var lastWordEnd = 0,
          wordStart,
          wordEnd;
        while (result = wordOptions.wordRegex.exec(word)) {
          wordStart = result.index;
          wordEnd = wordStart + result[0].length;

          // Create token for non-word characters preceding this word
          if (wordStart > lastWordEnd) {
            createTokenRange(lastWordEnd, wordStart, false);
          }

          // Get trailing space characters for word
          if (wordOptions.includeTrailingSpace) {
            while (nonLineBreakWhiteSpaceRegex.test(chars[wordEnd])) {
              ++wordEnd;
            }
          }
          createTokenRange(wordStart, wordEnd, true);
          lastWordEnd = wordEnd;
        }

        // Create token for trailing non-word characters, if any exist
        if (lastWordEnd < chars.length) {
          createTokenRange(lastWordEnd, chars.length, false);
        }
        return tokenRanges;
      }
      function convertCharRangeToToken(chars, tokenRange) {
        var tokenChars = chars.slice(tokenRange.start, tokenRange.end);
        var token = {
          isWord: tokenRange.isWord,
          chars: tokenChars,
          toString: function () {
            return tokenChars.join("");
          }
        };
        for (var i = 0, len = tokenChars.length; i < len; ++i) {
          tokenChars[i].token = token;
        }
        return token;
      }
      function tokenize(chars, wordOptions, tokenizer) {
        var tokenRanges = tokenizer(chars, wordOptions);
        var tokens = [];
        for (var i = 0, tokenRange; tokenRange = tokenRanges[i++];) {
          tokens.push(convertCharRangeToToken(chars, tokenRange));
        }
        return tokens;
      }
      var defaultCharacterOptions = {
        includeBlockContentTrailingSpace: true,
        includeSpaceBeforeBr: true,
        includeSpaceBeforeBlock: true,
        includePreLineTrailingSpace: true,
        ignoreCharacters: ""
      };
      function normalizeIgnoredCharacters(ignoredCharacters) {
        // Check if character is ignored
        var ignoredChars = ignoredCharacters || "";

        // Normalize ignored characters into a string consisting of characters in ascending order of character code
        var ignoredCharsArray = typeof ignoredChars == "string" ? ignoredChars.split("") : ignoredChars;
        ignoredCharsArray.sort(function (char1, char2) {
          return char1.charCodeAt(0) - char2.charCodeAt(0);
        });

        /// Convert back to a string and remove duplicates
        return ignoredCharsArray.join("").replace(/(.)\1+/g, "$1");
      }
      var defaultCaretCharacterOptions = {
        includeBlockContentTrailingSpace: !trailingSpaceBeforeLineBreakInPreLineCollapses,
        includeSpaceBeforeBr: !trailingSpaceBeforeBrCollapses,
        includeSpaceBeforeBlock: !trailingSpaceBeforeBlockCollapses,
        includePreLineTrailingSpace: true
      };
      var defaultWordOptions = {
        "en": {
          wordRegex: /[a-z0-9]+('[a-z0-9]+)*/gi,
          includeTrailingSpace: false,
          tokenizer: defaultTokenizer
        }
      };
      var defaultFindOptions = {
        caseSensitive: false,
        withinRange: null,
        wholeWordsOnly: false,
        wrap: false,
        direction: "forward",
        wordOptions: null,
        characterOptions: null
      };
      var defaultMoveOptions = {
        wordOptions: null,
        characterOptions: null
      };
      var defaultExpandOptions = {
        wordOptions: null,
        characterOptions: null,
        trim: false,
        trimStart: true,
        trimEnd: true
      };
      var defaultWordIteratorOptions = {
        wordOptions: null,
        characterOptions: null,
        direction: "forward"
      };
      function createWordOptions(options) {
        var lang, defaults;
        if (!options) {
          return defaultWordOptions[defaultLanguage];
        } else {
          lang = options.language || defaultLanguage;
          defaults = {};
          extend(defaults, defaultWordOptions[lang] || defaultWordOptions[defaultLanguage]);
          extend(defaults, options);
          return defaults;
        }
      }
      function createNestedOptions(optionsParam, defaults) {
        var options = createOptions(optionsParam, defaults);
        if (defaults.hasOwnProperty("wordOptions")) {
          options.wordOptions = createWordOptions(options.wordOptions);
        }
        if (defaults.hasOwnProperty("characterOptions")) {
          options.characterOptions = createOptions(options.characterOptions, defaultCharacterOptions);
        }
        return options;
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      /* DOM utility functions */
      var getComputedStyleProperty = dom.getComputedStyleProperty;

      // Create cachable versions of DOM functions

      // Test for old IE's incorrect display properties
      var tableCssDisplayBlock;
      (function () {
        var table = document.createElement("table");
        var body = getBody(document);
        body.appendChild(table);
        tableCssDisplayBlock = getComputedStyleProperty(table, "display") == "block";
        body.removeChild(table);
      })();
      var defaultDisplayValueForTag = {
        table: "table",
        caption: "table-caption",
        colgroup: "table-column-group",
        col: "table-column",
        thead: "table-header-group",
        tbody: "table-row-group",
        tfoot: "table-footer-group",
        tr: "table-row",
        td: "table-cell",
        th: "table-cell"
      };

      // Corrects IE's "block" value for table-related elements
      function getComputedDisplay(el, win) {
        var display = getComputedStyleProperty(el, "display", win);
        var tagName = el.tagName.toLowerCase();
        return display == "block" && tableCssDisplayBlock && defaultDisplayValueForTag.hasOwnProperty(tagName) ? defaultDisplayValueForTag[tagName] : display;
      }
      function isHidden(node) {
        var ancestors = getAncestorsAndSelf(node);
        for (var i = 0, len = ancestors.length; i < len; ++i) {
          if (ancestors[i].nodeType == 1 && getComputedDisplay(ancestors[i]) == "none") {
            return true;
          }
        }
        return false;
      }
      function isVisibilityHiddenTextNode(textNode) {
        var el;
        return textNode.nodeType == 3 && (el = textNode.parentNode) && getComputedStyleProperty(el, "visibility") == "hidden";
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // "A block node is either an Element whose "display" property does not have
      // resolved value "inline" or "inline-block" or "inline-table" or "none", or a
      // Document, or a DocumentFragment."
      function isBlockNode(node) {
        return node && (node.nodeType == 1 && !/^(inline(-block|-table)?|none)$/.test(getComputedDisplay(node)) || node.nodeType == 9 || node.nodeType == 11);
      }
      function getLastDescendantOrSelf(node) {
        var lastChild = node.lastChild;
        return lastChild ? getLastDescendantOrSelf(lastChild) : node;
      }
      function containsPositions(node) {
        return dom.isCharacterDataNode(node) || !/^(area|base|basefont|br|col|frame|hr|img|input|isindex|link|meta|param)$/i.test(node.nodeName);
      }
      function getAncestors(node) {
        var ancestors = [];
        while (node.parentNode) {
          ancestors.unshift(node.parentNode);
          node = node.parentNode;
        }
        return ancestors;
      }
      function getAncestorsAndSelf(node) {
        return getAncestors(node).concat([node]);
      }
      function nextNodeDescendants(node) {
        while (node && !node.nextSibling) {
          node = node.parentNode;
        }
        if (!node) {
          return null;
        }
        return node.nextSibling;
      }
      function nextNode(node, excludeChildren) {
        if (!excludeChildren && node.hasChildNodes()) {
          return node.firstChild;
        }
        return nextNodeDescendants(node);
      }
      function previousNode(node) {
        var previous = node.previousSibling;
        if (previous) {
          node = previous;
          while (node.hasChildNodes()) {
            node = node.lastChild;
          }
          return node;
        }
        var parent = node.parentNode;
        if (parent && parent.nodeType == 1) {
          return parent;
        }
        return null;
      }

      // Adpated from Aryeh's code.
      // "A whitespace node is either a Text node whose data is the empty string; or
      // a Text node whose data consists only of one or more tabs (0x0009), line
      // feeds (0x000A), carriage returns (0x000D), and/or spaces (0x0020), and whose
      // parent is an Element whose resolved value for "white-space" is "normal" or
      // "nowrap"; or a Text node whose data consists only of one or more tabs
      // (0x0009), carriage returns (0x000D), and/or spaces (0x0020), and whose
      // parent is an Element whose resolved value for "white-space" is "pre-line"."
      function isWhitespaceNode(node) {
        if (!node || node.nodeType != 3) {
          return false;
        }
        var text = node.data;
        if (text === "") {
          return true;
        }
        var parent = node.parentNode;
        if (!parent || parent.nodeType != 1) {
          return false;
        }
        var computedWhiteSpace = getComputedStyleProperty(node.parentNode, "whiteSpace");
        return /^[\t\n\r ]+$/.test(text) && /^(normal|nowrap)$/.test(computedWhiteSpace) || /^[\t\r ]+$/.test(text) && computedWhiteSpace == "pre-line";
      }

      // Adpated from Aryeh's code.
      // "node is a collapsed whitespace node if the following algorithm returns
      // true:"
      function isCollapsedWhitespaceNode(node) {
        // "If node's data is the empty string, return true."
        if (node.data === "") {
          return true;
        }

        // "If node is not a whitespace node, return false."
        if (!isWhitespaceNode(node)) {
          return false;
        }

        // "Let ancestor be node's parent."
        var ancestor = node.parentNode;

        // "If ancestor is null, return true."
        if (!ancestor) {
          return true;
        }

        // "If the "display" property of some ancestor of node has resolved value "none", return true."
        if (isHidden(node)) {
          return true;
        }
        return false;
      }
      function isCollapsedNode(node) {
        var type = node.nodeType;
        return type == 7 /* PROCESSING_INSTRUCTION */ || type == 8 /* COMMENT */ || isHidden(node) || /^(script|style)$/i.test(node.nodeName) || isVisibilityHiddenTextNode(node) || isCollapsedWhitespaceNode(node);
      }
      function isIgnoredNode(node, win) {
        var type = node.nodeType;
        return type == 7 /* PROCESSING_INSTRUCTION */ || type == 8 /* COMMENT */ || type == 1 && getComputedDisplay(node, win) == "none";
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // Possibly overengineered caching system to prevent repeated DOM calls slowing everything down

      function Cache() {
        this.store = {};
      }
      Cache.prototype = {
        get: function (key) {
          return this.store.hasOwnProperty(key) ? this.store[key] : null;
        },
        set: function (key, value) {
          return this.store[key] = value;
        }
      };
      var cachedCount = 0,
        uncachedCount = 0;
      function createCachingGetter(methodName, func, objProperty) {
        return function (args) {
          var cache = this.cache;
          if (cache.hasOwnProperty(methodName)) {
            cachedCount++;
            return cache[methodName];
          } else {
            uncachedCount++;
            var value = func.call(this, objProperty ? this[objProperty] : this, args);
            cache[methodName] = value;
            return value;
          }
        };
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      function NodeWrapper(node, session) {
        this.node = node;
        this.session = session;
        this.cache = new Cache();
        this.positions = new Cache();
      }
      var nodeProto = {
        getPosition: function (offset) {
          var positions = this.positions;
          return positions.get(offset) || positions.set(offset, new Position(this, offset));
        },
        toString: function () {
          return "[NodeWrapper(" + dom.inspectNode(this.node) + ")]";
        }
      };
      NodeWrapper.prototype = nodeProto;
      var EMPTY = "EMPTY",
        NON_SPACE = "NON_SPACE",
        UNCOLLAPSIBLE_SPACE = "UNCOLLAPSIBLE_SPACE",
        COLLAPSIBLE_SPACE = "COLLAPSIBLE_SPACE",
        TRAILING_SPACE_BEFORE_BLOCK = "TRAILING_SPACE_BEFORE_BLOCK",
        TRAILING_SPACE_IN_BLOCK = "TRAILING_SPACE_IN_BLOCK",
        TRAILING_SPACE_BEFORE_BR = "TRAILING_SPACE_BEFORE_BR",
        PRE_LINE_TRAILING_SPACE_BEFORE_LINE_BREAK = "PRE_LINE_TRAILING_SPACE_BEFORE_LINE_BREAK",
        TRAILING_LINE_BREAK_AFTER_BR = "TRAILING_LINE_BREAK_AFTER_BR",
        INCLUDED_TRAILING_LINE_BREAK_AFTER_BR = "INCLUDED_TRAILING_LINE_BREAK_AFTER_BR";
      extend(nodeProto, {
        isCharacterDataNode: createCachingGetter("isCharacterDataNode", dom.isCharacterDataNode, "node"),
        getNodeIndex: createCachingGetter("nodeIndex", dom.getNodeIndex, "node"),
        getLength: createCachingGetter("nodeLength", dom.getNodeLength, "node"),
        containsPositions: createCachingGetter("containsPositions", containsPositions, "node"),
        isWhitespace: createCachingGetter("isWhitespace", isWhitespaceNode, "node"),
        isCollapsedWhitespace: createCachingGetter("isCollapsedWhitespace", isCollapsedWhitespaceNode, "node"),
        getComputedDisplay: createCachingGetter("computedDisplay", getComputedDisplay, "node"),
        isCollapsed: createCachingGetter("collapsed", isCollapsedNode, "node"),
        isIgnored: createCachingGetter("ignored", isIgnoredNode, "node"),
        next: createCachingGetter("nextPos", nextNode, "node"),
        previous: createCachingGetter("previous", previousNode, "node"),
        getTextNodeInfo: createCachingGetter("textNodeInfo", function (textNode) {
          var spaceRegex = null,
            collapseSpaces = false;
          var cssWhitespace = getComputedStyleProperty(textNode.parentNode, "whiteSpace");
          var preLine = cssWhitespace == "pre-line";
          if (preLine) {
            spaceRegex = spacesMinusLineBreaksRegex;
            collapseSpaces = true;
          } else if (cssWhitespace == "normal" || cssWhitespace == "nowrap") {
            spaceRegex = spacesRegex;
            collapseSpaces = true;
          }
          return {
            node: textNode,
            text: textNode.data,
            spaceRegex: spaceRegex,
            collapseSpaces: collapseSpaces,
            preLine: preLine
          };
        }, "node"),
        hasInnerText: createCachingGetter("hasInnerText", function (el, backward) {
          var session = this.session;
          var posAfterEl = session.getPosition(el.parentNode, this.getNodeIndex() + 1);
          var firstPosInEl = session.getPosition(el, 0);
          var pos = backward ? posAfterEl : firstPosInEl;
          var endPos = backward ? firstPosInEl : posAfterEl;

          /*
           <body><p>X  </p><p>Y</p></body>
            Positions:
            body:0:""
           p:0:""
           text:0:""
           text:1:"X"
           text:2:TRAILING_SPACE_IN_BLOCK
           text:3:COLLAPSED_SPACE
           p:1:""
           body:1:"\n"
           p:0:""
           text:0:""
           text:1:"Y"
            A character is a TRAILING_SPACE_IN_BLOCK iff:
            - There is no uncollapsed character after it within the visible containing block element
            A character is a TRAILING_SPACE_BEFORE_BR iff:
            - There is no uncollapsed character after it preceding a <br> element
            An element has inner text iff
            - It is not hidden
           - It contains an uncollapsed character
            All trailing spaces (pre-line, before <br>, end of block) require definite non-empty characters to render.
           */

          while (pos !== endPos) {
            pos.prepopulateChar();
            if (pos.isDefinitelyNonEmpty()) {
              return true;
            }
            pos = backward ? pos.previousVisible() : pos.nextVisible();
          }
          return false;
        }, "node"),
        isRenderedBlock: createCachingGetter("isRenderedBlock", function (el) {
          // Ensure that a block element containing a <br> is considered to have inner text
          var brs = el.getElementsByTagName("br");
          for (var i = 0, len = brs.length; i < len; ++i) {
            if (!isCollapsedNode(brs[i])) {
              return true;
            }
          }
          return this.hasInnerText();
        }, "node"),
        getTrailingSpace: createCachingGetter("trailingSpace", function (el) {
          if (el.tagName.toLowerCase() == "br") {
            return "";
          } else {
            switch (this.getComputedDisplay()) {
              case "inline":
                var child = el.lastChild;
                while (child) {
                  if (!isIgnoredNode(child)) {
                    return child.nodeType == 1 ? this.session.getNodeWrapper(child).getTrailingSpace() : "";
                  }
                  child = child.previousSibling;
                }
                break;
              case "inline-block":
              case "inline-table":
              case "none":
              case "table-column":
              case "table-column-group":
                break;
              case "table-cell":
                return "\t";
              default:
                return this.isRenderedBlock(true) ? "\n" : "";
            }
          }
          return "";
        }, "node"),
        getLeadingSpace: createCachingGetter("leadingSpace", function (el) {
          switch (this.getComputedDisplay()) {
            case "inline":
            case "inline-block":
            case "inline-table":
            case "none":
            case "table-column":
            case "table-column-group":
            case "table-cell":
              break;
            default:
              return this.isRenderedBlock(false) ? "\n" : "";
          }
          return "";
        }, "node")
      });

      /*----------------------------------------------------------------------------------------------------------------*/

      function Position(nodeWrapper, offset) {
        this.offset = offset;
        this.nodeWrapper = nodeWrapper;
        this.node = nodeWrapper.node;
        this.session = nodeWrapper.session;
        this.cache = new Cache();
      }
      function inspectPosition() {
        return "[Position(" + dom.inspectNode(this.node) + ":" + this.offset + ")]";
      }
      var positionProto = {
        character: "",
        characterType: EMPTY,
        isBr: false,
        /*
        This method:
        - Fully populates positions that have characters that can be determined independently of any other characters.
        - Populates most types of space positions with a provisional character. The character is finalized later.
         */
        prepopulateChar: function () {
          var pos = this;
          if (!pos.prepopulatedChar) {
            var node = pos.node,
              offset = pos.offset;
            var visibleChar = "",
              charType = EMPTY;
            var finalizedChar = false;
            if (offset > 0) {
              if (node.nodeType == 3) {
                var text = node.data;
                var textChar = text.charAt(offset - 1);
                var nodeInfo = pos.nodeWrapper.getTextNodeInfo();
                var spaceRegex = nodeInfo.spaceRegex;
                if (nodeInfo.collapseSpaces) {
                  if (spaceRegex.test(textChar)) {
                    // "If the character at position is from set, append a single space (U+0020) to newdata and advance
                    // position until the character at position is not from set."

                    // We also need to check for the case where we're in a pre-line and we have a space preceding a
                    // line break, because such spaces are collapsed in some browsers
                    if (offset > 1 && spaceRegex.test(text.charAt(offset - 2))) {} else if (nodeInfo.preLine && text.charAt(offset) === "\n") {
                      visibleChar = " ";
                      charType = PRE_LINE_TRAILING_SPACE_BEFORE_LINE_BREAK;
                    } else {
                      visibleChar = " ";
                      //pos.checkForFollowingLineBreak = true;
                      charType = COLLAPSIBLE_SPACE;
                    }
                  } else {
                    visibleChar = textChar;
                    charType = NON_SPACE;
                    finalizedChar = true;
                  }
                } else {
                  visibleChar = textChar;
                  charType = UNCOLLAPSIBLE_SPACE;
                  finalizedChar = true;
                }
              } else {
                var nodePassed = node.childNodes[offset - 1];
                if (nodePassed && nodePassed.nodeType == 1 && !isCollapsedNode(nodePassed)) {
                  if (nodePassed.tagName.toLowerCase() == "br") {
                    visibleChar = "\n";
                    pos.isBr = true;
                    charType = COLLAPSIBLE_SPACE;
                    finalizedChar = false;
                  } else {
                    pos.checkForTrailingSpace = true;
                  }
                }

                // Check the leading space of the next node for the case when a block element follows an inline
                // element or text node. In that case, there is an implied line break between the two nodes.
                if (!visibleChar) {
                  var nextNode = node.childNodes[offset];
                  if (nextNode && nextNode.nodeType == 1 && !isCollapsedNode(nextNode)) {
                    pos.checkForLeadingSpace = true;
                  }
                }
              }
            }
            pos.prepopulatedChar = true;
            pos.character = visibleChar;
            pos.characterType = charType;
            pos.isCharInvariant = finalizedChar;
          }
        },
        isDefinitelyNonEmpty: function () {
          var charType = this.characterType;
          return charType == NON_SPACE || charType == UNCOLLAPSIBLE_SPACE;
        },
        // Resolve leading and trailing spaces, which may involve prepopulating other positions
        resolveLeadingAndTrailingSpaces: function () {
          if (!this.prepopulatedChar) {
            this.prepopulateChar();
          }
          if (this.checkForTrailingSpace) {
            var trailingSpace = this.session.getNodeWrapper(this.node.childNodes[this.offset - 1]).getTrailingSpace();
            if (trailingSpace) {
              this.isTrailingSpace = true;
              this.character = trailingSpace;
              this.characterType = COLLAPSIBLE_SPACE;
            }
            this.checkForTrailingSpace = false;
          }
          if (this.checkForLeadingSpace) {
            var leadingSpace = this.session.getNodeWrapper(this.node.childNodes[this.offset]).getLeadingSpace();
            if (leadingSpace) {
              this.isLeadingSpace = true;
              this.character = leadingSpace;
              this.characterType = COLLAPSIBLE_SPACE;
            }
            this.checkForLeadingSpace = false;
          }
        },
        getPrecedingUncollapsedPosition: function (characterOptions) {
          var pos = this,
            character;
          while (pos = pos.previousVisible()) {
            character = pos.getCharacter(characterOptions);
            if (character !== "") {
              return pos;
            }
          }
          return null;
        },
        getCharacter: function (characterOptions) {
          this.resolveLeadingAndTrailingSpaces();
          var thisChar = this.character,
            returnChar;

          // Check if character is ignored
          var ignoredChars = normalizeIgnoredCharacters(characterOptions.ignoreCharacters);
          var isIgnoredCharacter = thisChar !== "" && ignoredChars.indexOf(thisChar) > -1;

          // Check if this position's  character is invariant (i.e. not dependent on character options) and return it
          // if so
          if (this.isCharInvariant) {
            returnChar = isIgnoredCharacter ? "" : thisChar;
            return returnChar;
          }
          var cacheKey = ["character", characterOptions.includeSpaceBeforeBr, characterOptions.includeBlockContentTrailingSpace, characterOptions.includePreLineTrailingSpace, ignoredChars].join("_");
          var cachedChar = this.cache.get(cacheKey);
          if (cachedChar !== null) {
            return cachedChar;
          }

          // We need to actually get the character now
          var character = "";
          var collapsible = this.characterType == COLLAPSIBLE_SPACE;
          var nextPos, previousPos;
          var gotPreviousPos = false;
          var pos = this;
          function getPreviousPos() {
            if (!gotPreviousPos) {
              previousPos = pos.getPrecedingUncollapsedPosition(characterOptions);
              gotPreviousPos = true;
            }
            return previousPos;
          }

          // Disallow a collapsible space that is followed by a line break or is the last character
          if (collapsible) {
            // Allow a trailing space that we've previously determined should be included
            if (this.type == INCLUDED_TRAILING_LINE_BREAK_AFTER_BR) {
              character = "\n";
            }
            // Disallow a collapsible space that follows a trailing space or line break, or is the first character,
            // or follows a collapsible included space
            else if (thisChar == " " && (!getPreviousPos() || previousPos.isTrailingSpace || previousPos.character == "\n" || previousPos.character == " " && previousPos.characterType == COLLAPSIBLE_SPACE)) {}
            // Allow a leading line break unless it follows a line break
            else if (thisChar == "\n" && this.isLeadingSpace) {
              if (getPreviousPos() && previousPos.character != "\n") {
                character = "\n";
              } else {}
            } else {
              nextPos = this.nextUncollapsed();
              if (nextPos) {
                if (nextPos.isBr) {
                  this.type = TRAILING_SPACE_BEFORE_BR;
                } else if (nextPos.isTrailingSpace && nextPos.character == "\n") {
                  this.type = TRAILING_SPACE_IN_BLOCK;
                } else if (nextPos.isLeadingSpace && nextPos.character == "\n") {
                  this.type = TRAILING_SPACE_BEFORE_BLOCK;
                }
                if (nextPos.character == "\n") {
                  if (this.type == TRAILING_SPACE_BEFORE_BR && !characterOptions.includeSpaceBeforeBr) {} else if (this.type == TRAILING_SPACE_BEFORE_BLOCK && !characterOptions.includeSpaceBeforeBlock) {} else if (this.type == TRAILING_SPACE_IN_BLOCK && nextPos.isTrailingSpace && !characterOptions.includeBlockContentTrailingSpace) {} else if (this.type == PRE_LINE_TRAILING_SPACE_BEFORE_LINE_BREAK && nextPos.type == NON_SPACE && !characterOptions.includePreLineTrailingSpace) {} else if (thisChar == "\n") {
                    if (nextPos.isTrailingSpace) {
                      if (this.isTrailingSpace) {} else if (this.isBr) {
                        nextPos.type = TRAILING_LINE_BREAK_AFTER_BR;
                        if (getPreviousPos() && previousPos.isLeadingSpace && !previousPos.isTrailingSpace && previousPos.character == "\n") {
                          nextPos.character = "";
                        } else {
                          nextPos.type = INCLUDED_TRAILING_LINE_BREAK_AFTER_BR;
                        }
                      }
                    } else {
                      character = "\n";
                    }
                  } else if (thisChar == " ") {
                    character = " ";
                  } else {}
                } else {
                  character = thisChar;
                }
              } else {}
            }
          }
          if (ignoredChars.indexOf(character) > -1) {
            character = "";
          }
          this.cache.set(cacheKey, character);
          return character;
        },
        equals: function (pos) {
          return !!pos && this.node === pos.node && this.offset === pos.offset;
        },
        inspect: inspectPosition,
        toString: function () {
          return this.character;
        }
      };
      Position.prototype = positionProto;
      extend(positionProto, {
        next: createCachingGetter("nextPos", function (pos) {
          var nodeWrapper = pos.nodeWrapper,
            node = pos.node,
            offset = pos.offset,
            session = nodeWrapper.session;
          if (!node) {
            return null;
          }
          var nextNode, nextOffset, child;
          if (offset == nodeWrapper.getLength()) {
            // Move onto the next node
            nextNode = node.parentNode;
            nextOffset = nextNode ? nodeWrapper.getNodeIndex() + 1 : 0;
          } else {
            if (nodeWrapper.isCharacterDataNode()) {
              nextNode = node;
              nextOffset = offset + 1;
            } else {
              child = node.childNodes[offset];
              // Go into the children next, if children there are
              if (session.getNodeWrapper(child).containsPositions()) {
                nextNode = child;
                nextOffset = 0;
              } else {
                nextNode = node;
                nextOffset = offset + 1;
              }
            }
          }
          return nextNode ? session.getPosition(nextNode, nextOffset) : null;
        }),
        previous: createCachingGetter("previous", function (pos) {
          var nodeWrapper = pos.nodeWrapper,
            node = pos.node,
            offset = pos.offset,
            session = nodeWrapper.session;
          var previousNode, previousOffset, child;
          if (offset == 0) {
            previousNode = node.parentNode;
            previousOffset = previousNode ? nodeWrapper.getNodeIndex() : 0;
          } else {
            if (nodeWrapper.isCharacterDataNode()) {
              previousNode = node;
              previousOffset = offset - 1;
            } else {
              child = node.childNodes[offset - 1];
              // Go into the children next, if children there are
              if (session.getNodeWrapper(child).containsPositions()) {
                previousNode = child;
                previousOffset = dom.getNodeLength(child);
              } else {
                previousNode = node;
                previousOffset = offset - 1;
              }
            }
          }
          return previousNode ? session.getPosition(previousNode, previousOffset) : null;
        }),
        /*
         Next and previous position moving functions that filter out
          - Hidden (CSS visibility/display) elements
         - Script and style elements
         */
        nextVisible: createCachingGetter("nextVisible", function (pos) {
          var next = pos.next();
          if (!next) {
            return null;
          }
          var nodeWrapper = next.nodeWrapper,
            node = next.node;
          var newPos = next;
          if (nodeWrapper.isCollapsed()) {
            // We're skipping this node and all its descendants
            newPos = nodeWrapper.session.getPosition(node.parentNode, nodeWrapper.getNodeIndex() + 1);
          }
          return newPos;
        }),
        nextUncollapsed: createCachingGetter("nextUncollapsed", function (pos) {
          var nextPos = pos;
          while (nextPos = nextPos.nextVisible()) {
            nextPos.resolveLeadingAndTrailingSpaces();
            if (nextPos.character !== "") {
              return nextPos;
            }
          }
          return null;
        }),
        previousVisible: createCachingGetter("previousVisible", function (pos) {
          var previous = pos.previous();
          if (!previous) {
            return null;
          }
          var nodeWrapper = previous.nodeWrapper,
            node = previous.node;
          var newPos = previous;
          if (nodeWrapper.isCollapsed()) {
            // We're skipping this node and all its descendants
            newPos = nodeWrapper.session.getPosition(node.parentNode, nodeWrapper.getNodeIndex());
          }
          return newPos;
        })
      });

      /*----------------------------------------------------------------------------------------------------------------*/

      var currentSession = null;
      var Session = function () {
        function createWrapperCache(nodeProperty) {
          var cache = new Cache();
          return {
            get: function (node) {
              var wrappersByProperty = cache.get(node[nodeProperty]);
              if (wrappersByProperty) {
                for (var i = 0, wrapper; wrapper = wrappersByProperty[i++];) {
                  if (wrapper.node === node) {
                    return wrapper;
                  }
                }
              }
              return null;
            },
            set: function (nodeWrapper) {
              var property = nodeWrapper.node[nodeProperty];
              var wrappersByProperty = cache.get(property) || cache.set(property, []);
              wrappersByProperty.push(nodeWrapper);
            }
          };
        }
        var uniqueIDSupported = util.isHostProperty(document.documentElement, "uniqueID");
        function Session() {
          this.initCaches();
        }
        Session.prototype = {
          initCaches: function () {
            this.elementCache = uniqueIDSupported ? function () {
              var elementsCache = new Cache();
              return {
                get: function (el) {
                  return elementsCache.get(el.uniqueID);
                },
                set: function (elWrapper) {
                  elementsCache.set(elWrapper.node.uniqueID, elWrapper);
                }
              };
            }() : createWrapperCache("tagName");

            // Store text nodes keyed by data, although we may need to truncate this
            this.textNodeCache = createWrapperCache("data");
            this.otherNodeCache = createWrapperCache("nodeName");
          },
          getNodeWrapper: function (node) {
            var wrapperCache;
            switch (node.nodeType) {
              case 1:
                wrapperCache = this.elementCache;
                break;
              case 3:
                wrapperCache = this.textNodeCache;
                break;
              default:
                wrapperCache = this.otherNodeCache;
                break;
            }
            var wrapper = wrapperCache.get(node);
            if (!wrapper) {
              wrapper = new NodeWrapper(node, this);
              wrapperCache.set(wrapper);
            }
            return wrapper;
          },
          getPosition: function (node, offset) {
            return this.getNodeWrapper(node).getPosition(offset);
          },
          getRangeBoundaryPosition: function (range, isStart) {
            var prefix = isStart ? "start" : "end";
            return this.getPosition(range[prefix + "Container"], range[prefix + "Offset"]);
          },
          detach: function () {
            this.elementCache = this.textNodeCache = this.otherNodeCache = null;
          }
        };
        return Session;
      }();

      /*----------------------------------------------------------------------------------------------------------------*/

      function startSession() {
        endSession();
        return currentSession = new Session();
      }
      function getSession() {
        return currentSession || startSession();
      }
      function endSession() {
        if (currentSession) {
          currentSession.detach();
        }
        currentSession = null;
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // Extensions to the rangy.dom utility object

      extend(dom, {
        nextNode: nextNode,
        previousNode: previousNode
      });

      /*----------------------------------------------------------------------------------------------------------------*/

      function createCharacterIterator(startPos, backward, endPos, characterOptions) {
        // Adjust the end position to ensure that it is actually reached
        if (endPos) {
          if (backward) {
            if (isCollapsedNode(endPos.node)) {
              endPos = startPos.previousVisible();
            }
          } else {
            if (isCollapsedNode(endPos.node)) {
              endPos = endPos.nextVisible();
            }
          }
        }
        var pos = startPos,
          finished = false;
        function next() {
          var charPos = null;
          if (backward) {
            charPos = pos;
            if (!finished) {
              pos = pos.previousVisible();
              finished = !pos || endPos && pos.equals(endPos);
            }
          } else {
            if (!finished) {
              charPos = pos = pos.nextVisible();
              finished = !pos || endPos && pos.equals(endPos);
            }
          }
          if (finished) {
            pos = null;
          }
          return charPos;
        }
        var previousTextPos,
          returnPreviousTextPos = false;
        return {
          next: function () {
            if (returnPreviousTextPos) {
              returnPreviousTextPos = false;
              return previousTextPos;
            } else {
              var pos, character;
              while (pos = next()) {
                character = pos.getCharacter(characterOptions);
                if (character) {
                  previousTextPos = pos;
                  return pos;
                }
              }
              return null;
            }
          },
          rewind: function () {
            if (previousTextPos) {
              returnPreviousTextPos = true;
            } else {
              throw module.createError("createCharacterIterator: cannot rewind. Only one position can be rewound.");
            }
          },
          dispose: function () {
            startPos = endPos = null;
          }
        };
      }
      var arrayIndexOf = Array.prototype.indexOf ? function (arr, val) {
        return arr.indexOf(val);
      } : function (arr, val) {
        for (var i = 0, len = arr.length; i < len; ++i) {
          if (arr[i] === val) {
            return i;
          }
        }
        return -1;
      };

      // Provides a pair of iterators over text positions, tokenized. Transparently requests more text when next()
      // is called and there is no more tokenized text
      function createTokenizedTextProvider(pos, characterOptions, wordOptions) {
        var forwardIterator = createCharacterIterator(pos, false, null, characterOptions);
        var backwardIterator = createCharacterIterator(pos, true, null, characterOptions);
        var tokenizer = wordOptions.tokenizer;

        // Consumes a word and the whitespace beyond it
        function consumeWord(forward) {
          var pos, textChar;
          var newChars = [],
            it = forward ? forwardIterator : backwardIterator;
          var passedWordBoundary = false,
            insideWord = false;
          while (pos = it.next()) {
            textChar = pos.character;
            if (allWhiteSpaceRegex.test(textChar)) {
              if (insideWord) {
                insideWord = false;
                passedWordBoundary = true;
              }
            } else {
              if (passedWordBoundary) {
                it.rewind();
                break;
              } else {
                insideWord = true;
              }
            }
            newChars.push(pos);
          }
          return newChars;
        }

        // Get initial word surrounding initial position and tokenize it
        var forwardChars = consumeWord(true);
        var backwardChars = consumeWord(false).reverse();
        var tokens = tokenize(backwardChars.concat(forwardChars), wordOptions, tokenizer);

        // Create initial token buffers
        var forwardTokensBuffer = forwardChars.length ? tokens.slice(arrayIndexOf(tokens, forwardChars[0].token)) : [];
        var backwardTokensBuffer = backwardChars.length ? tokens.slice(0, arrayIndexOf(tokens, backwardChars.pop().token) + 1) : [];
        function inspectBuffer(buffer) {
          var textPositions = ["[" + buffer.length + "]"];
          for (var i = 0; i < buffer.length; ++i) {
            textPositions.push("(word: " + buffer[i] + ", is word: " + buffer[i].isWord + ")");
          }
          return textPositions;
        }
        return {
          nextEndToken: function () {
            var lastToken, forwardChars;

            // If we're down to the last token, consume character chunks until we have a word or run out of
            // characters to consume
            while (forwardTokensBuffer.length == 1 && !(lastToken = forwardTokensBuffer[0]).isWord && (forwardChars = consumeWord(true)).length > 0) {
              // Merge trailing non-word into next word and tokenize
              forwardTokensBuffer = tokenize(lastToken.chars.concat(forwardChars), wordOptions, tokenizer);
            }
            return forwardTokensBuffer.shift();
          },
          previousStartToken: function () {
            var lastToken, backwardChars;

            // If we're down to the last token, consume character chunks until we have a word or run out of
            // characters to consume
            while (backwardTokensBuffer.length == 1 && !(lastToken = backwardTokensBuffer[0]).isWord && (backwardChars = consumeWord(false)).length > 0) {
              // Merge leading non-word into next word and tokenize
              backwardTokensBuffer = tokenize(backwardChars.reverse().concat(lastToken.chars), wordOptions, tokenizer);
            }
            return backwardTokensBuffer.pop();
          },
          dispose: function () {
            forwardIterator.dispose();
            backwardIterator.dispose();
            forwardTokensBuffer = backwardTokensBuffer = null;
          }
        };
      }
      function movePositionBy(pos, unit, count, characterOptions, wordOptions) {
        var unitsMoved = 0,
          currentPos,
          newPos = pos,
          charIterator,
          nextPos,
          absCount = Math.abs(count),
          token;
        if (count !== 0) {
          var backward = count < 0;
          switch (unit) {
            case CHARACTER:
              charIterator = createCharacterIterator(pos, backward, null, characterOptions);
              while ((currentPos = charIterator.next()) && unitsMoved < absCount) {
                ++unitsMoved;
                newPos = currentPos;
              }
              nextPos = currentPos;
              charIterator.dispose();
              break;
            case WORD:
              var tokenizedTextProvider = createTokenizedTextProvider(pos, characterOptions, wordOptions);
              var next = backward ? tokenizedTextProvider.previousStartToken : tokenizedTextProvider.nextEndToken;
              while ((token = next()) && unitsMoved < absCount) {
                if (token.isWord) {
                  ++unitsMoved;
                  newPos = backward ? token.chars[0] : token.chars[token.chars.length - 1];
                }
              }
              break;
            default:
              throw new Error("movePositionBy: unit '" + unit + "' not implemented");
          }

          // Perform any necessary position tweaks
          if (backward) {
            newPos = newPos.previousVisible();
            unitsMoved = -unitsMoved;
          } else if (newPos && newPos.isLeadingSpace && !newPos.isTrailingSpace) {
            // Tweak the position for the case of a leading space. The problem is that an uncollapsed leading space
            // before a block element (for example, the line break between "1" and "2" in the following HTML:
            // "1<p>2</p>") is considered to be attached to the position immediately before the block element, which
            // corresponds with a different selection position in most browsers from the one we want (i.e. at the
            // start of the contents of the block element). We get round this by advancing the position returned to
            // the last possible equivalent visible position.
            if (unit == WORD) {
              charIterator = createCharacterIterator(pos, false, null, characterOptions);
              nextPos = charIterator.next();
              charIterator.dispose();
            }
            if (nextPos) {
              newPos = nextPos.previousVisible();
            }
          }
        }
        return {
          position: newPos,
          unitsMoved: unitsMoved
        };
      }
      function createRangeCharacterIterator(session, range, characterOptions, backward) {
        var rangeStart = session.getRangeBoundaryPosition(range, true);
        var rangeEnd = session.getRangeBoundaryPosition(range, false);
        var itStart = backward ? rangeEnd : rangeStart;
        var itEnd = backward ? rangeStart : rangeEnd;
        return createCharacterIterator(itStart, !!backward, itEnd, characterOptions);
      }
      function getRangeCharacters(session, range, characterOptions) {
        var chars = [],
          it = createRangeCharacterIterator(session, range, characterOptions),
          pos;
        while (pos = it.next()) {
          chars.push(pos);
        }
        it.dispose();
        return chars;
      }
      function isWholeWord(startPos, endPos, wordOptions) {
        var range = api.createRange(startPos.node);
        range.setStartAndEnd(startPos.node, startPos.offset, endPos.node, endPos.offset);
        return !range.expand("word", {
          wordOptions: wordOptions
        });
      }
      function findTextFromPosition(initialPos, searchTerm, isRegex, searchScopeRange, findOptions) {
        var backward = isDirectionBackward(findOptions.direction);
        var it = createCharacterIterator(initialPos, backward, initialPos.session.getRangeBoundaryPosition(searchScopeRange, backward), findOptions.characterOptions);
        var text = "",
          chars = [],
          pos,
          currentChar,
          matchStartIndex,
          matchEndIndex;
        var result, insideRegexMatch;
        var returnValue = null;
        function handleMatch(startIndex, endIndex) {
          var startPos = chars[startIndex].previousVisible();
          var endPos = chars[endIndex - 1];
          var valid = !findOptions.wholeWordsOnly || isWholeWord(startPos, endPos, findOptions.wordOptions);
          return {
            startPos: startPos,
            endPos: endPos,
            valid: valid
          };
        }
        while (pos = it.next()) {
          currentChar = pos.character;
          if (!isRegex && !findOptions.caseSensitive) {
            currentChar = currentChar.toLowerCase();
          }
          if (backward) {
            chars.unshift(pos);
            text = currentChar + text;
          } else {
            chars.push(pos);
            text += currentChar;
          }
          if (isRegex) {
            result = searchTerm.exec(text);
            if (result) {
              matchStartIndex = result.index;
              matchEndIndex = matchStartIndex + result[0].length;
              if (insideRegexMatch) {
                // Check whether the match is now over
                if (!backward && matchEndIndex < text.length || backward && matchStartIndex > 0) {
                  returnValue = handleMatch(matchStartIndex, matchEndIndex);
                  break;
                }
              } else {
                insideRegexMatch = true;
              }
            }
          } else if ((matchStartIndex = text.indexOf(searchTerm)) != -1) {
            returnValue = handleMatch(matchStartIndex, matchStartIndex + searchTerm.length);
            break;
          }
        }

        // Check whether regex match extends to the end of the range
        if (insideRegexMatch) {
          returnValue = handleMatch(matchStartIndex, matchEndIndex);
        }
        it.dispose();
        return returnValue;
      }
      function createEntryPointFunction(func) {
        return function () {
          var sessionRunning = !!currentSession;
          var session = getSession();
          var args = [session].concat(util.toArray(arguments));
          var returnValue = func.apply(this, args);
          if (!sessionRunning) {
            endSession();
          }
          return returnValue;
        };
      }

      /*----------------------------------------------------------------------------------------------------------------*/

      // Extensions to the Rangy Range object

      function createRangeBoundaryMover(isStart, collapse) {
        /*
         Unit can be "character" or "word"
         Options:
          - includeTrailingSpace
         - wordRegex
         - tokenizer
         - collapseSpaceBeforeLineBreak
         */
        return createEntryPointFunction(function (session, unit, count, moveOptions) {
          if (typeof count == UNDEF) {
            count = unit;
            unit = CHARACTER;
          }
          moveOptions = createNestedOptions(moveOptions, defaultMoveOptions);
          var boundaryIsStart = isStart;
          if (collapse) {
            boundaryIsStart = count >= 0;
            this.collapse(!boundaryIsStart);
          }
          var moveResult = movePositionBy(session.getRangeBoundaryPosition(this, boundaryIsStart), unit, count, moveOptions.characterOptions, moveOptions.wordOptions);
          var newPos = moveResult.position;
          this[boundaryIsStart ? "setStart" : "setEnd"](newPos.node, newPos.offset);
          return moveResult.unitsMoved;
        });
      }
      function createRangeTrimmer(isStart) {
        return createEntryPointFunction(function (session, characterOptions) {
          characterOptions = createOptions(characterOptions, defaultCharacterOptions);
          var pos;
          var it = createRangeCharacterIterator(session, this, characterOptions, !isStart);
          var trimCharCount = 0;
          while ((pos = it.next()) && allWhiteSpaceRegex.test(pos.character)) {
            ++trimCharCount;
          }
          it.dispose();
          var trimmed = trimCharCount > 0;
          if (trimmed) {
            this[isStart ? "moveStart" : "moveEnd"]("character", isStart ? trimCharCount : -trimCharCount, {
              characterOptions: characterOptions
            });
          }
          return trimmed;
        });
      }
      extend(api.rangePrototype, {
        moveStart: createRangeBoundaryMover(true, false),
        moveEnd: createRangeBoundaryMover(false, false),
        move: createRangeBoundaryMover(true, true),
        trimStart: createRangeTrimmer(true),
        trimEnd: createRangeTrimmer(false),
        trim: createEntryPointFunction(function (session, characterOptions) {
          var startTrimmed = this.trimStart(characterOptions),
            endTrimmed = this.trimEnd(characterOptions);
          return startTrimmed || endTrimmed;
        }),
        expand: createEntryPointFunction(function (session, unit, expandOptions) {
          var moved = false;
          expandOptions = createNestedOptions(expandOptions, defaultExpandOptions);
          var characterOptions = expandOptions.characterOptions;
          if (!unit) {
            unit = CHARACTER;
          }
          if (unit == WORD) {
            var wordOptions = expandOptions.wordOptions;
            var startPos = session.getRangeBoundaryPosition(this, true);
            var endPos = session.getRangeBoundaryPosition(this, false);
            var startTokenizedTextProvider = createTokenizedTextProvider(startPos, characterOptions, wordOptions);
            var startToken = startTokenizedTextProvider.nextEndToken();
            var newStartPos = startToken.chars[0].previousVisible();
            var endToken, newEndPos;
            if (this.collapsed) {
              endToken = startToken;
            } else {
              var endTokenizedTextProvider = createTokenizedTextProvider(endPos, characterOptions, wordOptions);
              endToken = endTokenizedTextProvider.previousStartToken();
            }
            newEndPos = endToken.chars[endToken.chars.length - 1];
            if (!newStartPos.equals(startPos)) {
              this.setStart(newStartPos.node, newStartPos.offset);
              moved = true;
            }
            if (newEndPos && !newEndPos.equals(endPos)) {
              this.setEnd(newEndPos.node, newEndPos.offset);
              moved = true;
            }
            if (expandOptions.trim) {
              if (expandOptions.trimStart) {
                moved = this.trimStart(characterOptions) || moved;
              }
              if (expandOptions.trimEnd) {
                moved = this.trimEnd(characterOptions) || moved;
              }
            }
            return moved;
          } else {
            return this.moveEnd(CHARACTER, 1, expandOptions);
          }
        }),
        text: createEntryPointFunction(function (session, characterOptions) {
          return this.collapsed ? "" : getRangeCharacters(session, this, createOptions(characterOptions, defaultCharacterOptions)).join("");
        }),
        selectCharacters: createEntryPointFunction(function (session, containerNode, startIndex, endIndex, characterOptions) {
          var moveOptions = {
            characterOptions: characterOptions
          };
          if (!containerNode) {
            containerNode = getBody(this.getDocument());
          }
          this.selectNodeContents(containerNode);
          this.collapse(true);
          this.moveStart("character", startIndex, moveOptions);
          this.collapse(true);
          this.moveEnd("character", endIndex - startIndex, moveOptions);
        }),
        // Character indexes are relative to the start of node
        toCharacterRange: createEntryPointFunction(function (session, containerNode, characterOptions) {
          if (!containerNode) {
            containerNode = getBody(this.getDocument());
          }
          var parent = containerNode.parentNode,
            nodeIndex = dom.getNodeIndex(containerNode);
          var rangeStartsBeforeNode = dom.comparePoints(this.startContainer, this.endContainer, parent, nodeIndex) == -1;
          var rangeBetween = this.cloneRange();
          var startIndex, endIndex;
          if (rangeStartsBeforeNode) {
            rangeBetween.setStartAndEnd(this.startContainer, this.startOffset, parent, nodeIndex);
            startIndex = -rangeBetween.text(characterOptions).length;
          } else {
            rangeBetween.setStartAndEnd(parent, nodeIndex, this.startContainer, this.startOffset);
            startIndex = rangeBetween.text(characterOptions).length;
          }
          endIndex = startIndex + this.text(characterOptions).length;
          return {
            start: startIndex,
            end: endIndex
          };
        }),
        findText: createEntryPointFunction(function (session, searchTermParam, findOptions) {
          // Set up options
          findOptions = createNestedOptions(findOptions, defaultFindOptions);

          // Create word options if we're matching whole words only
          if (findOptions.wholeWordsOnly) {
            // We don't ever want trailing spaces for search results
            findOptions.wordOptions.includeTrailingSpace = false;
          }
          var backward = isDirectionBackward(findOptions.direction);

          // Create a range representing the search scope if none was provided
          var searchScopeRange = findOptions.withinRange;
          if (!searchScopeRange) {
            searchScopeRange = api.createRange();
            searchScopeRange.selectNodeContents(this.getDocument());
          }

          // Examine and prepare the search term
          var searchTerm = searchTermParam,
            isRegex = false;
          if (typeof searchTerm == "string") {
            if (!findOptions.caseSensitive) {
              searchTerm = searchTerm.toLowerCase();
            }
          } else {
            isRegex = true;
          }
          var initialPos = session.getRangeBoundaryPosition(this, !backward);

          // Adjust initial position if it lies outside the search scope
          var comparison = searchScopeRange.comparePoint(initialPos.node, initialPos.offset);
          if (comparison === -1) {
            initialPos = session.getRangeBoundaryPosition(searchScopeRange, true);
          } else if (comparison === 1) {
            initialPos = session.getRangeBoundaryPosition(searchScopeRange, false);
          }
          var pos = initialPos;
          var wrappedAround = false;

          // Try to find a match and ignore invalid ones
          var findResult;
          while (true) {
            findResult = findTextFromPosition(pos, searchTerm, isRegex, searchScopeRange, findOptions);
            if (findResult) {
              if (findResult.valid) {
                this.setStartAndEnd(findResult.startPos.node, findResult.startPos.offset, findResult.endPos.node, findResult.endPos.offset);
                return true;
              } else {
                // We've found a match that is not a whole word, so we carry on searching from the point immediately
                // after the match
                pos = backward ? findResult.startPos : findResult.endPos;
              }
            } else if (findOptions.wrap && !wrappedAround) {
              // No result found but we're wrapping around and limiting the scope to the unsearched part of the range
              searchScopeRange = searchScopeRange.cloneRange();
              pos = session.getRangeBoundaryPosition(searchScopeRange, !backward);
              searchScopeRange.setBoundary(initialPos.node, initialPos.offset, backward);
              wrappedAround = true;
            } else {
              // Nothing found and we can't wrap around, so we're done
              return false;
            }
          }
        }),
        pasteHtml: function (html) {
          this.deleteContents();
          if (html) {
            var frag = this.createContextualFragment(html);
            var lastChild = frag.lastChild;
            this.insertNode(frag);
            this.collapseAfter(lastChild);
          }
        }
      });

      /*----------------------------------------------------------------------------------------------------------------*/

      // Extensions to the Rangy Selection object

      function createSelectionTrimmer(methodName) {
        return createEntryPointFunction(function (session, characterOptions) {
          var trimmed = false;
          this.changeEachRange(function (range) {
            trimmed = range[methodName](characterOptions) || trimmed;
          });
          return trimmed;
        });
      }
      extend(api.selectionPrototype, {
        expand: createEntryPointFunction(function (session, unit, expandOptions) {
          this.changeEachRange(function (range) {
            range.expand(unit, expandOptions);
          });
        }),
        move: createEntryPointFunction(function (session, unit, count, options) {
          var unitsMoved = 0;
          if (this.focusNode) {
            this.collapse(this.focusNode, this.focusOffset);
            var range = this.getRangeAt(0);
            if (!options) {
              options = {};
            }
            options.characterOptions = createOptions(options.characterOptions, defaultCaretCharacterOptions);
            unitsMoved = range.move(unit, count, options);
            this.setSingleRange(range);
          }
          return unitsMoved;
        }),
        trimStart: createSelectionTrimmer("trimStart"),
        trimEnd: createSelectionTrimmer("trimEnd"),
        trim: createSelectionTrimmer("trim"),
        selectCharacters: createEntryPointFunction(function (session, containerNode, startIndex, endIndex, direction, characterOptions) {
          var range = api.createRange(containerNode);
          range.selectCharacters(containerNode, startIndex, endIndex, characterOptions);
          this.setSingleRange(range, direction);
        }),
        saveCharacterRanges: createEntryPointFunction(function (session, containerNode, characterOptions) {
          var ranges = this.getAllRanges(),
            rangeCount = ranges.length;
          var rangeInfos = [];
          var backward = rangeCount == 1 && this.isBackward();
          for (var i = 0, len = ranges.length; i < len; ++i) {
            rangeInfos[i] = {
              characterRange: ranges[i].toCharacterRange(containerNode, characterOptions),
              backward: backward,
              characterOptions: characterOptions
            };
          }
          return rangeInfos;
        }),
        restoreCharacterRanges: createEntryPointFunction(function (session, containerNode, saved) {
          this.removeAllRanges();
          for (var i = 0, len = saved.length, range, rangeInfo, characterRange; i < len; ++i) {
            rangeInfo = saved[i];
            characterRange = rangeInfo.characterRange;
            range = api.createRange(containerNode);
            range.selectCharacters(containerNode, characterRange.start, characterRange.end, rangeInfo.characterOptions);
            this.addRange(range, rangeInfo.backward);
          }
        }),
        text: createEntryPointFunction(function (session, characterOptions) {
          var rangeTexts = [];
          for (var i = 0, len = this.rangeCount; i < len; ++i) {
            rangeTexts[i] = this.getRangeAt(i).text(characterOptions);
          }
          return rangeTexts.join("");
        })
      });

      /*----------------------------------------------------------------------------------------------------------------*/

      // Extensions to the core rangy object

      api.innerText = function (el, characterOptions) {
        var range = api.createRange(el);
        range.selectNodeContents(el);
        var text = range.text(characterOptions);
        return text;
      };
      api.createWordIterator = function (startNode, startOffset, iteratorOptions) {
        var session = getSession();
        iteratorOptions = createNestedOptions(iteratorOptions, defaultWordIteratorOptions);
        var startPos = session.getPosition(startNode, startOffset);
        var tokenizedTextProvider = createTokenizedTextProvider(startPos, iteratorOptions.characterOptions, iteratorOptions.wordOptions);
        var backward = isDirectionBackward(iteratorOptions.direction);
        return {
          next: function () {
            return backward ? tokenizedTextProvider.previousStartToken() : tokenizedTextProvider.nextEndToken();
          },
          dispose: function () {
            tokenizedTextProvider.dispose();
            this.next = function () {};
          }
        };
      };

      /*----------------------------------------------------------------------------------------------------------------*/

      api.noMutation = function (func) {
        var session = getSession();
        func(session);
        endSession();
      };
      api.noMutation.createEntryPointFunction = createEntryPointFunction;
      api.textRange = {
        isBlockNode: isBlockNode,
        isCollapsedWhitespaceNode: isCollapsedWhitespaceNode,
        createPosition: createEntryPointFunction(function (session, node, offset) {
          return session.getPosition(node, offset);
        })
      };
    });
    return rangy;
  }, commonjsGlobal);
})(rangyTextrange$1, rangyTextrange$1.exports);
var rangyTextrange = rangyTextrange$1.exports;

window.rangy = rangy$1;
const keyCodes$1 = {};
for (const code in key_names) {
  const name = key_names[code];
  keyCodes$1[name] = code;
}
const keys = {
  left: "ArrowLeft",
  right: "ArrowRight"
};
const moveCursor = async options => {
  let direction, times;
  if (typeof options === "string") {
    direction = options;
  } else {
    times = options.times;
    direction = options.direction;
  }
  if (!times) times = 1;
  const move = async () => {
    await nextFrame();
    if (triggerEvent(document.activeElement, "keydown", {
      keyCode: keyCodes$1[direction],
      key: keys[direction]
    })) {
      const selection = rangy$1.getSelection();
      selection.move("character", direction === "right" ? 1 : -1);
      selectionChangeObserver.update();
    }
    if (--times === 0) {
      await nextFrame();
      return getCursorCoordinates();
    } else {
      return move();
    }
  };
  return await move();
};
const expandSelection = async options => {
  await nextFrame();
  let direction, times;
  if (typeof options === "string") {
    direction = options;
  } else {
    ({
      direction
    } = options);
    times = options.times;
  }
  if (!times) times = 1;
  const expand = async () => {
    await nextFrame();
    if (triggerEvent(document.activeElement, "keydown", {
      keyCode: keyCodes$1[direction],
      key: keys[direction],
      shiftKey: true
    })) {
      getComposition().expandSelectionInDirection(direction === "left" ? "backward" : "forward");
    }
    if (--times === 0) {
      await nextFrame();
    } else {
      return await expand();
    }
  };
  return await expand();
};
const collapseSelection = async direction => {
  const selection = rangy$1.getSelection();
  if (direction === "left") {
    selection.collapseToStart();
  } else {
    selection.collapseToEnd();
  }
  selectionChangeObserver.update();
  await nextFrame();
};
const selectAll = async () => {
  rangy$1.getSelection().selectAllChildren(document.activeElement);
  selectionChangeObserver.update();
  await nextFrame();
};
const deleteSelection = () => {
  const selection = rangy$1.getSelection();
  selection.getRangeAt(0).deleteContents();
  selectionChangeObserver.update();
};
const selectionIsCollapsed = () => rangy$1.getSelection().isCollapsed;
const insertNode = async node => {
  const selection = rangy$1.getSelection();
  const range = selection.getRangeAt(0);
  range.splitBoundaries();
  range.insertNode(node);
  range.setStartAfter(node);
  range.deleteContents();
  selection.setSingleRange(range);
  selectionChangeObserver.update();
  await nextFrame();
};
const selectNode = async node => {
  const selection = rangy$1.getSelection();
  selection.selectAllChildren(node);
  selectionChangeObserver.update();
};
const createDOMRangeFromPoint = function (px, py) {
  if (document.caretPositionFromPoint) {
    const {
      offsetNode,
      offset
    } = document.caretPositionFromPoint(px, py);
    const domRange = document.createRange();
    domRange.setStart(offsetNode, offset);
    return domRange;
  } else if (document.caretRangeFromPoint) {
    return document.caretRangeFromPoint(px, py);
  }
};
const getCursorCoordinates = () => {
  const rect = window.getSelection().getRangeAt(0).getClientRects()[0];
  if (rect) {
    return {
      clientX: rect.left,
      clientY: rect.top + rect.height / 2
    };
  }
};

const keyCodes = {};
Object.keys(key_names).forEach(code => {
  const name = key_names[code];
  keyCodes[name] = code;
});
const isIE = /Windows.*Trident/.test(navigator.userAgent);
const triggerInputEvent = function (element, type) {
  let properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (input.getLevel() === 2) {
    let ranges;
    if (properties.ranges) {
      ({
        ranges
      } = properties);
      delete properties.ranges;
    } else {
      ranges = [];
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        ranges.push(selection.getRangeAt(0).cloneRange());
      }
    }
    properties.getTargetRanges = () => ranges;
    triggerEvent(element, type, properties);
  }
};
const pasteContent = async (contentType, value) => {
  let data;
  if (typeof contentType === "object") {
    data = contentType;
  } else {
    data = {
      [contentType]: value
    };
  }
  const testClipboardData = {
    getData: type => data[type],
    types: Object.keys(data),
    items: Object.values(data)
  };
  if (testClipboardData.types.includes("Files")) {
    testClipboardData.files = testClipboardData.items;
  }
  triggerInputEvent(document.activeElement, "beforeinput", {
    inputType: "insertFromPaste",
    dataTransfer: testClipboardData
  });
  triggerEvent(document.activeElement, "paste", {
    testClipboardData
  });
  await nextFrame();
};
const createFile$1 = function () {
  let properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const file = {
    getAsFile() {
      return {};
    }
  };
  for (const key in properties) {
    const value = properties[key];
    file[key] = value;
  }
  return file;
};
const typeCharacters = async string => {
  const characters = Array.isArray(string) ? string : string.split("");
  const typeNextCharacter = async () => {
    await delay(10);
    const character = characters.shift();
    if (character == null) return;
    switch (character) {
      case "\n":
        await pressKey("return");
        await typeNextCharacter();
        break;
      case "\b":
        await pressKey("backspace");
        await typeNextCharacter();
        break;
      default:
        await typeCharacterInElement(character, document.activeElement);
        await typeNextCharacter();
    }
  };
  await typeNextCharacter();
  await delay(10);
};
const pressKey = async keyName => {
  const element = document.activeElement;
  const code = keyCodes[keyName];
  const properties = {
    which: code,
    keyCode: code,
    charCode: 0,
    key: capitalize(keyName)
  };
  if (!triggerEvent(element, "keydown", properties)) return;
  await simulateKeypress(keyName);
  await nextFrame();
  triggerEvent(element, "keyup", properties);
  await nextFrame();
};
const startComposition = async data => {
  const element = document.activeElement;
  triggerEvent(element, "compositionstart", {
    data: ""
  });
  triggerInputEvent(element, "beforeinput", {
    inputType: "insertCompositionText",
    data
  });
  triggerEvent(element, "compositionupdate", {
    data
  });
  triggerEvent(element, "input");
  const node = document.createTextNode(data);
  insertNode(node);
  await selectNode(node);
};
const updateComposition = async data => {
  const element = document.activeElement;
  triggerInputEvent(element, "beforeinput", {
    inputType: "insertCompositionText",
    data
  });
  triggerEvent(element, "compositionupdate", {
    data
  });
  triggerEvent(element, "input");
  const node = document.createTextNode(data);
  insertNode(node);
  await selectNode(node);
};
const endComposition = async data => {
  const element = document.activeElement;
  triggerInputEvent(element, "beforeinput", {
    inputType: "insertCompositionText",
    data
  });
  triggerEvent(element, "compositionupdate", {
    data
  });
  const node = document.createTextNode(data);
  insertNode(node);
  selectNode(node);
  await collapseSelection("right");
  triggerEvent(element, "input");
  triggerEvent(element, "compositionend", {
    data
  });
  await nextFrame();
};
const clickElement = async element => {
  if (triggerEvent(element, "mousedown")) {
    await nextFrame();
    if (triggerEvent(element, "mouseup")) {
      await nextFrame();
      triggerEvent(element, "click");
      await nextFrame();
    }
  }
};
const dragToCoordinates = async coordinates => {
  const element = document.activeElement;

  // IE only allows writing "text" to DataTransfer
  // https://msdn.microsoft.com/en-us/library/ms536744(v=vs.85).aspx
  const dataTransfer = {
    files: [],
    data: {},
    getData(format) {
      if (isIE && format.toLowerCase() !== "text") {
        throw new Error("Invalid argument.");
      } else {
        this.data[format];
        return true;
      }
    },
    setData(format, data) {
      if (isIE && format.toLowerCase() !== "text") {
        throw new Error("Unexpected call to method or property access.");
      } else {
        this.data[format] = data;
      }
    }
  };
  triggerEvent(element, "mousemove");
  const dragstartData = {
    dataTransfer
  };
  triggerEvent(element, "dragstart", dragstartData);
  triggerInputEvent(element, "beforeinput", {
    inputType: "deleteByDrag"
  });
  const dropData = {
    dataTransfer
  };
  for (const key in coordinates) {
    const value = coordinates[key];
    dropData[key] = value;
  }
  triggerEvent(element, "drop", dropData);
  const {
    clientX,
    clientY
  } = coordinates;
  const domRange = createDOMRangeFromPoint(clientX, clientY);
  triggerInputEvent(element, "beforeinput", {
    inputType: "insertFromDrop",
    ranges: [domRange]
  });
  await nextFrame();
};
const mouseDownOnElementAndMove = async (element, distance) => {
  const coordinates = getElementCoordinates(element);
  triggerEvent(element, "mousedown", coordinates);
  const destination = offset => ({
    clientX: coordinates.clientX + offset,
    clientY: coordinates.clientY + offset
  });
  const dragSpeed = 20;
  await delay(dragSpeed);
  let offset = 0;
  const drag = async () => {
    if (++offset <= distance) {
      triggerEvent(element, "mousemove", destination(offset));
      await delay(dragSpeed);
      drag();
    } else {
      triggerEvent(element, "mouseup", destination(distance));
      await delay(dragSpeed);
    }
  };
  drag();
};
const typeCharacterInElement = async (character, element) => {
  const charCode = character.charCodeAt(0);
  const keyCode = character.toUpperCase().charCodeAt(0);
  if (!triggerEvent(element, "keydown", {
    keyCode,
    charCode: 0
  })) return;
  await nextFrame();
  if (!triggerEvent(element, "keypress", {
    keyCode: charCode,
    charCode
  })) return;
  triggerInputEvent(element, "beforeinput", {
    inputType: "insertText",
    data: character
  });
  await insertCharacter(character);
  triggerEvent(element, "input");
  await nextFrame();
  triggerEvent(element, "keyup", {
    keyCode,
    charCode: 0
  });
};
const insertCharacter = async character => {
  const node = document.createTextNode(character);
  await insertNode(node);
};
const simulateKeypress = async keyName => {
  switch (keyName) {
    case "backspace":
      await deleteInDirection("left");
      break;
    case "delete":
      await deleteInDirection("right");
      break;
    case "return":
      triggerInputEvent(document.activeElement, "beforeinput", {
        inputType: "insertParagraph"
      });
      break;
  }
};
const deleteInDirection = async direction => {
  if (selectionIsCollapsed()) {
    getComposition().expandSelectionInDirection(direction === "left" ? "backward" : "forward");
    await nextFrame();
    const inputType = direction === "left" ? "deleteContentBackward" : "deleteContentForward";
    triggerInputEvent(document.activeElement, "beforeinput", {
      inputType
    });
    await nextFrame();
    deleteSelection();
  } else {
    triggerInputEvent(document.activeElement, "beforeinput", {
      inputType: "deleteContentBackward"
    });
    deleteSelection();
  }
};
const getElementCoordinates = function (element) {
  const rect = element.getBoundingClientRect();
  return {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  };
};
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const insertString = function (string) {
  getComposition().insertString(string);
  render();
};
const insertText = function (text) {
  getComposition().insertText(text);
  render();
};
const insertDocument = function (document) {
  getComposition().insertDocument(document);
  render();
};
const insertFile = function (file) {
  getComposition().insertFile(file);
  render();
};
const insertAttachment = function (attachment) {
  getComposition().insertAttachment(attachment);
  render();
};
const insertAttachments = function (attachments) {
  getComposition().insertAttachments(attachments);
  render();
};
const insertImageAttachment = function (attributes) {
  const attachment = createImageAttachment(attributes);
  return insertAttachment(attachment);
};
const createImageAttachment = function (attributes) {
  if (!attributes) {
    attributes = {
      url: TEST_IMAGE_URL,
      width: 10,
      height: 10,
      filename: "image.gif",
      filesize: 35,
      contentType: "image/gif"
    };
  }
  return new Attachment(attributes);
};
const replaceDocument = function (document) {
  getComposition().setDocument(document);
  render();
};
const render = () => getEditorController().render();

const clickToolbarButton = async selector => {
  selectionChangeObserver.update();
  const button = getToolbarButton(selector);
  triggerEvent(button, "mousedown");
  await delay(5);
};
const typeToolbarKeyCommand = async selector => {
  const button = getToolbarButton(selector);
  const {
    trixKey
  } = button.dataset;
  if (trixKey) {
    const keyCode = trixKey.toUpperCase().charCodeAt(0);
    triggerEvent(getEditorElement(), "keydown", {
      keyCode,
      charCode: 0,
      metaKey: true,
      ctrlKey: true
    });
  }
  await nextFrame();
};
const clickToolbarDialogButton = async _ref => {
  let {
    method
  } = _ref;
  const button = getToolbarElement().querySelector("[data-trix-dialog] [data-trix-method='".concat(method, "']"));
  triggerEvent(button, "click");
  await nextFrame();
};
const isToolbarButtonActive = function (selector) {
  const button = getToolbarButton(selector);
  return button.hasAttribute("data-trix-active") && button.classList.contains("trix-active");
};
const isToolbarButtonDisabled = selector => getToolbarButton(selector).disabled;
const typeInToolbarDialog = async (string, _ref2) => {
  let {
    attribute
  } = _ref2;
  const dialog = getToolbarDialog({
    attribute
  });
  const input = dialog.querySelector("[data-trix-input][name='".concat(attribute, "']"));
  const button = dialog.querySelector("[data-trix-method='setAttribute']");
  input.value = string;
  triggerEvent(button, "click");
  await nextFrame();
};
const isToolbarDialogActive = function (selector) {
  const dialog = getToolbarDialog(selector);
  return dialog.hasAttribute("data-trix-active") && dialog.classList.contains("trix-active");
};
const getToolbarButton = _ref3 => {
  let {
    attribute,
    action
  } = _ref3;
  return getToolbarElement().querySelector("[data-trix-attribute='".concat(attribute, "'], [data-trix-action='").concat(action, "']"));
};
const getToolbarDialog = _ref4 => {
  let {
    attribute,
    action
  } = _ref4;
  return getToolbarElement().querySelector("[data-trix-dialog='".concat(attribute, "']"));
};

window.Trix = Trix;
Trix.config.undo.interval = 0;
QUnit.config.hidepassed = true;
QUnit.config.testTimeout = 20000;
document.head.insertAdjacentHTML("beforeend", "<style type=\"text/css\">\n    #trix-container { height: 150px; }\n    trix-toolbar { margin-bottom: 10px; }\n    trix-toolbar button { border: 1px solid #ccc; background: #fff; }\n    trix-toolbar button.active { background: #d3e6fd; }\n    trix-toolbar button:disabled { color: #ccc; }\n    #qunit { position: relative !important; }\n  </style>");

testGroup("Attachment", () => {
  const previewableTypes = "image image/gif image/png image/jpg image/webp".split(" ");
  const nonPreviewableTypes = "image/tiff application/foo".split(" ");
  const createAttachment = attributes => new Attachment(attributes);
  previewableTypes.forEach(contentType => {
    test$3("".concat(contentType, " content type is previewable"), () => {
      assert.ok(createAttachment({
        contentType
      }).isPreviewable());
    });
  });
  nonPreviewableTypes.forEach(contentType => {
    test$3("".concat(contentType, " content type is NOT previewable"), () => {
      assert.notOk(createAttachment({
        contentType
      }).isPreviewable());
    });
  });
  test$3("'previewable' attribute determines previewability", () => {
    let attrs = {
      previewable: true,
      contentType: nonPreviewableTypes[0]
    };
    assert.ok(createAttachment(attrs).isPreviewable());
    attrs = {
      previewable: false,
      contentType: previewableTypes[0]
    };
    assert.notOk(createAttachment(attrs).isPreviewable());
  });
});

testGroup("BIDI", () => {
  test$3("detects text direction", () => {
    assert.equal(getDirection("abc"), "ltr");
    assert.equal(getDirection("אבג"), "rtl");
  });
});

testGroup("Block", () => {
  test$3("consolidating blocks creates text with one blockBreak piece", () => {
    const blockA = new Block(Text.textForStringWithAttributes("a"));
    const blockB = new Block(Text.textForStringWithAttributes("b"));
    const consolidatedBlock = blockA.consolidateWith(blockB);
    const pieces = consolidatedBlock.text.getPieces();
    assert.equal(pieces.length, 2, JSON.stringify(pieces));
    assert.deepEqual(pieces[0].getAttributes(), {});
    assert.deepEqual(pieces[1].getAttributes(), {
      blockBreak: true
    });
    assert.equal(consolidatedBlock.toString(), "a\nb\n");
  });
  test$3("consolidating empty blocks creates text with one blockBreak piece", () => {
    const consolidatedBlock = new Block().consolidateWith(new Block());
    const pieces = consolidatedBlock.text.getPieces();
    assert.equal(pieces.length, 2, JSON.stringify(pieces));
    assert.deepEqual(pieces[0].getAttributes(), {});
    assert.deepEqual(pieces[1].getAttributes(), {
      blockBreak: true
    });
    assert.equal(consolidatedBlock.toString(), "\n\n");
  });
});

let composition = null;
const setup = () => {
  composition = new Composition();
  composition.delegate = new TestCompositionDelegate();
};
testGroup("Composition", {
  setup
}, () => test$3("deleteInDirection respects UTF-16 character boundaries", () => {
  composition.insertString("abc😭");
  composition.deleteInDirection("backward");
  composition.insertString("d");
  assert.equal(composition.document.toString(), "abcd\n");
}));

testGroup("Document", () => {
  const createDocumentWithAttachment = function (attachment) {
    const text = Text.textForAttachmentWithAttributes(attachment);
    return new Document([new Block(text)]);
  };
  test$3("documents with different attachments are not equal", () => {
    const aDoc = createDocumentWithAttachment(new Attachment({
      url: "a"
    }));
    const bDoc = createDocumentWithAttachment(new Attachment({
      url: "b"
    }));
    assert.notOk(aDoc.isEqualTo(bDoc));
  });
  test$3("getStringAtRange does not leak trailing block breaks", () => {
    const document = Document.fromString("Hey");
    assert.equal(document.getStringAtRange([0, 0]), "");
    assert.equal(document.getStringAtRange([0, 1]), "H");
    assert.equal(document.getStringAtRange([0, 2]), "He");
    assert.equal(document.getStringAtRange([0, 3]), "Hey");
    assert.equal(document.getStringAtRange([0, 4]), "Hey\n");
  });
  test$3("findRangesForTextAttribute", () => {
    const document = HTMLParser.parse("\n      <div>Hello <strong>world, <em>this</em> is</strong> a <strong>test</strong>.<br></div>\n    ").getDocument();
    assert.deepEqual(document.findRangesForTextAttribute("bold"), [[6, 20], [23, 27]]);
    assert.deepEqual(document.findRangesForTextAttribute("italic"), [[13, 17]]);
    assert.deepEqual(document.findRangesForTextAttribute("href"), []);
  });
  test$3("findRangesForTextAttribute withValue", () => {
    const document = HTMLParser.parse("\n      <div>Hello <a href=\"http://google.com/\">world, <em>this</em> is</a> a <a href=\"http://basecamp.com/\">test</a>.<br></div>\n    ").getDocument();
    assert.deepEqual(document.findRangesForTextAttribute("href"), [[6, 20], [23, 27]]);
    assert.deepEqual(document.findRangesForTextAttribute("href", {
      withValue: "http://google.com/"
    }), [[6, 20]]);
    assert.deepEqual(document.findRangesForTextAttribute("href", {
      withValue: "http://basecamp.com/"
    }), [[23, 27]]);
    assert.deepEqual(document.findRangesForTextAttribute("href", {
      withValue: "http://amazon.com/"
    }), []);
  });
});

testGroup("DocumentView", () => {
  eachFixture((name, details) => {
    test$3(name, () => {
      assert.documentHTMLEqual(details.document, details.html);
    });
  });
});

let meta = null;
const insertMeta = attributes => {
  meta = makeElement("meta", attributes);
  document.head.append(meta);
};
const installDefaultCSS = (tagName, css) => {
  installDefaultCSSForTagName(tagName, css);
  return document.querySelector("style[data-tag-name=".concat(tagName, "]"));
};
const teardown = () => meta.remove();
testGroup("Helpers: Custom Elements", {
  teardown
}, () => {
  test$3("reads from meta[name=csp-nonce][content]", () => {
    insertMeta({
      name: "csp-nonce",
      content: "abc123"
    });
    const style = installDefaultCSS("trix-element", "trix-element { display: block; }");
    assert.equal(style.getAttribute("nonce"), "abc123");
    assert.equal(style.innerHTML, "trix-element { display: block; }");
  });
  test$3("reads from meta[name=trix-csp-nonce][content]", () => {
    insertMeta({
      name: "trix-csp-nonce",
      content: "abc123"
    });
    const style = installDefaultCSS("trix-element", "trix-element { display: block; }");
    assert.equal(style.getAttribute("nonce"), "abc123");
    assert.equal(style.innerHTML, "trix-element { display: block; }");
  });
  test$3("reads from meta[name=csp-nonce][nonce]", () => {
    insertMeta({
      name: "csp-nonce",
      nonce: "abc123"
    });
    const style = installDefaultCSS("trix-element", "trix-element { display: block; }");
    assert.equal(style.getAttribute("nonce"), "abc123");
    assert.equal(style.innerHTML, "trix-element { display: block; }");
  });
  test$3("reads from meta[name=trix-csp-nonce][nonce]", () => {
    insertMeta({
      name: "trix-csp-nonce",
      nonce: "abc123"
    });
    const style = installDefaultCSS("trix-element", "trix-element { display: block; }");
    assert.equal(style.getAttribute("nonce"), "abc123");
    assert.equal(style.innerHTML, "trix-element { display: block; }");
  });
});

const cursorTargetLeft = createCursorTarget("left").outerHTML;
const cursorTargetRight = createCursorTarget("right").outerHTML;
testGroup("HTMLParser", () => {
  eachFixture((name, _ref) => {
    let {
      html,
      document
    } = _ref;
    test$3(name, () => {
      const parsedDocument = HTMLParser.parse(html).getDocument();
      assert.documentHTMLEqual(parsedDocument.copyUsingObjectsFromDocument(document), html);
    });
  });
  eachFixture((name, _ref2) => {
    let {
      html,
      serializedHTML,
      document
    } = _ref2;
    if (serializedHTML) {
      test$3("".concat(name, " (serialized)"), () => {
        const parsedDocument = HTMLParser.parse(serializedHTML).getDocument();
        assert.documentHTMLEqual(parsedDocument.copyUsingObjectsFromDocument(document), html);
      });
    }
  });
  testGroup("nested line breaks", () => {
    const cases = {
      "<div>a<div>b</div>c</div>": "<div><!--block-->a<br>b<br>c</div>",
      "<div>a<div><div><div>b</div></div></div>c</div>": "<div><!--block-->a<br>b<br>c</div>",
      "<blockquote>a<div>b</div>c</blockquote>": "<blockquote><!--block-->a<br>b<br>c</blockquote>"
    };
    // TODO:
    // "<div><div>a</div><div>b</div>c</div>": "<div><!--block-->a<br>b<br>c</div>"
    // "<blockquote><div>a</div><div>b</div><div>c</div></blockquote>": "<blockquote><!--block-->a<br>b<br>c</blockquote>"
    // "<blockquote><div>a<br></div><div><br></div><div>b<br></div></blockquote>": "<blockquote><!--block-->a<br><br>b</blockquote>"

    for (const [html, expectedHTML] of Object.entries(cases)) {
      test$3(html, () => {
        assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
      });
    }
  });
  test$3("parses absolute image URLs", () => {
    const src = "".concat(getOrigin(), "/test_helpers/fixtures/logo.png");
    const pattern = new RegExp("src=\"".concat(src, "\""));
    const html = "<img src=\"".concat(src, "\">");
    const finalHTML = getHTML(HTMLParser.parse(html).getDocument());
    assert.ok(pattern.test(finalHTML), "".concat(pattern, " not found in ").concat(JSON.stringify(finalHTML)));
  });
  test$3("parses relative image URLs", () => {
    const src = "/test_helpers/fixtures/logo.png";
    const pattern = new RegExp("src=\"".concat(src, "\""));
    const html = "<img src=\"".concat(src, "\">");
    const finalHTML = getHTML(HTMLParser.parse(html).getDocument());
    assert.ok(pattern.test(finalHTML), "".concat(pattern, " not found in ").concat(JSON.stringify(finalHTML)));
  });
  test$3("parses unfamiliar html", () => {
    const html = "<meta charset=\"UTF-8\"><span style=\"font-style: italic\">abc</span><span>d</span><section style=\"margin:0\"><blink>123</blink><a href=\"http://example.com\">45<b>6</b></a>x<br />y</section><p style=\"margin:0\">9</p>";
    const expectedHTML = "<div><!--block--><em>abc</em>d</div><div><!--block-->123<a href=\"http://example.com\">45<strong>6</strong></a>x<br>y</div><div><!--block-->9</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("ignores leading whitespace before <meta> tag", () => {
    const html = " \n <meta charset=\"UTF-8\"><pre>abc</pre>";
    const expectedHTML = "<pre><!--block-->abc</pre>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("ignores content after </html>", () => {
    const html = "\n      <html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" xmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\" xmlns=\"http://www.w3.org/TR/REC-html40\">\n      <head>\n      <meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">\n      <meta name=ProgId content=Word.Document>\n      </head>\n\n      <body lang=EN-US link=blue vlink=\"#954F72\" style='tab-interval:.5in'>\n      <!--StartFragment--><span lang=EN style='font-size:12.0pt;font-family:\n      \"Arial\",sans-serif;mso-fareast-font-family:\"Times New Roman\";mso-ansi-language:\n      EN;mso-fareast-language:EN-US;mso-bidi-language:AR-SA'>abc</span><!--EndFragment-->\n      </body>\n\n      </html>\n      TAxelFCg\uFFFD\uFFFDK\uFFFD\uFFFD";
    const expectedHTML = "<div><!--block-->abc</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses incorrectly nested list html", () => {
    const html = "<ul><li>a</li><ul><li>b</li><ol><li>1</li><li>2</li><ol></ul></ul>";
    const expectedHTML = "<ul><li><!--block-->a<ul><li><!--block-->b<ol><li><!--block-->1</li><li><!--block-->2</li></ol></li></ul></li></ul>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("ignores whitespace between block elements", () => {
    const html = "<div>a</div> \n <div>b</div>     <article>c</article>  \n\n <section>d</section> ";
    const expectedHTML = "<div><!--block-->a</div><div><!--block-->b</div><div><!--block-->c</div><div><!--block-->d</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("ingores whitespace between nested block elements", () => {
    const html = "<ul> <li>a</li> \n  <li>b</li>  </ul><div>  <div> \n <blockquote>c</blockquote>\n </div>  \n</div>";
    const expectedHTML = "<ul><li><!--block-->a</li><li><!--block-->b</li></ul><blockquote><!--block-->c</blockquote>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("ignores inline whitespace that can't be displayed", () => {
    const html = " a  \n b    <span>c\n</span><span>d  \ne </span> f <span style=\"white-space: pre\">  g\n\n h  </span>";
    const expectedHTML = "<div><!--block-->a b c d e f &nbsp; g<br><br>&nbsp;h &nbsp;</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses significant whitespace in empty inline elements", () => {
    const html = "a<span style='mso-spacerun:yes'> </span>b<span style='mso-spacerun:yes'>  </span>c";
    const expectedHTML = "<div><!--block-->a b c</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses block elements with leading breakable whitespace", () => {
    const html = "<blockquote> <span>a</span> <blockquote>\n <strong>b</strong> <pre> <span>c</span></pre></blockquote></blockquote>";
    const expectedHTML = "<blockquote><!--block-->a<blockquote><!--block--><strong>b</strong><pre><!--block--> c</pre></blockquote></blockquote>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses block elements with leading non-breaking whitespace", () => {
    const html = "<blockquote>&nbsp;<span>a</span></blockquote>";
    const expectedHTML = "<blockquote><!--block-->&nbsp;a</blockquote>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("converts newlines to spaces", () => {
    const html = "<div>a\nb \nc \n d \n\ne</div><pre>1\n2</pre>";
    const expectedHTML = "<div><!--block-->a b c d e</div><pre><!--block-->1\n2</pre>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses entire HTML document", () => {
    const html = "<html><head><style>.bold {font-weight: bold}</style></head><body><span class=\"bold\">abc</span></body></html>";
    const expectedHTML = "<div><!--block--><strong>abc</strong></div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses inline element following block element", () => {
    const html = "<blockquote>abc</blockquote><strong>123</strong>";
    const expectedHTML = "<blockquote><!--block-->abc</blockquote><div><!--block--><strong>123</strong></div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses text nodes following block elements", () => {
    const html = "<ul><li>a</li></ul>b<blockquote>c</blockquote>d";
    const expectedHTML = "<ul><li><!--block-->a</li></ul><div><!--block-->b</div><blockquote><!--block-->c</blockquote><div><!--block-->d</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses whitespace-only text nodes without a containing block element", () => {
    const html = "a <strong>b</strong> <em>c</em>";
    const expectedHTML = "<div><!--block-->a <strong>b</strong> <em>c</em></div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses spaces around cursor targets", () => {
    const html = "<div>a ".concat(cursorTargetLeft, "<span>b</span>").concat(cursorTargetRight, " c</div>");
    const expectedHTML = "<div><!--block-->a b c</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses spanned text elements that don't have a parser function", () => {
    assert.notOk(text_attributes.strike.parser);
    const html = "<del>a <strong>b</strong></del>";
    const expectedHTML = "<div><!--block--><del>a </del><strong><del>b</del></strong></div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("translates tables into plain text", () => {
    const html = "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td><p>2</p></td></tr><table>";
    const expectedHTML = "<div><!--block-->a | b<br>1 | 2</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("allows customizing table separater", () => {
    withParserConfig({
      tableCellSeparator: "*",
      tableRowSeparator: "-"
    }, () => {
      const html = "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td><p>2</p></td></tr><table>";
      const expectedHTML = "<div><!--block-->a*b-1*2</div>";
      assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
    });
  });
  test$3("includes empty cells when translating tables into plain text", () => {
    const html = "<table><tr><td> </td><td></td></tr><tr><td>1</td><td><p>2</p></td></tr><table>";
    const expectedHTML = "<div><!--block-->&nbsp;|&nbsp;<br>1 | 2</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("allows removing empty table cells from translated tables", () => {
    withParserConfig({
      removeBlankTableCells: true
    }, () => {
      const html = "<table><tr><td> </td><td>\n</td></tr><tr><td>1</td><td><p>2</p></td></tr><table>";
      const expectedHTML = "<div><!--block-->1 | 2</div>";
      assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
    });
  });
  test$3("translates block element margins to newlines", () => {
    const html = "<p style=\"margin: 0 0 1em 0\">a</p><p style=\"margin: 0\">b</p><article style=\"margin: 1em 0 0 0\">c</article>";
    const expectedHTML = "<div><!--block-->a<br><br></div><div><!--block-->b</div><div><!--block--><br>c</div>";
    const document = HTMLParser.parse(html).getDocument();
    assert.documentHTMLEqual(document, expectedHTML);
  });
  test$3("skips translating empty block element margins to newlines", () => {
    const html = "<p style=\"margin: 0 0 1em 0\">a</p><p style=\"margin: 0 0 1em 0\"><span></span></p><p style=\"margin: 0\">b</p>";
    const expectedHTML = "<div><!--block-->a<br><br></div><div><!--block--><br></div><div><!--block-->b</div>";
    const document = HTMLParser.parse(html).getDocument();
    assert.documentHTMLEqual(document, expectedHTML);
  });
  test$3("ignores text nodes in script elements", () => {
    const html = "<div>a<script>alert(\"b\")</script></div>";
    const expectedHTML = "<div><!--block-->a</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("ignores iframe elements", () => {
    const html = "<div>a<iframe src=\"data:text/html;base64,PHNjcmlwdD5hbGVydCgneHNzJyk7PC9zY3JpcHQ+\">b</iframe></div>";
    const expectedHTML = "<div><!--block-->a</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("sanitizes unsafe html", async () => {
    window.unsanitized = [];
    HTMLParser.parse("\n      <img onload=\"window.unsanitized.push('img.onload');\" src=\"".concat(TEST_IMAGE_URL, "\">\n      <img onerror=\"window.unsanitized.push('img.onerror');\" src=\"data:image/gif;base64,TOTALLYBOGUS\">\n      <script>\n        window.unsanitized.push('script tag');\n      </script>"));
    await delay(20);
    assert.deepEqual(window.unsanitized, []);
    delete window.unsanitized;
  });
  test$3("forbids href attributes with javascript: protocol", () => {
    const html = "<a href=\"javascript:alert()\">a</a> <a href=\" javascript: alert()\">b</a> <a href=\"JavaScript:alert()\">c</a>";
    const expectedHTML = "<div><!--block-->a b c</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("ignores attachment elements with malformed JSON", () => {
    const html = "<div>a</div><div data-trix-attachment data-trix-attributes></div>" + "<div data-trix-attachment=\"\" data-trix-attributes=\"\"></div>" + "<div data-trix-attachment=\"{&quot;x:}\" data-trix-attributes=\"{&quot;x:}\"></div>" + "<div>b</div>";
    const expectedHTML = "<div><!--block-->a</div><div><!--block--><br></div><div><!--block-->b</div>";
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML);
  });
  test$3("parses attachment caption from large html string", () => {
    let {
      html
    } = fixtures["image attachment with edited caption"];
    for (let i = 1; i <= 30; i++) {
      html += fixtures["image attachment"].html;
    }
    for (let n = 1; n <= 3; n++) {
      const attachmentPiece = HTMLParser.parse(html).getDocument().getAttachmentPieces()[0];
      assert.equal(attachmentPiece.getCaption(), "Example");
    }
  });
  test$3("parses foreground color when configured", () => {
    const attrConfig = {
      foregroundColor: {
        styleProperty: "color"
      }
    };
    withTextAttributeConfig(attrConfig, () => {
      const html = "<span style=\"color: rgb(60, 179, 113);\">green</span>";
      const expectedHTML = "<div><!--block--><span style=\"color: rgb(60, 179, 113);\">green</span></div>";
      const document = HTMLParser.parse(html).getDocument();
      assert.documentHTMLEqual(document, expectedHTML);
    });
  });
  test$3("parses background color when configured", () => {
    const attrConfig = {
      backgroundColor: {
        styleProperty: "backgroundColor"
      }
    };
    withTextAttributeConfig(attrConfig, () => {
      const html = "<span style=\"background-color: yellow;\">on yellow</span>";
      const expectedHTML = "<div><!--block--><span style=\"background-color: yellow;\">on yellow</span></div>";
      const document = HTMLParser.parse(html).getDocument();
      assert.documentHTMLEqual(document, expectedHTML);
    });
  });
  test$3("parses configured foreground color on formatted text", () => {
    const attrConfig = {
      foregroundColor: {
        styleProperty: "color"
      }
    };
    withTextAttributeConfig(attrConfig, () => {
      const html = "<strong style=\"color: rgb(60, 179, 113);\">GREEN</strong>";
      const expectedHTML = "<div><!--block--><strong style=\"color: rgb(60, 179, 113);\">GREEN</strong></div>";
      const document = HTMLParser.parse(html).getDocument();
      assert.documentHTMLEqual(document, expectedHTML);
    });
  });
  test$3("parses foreground color using configured parser function", () => {
    const attrConfig = {
      foregroundColor: {
        styleProperty: "color",
        parser(element) {
          const {
            color
          } = element.style;
          if (color === "rgb(60, 179, 113)") {
            return color;
          }
        }
      }
    };
    withTextAttributeConfig(attrConfig, () => {
      const html = "<span style=\"color: rgb(60, 179, 113);\">green</span><span style=\"color: yellow;\">not yellow</span>";
      const expectedHTML = "<div><!--block--><span style=\"color: rgb(60, 179, 113);\">green</span>not yellow</div>";
      const document = HTMLParser.parse(html).getDocument();
      assert.documentHTMLEqual(document, expectedHTML);
    });
  });
});
const withParserConfig = function () {
  let attrConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let fn = arguments.length > 1 ? arguments[1] : undefined;
  withConfig$1("parser", attrConfig, fn);
};
const withTextAttributeConfig = function () {
  let attrConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let fn = arguments.length > 1 ? arguments[1] : undefined;
  withConfig$1("textAttributes", attrConfig, fn);
};
const withConfig$1 = function (section) {
  let newConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let fn = arguments.length > 2 ? arguments[2] : undefined;
  const originalConfig = Object.assign({}, config[section]);
  const copy = (section, properties) => {
    for (const [key, value] of Object.entries(properties)) {
      if (value) {
        config[section][key] = value;
      } else {
        delete config[section][key];
      }
    }
  };
  try {
    copy(section, newConfig);
    fn();
  } finally {
    copy(section, originalConfig);
  }
};
const getOrigin = () => {
  const {
    protocol,
    hostname,
    port
  } = window.location;
  return "".concat(protocol, "//").concat(hostname).concat(port ? ":".concat(port) : "");
};

testGroup("HTMLSanitizer", () => {
  test$3("strips custom tags", () => {
    const html = "<custom-tag></custom-tag>";
    const expectedHTML = "";
    const document = HTMLSanitizer.sanitize(html).body.innerHTML;
    assert.equal(document, expectedHTML);
  });
  test$3("keeps custom tags configured for DOMPurify", () => {
    const config = {
      ADD_TAGS: ["custom-tag"],
      RETURN_DOM: true
    };
    withDOMPurifyConfig(config, () => {
      const html = "<custom-tag></custom-tag>";
      const expectedHTML = "<custom-tag></custom-tag>";
      const document = HTMLSanitizer.sanitize(html).body.innerHTML;
      assert.equal(document, expectedHTML);
    });
  });
});
const withDOMPurifyConfig = function () {
  let attrConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let fn = arguments.length > 1 ? arguments[1] : undefined;
  withConfig("dompurify", attrConfig, fn);
};
const withConfig = function (section) {
  let newConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let fn = arguments.length > 2 ? arguments[2] : undefined;
  const originalConfig = Object.assign({}, config[section]);
  const copy = (section, properties) => {
    for (const [key, value] of Object.entries(properties)) {
      if (value) {
        config[section][key] = value;
      } else {
        delete config[section][key];
      }
    }
  };
  try {
    copy(section, newConfig);
    fn();
  } finally {
    copy(section, originalConfig);
  }
};

testGroup("LocationMapper", () => {
  test$3("findLocationFromContainerAndOffset", () => {
    setDocument([
    // <trix-editor>
    // 0 <div>
    //     0 <!--block-->
    //     1 <strong>
    //         0 a
    //         1 <br>
    //       </strong>
    //     2 <br>
    //   </div>
    // 1 <blockquote>
    //     0 <!--block-->
    //     1 b😭cd
    //     2 <span data-trix-cursor-target>
    //         0 (zero-width space)
    //       </span>
    //     3 <a href="data:image/png," data-trix-attachment="" ...>
    //         0 <figure ...>...</figure>
    //       </a>
    //     4 <span data-trix-cursor-target>
    //         0 (zero-width space)
    //       </span>
    //     5 e
    //   </blockquote>
    // </trix-editor>
    {
      text: [{
        type: "string",
        attributes: {
          bold: true
        },
        string: "a\n"
      }, {
        type: "string",
        attributes: {
          blockBreak: true
        },
        string: "\n"
      }],
      attributes: []
    }, {
      text: [{
        type: "string",
        attributes: {},
        string: "b😭cd"
      }, {
        type: "attachment",
        attributes: {},
        attachment: {
          contentType: "image/png",
          filename: "x.png",
          filesize: 0,
          height: 13,
          href: TEST_IMAGE_URL,
          identifier: "1",
          url: TEST_IMAGE_URL,
          width: 15
        }
      }, {
        type: "string",
        attributes: {},
        string: "e"
      }, {
        type: "string",
        attributes: {
          blockBreak: true
        },
        string: "\n"
      }],
      attributes: ["quote"]
    }]);
    const assertions = [{
      location: [0, 0],
      container: [],
      offset: 0
    }, {
      location: [0, 0],
      container: [0],
      offset: 0
    }, {
      location: [0, 0],
      container: [0],
      offset: 1
    }, {
      location: [0, 0],
      container: [0, 1],
      offset: 0
    }, {
      location: [0, 0],
      container: [0, 1, 0],
      offset: 0
    }, {
      location: [0, 1],
      container: [0, 1, 0],
      offset: 1
    }, {
      location: [0, 1],
      container: [0, 1],
      offset: 1
    }, {
      location: [0, 2],
      container: [0, 1],
      offset: 2
    }, {
      location: [0, 2],
      container: [0],
      offset: 2
    }, {
      location: [0, 3],
      container: [],
      offset: 1
    }, {
      location: [0, 3],
      container: [1],
      offset: 0
    }, {
      location: [1, 0],
      container: [1],
      offset: 1
    }, {
      location: [1, 0],
      container: [1, 1],
      offset: 0
    }, {
      location: [1, 1],
      container: [1, 1],
      offset: 1
    }, {
      location: [1, 2],
      container: [1, 1],
      offset: 2
    }, {
      location: [1, 3],
      container: [1, 1],
      offset: 3
    }, {
      location: [1, 4],
      container: [1, 1],
      offset: 4
    }, {
      location: [1, 5],
      container: [1, 1],
      offset: 5
    }, {
      location: [1, 6],
      container: [1, 1],
      offset: 6
    }, {
      location: [1, 5],
      container: [1],
      offset: 2
    }, {
      location: [1, 5],
      container: [1, 2],
      offset: 0
    }, {
      location: [1, 5],
      container: [1, 2],
      offset: 1
    }, {
      location: [1, 5],
      container: [1],
      offset: 3
    }, {
      location: [1, 5],
      container: [1, 3],
      offset: 0
    }, {
      location: [1, 5],
      container: [1, 3],
      offset: 1
    }, {
      location: [1, 6],
      container: [1],
      offset: 4
    }, {
      location: [1, 6],
      container: [1, 4],
      offset: 0
    }, {
      location: [1, 6],
      container: [1, 4],
      offset: 1
    }, {
      location: [1, 6],
      container: [1],
      offset: 5
    }, {
      location: [1, 6],
      container: [1, 5],
      offset: 0
    }, {
      location: [1, 7],
      container: [1, 5],
      offset: 1
    }, {
      location: [1, 7],
      container: [],
      offset: 2
    }];
    for (const assertion of assertions) {
      const path = assertion.container;
      const container = findContainer(path);
      const {
        offset
      } = assertion;
      const expectedLocation = {
        index: assertion.location[0],
        offset: assertion.location[1]
      };
      const actualLocation = mapper.findLocationFromContainerAndOffset(container, offset);
      assert.equal(format(actualLocation), format(expectedLocation), "".concat(describe(container), " at [").concat(path.join(", "), "], offset ").concat(offset, " = ").concat(format(expectedLocation)));
    }
  });
  test$3("findContainerAndOffsetFromLocation: (0/0)", () => {
    setDocument([
    // <trix-editor>
    // 0 <ul>
    //     0 <li>
    //         0 <!--block-->
    //         1 <br>
    //       </li>
    //   </ul>
    // </trix-editor>
    {
      text: [{
        type: "string",
        attributes: {
          blockBreak: true
        },
        string: "\n"
      }],
      attributes: ["bulletList", "bullet"]
    }]);
    const location = {
      index: 0,
      offset: 0
    };
    const container = findContainer([0, 0]);
    const offset = 1;
    assert.deepEqual(mapper.findContainerAndOffsetFromLocation(location), [container, offset]);
  });
  test$3("findContainerAndOffsetFromLocation after newline in formatted text", () => {
    setDocument([
    // <trix-editor>
    // 0 <div>
    //     0 <!--block-->
    //     0 <strong>
    //         0 a
    //         1 <br>
    //       </strong>
    //   </div>
    // </trix-editor>
    {
      text: [{
        type: "string",
        attributes: {
          bold: true
        },
        string: "a\n"
      }, {
        type: "string",
        attributes: {
          blockBreak: true
        },
        string: "\n"
      }],
      attributes: []
    }]);
    const location = {
      index: 0,
      offset: 2
    };
    const container = findContainer([0]);
    const offset = 2;
    assert.deepEqual(mapper.findContainerAndOffsetFromLocation(location), [container, offset]);
  });
  test$3("findContainerAndOffsetFromLocation after nested block", () => {
    setDocument([
    // <trix-editor>
    //   <blockquote>
    //     <ul>
    //       <li>
    //         <!--block-->
    //         a
    //       </li>
    //     </ul>
    //     <!--block-->
    //     <br>
    //   </blockquote>
    // </trix-editor>
    {
      text: [{
        type: "string",
        attributes: {},
        string: "a"
      }, {
        type: "string",
        attributes: {
          blockBreak: true
        },
        string: "\n"
      }],
      attributes: ["quote", "bulletList", "bullet"]
    }, {
      text: [{
        type: "string",
        attributes: {
          blockBreak: true
        },
        string: "\n"
      }],
      attributes: ["quote"]
    }]);
    const location = {
      index: 1,
      offset: 0
    };
    const container = findContainer([0]);
    const offset = 2;
    assert.deepEqual(mapper.findContainerAndOffsetFromLocation(location), [container, offset]);
  });
});

// ---
let document$1 = null;
let element$1 = null;
let mapper = null;
const setDocument = json => {
  document$1 = Document.fromJSON(json);
  element$1 = DocumentView.render(document$1);
  mapper = new LocationMapper(element$1);
};
const findContainer = path => {
  let el = element$1;
  for (const index of path) {
    el = el.childNodes[index];
  }
  return el;
};
const format = _ref => {
  let {
    index,
    offset
  } = _ref;
  return "".concat(index, "/").concat(offset);
};
const describe = node => {
  if (node.nodeType === Node.TEXT_NODE) {
    return "text node ".concat(JSON.stringify(node.textContent));
  } else {
    return "container <".concat(node.tagName.toLowerCase(), ">");
  }
};

let observer = null;
let element = null;
let summaries = [];
const install = function (html) {
  element = document.createElement("div");
  if (html) {
    element.innerHTML = html;
  }
  observer = new MutationObserver(element);
  observer.delegate = {
    elementDidMutate(summary) {
      summaries.push(summary);
    }
  };
};
const uninstall = () => {
  var _observer;
  (_observer = observer) === null || _observer === void 0 || _observer.stop();
  observer = null;
  element = null;
  summaries = [];
};
const observerTest = function (name) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let callback = arguments.length > 2 ? arguments[2] : undefined;
  test$3(name, async () => {
    install(options.html);
    await callback();
    uninstall();
  });
};
testGroup("MutationObserver", () => {
  observerTest("add character", {
    html: "a"
  }, async () => {
    element.firstChild.data += "b";
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textAdded: "b"
    });
  });
  observerTest("remove character", {
    html: "ab"
  }, async () => {
    element.firstChild.data = "a";
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textDeleted: "b"
    });
  });
  observerTest("replace character", {
    html: "ab"
  }, async () => {
    element.firstChild.data = "ac";
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textAdded: "c",
      textDeleted: "b"
    });
  });
  observerTest("add <br>", {
    html: "a"
  }, async () => {
    element.appendChild(document.createElement("br"));
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textAdded: "\n"
    });
  });
  observerTest("remove <br>", {
    html: "a<br>"
  }, async () => {
    element.removeChild(element.lastChild);
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textDeleted: "\n"
    });
  });
  observerTest("remove block comment", {
    html: "<div><!--block-->a</div>"
  }, async () => {
    element.firstChild.removeChild(element.firstChild.firstChild);
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textDeleted: "\n"
    });
  });
  observerTest("remove formatted element", {
    html: "a<strong>b</strong>"
  }, async () => {
    element.removeChild(element.lastChild);
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textDeleted: "b"
    });
  });
  observerTest("remove nested formatted elements", {
    html: "a<strong>b<em>c</em></strong>"
  }, async () => {
    element.removeChild(element.lastChild);
    await nextFrame();
    assert.equal(summaries.length, 1);
    assert.deepEqual(summaries[0], {
      textDeleted: "bc"
    });
  });
});

testGroup("serializeToContentType", () => {
  eachFixture((name, details) => {
    if (details.serializedHTML) {
      test$3(name, () => {
        assert.equal(serializeToContentType(details.document, "text/html"), details.serializedHTML);
      });
    }
  });
});

testGroup("summarizeStringChange", () => {
  const assertions = {
    "no change": {
      oldString: "abc",
      newString: "abc",
      change: {
        added: "",
        removed: ""
      }
    },
    "adding a character": {
      oldString: "",
      newString: "a",
      change: {
        added: "a",
        removed: ""
      }
    },
    "appending a character": {
      oldString: "ab",
      newString: "abc",
      change: {
        added: "c",
        removed: ""
      }
    },
    "appending a multibyte character": {
      oldString: "a💩",
      newString: "a💩💩",
      change: {
        added: "💩",
        removed: ""
      }
    },
    "prepending a character": {
      oldString: "bc",
      newString: "abc",
      change: {
        added: "a",
        removed: ""
      }
    },
    "inserting a character": {
      oldString: "ac",
      newString: "abc",
      change: {
        added: "b",
        removed: ""
      }
    },
    "inserting a string": {
      oldString: "ac",
      newString: "aZZZc",
      change: {
        added: "ZZZ",
        removed: ""
      }
    },
    "replacing a character": {
      oldString: "abc",
      newString: "aZc",
      change: {
        added: "Z",
        removed: "b"
      }
    },
    "replacing a character with a string": {
      oldString: "abc",
      newString: "aXYc",
      change: {
        added: "XY",
        removed: "b"
      }
    },
    "replacing a string with a character": {
      oldString: "abcde",
      newString: "aXe",
      change: {
        added: "X",
        removed: "bcd"
      }
    },
    "replacing a string with a string": {
      oldString: "abcde",
      newString: "aBCDe",
      change: {
        added: "BCD",
        removed: "bcd"
      }
    },
    "removing a character": {
      oldString: "abc",
      newString: "ac",
      change: {
        added: "",
        removed: "b"
      }
    }
  };
  for (const name in assertions) {
    test$3(name, () => {
      const details = assertions[name];
      const {
        oldString,
        newString,
        change
      } = details;
      assert.deepEqual(summarizeStringChange(oldString, newString), change);
    });
  }
});

testGroup("Text", () => testGroup("#removeTextAtRange", () => {
  test$3("removes text with range in single piece", () => {
    const text = new Text([new StringPiece("abc")]);
    const pieces = text.removeTextAtRange([0, 1]).getPieces();
    assert.equal(pieces.length, 1);
    assert.equal(pieces[0].toString(), "bc");
    assert.deepEqual(pieces[0].getAttributes(), {});
  });
  test$3("removes text with range spanning pieces", () => {
    const text = new Text([new StringPiece("abc"), new StringPiece("123", {
      bold: true
    })]);
    const pieces = text.removeTextAtRange([2, 4]).getPieces();
    assert.equal(pieces.length, 2);
    assert.equal(pieces[0].toString(), "ab");
    assert.deepEqual(pieces[0].getAttributes(), {});
    assert.equal(pieces[1].toString(), "23");
    assert.deepEqual(pieces[1].getAttributes(), {
      bold: true
    });
  });
}));

testGroup("Accessibility attributes", {
  template: "editor_default_aria_label"
}, () => {
  test$3("sets the role to textbox", () => {
    const editor = document.getElementById("editor-without-labels");
    assert.equal(editor.getAttribute("role"), "textbox");
  });
  skipIf(TrixEditorElement.formAssociated, "does not set aria-label when the element has no <label> elements", () => {
    const editor = document.getElementById("editor-without-labels");
    assert.equal(editor.hasAttribute("aria-label"), false);
  });
  skipIf(TrixEditorElement.formAssociated, "does not override aria-label when the element declares it", () => {
    const editor = document.getElementById("editor-with-aria-label");
    assert.equal(editor.getAttribute("aria-label"), "ARIA Label text");
  });
  skipIf(TrixEditorElement.formAssociated, "does not set aria-label when the element declares aria-labelledby", () => {
    const editor = document.getElementById("editor-with-aria-labelledby");
    assert.equal(editor.hasAttribute("aria-label"), false);
    assert.equal(editor.getAttribute("aria-labelledby"), "aria-labelledby-id");
  });
  skipIf(TrixEditorElement.formAssociated, "assigns aria-label to the text of the element's <label> elements", () => {
    const editor = document.getElementById("editor-with-labels");
    assert.equal(editor.getAttribute("aria-label"), "Label 1 Label 2 Label 3");
  });
  skipIf(TrixEditorElement.formAssociated, "updates the aria-label on focus", () => {
    const editor = document.getElementById("editor-with-modified-label");
    const label = document.getElementById("modified-label");
    label.innerHTML = "<span>New Value</span>";
    triggerEvent(editor, "focus");
    assert.equal(editor.getAttribute("aria-label"), "New Value");
  });
});

testGroup("Attachment captions", {
  template: "editor_empty"
}, () => {
  test$3("default caption includes file name and size", () => {
    insertImageAttachment();
    const element = getCaptionElement();
    assert.notOk(element.hasAttribute("data-trix-placeholder"));
    assert.equal(element.textContent, "image.gif 35 Bytes");
  });
  test$3("caption excludes file name when configured", () => {
    withPreviewCaptionConfig({
      name: false,
      size: true
    }, () => {
      insertImageAttachment();
      const element = getCaptionElement();
      assert.notOk(element.hasAttribute("data-trix-placeholder"));
      assert.equal(element.textContent, "35 Bytes");
    });
  });
  test$3("caption excludes file size when configured", () => {
    withPreviewCaptionConfig({
      name: true,
      size: false
    }, () => {
      insertImageAttachment();
      const element = getCaptionElement();
      assert.notOk(element.hasAttribute("data-trix-placeholder"));
      assert.equal(element.textContent, "image.gif");
    });
  });
  test$3("caption is empty when configured", () => {
    withPreviewCaptionConfig({
      name: false,
      size: false
    }, () => {
      insertImageAttachment();
      const element = getCaptionElement();
      assert.ok(element.hasAttribute("data-trix-placeholder"));
      assert.equal(element.getAttribute("data-trix-placeholder"), lang$1.captionPlaceholder);
      assert.equal(element.textContent, "");
    });
  });
});
const withPreviewCaptionConfig = (captionConfig, fn) => {
  if (!captionConfig) captionConfig = {};
  const {
    caption
  } = attachments.preview;
  attachments.preview.caption = captionConfig;
  try {
    return fn();
  } finally {
    attachments.preview.caption = caption;
  }
};
const getCaptionElement = () => getEditorElement().querySelector("figcaption");

const ORC = OBJECT_REPLACEMENT_CHARACTER;
testGroup("Attachment galleries", {
  template: "editor_empty"
}, () => {
  test$3("inserting more than one image attachment creates a gallery block", () => {
    insertAttachments(createImageAttachments(2));
    assert.blockAttributes([0, 2], ["attachmentGallery"]);
    expectDocument("".concat(ORC).concat(ORC, "\n"));
  });
  test$3("gallery formatting is removed from blocks containing less than two image attachments", async () => {
    insertAttachments(createImageAttachments(2));
    assert.blockAttributes([0, 2], ["attachmentGallery"]);
    getEditor().setSelectedRange([1, 2]);
    await pressKey("backspace");
    await nextFrame();
    assert.blockAttributes([0, 2], []);
    expectDocument("".concat(ORC, "\n"));
  });
  test$3("typing in an attachment gallery block splits it", async () => {
    insertAttachments(createImageAttachments(4));
    getEditor().setSelectedRange(2);
    await typeCharacters("a");
    await nextFrame();
    assert.blockAttributes([0, 2], ["attachmentGallery"]);
    assert.blockAttributes([3, 4], []);
    assert.blockAttributes([5, 7], ["attachmentGallery"]);
    expectDocument("".concat(ORC).concat(ORC, "\na\n").concat(ORC).concat(ORC, "\n"));
  });
  test$3("inserting a gallery in a formatted block", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    await typeCharacters("abc");
    insertAttachments(createImageAttachments(2));
    await nextFrame();
    assert.blockAttributes([0, 3], ["quote"]);
    assert.blockAttributes([4, 6], ["attachmentGallery"]);
    expectDocument("abc\n".concat(ORC).concat(ORC, "\n"));
  });
});
const createImageAttachments = function (num) {
  if (num == null) {
    num = 1;
  }
  const attachments = [];
  while (attachments.length < num) {
    attachments.push(createImageAttachment());
  }
  return attachments;
};

testGroup("Attachments", {
  template: "editor_with_image"
}, () => {
  test$3("moving an image by drag and drop", async () => {
    await typeCharacters("!");
    const coordinates = await moveCursor({
      direction: "right",
      times: 1
    });
    const img = document.activeElement.querySelector("img");
    triggerEvent(img, "mousedown");
    await nextFrame();
    await dragToCoordinates(coordinates);
    expectDocument("!a".concat(OBJECT_REPLACEMENT_CHARACTER, "b\n"));
  });
  test$3("removing an image", async () => {
    await delay(20);
    await clickElement(getFigure());
    const closeButton = getFigure().querySelector("[data-trix-action=remove]");
    await clickElement(closeButton);
    expectDocument("ab\n");
  });
  test$3("intercepting attachment toolbar creation", async () => {
    function insertToolbarButton(event) {
      const {
        toolbar,
        attachment
      } = event;
      assert.ok(toolbar.matches(".attachment__toolbar"));
      assert.equal(attachment.getContentType(), "image");
      toolbar.querySelector(".trix-button-group").insertAdjacentHTML("beforeend", "<button class=\"new-button\">👍</button>");
    }
    getEditorElement().addEventListener("trix-attachment-before-toolbar", insertToolbarButton, {
      once: true
    });
    await clickElement(getFigure());
    assert.ok(getEditorElement().querySelector(".trix-button-group .new-button"));
  });
  test$3("editing an image caption", async () => {
    await delay(20);
    await clickElement(findElement("figure"));
    await clickElement(findElement("figcaption"));
    await nextFrame();
    const textarea = findElement("textarea");
    assert.ok(textarea);
    textarea.focus();
    textarea.value = "my";
    triggerEvent(textarea, "input");
    await nextFrame();
    textarea.value = "";
    await nextFrame();
    textarea.value = "my caption";
    triggerEvent(textarea, "input");
    await pressKey("return");
    assert.notOk(findElement("textarea"));
    assert.textAttributes([2, 3], {
      caption: "my caption"
    });
    assert.locationRange({
      index: 0,
      offset: 3
    });
    expectDocument("ab".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
  });
  test$3("editing an attachment caption with no filename", async () => {
    await delay(20);
    let captionElement = findElement("figcaption");
    assert.ok(captionElement.clientHeight > 0);
    assert.equal(captionElement.getAttribute("data-trix-placeholder"), lang$1.captionPlaceholder);
    await clickElement(findElement("figure"));
    captionElement = findElement("figcaption");
    assert.ok(captionElement.clientHeight > 0);
    assert.equal(captionElement.getAttribute("data-trix-placeholder"), lang$1.captionPlaceholder);
  });
  test$3("updating an attachment's href attribute while editing its caption", async () => {
    const attachment = getEditorController().attachmentManager.getAttachments()[0];
    await delay(20);
    await clickElement(findElement("figure"));
    await clickElement(findElement("figcaption"));
    await nextFrame();
    let textarea = findElement("textarea");
    assert.ok(textarea);
    textarea.focus();
    textarea.value = "my caption";
    triggerEvent(textarea, "input");
    attachment.setAttributes({
      href: "https://example.com"
    });
    await nextFrame();
    textarea = findElement("textarea");
    assert.ok(document.activeElement === textarea);
    assert.equal(textarea.value, "my caption");
    await pressKey("return");
    assert.notOk(findElement("textarea"));
    assert.textAttributes([2, 3], {
      caption: "my caption"
    });
    assert.locationRange({
      index: 0,
      offset: 3
    });
    expectDocument("ab".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
  });
  testGroup("File insertion", {
    template: "editor_empty"
  }, () => {
    test$3("inserting a file in a formatted block", async () => {
      await clickToolbarButton({
        attribute: "bullet"
      });
      await clickToolbarButton({
        attribute: "bold"
      });
      getComposition().insertFile(createFile$1());
      assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
      assert.textAttributes([0, 1], {});
      expectDocument("".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
    });
    test$3("inserting a files in a formatted block", async () => {
      await clickToolbarButton({
        attribute: "quote"
      });
      await clickToolbarButton({
        attribute: "italic"
      });
      getComposition().insertFiles([createFile$1(), createFile$1()]);
      assert.blockAttributes([0, 2], ["quote"]);
      assert.textAttributes([0, 1], {});
      assert.textAttributes([1, 2], {});
      expectDocument("".concat(OBJECT_REPLACEMENT_CHARACTER).concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
    });
  });
});
const getFigure = () => findElement("figure");
const findElement = selector => getEditorElement().querySelector(selector);

testGroup("Basic input", {
  template: "editor_empty"
}, () => {
  test$3("typing", async () => {
    await typeCharacters("abc");
    expectDocument("abc\n");
  });
  test$3("backspacing", async () => {
    await typeCharacters("abc\b");
    expectDocument("ab\n");
  });
  test$3("pressing delete", async () => {
    await typeCharacters("ab");
    await moveCursor("left");
    await pressKey("delete");
    expectDocument("a\n");
  });
  test$3("pressing return", async () => {
    await typeCharacters("ab");
    await pressKey("return");
    await typeCharacters("c");
    expectDocument("ab\nc\n");
  });
  test$3("pressing escape in Safari", async () => {
    await typeCharacters("a");
    if (triggerEvent(document.activeElement, "keydown", {
      charCode: 0,
      keyCode: 27,
      which: 27,
      key: "Escape",
      code: "Escape"
    })) {
      triggerEvent(document.activeElement, "keypress", {
        charCode: 27,
        keyCode: 27,
        which: 27,
        key: "Escape",
        code: "Escape"
      });
    }
    await nextFrame();
    expectDocument("a\n");
  });
  test$3("pressing escape in Firefox", async () => {
    await typeCharacters("a");
    if (triggerEvent(document.activeElement, "keydown", {
      charCode: 0,
      keyCode: 27,
      which: 27,
      key: "Escape",
      code: "Escape"
    })) {
      triggerEvent(document.activeElement, "keypress", {
        charCode: 0,
        keyCode: 27,
        which: 0,
        key: "Escape",
        code: "Escape"
      });
    }
    await nextFrame();
    expectDocument("a\n");
  });
  test$3("pressing escape in Chrome", async () => {
    await typeCharacters("a");
    triggerEvent(document.activeElement, "keydown", {
      charCode: 0,
      keyCode: 27,
      which: 27,
      key: "Escape",
      code: "Escape"
    });
    await nextFrame();
    expectDocument("a\n");
  });
  test$3("cursor left", async () => {
    await typeCharacters("ac");
    await moveCursor("left");
    await typeCharacters("b");
    expectDocument("abc\n");
  });
  test$3("replace entire document", async () => {
    await typeCharacters("abc");
    await selectAll();
    await typeCharacters("d");
    expectDocument("d\n");
  });
  test$3("remove entire document", async () => {
    await typeCharacters("abc");
    await selectAll();
    await typeCharacters("\b");
    expectDocument("\n");
  });
  test$3("drag text", async () => {
    await typeCharacters("abc");
    const coordinates = await moveCursor({
      direction: "left",
      times: 2
    });
    await nextFrame();
    await moveCursor("right");
    await expandSelection("right");
    await dragToCoordinates(coordinates);
    await expectDocument("acb\n");
  });
  testIf(input.getLevel() === 0, "inserting newline after cursor (control + o)", async () => {
    await typeCharacters("ab");
    await moveCursor("left");
    triggerEvent(document.activeElement, "keydown", {
      charCode: 0,
      keyCode: 79,
      which: 79,
      ctrlKey: true
    });
    await nextFrame();
    assert.locationRange({
      index: 0,
      offset: 1
    });
    expectDocument("a\nb\n");
  });
  testIf(input.getLevel() === 0, "inserting ó with control + alt + o (AltGr)", async () => {
    await typeCharacters("ab");
    await moveCursor("left");
    if (triggerEvent(document.activeElement, "keydown", {
      charCode: 0,
      keyCode: 79,
      which: 79,
      altKey: true,
      ctrlKey: true
    })) {
      triggerEvent(document.activeElement, "keypress", {
        charCode: 243,
        keyCode: 243,
        which: 243,
        altKey: true,
        ctrlKey: true
      });
      insertNode(document.createTextNode("ó"));
    }
    await nextFrame();
    assert.locationRange({
      index: 0,
      offset: 2
    });
    expectDocument("aób\n");
  });
});

testGroup("Block formatting", {
  template: "editor_empty"
}, () => {
  test$3("applying block attributes", async () => {
    await typeCharacters("abc");
    await clickToolbarButton({
      attribute: "quote"
    });
    assert.blockAttributes([0, 4], ["quote"]);
    assert.ok(isToolbarButtonActive({
      attribute: "quote"
    }));
    await clickToolbarButton({
      attribute: "code"
    });
    assert.blockAttributes([0, 4], ["quote", "code"]);
    assert.ok(isToolbarButtonActive({
      attribute: "code"
    }));
    await clickToolbarButton({
      attribute: "code"
    });
    assert.blockAttributes([0, 4], ["quote"]);
    assert.notOk(isToolbarButtonActive({
      attribute: "code"
    }));
    assert.ok(isToolbarButtonActive({
      attribute: "quote"
    }));
  });
  test$3("applying block attributes to text after newline", async () => {
    await typeCharacters("a\nbc");
    await clickToolbarButton({
      attribute: "quote"
    });
    assert.blockAttributes([0, 2], []);
    assert.blockAttributes([2, 4], ["quote"]);
  });
  test$3("applying block attributes to text between newlines", async () => {
    await typeCharacters("ab\ndef\nghi\nj\n");
    await moveCursor({
      direction: "left",
      times: 2
    });
    await expandSelection({
      direction: "left",
      times: 5
    });
    await clickToolbarButton({
      attribute: "quote"
    });
    assert.blockAttributes([0, 3], []);
    assert.blockAttributes([3, 11], ["quote"]);
    assert.blockAttributes([11, 13], []);
  });
  test$3("applying bullets to text with newlines", async () => {
    await typeCharacters("abc\ndef\nghi\njkl\nmno\n");
    await moveCursor({
      direction: "left",
      times: 2
    });
    await expandSelection({
      direction: "left",
      times: 15
    });
    await clickToolbarButton({
      attribute: "bullet"
    });
    assert.blockAttributes([0, 4], ["bulletList", "bullet"]);
    assert.blockAttributes([4, 8], ["bulletList", "bullet"]);
    assert.blockAttributes([8, 12], ["bulletList", "bullet"]);
    assert.blockAttributes([12, 16], ["bulletList", "bullet"]);
    assert.blockAttributes([16, 20], ["bulletList", "bullet"]);
  });
  test$3("applying block attributes to adjacent unformatted blocks consolidates them", async () => {
    const document = new Document([new Block(Text.textForStringWithAttributes("1"), ["bulletList", "bullet"]), new Block(Text.textForStringWithAttributes("a"), []), new Block(Text.textForStringWithAttributes("b"), []), new Block(Text.textForStringWithAttributes("c"), []), new Block(Text.textForStringWithAttributes("2"), ["bulletList", "bullet"]), new Block(Text.textForStringWithAttributes("3"), ["bulletList", "bullet"])]);
    replaceDocument(document);
    getEditorController().setLocationRange([{
      index: 0,
      offset: 0
    }, {
      index: 5,
      offset: 1
    }]);
    await nextFrame();
    await clickToolbarButton({
      attribute: "quote"
    });
    assert.blockAttributes([0, 2], ["bulletList", "bullet", "quote"]);
    assert.blockAttributes([2, 8], ["quote"]);
    assert.blockAttributes([8, 10], ["bulletList", "bullet", "quote"]);
    assert.blockAttributes([10, 12], ["bulletList", "bullet", "quote"]);
  });
  test$3("breaking out of the end of a block", async () => {
    await typeCharacters("abc");
    await clickToolbarButton({
      attribute: "quote"
    });
    await typeCharacters("\n\n");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["quote"]);
    assert.equal(block.toString(), "abc\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), []);
    assert.equal(block.toString(), "\n");
    assert.locationRange({
      index: 1,
      offset: 0
    });
  });
  test$3("breaking out of the middle of a block before character", async () => {
    // * = cursor
    //
    // ab
    // *c
    //
    await typeCharacters("abc");
    await clickToolbarButton({
      attribute: "quote"
    });
    await moveCursor("left");
    await typeCharacters("\n\n");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["quote"]);
    assert.equal(block.toString(), "ab\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), []);
    assert.equal(block.toString(), "\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["quote"]);
    assert.equal(block.toString(), "c\n");
    assert.locationRange({
      index: 2,
      offset: 0
    });
  });
  test$3("breaking out of the middle of a block before newline", async () => {
    // * = cursor
    //
    // ab
    // *
    // c
    //
    await typeCharacters("abc");
    await clickToolbarButton({
      attribute: "quote"
    });
    await moveCursor("left");
    await typeCharacters("\n");
    await moveCursor("left");
    await typeCharacters("\n\n");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["quote"]);
    assert.equal(block.toString(), "ab\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), []);
    assert.equal(block.toString(), "\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["quote"]);
    assert.equal(block.toString(), "c\n");
  });
  test$3("breaking out of a formatted block with adjacent non-formatted blocks", async () => {
    // * = cursor
    //
    // a
    // b*
    // c
    let document = new Document([new Block(Text.textForStringWithAttributes("a"), []), new Block(Text.textForStringWithAttributes("b"), ["quote"]), new Block(Text.textForStringWithAttributes("c"), [])]);
    replaceDocument(document);
    getEditor().setSelectedRange(3);
    await typeCharacters("\n\n");
    document = getDocument();
    assert.equal(document.getBlockCount(), 4);
    assert.blockAttributes([0, 1], []);
    assert.blockAttributes([2, 3], ["quote"]);
    assert.blockAttributes([4, 5], []);
    assert.blockAttributes([5, 6], []);
    expectDocument("a\nb\n\nc\n");
  });
  test$3("breaking out a block after newline at offset 0", async () => {
    // * = cursor
    //
    //
    // *a
    //
    await typeCharacters("a");
    await clickToolbarButton({
      attribute: "quote"
    });
    await moveCursor("left");
    await typeCharacters("\n\n");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), []);
    assert.equal(block.toString(), "\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["quote"]);
    assert.equal(block.toString(), "a\n");
    assert.locationRange({
      index: 1,
      offset: 0
    });
  });
  test$3("deleting the only non-block-break character in a block", async () => {
    await typeCharacters("ab");
    await clickToolbarButton({
      attribute: "quote"
    });
    await typeCharacters("\b\b");
    assert.blockAttributes([0, 1], ["quote"]);
  });
  test$3("backspacing a quote", async () => {
    await nextFrame();
    await clickToolbarButton({
      attribute: "quote"
    });
    assert.blockAttributes([0, 1], ["quote"]);
    await pressKey("backspace");
    assert.blockAttributes([0, 1], []);
  });
  test$3("backspacing a nested quote", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    assert.blockAttributes([0, 1], ["quote", "quote"]);
    await pressKey("backspace");
    assert.blockAttributes([0, 1], ["quote"]);
    await pressKey("backspace");
    assert.blockAttributes([0, 1], []);
  });
  test$3("backspacing a list item", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    await pressKey("backspace");
    assert.blockAttributes([0, 0], []);
  });
  test$3("backspacing a nested list item", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a\n");
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    assert.blockAttributes([2, 3], ["bulletList", "bullet", "bulletList", "bullet"]);
    await pressKey("backspace");
    assert.blockAttributes([2, 3], ["bulletList", "bullet"]);
    expectDocument("a\n\n");
  });
  test$3("backspacing a list item inside a quote", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    await clickToolbarButton({
      attribute: "bullet"
    });
    assert.blockAttributes([0, 1], ["quote", "bulletList", "bullet"]);
    await pressKey("backspace");
    assert.blockAttributes([0, 1], ["quote"]);
    await pressKey("backspace");
    assert.blockAttributes([0, 1], []);
  });
  test$3("backspacing selected nested list items", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a\n");
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    await typeCharacters("b");
    getSelectionManager().setLocationRange([{
      index: 0,
      offset: 0
    }, {
      index: 1,
      offset: 1
    }]);
    await pressKey("backspace");
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    expectDocument("\n");
  });
  test$3("backspace selection spanning formatted blocks", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    await typeCharacters("ab\n\n");
    await clickToolbarButton({
      attribute: "code"
    });
    await typeCharacters("cd");
    getSelectionManager().setLocationRange([{
      index: 0,
      offset: 1
    }, {
      index: 1,
      offset: 1
    }]);
    getComposition().deleteInDirection("backward");
    assert.blockAttributes([0, 2], ["quote"]);
    expectDocument("ad\n");
  });
  test$3("backspace selection spanning and entire formatted block and a formatted block", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    await typeCharacters("ab\n\n");
    await clickToolbarButton({
      attribute: "code"
    });
    await typeCharacters("cd");
    getSelectionManager().setLocationRange([{
      index: 0,
      offset: 0
    }, {
      index: 1,
      offset: 1
    }]);
    getComposition().deleteInDirection("backward");
    assert.blockAttributes([0, 2], ["code"]);
    expectDocument("d\n");
  });
  test$3("increasing list level", async () => {
    assert.ok(isToolbarButtonDisabled({
      action: "increaseNestingLevel"
    }));
    assert.ok(isToolbarButtonDisabled({
      action: "decreaseNestingLevel"
    }));
    await clickToolbarButton({
      attribute: "bullet"
    });
    assert.ok(isToolbarButtonDisabled({
      action: "increaseNestingLevel"
    }));
    assert.notOk(isToolbarButtonDisabled({
      action: "decreaseNestingLevel"
    }));
    await typeCharacters("a\n");
    assert.notOk(isToolbarButtonDisabled({
      action: "increaseNestingLevel"
    }));
    assert.notOk(isToolbarButtonDisabled({
      action: "decreaseNestingLevel"
    }));
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    await typeCharacters("b");
    assert.ok(isToolbarButtonDisabled({
      action: "increaseNestingLevel"
    }));
    assert.notOk(isToolbarButtonDisabled({
      action: "decreaseNestingLevel"
    }));
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 4], ["bulletList", "bullet", "bulletList", "bullet"]);
  });
  test$3("changing list type", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    await clickToolbarButton({
      attribute: "number"
    });
    assert.blockAttributes([0, 1], ["numberList", "number"]);
  });
  test$3("adding bullet to heading block", async () => {
    await clickToolbarButton({
      attribute: "heading1"
    });
    await clickToolbarButton({
      attribute: "bullet"
    });
    assert.ok(isToolbarButtonActive({
      attribute: "heading1"
    }));
    assert.blockAttributes([1, 2], []);
  });
  test$3("removing bullet from heading block", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await clickToolbarButton({
      attribute: "heading1"
    });
    assert.ok(isToolbarButtonDisabled({
      attribute: "bullet"
    }));
  });
  test$3("breaking out of heading in list", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await clickToolbarButton({
      attribute: "heading1"
    });
    assert.ok(isToolbarButtonActive({
      attribute: "heading1"
    }));
    await typeCharacters("abc");
    await typeCharacters("\n");
    assert.ok(isToolbarButtonActive({
      attribute: "bullet"
    }));
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 4], ["bulletList", "bullet", "heading1"]);
    assert.blockAttributes([4, 5], ["bulletList", "bullet"]);
    expectDocument("abc\n\n");
  });
  test$3("breaking out of middle of heading block", async () => {
    await clickToolbarButton({
      attribute: "heading1"
    });
    await typeCharacters("abc");
    assert.ok(isToolbarButtonActive({
      attribute: "heading1"
    }));
    await moveCursor({
      direction: "left",
      times: 1
    });
    await typeCharacters("\n");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 3], ["heading1"]);
    assert.blockAttributes([3, 4], ["heading1"]);
    expectDocument("ab\nc\n");
  });
  test$3("breaking out of middle of heading block with preceding blocks", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("a"), ["heading1"]), new Block(Text.textForStringWithAttributes("b"), []), new Block(Text.textForStringWithAttributes("cd"), ["heading1"])]);
    replaceDocument(document);
    getEditor().setSelectedRange(5);
    assert.ok(isToolbarButtonActive({
      attribute: "heading1"
    }));
    await typeCharacters("\n");
    document = getDocument();
    assert.equal(document.getBlockCount(), 4);
    assert.blockAttributes([0, 1], ["heading1"]);
    assert.blockAttributes([2, 3], []);
    assert.blockAttributes([4, 5], ["heading1"]);
    assert.blockAttributes([6, 7], ["heading1"]);
    expectDocument("a\nb\nc\nd\n");
  });
  test$3("breaking out of end of heading block with preceding blocks", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("a"), ["heading1"]), new Block(Text.textForStringWithAttributes("b"), []), new Block(Text.textForStringWithAttributes("cd"), ["heading1"])]);
    replaceDocument(document);
    getEditor().setSelectedRange(6);
    assert.ok(isToolbarButtonActive({
      attribute: "heading1"
    }));
    await typeCharacters("\n");
    document = getDocument();
    assert.equal(document.getBlockCount(), 4);
    assert.blockAttributes([0, 1], ["heading1"]);
    assert.blockAttributes([2, 3], []);
    assert.blockAttributes([4, 6], ["heading1"]);
    assert.blockAttributes([7, 8], []);
    expectDocument("a\nb\ncd\n\n");
  });
  test$3("inserting newline before heading", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("\n"), []), new Block(Text.textForStringWithAttributes("abc"), ["heading1"])]);
    replaceDocument(document);
    getEditor().setSelectedRange(0);
    await typeCharacters("\n");
    document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), []);
    assert.equal(block.toString(), "\n\n\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["heading1"]);
    assert.equal(block.toString(), "abc\n");
  });
  test$3("inserting multiple newlines before heading", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("\n"), []), new Block(Text.textForStringWithAttributes("abc"), ["heading1"])]);
    replaceDocument(document);
    getEditor().setSelectedRange(0);
    await typeCharacters("\n\n");
    document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), []);
    assert.equal(block.toString(), "\n\n\n\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["heading1"]);
    assert.equal(block.toString(), "abc\n");
  });
  test$3("inserting multiple newlines before formatted block", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("\n"), []), new Block(Text.textForStringWithAttributes("abc"), ["quote"])]);
    replaceDocument(document);
    getEditor().setSelectedRange(1);
    await typeCharacters("\n\n");
    document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 1], []);
    assert.blockAttributes([2, 3], []);
    assert.blockAttributes([4, 6], ["quote"]);
    assert.locationRange({
      index: 0,
      offset: 3
    });
    expectDocument("\n\n\n\nabc\n");
  });
  test$3("inserting newline after heading with text in following block", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("ab"), ["heading1"]), new Block(Text.textForStringWithAttributes("cd"), [])]);
    replaceDocument(document);
    getEditor().setSelectedRange(2);
    await typeCharacters("\n");
    document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    assert.blockAttributes([0, 2], ["heading1"]);
    assert.blockAttributes([3, 4], []);
    assert.blockAttributes([5, 6], []);
    expectDocument("ab\n\ncd\n");
  });
  test$3("backspacing a newline in an empty block with adjacent formatted blocks", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("abc"), ["heading1"]), new Block(), new Block(Text.textForStringWithAttributes("d"), ["heading1"])]);
    replaceDocument(document);
    getEditor().setSelectedRange(4);
    await pressKey("backspace");
    document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 1], ["heading1"]);
    assert.blockAttributes([2, 3], ["heading1"]);
    expectDocument("abc\nd\n");
  });
  test$3("backspacing a newline at beginning of non-formatted block", async () => {
    let document = new Document([new Block(Text.textForStringWithAttributes("ab"), ["heading1"]), new Block(Text.textForStringWithAttributes("\ncd"), [])]);
    replaceDocument(document);
    getEditor().setSelectedRange(3);
    await pressKey("backspace");
    document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 2], ["heading1"]);
    assert.blockAttributes([3, 5], []);
    expectDocument("ab\ncd\n");
  });
  test$3("inserting newline after single character header", async () => {
    await clickToolbarButton({
      attribute: "heading1"
    });
    await typeCharacters("a");
    await typeCharacters("\n");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 1], ["heading1"]);
    expectDocument("a\n\n");
  });
  test$3("terminal attributes are only added once", async () => {
    replaceDocument(new Document([new Block(Text.textForStringWithAttributes("a"), []), new Block(Text.textForStringWithAttributes("b"), ["heading1"]), new Block(Text.textForStringWithAttributes("c"), [])]));
    await selectAll();
    await clickToolbarButton({
      attribute: "heading1"
    });
    assert.equal(getDocument().getBlockCount(), 3);
    assert.blockAttributes([0, 1], ["heading1"]);
    assert.blockAttributes([2, 3], ["heading1"]);
    assert.blockAttributes([4, 5], ["heading1"]);
    expectDocument("a\nb\nc\n");
  });
  test$3("terminal attributes replace existing terminal attributes", async () => {
    replaceDocument(new Document([new Block(Text.textForStringWithAttributes("a"), []), new Block(Text.textForStringWithAttributes("b"), ["heading1"]), new Block(Text.textForStringWithAttributes("c"), [])]));
    await selectAll();
    await clickToolbarButton({
      attribute: "code"
    });
    assert.equal(getDocument().getBlockCount(), 3);
    assert.blockAttributes([0, 1], ["code"]);
    assert.blockAttributes([2, 3], ["code"]);
    assert.blockAttributes([4, 5], ["code"]);
    expectDocument("a\nb\nc\n");
  });
  test$3("code blocks preserve newlines", async () => {
    await typeCharacters("a\nb");
    await selectAll();
    clickToolbarButton({
      attribute: "code"
    });
    assert.equal(getDocument().getBlockCount(), 1);
    assert.blockAttributes([0, 3], ["code"]);
    expectDocument("a\nb\n");
  });
  test$3("code blocks are not indentable", async () => {
    await clickToolbarButton({
      attribute: "code"
    });
    assert.notOk(isToolbarButtonActive({
      action: "increaseNestingLevel"
    }));
  });
  test$3("code blocks are terminal", async () => {
    await clickToolbarButton({
      attribute: "code"
    });
    assert.ok(isToolbarButtonDisabled({
      attribute: "quote"
    }));
    assert.ok(isToolbarButtonDisabled({
      attribute: "heading1"
    }));
    assert.ok(isToolbarButtonDisabled({
      attribute: "bullet"
    }));
    assert.ok(isToolbarButtonDisabled({
      attribute: "number"
    }));
    assert.notOk(isToolbarButtonDisabled({
      attribute: "code"
    }));
    assert.notOk(isToolbarButtonDisabled({
      attribute: "bold"
    }));
    assert.notOk(isToolbarButtonDisabled({
      attribute: "italic"
    }));
  });
  test$3("unindenting a code block inside a bullet", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await clickToolbarButton({
      attribute: "code"
    });
    await typeCharacters("a");
    await clickToolbarButton({
      action: "decreaseNestingLevel"
    });
    const document = getDocument();
    assert.equal(document.getBlockCount(), 1);
    assert.blockAttributes([0, 1], ["code"]);
    expectDocument("a\n");
  });
  test$3("indenting a heading inside a bullet", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a");
    await typeCharacters("\n");
    await clickToolbarButton({
      attribute: "heading1"
    });
    await typeCharacters("b");
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], ["bulletList", "bullet", "bulletList", "bullet", "heading1"]);
    expectDocument("a\nb\n");
  });
  test$3("indenting a quote inside a bullet", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await clickToolbarButton({
      attribute: "quote"
    });
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    const document = getDocument();
    assert.equal(document.getBlockCount(), 1);
    assert.blockAttributes([0, 1], ["bulletList", "bullet", "quote", "quote"]);
    expectDocument("\n");
  });
  test$3("list indentation constraints consider the list type", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a\n\n");
    await clickToolbarButton({
      attribute: "number"
    });
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], ["numberList", "number"]);
    expectDocument("a\n\n");
  });
});

testGroup("View caching", {
  template: "editor_empty"
}, () => {
  test$3("reparsing and rendering identical texts", async () => {
    await typeCharacters("a\nb\na");
    await moveCursor({
      direction: "left",
      times: 2
    });
    await clickToolbarButton({
      attribute: "quote"
    });
    const html = getEditorElement().innerHTML;
    getEditorController().reparse();
    getEditorController().render();
    assert.equal(getEditorElement().innerHTML, html);
  });
  test$3("reparsing and rendering identical blocks", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a\na");
    const html = getEditorElement().innerHTML;
    getEditorController().reparse();
    getEditorController().render();
    assert.equal(getEditorElement().innerHTML, html);
  });
});

const testOptions$1 = {
  template: "editor_empty",
  setup() {
    let handler;
    addEventListener("keydown", cancel, true);
    addEventListener("trix-before-initialize", handler = function (_ref) {
      let {
        target
      } = _ref;
      removeEventListener("trix-before-initialize", handler);
      target.addEventListener("keydown", cancel);
    });
  },
  teardown() {
    removeEventListener("keydown", cancel, true);
  }
};
let cancelingInCapturingPhase = false;
let cancelingAtTarget = false;
const cancel = event => {
  switch (event.eventPhase) {
    case Event.prototype.CAPTURING_PHASE:
      if (cancelingInCapturingPhase) {
        event.preventDefault();
      }
      break;
    case Event.prototype.AT_TARGET:
      if (cancelingAtTarget) {
        event.preventDefault();
      }
      break;
  }
};
testGroup("Canceled input", testOptions$1, () => {
  test$3("ignoring canceled input events in capturing phase", async () => {
    await typeCharacters("a");
    cancelingInCapturingPhase = true;
    await pressKey("backspace");
    await pressKey("return");
    cancelingInCapturingPhase = false;
    await typeCharacters("b");
    expectDocument("ab\n");
  });
  test$3("ignoring canceled input events at target", async () => {
    await typeCharacters("a");
    cancelingAtTarget = true;
    await pressKey("backspace");
    await pressKey("return");
    cancelingAtTarget = false;
    await typeCharacters("b");
    expectDocument("ab\n");
  });
});

testGroup("Composition input", {
  template: "editor_empty"
}, () => {
  test$3("composing", async () => {
    await startComposition("a");
    await updateComposition("ab");
    await endComposition("abc");
    expectDocument("abc\n");
  });
  test$3("typing and composing", async () => {
    await typeCharacters("a");
    await startComposition("b");
    await updateComposition("bc");
    await endComposition("bcd");
    await typeCharacters("e");
    expectDocument("abcde\n");
  });
  test$3("composition input is serialized", async () => {
    await startComposition("´");
    await endComposition("é");
    assert.equal(getEditorElement().value, "<div>é</div>");
    expectDocument("é\n");
  });
  test$3("pressing after a canceled composition", async () => {
    await typeCharacters("ab");
    triggerEvent(document.activeElement, "compositionend", {
      data: "ab"
    });
    await pressKey("return");
    expectDocument("ab\n\n");
  });
  test$3("composing formatted text", async () => {
    await typeCharacters("abc");
    await clickToolbarButton({
      attribute: "bold"
    });
    await startComposition("d");
    await updateComposition("de");
    await endComposition("def");
    assert.textAttributes([0, 3], {});
    assert.textAttributes([3, 6], {
      bold: true
    });
    expectDocument("abcdef\n");
  });
  test$3("composing away from formatted text", async () => {
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("abc");
    await clickToolbarButton({
      attribute: "bold"
    });
    await startComposition("d");
    await updateComposition("de");
    await endComposition("def");
    assert.textAttributes([0, 3], {
      bold: true
    });
    assert.textAttributes([3, 6], {});
    expectDocument("abcdef\n");
  });
  test$3("composing another language using a QWERTY keyboard", async () => {
    const element = getEditorElement();
    const keyCodes = {
      x: 120,
      i: 105
    };
    triggerEvent(element, "keypress", {
      charCode: keyCodes.x,
      keyCode: keyCodes.x,
      which: keyCodes.x
    });
    await startComposition("x");
    triggerEvent(element, "keypress", {
      charCode: keyCodes.i,
      keyCode: keyCodes.i,
      which: keyCodes.i
    });
    await updateComposition("xi");
    await endComposition("喜");
    expectDocument("喜\n");
  });

  // Simulates the sequence of events when pressing backspace through a word on Android
  testIf(input.getLevel() === 0, "backspacing through a composition", async () => {
    const element = getEditorElement();
    element.editor.insertString("a cat");
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionupdate", {
      data: "ca"
    });
    triggerEvent(element, "input");
    await removeCharacters(-1);
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionupdate", {
      data: "c"
    });
    triggerEvent(element, "input");
    triggerEvent(element, "compositionend", {
      data: "c"
    });
    await removeCharacters(-1);
    await pressKey("backspace");
    expectDocument("a \n");
  });

  // Simulates the sequence of events when pressing backspace at the end of a
  // word and updating it on Android (running older versions of System WebView)
  testIf(input.getLevel() === 0, "updating a composition", async () => {
    const element = getEditorElement();
    element.editor.insertString("cat");
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionstart", {
      data: "cat"
    });
    triggerEvent(element, "compositionupdate", {
      data: "cat"
    });
    triggerEvent(element, "input");
    await removeCharacters(-1);
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionupdate", {
      data: "car"
    });
    triggerEvent(element, "input");
    triggerEvent(element, "compositionend", {
      data: "car"
    });
    await insertNode(document.createTextNode("r"));
    expectDocument("car\n");
  });

  // Simulates the sequence of events when typing on Android and then tapping elsewhere
  testIf(input.getLevel() === 0, "leaving a composition", async () => {
    const element = getEditorElement();
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionstart", {
      data: ""
    });
    triggerInputEvent(element, "beforeinput", {
      inputType: "insertCompositionText",
      data: "c"
    });
    triggerEvent(element, "compositionupdate", {
      data: "c"
    });
    triggerEvent(element, "input");
    const node = document.createTextNode("c");
    insertNode(node);
    selectNode(node);
    await nextFrame();
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerInputEvent(element, "beforeinput", {
      inputType: "insertCompositionText",
      data: "ca"
    });
    triggerEvent(element, "compositionupdate", {
      data: "ca"
    });
    triggerEvent(element, "input");
    node.data = "ca";
    await nextFrame();
    triggerEvent(element, "compositionend", {
      data: ""
    });
    await nextFrame();
    expectDocument("ca\n");
  });
  testIf(browser$1.composesExistingText, "composition events from cursor movement are ignored", async () => {
    const element = getEditorElement();
    element.editor.insertString("ab ");
    element.editor.setSelectedRange(0);
    triggerEvent(element, "compositionstart", {
      data: ""
    });
    triggerEvent(element, "compositionupdate", {
      data: "ab"
    });
    await nextFrame();
    element.editor.setSelectedRange(1);
    triggerEvent(element, "compositionupdate", {
      data: "ab"
    });
    await nextFrame();
    element.editor.setSelectedRange(2);
    triggerEvent(element, "compositionupdate", {
      data: "ab"
    });
    await nextFrame();
    element.editor.setSelectedRange(3);
    triggerEvent(element, "compositionend", {
      data: "ab"
    });
    await nextFrame();
    expectDocument("ab \n");
  });

  // Simulates compositions in Firefox where the final composition data is
  // dispatched as both compositionupdate and compositionend.
  testIf(input.getLevel() === 0, "composition ending with same data as last update", async () => {
    const element = getEditorElement();
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionstart", {
      data: ""
    });
    triggerEvent(element, "compositionupdate", {
      data: "´"
    });
    const node = document.createTextNode("´");
    insertNode(node);
    selectNode(node);
    await nextFrame();
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionupdate", {
      data: "é"
    });
    triggerEvent(element, "input");
    node.data = "é";
    await nextFrame();
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    triggerEvent(element, "compositionupdate", {
      data: "éé"
    });
    triggerEvent(element, "input");
    node.data = "éé";
    await nextFrame();
    triggerEvent(element, "compositionend", {
      data: "éé"
    });
    await nextFrame();
    assert.locationRange({
      index: 0,
      offset: 2
    });
    expectDocument("éé\n");
  });
});
const removeCharacters = async direction => {
  const selection = rangy.getSelection();
  const range = selection.getRangeAt(0);
  range.moveStart("character", direction);
  range.deleteContents();
  await nextFrame();
};

testGroup("Cursor movement", {
  template: "editor_empty"
}, () => {
  test$3("move cursor around attachment", async () => {
    insertFile(createFile$1());
    assert.locationRange({
      index: 0,
      offset: 1
    });
    await moveCursor("left");
    assert.locationRange({
      index: 0,
      offset: 0
    }, {
      index: 0,
      offset: 1
    });
    await moveCursor("left");
    assert.locationRange({
      index: 0,
      offset: 0
    });
    await moveCursor("right");
    assert.locationRange({
      index: 0,
      offset: 0
    }, {
      index: 0,
      offset: 1
    });
    await moveCursor("right");
    assert.locationRange({
      index: 0,
      offset: 1
    });
  });
  test$3("move cursor around attachment and text", async () => {
    insertString("a");
    insertFile(createFile$1());
    insertString("b");
    assert.locationRange({
      index: 0,
      offset: 3
    });
    await moveCursor("left");
    assert.locationRange({
      index: 0,
      offset: 2
    });
    await moveCursor("left");
    assert.locationRange({
      index: 0,
      offset: 1
    }, {
      index: 0,
      offset: 2
    });
    await moveCursor("left");
    assert.locationRange({
      index: 0,
      offset: 1
    });
    await moveCursor("left");
    assert.locationRange({
      index: 0,
      offset: 0
    });
  });
  test$3("expand selection over attachment", async () => {
    insertFile(createFile$1());
    assert.locationRange({
      index: 0,
      offset: 1
    });
    await expandSelection("left");
    assert.locationRange({
      index: 0,
      offset: 0
    }, {
      index: 0,
      offset: 1
    });
    await moveCursor("left");
    assert.locationRange({
      index: 0,
      offset: 0
    });
    await expandSelection("right");
    assert.locationRange({
      index: 0,
      offset: 0
    }, {
      index: 0,
      offset: 1
    });
  });
  test$3("expand selection over attachment and text", async () => {
    insertString("a");
    insertFile(createFile$1());
    insertString("b");
    assert.locationRange({
      index: 0,
      offset: 3
    });
    await expandSelection("left");
    assert.locationRange({
      index: 0,
      offset: 2
    }, {
      index: 0,
      offset: 3
    });
    await expandSelection("left");
    assert.locationRange({
      index: 0,
      offset: 1
    }, {
      index: 0,
      offset: 3
    });
    await expandSelection("left");
    assert.locationRange({
      index: 0,
      offset: 0
    }, {
      index: 0,
      offset: 3
    });
  });
});

testGroup("Custom element API", {
  template: "editor_empty"
}, () => {
  test$3("element triggers trix-initialize on first connect", async () => {
    const container = document.getElementById("trix-container");
    container.innerHTML = "";
    let initializeEventCount = 0;
    const element = document.createElement("trix-editor");
    element.addEventListener("trix-initialize", () => initializeEventCount++);
    container.appendChild(element);
    await nextFrame();
    container.removeChild(element);
    await nextFrame();
    container.appendChild(element);
    await delay(60);
    assert.equal(initializeEventCount, 1);
  });
  test$3("files are accepted by default", () => {
    getComposition().insertFile(createFile$1());
    assert.equal(getComposition().getAttachments().length, 1);
  });
  test$3("rejecting a file by canceling the trix-file-accept event", () => {
    getEditorElement().addEventListener("trix-file-accept", event => event.preventDefault());
    getComposition().insertFile(createFile$1());
    assert.equal(getComposition().getAttachments().length, 0);
  });
  test$3("element triggers attachment events", () => {
    const file = createFile$1();
    const element = getEditorElement();
    const composition = getComposition();
    let attachment = null;
    const events = [];
    element.addEventListener("trix-file-accept", function (event) {
      events.push(event.type);
      assert.ok(file === event.file);
    });
    element.addEventListener("trix-attachment-add", function (event) {
      events.push(event.type);
      attachment = event.attachment;
    });
    composition.insertFile(file);
    assert.deepEqual(events, ["trix-file-accept", "trix-attachment-add"]);
    element.addEventListener("trix-attachment-remove", function (event) {
      events.push(event.type);
      assert.ok(attachment === event.attachment);
    });
    attachment.remove();
    assert.deepEqual(events, ["trix-file-accept", "trix-attachment-add", "trix-attachment-remove"]);
  });
  test$3("element triggers trix-change when an attachment is edited", () => {
    const file = createFile$1();
    const element = getEditorElement();
    const composition = getComposition();
    let attachment = null;
    const events = [];
    element.addEventListener("trix-attachment-add", event => attachment = event.attachment);
    composition.insertFile(file);
    element.addEventListener("trix-attachment-edit", event => events.push(event.type));
    element.addEventListener("trix-change", event => events.push(event.type));
    attachment.setAttributes({
      width: 9876
    });
    assert.deepEqual(events, ["trix-attachment-edit", "trix-change"]);
  });
  test$3("editing the document in a trix-attachment-add handler doesn't trigger trix-attachment-add again", () => {
    const element = getEditorElement();
    const composition = getComposition();
    let eventCount = 0;
    element.addEventListener("trix-attachment-add", () => {
      if (eventCount++ === 0) {
        element.editor.setSelectedRange([0, 1]);
        element.editor.activateAttribute("bold");
      }
    });
    composition.insertFile(createFile$1());
    assert.equal(eventCount, 1);
  });
  test$3("element triggers trix-change events when the document changes", async () => {
    const element = getEditorElement();
    let eventCount = 0;
    element.addEventListener("trix-change", event => eventCount++);
    await typeCharacters("a");
    assert.equal(eventCount, 1);
    await moveCursor("left");
    assert.equal(eventCount, 1);
    await typeCharacters("bcd");
    assert.equal(eventCount, 4);
    await clickToolbarButton({
      action: "undo"
    });
    assert.equal(eventCount, 5);
  });
  test$3("invoking internal actions does not dispatch a trix-action-invoke event", async () => {
    let event = null;
    addEventListener("trix-action-invoke", ev => event = ev, {
      once: true
    });
    await clickToolbarButton({
      action: "link"
    });
    assert.equal(null, event);
  });
  test$3("invoking external actions dispatches a trix-action-invoke event", async () => {
    let event = null;
    const editor = getEditorElement();
    editor.toolbarElement.insertAdjacentHTML("beforeend", "\n      <button id=\"test-action\" type=\"button\" data-trix-action=\"x-test\"></button>\n    ");
    addEventListener("trix-action-invoke", ev => event = ev, {
      once: true
    });
    await clickToolbarButton({
      action: "x-test"
    });
    assert.equal(editor, event.target);
    assert.equal("x-test", event.actionName);
    assert.equal(document.getElementById("test-action"), event.invokingElement);
  });
  test$3("element triggers trix-change event after toggling attributes", async () => {
    const element = getEditorElement();
    const {
      editor
    } = element;
    const afterChangeEvent = edit => {
      return new Promise(resolve => {
        let handler;
        element.addEventListener("trix-change", handler = function (event) {
          element.removeEventListener("trix-change", handler);
          resolve(event);
        });
        edit();
      });
    };
    await typeCharacters("hello");
    let edit = () => editor.activateAttribute("quote");
    await afterChangeEvent(edit);
    assert.ok(editor.attributeIsActive("quote"));
    edit = () => editor.deactivateAttribute("quote");
    await afterChangeEvent(edit);
    assert.notOk(editor.attributeIsActive("quote"));
    editor.setSelectedRange([0, 5]);
    edit = () => editor.activateAttribute("bold");
    await afterChangeEvent(edit);
    assert.ok(editor.attributeIsActive("bold"));
    edit = () => editor.deactivateAttribute("bold");
    await afterChangeEvent(edit);
    assert.notOk(editor.attributeIsActive("bold"));
  });
  test$3("disabled attributes aren't considered active", async () => {
    const {
      editor
    } = getEditorElement();
    editor.activateAttribute("heading1");
    assert.notOk(editor.attributeIsActive("code"));
    assert.notOk(editor.attributeIsActive("quote"));
  });
  test$3("element triggers trix-selection-change events when the location range changes", async () => {
    const element = getEditorElement();
    let eventCount = 0;
    element.addEventListener("trix-selection-change", event => eventCount++);
    await nextFrame();
    await typeCharacters("a");
    assert.equal(eventCount, 1);
    await moveCursor("left");
    assert.equal(eventCount, 2);
  });
  test$3("only triggers trix-selection-change events on the active element", () => {
    const elementA = getEditorElement();
    const elementB = document.createElement("trix-editor");
    elementA.parentNode.insertBefore(elementB, elementA.nextSibling);
    return new Promise(resolve => {
      elementB.addEventListener("trix-initialize", () => {
        elementA.editor.insertString("a");
        elementB.editor.insertString("b");
        rangy.getSelection().removeAllRanges();
        let eventCountA = 0;
        let eventCountB = 0;
        elementA.addEventListener("trix-selection-change", event => eventCountA++);
        elementB.addEventListener("trix-selection-change", event => eventCountB++);
        elementA.editor.setSelectedRange(0);
        assert.equal(eventCountA, 1);
        assert.equal(eventCountB, 0);
        elementB.editor.setSelectedRange(0);
        assert.equal(eventCountA, 1);
        assert.equal(eventCountB, 1);
        elementA.editor.setSelectedRange(1);
        assert.equal(eventCountA, 2);
        assert.equal(eventCountB, 1);
        resolve();
      });
    });
  });
  test$3("element triggers toolbar dialog events", async () => {
    const element = getEditorElement();
    const events = [];
    element.addEventListener("trix-toolbar-dialog-show", event => events.push(event.type));
    element.addEventListener("trix-toolbar-dialog-hide", event => events.push(event.type));
    await nextFrame();
    await clickToolbarButton({
      action: "link"
    });
    await typeInToolbarDialog("http://example.com", {
      attribute: "href"
    });
    await nextFrame();
    assert.deepEqual(events, ["trix-toolbar-dialog-show", "trix-toolbar-dialog-hide"]);
  });
  test$3("element triggers before-paste event with paste data", async () => {
    const element = getEditorElement();
    let eventCount = 0;
    let paste = null;
    element.addEventListener("trix-before-paste", function (event) {
      eventCount++;
      paste = event.paste;
    });
    await typeCharacters("");
    await pasteContent("text/html", "<strong>hello</strong>");
    assert.equal(eventCount, 1);
    assert.equal(paste.type, "text/html");
    assert.equal(paste.html, "<strong>hello</strong>");
    expectDocument("hello\n");
  });
  test$3("element triggers before-paste event with mutable paste data", async () => {
    const element = getEditorElement();
    let eventCount = 0;
    let paste = null;
    element.addEventListener("trix-before-paste", function (event) {
      eventCount++;
      paste = event.paste;
      paste.html = "<strong>greetings</strong>";
    });
    await typeCharacters("");
    await pasteContent("text/html", "<strong>hello</strong>");
    assert.equal(eventCount, 1);
    assert.equal(paste.type, "text/html");
    expectDocument("greetings\n");
  });
  test$3("element triggers paste event with position range", async () => {
    const element = getEditorElement();
    let eventCount = 0;
    let paste = null;
    element.addEventListener("trix-paste", function (event) {
      eventCount++;
      paste = event.paste;
    });
    await typeCharacters("");
    await pasteContent("text/html", "<strong>hello</strong>");
    assert.equal(eventCount, 1);
    assert.equal(paste.type, "text/html");
    assert.ok(rangesAreEqual([0, 5], paste.range));
  });
  test$3("element triggers attribute change events", async () => {
    const element = getEditorElement();
    let eventCount = 0;
    let attributes = null;
    element.addEventListener("trix-attributes-change", function (event) {
      eventCount++;
      attributes = event.attributes;
    });
    await typeCharacters("");
    assert.equal(eventCount, 0);
    await clickToolbarButton({
      attribute: "bold"
    });
    assert.equal(eventCount, 1);
    assert.deepEqual({
      bold: true
    }, attributes);
  });
  test$3("element triggers action change events", async () => {
    const element = getEditorElement();
    let eventCount = 0;
    let actions = null;
    element.addEventListener("trix-actions-change", function (event) {
      eventCount++;
      actions = event.actions;
    });
    await typeCharacters("");
    assert.equal(eventCount, 0);
    await clickToolbarButton({
      attribute: "bullet"
    });
    assert.equal(eventCount, 1);
    assert.equal(actions.decreaseNestingLevel, true);
    assert.equal(actions.increaseNestingLevel, false);
  });
  test$3("element triggers custom focus and blur events", async () => {
    const element = getEditorElement();
    let focusEventCount = 0;
    let blurEventCount = 0;
    element.addEventListener("trix-focus", () => focusEventCount++);
    element.addEventListener("trix-blur", () => blurEventCount++);
    triggerEvent(element, "blur");
    await delay(10);
    assert.equal(blurEventCount, 1);
    assert.equal(focusEventCount, 0);
    triggerEvent(element, "focus");
    await delay(10);
    assert.equal(blurEventCount, 1);
    assert.equal(focusEventCount, 1);
    insertImageAttachment();
    await delay(20);
    await clickElement(element.querySelector("figure"));
    const textarea = element.querySelector("textarea");
    textarea.focus();
    await nextFrame();
    assert.equal(document.activeElement, textarea);
    assert.equal(blurEventCount, 1);
    assert.equal(focusEventCount, 1);
  });

  // Selenium doesn't seem to focus windows properly in some browsers (FF 47 on OS X)
  // so skip this test when unfocused pending a better solution.
  testIf(document.hasFocus(), "element triggers custom focus event when autofocusing", () => {
    const element = document.createElement("trix-editor");
    element.setAttribute("autofocus", "");
    let focusEventCount = 0;
    element.addEventListener("trix-focus", () => focusEventCount++);
    const container = document.getElementById("trix-container");
    container.innerHTML = "";
    container.appendChild(element);
    return new Promise(resolve => {
      element.addEventListener("trix-initialize", () => {
        assert.equal(focusEventCount, 1);
        resolve();
      });
    });
  });
  test$3("element serializes HTML after attribute changes", async () => {
    const element = getEditorElement();
    let serializedHTML = element.value;
    await typeCharacters("a");
    assert.notEqual(serializedHTML, element.value);
    serializedHTML = element.value;
    await clickToolbarButton({
      attribute: "quote"
    });
    assert.notEqual(serializedHTML, element.value);
    serializedHTML = element.value;
    await clickToolbarButton({
      attribute: "quote"
    });
    assert.notEqual(serializedHTML, element.value);
  });
  test$3("element serializes HTML after attachment attribute changes", async () => {
    const element = getEditorElement();
    const attributes = {
      url: "test_helpers/fixtures/logo.png",
      contentType: "image/png"
    };
    const promise = new Promise(resolve => {
      element.addEventListener("trix-attachment-add", async event => {
        const {
          attachment
        } = event;
        await nextFrame();
        let serializedHTML = element.value;
        attachment.setAttributes(attributes);
        assert.notEqual(serializedHTML, element.value);
        serializedHTML = element.value;
        assert.ok(serializedHTML.indexOf(TEST_IMAGE_URL) < 0, "serialized HTML contains previous attachment attributes");
        assert.ok(serializedHTML.indexOf(attributes.url) > 0, "serialized HTML doesn't contain current attachment attributes");
        attachment.remove();
        await nextFrame();
        resolve();
      });
    });
    await nextFrame();
    insertImageAttachment();
    return promise;
  });
  test$3("editor resets to its original value on form reset", async () => {
    const element = getEditorElement();
    const {
      form
    } = element.inputElement;
    await typeCharacters("hello");
    form.reset();
    expectDocument("\n");
  });
  test$3("editor resets to last-set value on form reset", async () => {
    const element = getEditorElement();
    const {
      form
    } = element.inputElement;
    element.value = "hi";
    await typeCharacters("hello");
    form.reset();
    expectDocument("hi\n");
  });
  test$3("editor respects preventDefault on form reset", async () => {
    const element = getEditorElement();
    const {
      form
    } = element.inputElement;
    const preventDefault = event => event.preventDefault();
    await typeCharacters("hello");
    form.addEventListener("reset", preventDefault, false);
    form.reset();
    form.removeEventListener("reset", preventDefault, false);
    expectDocument("hello\n");
  });
});
testGroup("<label> support", {
  template: "editor_with_labels"
}, () => {
  test$3("associates all label elements", () => {
    const labels = [document.getElementById("label-1"), document.getElementById("label-3")];
    assert.deepEqual(Array.from(getEditorElement().labels), labels);
  });
  test$3("focuses when <label> clicked", () => {
    document.getElementById("label-1").click();
    assert.equal(getEditorElement(), document.activeElement);
  });
  test$3("focuses when <label> descendant clicked", () => {
    document.getElementById("label-1").querySelector("span").click();
    assert.equal(getEditorElement(), document.activeElement);
  });
  test$3("does not focus when <label> controls another element", () => {
    const label = document.getElementById("label-2");
    assert.notEqual(getEditorElement(), label.control);
    label.click();
    assert.notEqual(getEditorElement(), document.activeElement);
  });
});
testGroup("form property references its <form>", {
  template: "editors_with_forms",
  container: "div"
}, () => {
  test$3("accesses its ancestor form", () => {
    const form = document.getElementById("ancestor-form");
    const editor = document.getElementById("editor-with-ancestor-form");
    assert.equal(editor.form, form);
  });
  test$3("transitively accesses its related <input> element's <form>", () => {
    const form = document.getElementById("input-form");
    const editor = document.getElementById("editor-with-input-form");
    assert.equal(editor.form, form);
  });
  test$3("returns null when there is no associated <form>", () => {
    const editor = document.getElementById("editor-with-no-form");
    assert.equal(editor.form, null);
  });
  test$3("editor resets to its original value on element reset", async () => {
    const element = getEditorElement();
    await typeCharacters("hello");
    element.reset();
    expectDocument("\n");
  });
  test$3("element returns empty string when value is missing", () => {
    const element = getEditorElement();
    assert.equal(element.value, "");
  });
  test$3("editor returns its type", () => {
    const element = getEditorElement();
    assert.equal("trix-editor", element.type);
  });
  testIf(TrixEditorElement.formAssociated, "adds [disabled] attribute based on .disabled property", () => {
    const editor = document.getElementById("editor-with-ancestor-form");
    editor.disabled = true;
    assert.equal(editor.hasAttribute("disabled"), true, "adds [disabled] attribute");
    editor.disabled = false;
    assert.equal(editor.hasAttribute("disabled"), false, "removes [disabled] attribute");
  });
  testIf(TrixEditorElement.formAssociated, "removes [contenteditable] and disables input when editor element has [disabled]", () => {
    const editor = document.getElementById("editor-with-no-form");
    editor.setAttribute("disabled", "");
    assert.equal(editor.matches(":disabled"), true, "sets :disabled CSS pseudostate");
    assert.equal(editor.inputElement.disabled, true, "disables input");
    assert.equal(editor.disabled, true, "exposes [disabled] attribute as .disabled property");
    assert.equal(editor.hasAttribute("contenteditable"), false, "removes [contenteditable] attribute");
    editor.removeAttribute("disabled");
    assert.equal(editor.matches(":disabled"), false, "removes sets :disabled pseudostate");
    assert.equal(editor.inputElement.disabled, false, "enabled input");
    assert.equal(editor.disabled, false, "updates .disabled property");
    assert.equal(editor.hasAttribute("contenteditable"), true, "adds [contenteditable] attribute");
  });
  testIf(TrixEditorElement.formAssociated, "removes [contenteditable] and disables input when editor element is :disabled", () => {
    const editor = document.getElementById("editor-within-fieldset");
    const fieldset = document.getElementById("fieldset");
    fieldset.disabled = true;
    assert.equal(editor.matches(":disabled"), true, "sets :disabled CSS pseudostate");
    assert.equal(editor.inputElement.disabled, true, "disables input");
    assert.equal(editor.disabled, true, "infers disabled state from ancestor");
    assert.equal(editor.hasAttribute("disabled"), false, "does not set [disabled] attribute");
    assert.equal(editor.hasAttribute("contenteditable"), false, "removes [contenteditable] attribute");
    fieldset.disabled = false;
    assert.equal(editor.matches(":disabled"), false, "removes sets :disabled pseudostate");
    assert.equal(editor.inputElement.disabled, false, "enabled input");
    assert.equal(editor.disabled, false, "updates .disabled property");
    assert.equal(editor.hasAttribute("disabled"), false, "does not set [disabled] attribute");
    assert.equal(editor.hasAttribute("contenteditable"), true, "adds [contenteditable] attribute");
  });
  testIf(TrixEditorElement.formAssociated, "does not receive focus when :disabled", () => {
    const activeEditor = document.getElementById("editor-with-input-form");
    const editor = document.getElementById("editor-within-fieldset");
    activeEditor.focus();
    editor.disabled = true;
    editor.focus();
    assert.equal(activeEditor, document.activeElement, "disabled editor does not receive focus");
  });
  testIf(TrixEditorElement.formAssociated, "disabled editor does not encode its value when the form is submitted", () => {
    const editor = document.getElementById("editor-with-ancestor-form");
    const form = editor.form;
    editor.inputElement.value = "Hello world";
    editor.disabled = true;
    assert.deepEqual({}, Object.fromEntries(new FormData(form).entries()), "does not write to FormData");
  });
  testIf(TrixEditorElement.formAssociated, "validates with [required] attribute as invalid", () => {
    const editor = document.getElementById("editor-with-ancestor-form");
    const form = editor.form;
    const invalidInput = makeElement("input", {
      required: true
    });
    let invalidEvent,
      submitEvent = null;
    editor.addEventListener("invalid", event => invalidEvent = event, {
      once: true
    });
    form.addEventListener("submit", event => submitEvent = event, {
      once: true
    });
    editor.required = true;
    form.requestSubmit();

    // assert.equal(document.activeElement, editor, "editor receives focus")
    assert.equal(editor.required, true, ".required property retrurns true");
    assert.equal(editor.validity.valid, false, "validity.valid is false");
    assert.equal(editor.validationMessage, invalidInput.validationMessage, "sets .validationMessage");
    assert.equal(invalidEvent.target, editor, "dispatches 'invalid' event on editor");
    assert.equal(submitEvent, null, "does not dispatch a 'submit' event");
  });
  testIf(TrixEditorElement.formAssociated, "does not validate with [disabled] attribute", () => {
    const editor = document.getElementById("editor-with-ancestor-form");
    let invalidEvent = null;
    editor.disabled = true;
    editor.required = true;
    editor.addEventListener("invalid", event => invalidEvent = event, {
      once: true
    });
    editor.reportValidity();
    assert.equal(invalidEvent, null, "does not dispatch an 'invalid' event");
  });
  testIf(TrixEditorElement.formAssociated, "re-validates when the value changes", async () => {
    const editor = document.getElementById("editor-with-ancestor-form");
    editor.required = true;
    editor.focus();
    assert.equal(editor.validity.valid, false, "validity.valid is initially false");
    await typeCharacters("a");
    assert.equal(editor.validity.valid, true, "validity.valid is true after re-validating");
    assert.equal(editor.validity.valueMissing, false, "validity.valueMissing is false");
    assert.equal(editor.validationMessage, "", "clears the validationMessage");
  });
  testIf(TrixEditorElement.formAssociated, "accepts a customError validation message", () => {
    const editor = document.getElementById("editor-with-ancestor-form");
    editor.setCustomValidity("A custom validation message");
    assert.equal(editor.validity.valid, false);
    assert.equal(editor.validity.customError, true);
    assert.equal(editor.validationMessage, "A custom validation message");
  });
});

testGroup("HTML loading", () => {
  testGroup("inline elements", {
    template: "editor_with_styled_content"
  }, () => {
    const cases = {
      "BR before block element styled otherwise": {
        html: "a<br><figure class=\"attachment\"><img src=\"".concat(TEST_IMAGE_URL, "\"></figure>"),
        expectedDocument: "a\n".concat(OBJECT_REPLACEMENT_CHARACTER, "\n")
      },
      "BR in text before block element styled otherwise": {
        html: "<div>a<br>b<figure class=\"attachment\"><img src=\"".concat(TEST_IMAGE_URL, "\"></figure></div>"),
        expectedDocument: "a\nb".concat(OBJECT_REPLACEMENT_CHARACTER, "\n")
      }
    };
    for (const name in cases) {
      const details = cases[name];
      test$3(name, () => {
        getEditor().loadHTML(details.html);
        expectDocument(details.expectedDocument);
      });
    }
  });
  testGroup("bold elements", {
    template: "editor_with_bold_styles"
  }, () => {
    test$3("<strong> with font-weight: 500", () => {
      getEditor().loadHTML("<strong>a</strong>");
      assert.textAttributes([0, 1], {
        bold: true
      });
      expectDocument("a\n");
    });
    test$3("<span> with font-weight: 600", () => {
      getEditor().loadHTML("<span>a</span>");
      assert.textAttributes([0, 1], {
        bold: true
      });
      expectDocument("a\n");
    });
    test$3("<article> with font-weight: bold", () => {
      getEditor().loadHTML("<article>a</article>");
      assert.textAttributes([0, 1], {
        bold: true
      });
      expectDocument("a\n");
    });
  });
  testGroup("styled block elements", {
    template: "editor_with_block_styles"
  }, () => {
    test$3("<em> in <blockquote> with font-style: italic", () => {
      getEditor().loadHTML("<blockquote>a<em>b</em></blockquote>");
      assert.textAttributes([0, 1], {});
      assert.textAttributes([1, 2], {
        italic: true
      });
      assert.blockAttributes([0, 2], ["quote"]);
      expectDocument("ab\n");
    });
    test$3("<strong> in <li> with font-weight: bold", () => {
      getEditor().loadHTML("<ul><li>a<strong>b</strong></li></ul>");
      assert.textAttributes([0, 1], {});
      assert.textAttributes([1, 2], {
        bold: true
      });
      assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
      expectDocument("ab\n");
    });
    test$3("newline in <li> with font-weight: bold", () => {
      getEditor().loadHTML("<ul><li>a<br>b</li></ul>");
      assert.textAttributes([0, 2], {});
      assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
      expectDocument("a\nb\n");
    });
  });
  testGroup("in a table", {
    template: "editor_in_table"
  }, () => {
    test$3("block elements", () => {
      getEditor().loadHTML("<h1>a</h1><blockquote>b</blockquote>");
      assert.blockAttributes([0, 2], ["heading1"]);
      assert.blockAttributes([2, 4], ["quote"]);
      expectDocument("a\nb\n");
    });
  });
  testGroup("images", {
    template: "editor_empty"
  }, () => {
    test$3("without dimensions", async () => {
      getEditor().loadHTML("<img src=\"".concat(TEST_IMAGE_URL, "\">"));
      await delay(50);
      const attachment = getDocument().getAttachments()[0];
      const image = getEditorElement().querySelector("img");
      assert.equal(attachment.getWidth(), 1);
      assert.equal(attachment.getHeight(), 1);
      assert.equal(image.getAttribute("width"), "1");
      assert.equal(image.getAttribute("height"), "1");
      expectDocument("".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
    });
    test$3("with dimensions", async () => {
      getEditor().loadHTML("<img src=\"".concat(TEST_IMAGE_URL, "\" width=\"10\" height=\"20\">"));
      await delay(50);
      const attachment = getDocument().getAttachments()[0];
      const image = getEditorElement().querySelector("img");
      assert.equal(attachment.getWidth(), 10);
      assert.equal(attachment.getHeight(), 20);
      assert.equal(image.getAttribute("width"), "10");
      assert.equal(image.getAttribute("height"), "20");
      expectDocument("".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
    });
  });
  testGroup("text after closing tag", {
    template: "editor_empty"
  }, () => {
    test$3("parses text as separate block", () => {
      getEditor().loadHTML("<h1>a</h1>b");
      assert.blockAttributes([0, 2], ["heading1"]);
      assert.blockAttributes([2, 4], []);
      expectDocument("a\nb\n");
    });
  });
});

testGroup("HTML Reparsing", {
  template: "editor_empty"
}, () => {
  test$3("mutation resulting in identical blocks", async () => {
    const element = getEditorElement();
    element.editor.loadHTML("<ul><li>a</li><li>b</li></ul>");
    await nextFrame();
    element.querySelector("li").textContent = "b";
    await nextFrame();
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], ["bulletList", "bullet"]);
    assert.equal(element.value, "<ul><li>b</li><li>b</li></ul>");
    expectDocument("b\nb\n");
  });
  test$3("mutation resulting in identical pieces", async () => {
    const element = getEditorElement();
    element.editor.loadHTML("<div><strong>a</strong> <strong>b</strong></div>");
    await nextFrame();
    element.querySelector("strong").textContent = "b";
    await nextFrame();
    assert.textAttributes([0, 1], {
      bold: true
    });
    assert.textAttributes([2, 3], {
      bold: true
    });
    assert.equal(element.value, "<div><strong>b</strong> <strong>b</strong></div>");
    expectDocument("b b\n");
  });
});

const test$2 = function () {
  testIf(input.getLevel() === 0, ...arguments);
};
testGroup("Level 0 input: HTML replacement", () => testGroup("deleting with command+backspace", {
  template: "editor_empty"
}, () => {
  test$2("from the end of a line", async () => {
    getEditor().loadHTML("<div>a</div><blockquote>b</blockquote><div>c</div>");
    getSelectionManager().setLocationRange({
      index: 1,
      offset: 1
    });
    await pressCommandBackspace({
      replaceText: "b"
    });
    assert.locationRange({
      index: 1,
      offset: 0
    });
    assert.blockAttributes([0, 2], []);
    assert.blockAttributes([2, 3], ["quote"]);
    assert.blockAttributes([3, 5], []);
    expectDocument("a\n\nc\n");
  });
  test$2("in the first block", async () => {
    getEditor().loadHTML("<div>a</div><blockquote>b</blockquote>");
    getSelectionManager().setLocationRange({
      index: 0,
      offset: 1
    });
    await pressCommandBackspace({
      replaceText: "a"
    });
    assert.locationRange({
      index: 0,
      offset: 0
    });
    assert.blockAttributes([0, 1], []);
    assert.blockAttributes([1, 3], ["quote"]);
    expectDocument("\nb\n");
  });
  test$2("from the middle of a line", async () => {
    getEditor().loadHTML("<div>a</div><blockquote>bc</blockquote><div>d</div>");
    getSelectionManager().setLocationRange({
      index: 1,
      offset: 1
    });
    await pressCommandBackspace({
      replaceText: "b"
    });
    assert.locationRange({
      index: 1,
      offset: 0
    });
    assert.blockAttributes([0, 2], []);
    assert.blockAttributes([2, 4], ["quote"]);
    assert.blockAttributes([4, 6], []);
    expectDocument("a\nc\nd\n");
  });
  test$2("from the middle of a line in a multi-line block", async () => {
    getEditor().loadHTML("<div>a</div><blockquote>bc<br>d</blockquote><div>e</div>");
    getSelectionManager().setLocationRange({
      index: 1,
      offset: 1
    });
    await pressCommandBackspace({
      replaceText: "b"
    });
    assert.locationRange({
      index: 1,
      offset: 0
    });
    assert.blockAttributes([0, 2], []);
    assert.blockAttributes([2, 6], ["quote"]);
    expectDocument("a\nc\nd\ne\n");
  });
  test$2("from the end of a list item", async () => {
    getEditor().loadHTML("<ul><li>a</li><li>b</li></ul>");
    getSelectionManager().setLocationRange({
      index: 1,
      offset: 1
    });
    await pressCommandBackspace({
      replaceText: "b"
    });
    assert.locationRange({
      index: 1,
      offset: 0
    });
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 4], ["bulletList", "bullet"]);
    expectDocument("a\n\n");
  });
  test$2("a character that is its text node's only data", async () => {
    getEditor().loadHTML("<div>a<br>b<br><strong>c</strong></div>");
    getSelectionManager().setLocationRange({
      index: 0,
      offset: 3
    });
    await pressCommandBackspace({
      replaceText: "b"
    });
    assert.locationRange({
      index: 0,
      offset: 2
    });
    expectDocument("a\n\nc\n");
  });
  test$2("a formatted word", async () => {
    getEditor().loadHTML("<div>a<strong>bc</strong></div>");
    getSelectionManager().setLocationRange({
      index: 0,
      offset: 4
    });
    await pressCommandBackspace({
      replaceElementWithText: "bc"
    });
    assert.locationRange({
      index: 0,
      offset: 1
    });
    expectDocument("a\n");
  });
}));
const pressCommandBackspace = async _ref => {
  let {
    replaceText,
    replaceElementWithText
  } = _ref;
  let previousSibling;
  triggerEvent(document.activeElement, "keydown", {
    charCode: 0,
    keyCode: 8,
    which: 8,
    metaKey: true
  });
  const range = rangy.getSelection().getRangeAt(0);
  if (replaceElementWithText) {
    const element = getElementWithText(replaceElementWithText);
    previousSibling = element.previousSibling;
    element.parentNode.removeChild(element);
    range.collapseAfter(previousSibling);
  } else {
    var _previousSibling;
    range.findText(replaceText, {
      direction: "backward"
    });
    range.splitBoundaries();
    const node = range.getNodes()[0];
    previousSibling = node.previousSibling;
    const {
      nextSibling,
      parentNode
    } = node;
    if (((_previousSibling = previousSibling) === null || _previousSibling === void 0 ? void 0 : _previousSibling.nodeType) === Node.COMMENT_NODE) {
      parentNode.removeChild(previousSibling);
    }
    node.data = "";
    parentNode.removeChild(node);
    if (!parentNode.hasChildNodes()) {
      parentNode.appendChild(document.createElement("br"));
    }
    range.collapseBefore(nextSibling ? nextSibling : parentNode.firstChild);
  }
  range.select();
  await nextFrame();
};
const getElementWithText = function (text) {
  for (const element of Array.from(document.activeElement.querySelectorAll("*"))) {
    if (element.innerText === text) {
      return element;
    }
  }
  return null;
};

testGroup("Installation process", {
  template: "editor_html"
}, () => {
  test$3("element.editorController", () => {
    assert.ok(getEditorController() instanceof EditorController);
  });
  test$3("creates a contenteditable element", () => assert.ok(getEditorElement()));
  test$3("loads the initial document", () => {
    assert.equal(getEditorElement().textContent, "Hello world");
  });
  test$3("sets value property", async () => {
    await nextFrame();
    assert.equal(getEditorElement().value, "<div>Hello world</div>");
  });
});
testGroup("Installation process without specified elements", {
  template: "editor_empty"
}, () => test$3("creates identified toolbar and input elements", () => {
  const editorElement = getEditorElement();
  const toolbarId = editorElement.getAttribute("toolbar");
  assert.ok(/trix-toolbar-\d+/.test(toolbarId), "toolbar id not assert.ok ".concat(JSON.stringify(toolbarId)));
  const toolbarElement = document.getElementById(toolbarId);
  assert.ok(toolbarElement, "toolbar element not assert.ok");
  assert.equal(editorElement.toolbarElement, toolbarElement);
  const inputId = editorElement.getAttribute("input");
  assert.ok(/trix-input-\d+/.test(inputId), "input id not assert.ok ".concat(JSON.stringify(inputId)));
  const inputElement = document.getElementById(inputId);
  assert.ok(inputElement, "input element not assert.ok");
  assert.equal(editorElement.inputElement, inputElement);
}));
testGroup("Installation process with specified elements", {
  template: "editor_with_toolbar_and_input"
}, () => {
  test$3("uses specified elements", () => {
    const editorElement = getEditorElement();
    assert.equal(editorElement.toolbarElement, document.getElementById("my_toolbar"));
    assert.equal(editorElement.inputElement, document.getElementById("my_input"));
    assert.equal(editorElement.value, "<div>Hello world</div>");
  });
  test$3("can be cloned", async () => {
    const originalElement = document.getElementById("my_editor");
    const clonedElement = originalElement.cloneNode(true);
    const {
      parentElement
    } = originalElement;
    parentElement.removeChild(originalElement);
    parentElement.appendChild(clonedElement);
    await nextFrame();
    const editorElement = getEditorElement();
    assert.equal(editorElement.toolbarElement, document.getElementById("my_toolbar"));
    assert.equal(editorElement.inputElement, document.getElementById("my_input"));
    assert.equal(editorElement.value, "<div>Hello world</div>");
  });
});

const test$1 = function () {
  testIf(input.getLevel() === 2, ...arguments);
};
const testOptions = {
  template: "editor_empty",
  setup() {
    addEventListener("beforeinput", recordInputEvent, true);
    addEventListener("input", recordInputEvent, true);
  },
  teardown() {
    removeEventListener("beforeinput", recordInputEvent, true);
    removeEventListener("input", recordInputEvent, true);
  }
};
let inputEvents = [];
const recordInputEvent = function (event) {
  // Not all browsers dispatch "beforeinput" event when calling execCommand() so
  // we manually dispatch a synthetic one. If a second one arrives, ignore it.
  if (event.type === "beforeinput" && inputEvents.length === 1 && inputEvents[0].type === "beforeinput") {
    event.stopImmediatePropagation();
  } else {
    const {
      type,
      inputType,
      data
    } = event;
    inputEvents.push({
      type,
      inputType,
      data
    });
  }
};

// Borrowed from https://github.com/web-platform-tests/wpt/blob/master/input-events/input-events-exec-command.html
const performInputTypeUsingExecCommand = async (command, _ref) => {
  let {
    inputType,
    data
  } = _ref;
  inputEvents = [];
  await nextFrame();
  const isInsertParagraph = inputType === "insertParagraph";
  triggerInputEvent(document.activeElement, "beforeinput", {
    inputType,
    data
  });

  // See `shouldRenderInmmediatelyToDealWithIOSDictation` to deal with iOS 18+ dictation bug.
  if (!isInsertParagraph) {
    document.execCommand(command, false, data);
    assert.equal(inputEvents[1].type, "input");
  }
  assert.equal(inputEvents.length, isInsertParagraph ? 1 : 2);
  assert.equal(inputEvents[0].type, "beforeinput");
  assert.equal(inputEvents[0].inputType, inputType);
  assert.equal(inputEvents[0].data, data);
  await nextFrame();
  await nextFrame();
};
testGroup("Level 2 Input", testOptions, () => {
  test$1("insertText", async () => {
    await performInputTypeUsingExecCommand("insertText", {
      inputType: "insertText",
      data: "abc"
    });
    expectDocument("abc\n");
  });
  test$1("insertOrderedList", async () => {
    insertString("a\nb");
    await performInputTypeUsingExecCommand("insertOrderedList", {
      inputType: "insertOrderedList"
    });
    assert.blockAttributes([0, 2], []);
    assert.blockAttributes([2, 4], ["numberList", "number"]);
    assert.ok(isToolbarButtonActive({
      attribute: "number"
    }));
    expectDocument("a\nb\n");
  });
  test$1("insertUnorderedList", async () => {
    insertString("a\nb");
    await performInputTypeUsingExecCommand("insertUnorderedList", {
      inputType: "insertUnorderedList"
    });
    assert.blockAttributes([0, 2], []);
    assert.blockAttributes([2, 4], ["bulletList", "bullet"]);
    assert.ok(isToolbarButtonActive({
      attribute: "bullet"
    }));
    expectDocument("a\nb\n");
  });
  test$1("insertLineBreak", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    insertString("abc");
    await performInputTypeUsingExecCommand("insertLineBreak", {
      inputType: "insertLineBreak"
    });
    await performInputTypeUsingExecCommand("insertLineBreak", {
      inputType: "insertLineBreak"
    });
    assert.blockAttributes([0, 6], ["quote"]);
    expectDocument("abc\n\n\n");
  });
  test$1("insertParagraph", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    insertString("abc");
    await performInputTypeUsingExecCommand("insertParagraph", {
      inputType: "insertParagraph"
    });
    await performInputTypeUsingExecCommand("insertParagraph", {
      inputType: "insertParagraph"
    });
    assert.blockAttributes([0, 4], ["quote"]);
    assert.blockAttributes([4, 5], []);
    expectDocument("abc\n\n");
  });
  test$1("formatBold", async () => {
    insertString("abc");
    getComposition().setSelectedRange([1, 2]);
    await performInputTypeUsingExecCommand("bold", {
      inputType: "formatBold"
    });
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 2], {
      bold: true
    });
    assert.textAttributes([2, 3], {});
    expectDocument("abc\n");
  });
  test$1("formatItalic", async () => {
    insertString("abc");
    getComposition().setSelectedRange([1, 2]);
    await performInputTypeUsingExecCommand("italic", {
      inputType: "formatItalic"
    });
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 2], {
      italic: true
    });
    assert.textAttributes([2, 3], {});
    expectDocument("abc\n");
  });
  test$1("formatStrikeThrough", async () => {
    insertString("abc");
    getComposition().setSelectedRange([1, 2]);
    await performInputTypeUsingExecCommand("strikeThrough", {
      inputType: "formatStrikeThrough"
    });
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 2], {
      strike: true
    });
    assert.textAttributes([2, 3], {});
    expectDocument("abc\n");
  });

  // https://input-inspector.now.sh/profiles/hVXS1cHYFvc2EfdRyTWQ
  test$1("correcting a misspelled word", async () => {
    insertString("onr");
    getComposition().setSelectedRange([0, 3]);
    await nextFrame();
    const inputType = "insertReplacementText";
    const dataTransfer = createDataTransfer({
      "text/plain": "one"
    });
    const targetRange = document.createRange();
    const textNode = getEditorElement().firstElementChild.lastChild;
    targetRange.setStart(textNode, 0);
    targetRange.setEnd(textNode, 3);
    const event = createEvent("beforeinput", {
      inputType,
      dataTransfer,
      getTargetRanges: () => [targetRange]
    });
    document.activeElement.dispatchEvent(event);
    await nextFrame();
    expectDocument("one\n");
  });

  // https://input-inspector.now.sh/profiles/XsZVwKtFxakwnsNs0qnX
  test$1("correcting a misspelled word in Safari", async () => {
    insertString("onr");
    getComposition().setSelectedRange([0, 3]);
    await nextFrame();
    const inputType = "insertText";
    const dataTransfer = createDataTransfer({
      "text/plain": "one",
      "text/html": "one"
    });
    const event = createEvent("beforeinput", {
      inputType,
      dataTransfer
    });
    document.activeElement.dispatchEvent(event);
    await nextFrame();
    expectDocument("one\n");
  });

  // https://input-inspector.now.sh/profiles/yZlsrfG93QMzp2oyr0BE
  test$1("deleting the last character in a composed word on Android", async () => {
    insertString("c");
    const element = getEditorElement();
    const textNode = element.firstChild.lastChild;
    await selectNode(textNode);
    triggerInputEvent(element, "beforeinput", {
      inputType: "insertCompositionText",
      data: ""
    });
    triggerEvent(element, "compositionend", {
      data: ""
    });
    await nextFrame();
    expectDocument("\n");
  });
  test$1("pasting a file", async () => {
    const file = await createFile();
    const clipboardData = createDataTransfer({
      Files: [file]
    });
    const dataTransfer = createDataTransfer({
      Files: [file]
    });
    await paste({
      clipboardData,
      dataTransfer
    });
    const attachments = getDocument().getAttachments();
    assert.equal(attachments.length, 1);
    assert.equal(attachments[0].getFilename(), file.name);
    expectDocument("".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
  });

  // "insertFromPaste InputEvent missing pasted files in dataTransfer"
  // - https://bugs.webkit.org/show_bug.cgi?id=194921
  test$1("pasting a file in Safari", async () => {
    const file = await createFile();
    const clipboardData = createDataTransfer({
      Files: [file]
    });
    const dataTransfer = createDataTransfer({
      "text/html": "<img src=\"blob:".concat(location.origin, "/531de8\">")
    });
    await paste({
      clipboardData,
      dataTransfer
    });
    const attachments = getDocument().getAttachments();
    assert.equal(attachments.length, 1);
    assert.equal(attachments[0].getFilename(), file.name);
    expectDocument("".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
  });

  // "insertFromPaste InputEvent missing text/uri-list in dataTransfer for pasted links"
  // - https://bugs.webkit.org/show_bug.cgi?id=196702
  test$1("pasting a link in Safari", async () => {
    await createFile();
    const url = "https://bugs.webkit.org";
    const text = "WebKit Bugzilla";
    const clipboardData = createDataTransfer({
      URL: url,
      "text/uri-list": url,
      "text/plain": text
    });
    const dataTransfer = createDataTransfer({
      "text/html": "<a href=\"".concat(url, "\">").concat(text, "</a>"),
      "text/plain": text
    });
    await paste({
      clipboardData,
      dataTransfer
    });
    assert.textAttributes([0, url.length], {
      href: url
    });
    expectDocument("".concat(url, "\n"));
  });

  // Pastes from MS Word include an image of the copied text 🙃
  // https://input-inspector.now.sh/profiles/QWDITsV60dpEVl1SOZg8
  test$1("pasting text from MS Word", async () => {
    const file = await createFile();
    const dataTransfer = createDataTransfer({
      "text/html": "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\"\n        xmlns:w=\"urn:schemas-microsoft-com:office:word\"\n        xmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\"\n        xmlns=\"http://www.w3.org/TR/REC-html40\">\n        <body>\n          <span class=\"MsoNormal\">abc</span>\n        </body>\n      </html>",
      "text/plain": "abc",
      Files: [file]
    });
    await paste({
      dataTransfer
    });
    const attachments = getDocument().getAttachments();
    assert.equal(attachments.length, 0);
    expectDocument("abc\n");
  });

  // "beforeinput" event is not fired for Paste and Match Style operations
  // - https://bugs.chromium.org/p/chromium/issues/detail?id=934448
  test$1("Paste and Match Style in Chrome", async () => {
    await typeCharacters("a\n\n");
    const clipboardData = createDataTransfer({
      "text/plain": "b\n\nc"
    });
    const pasteEvent = createEvent("paste", {
      clipboardData
    });
    if (document.activeElement.dispatchEvent(pasteEvent)) {
      const node = document.createElement("div");
      node.innerHTML = "<div>b</div><div><br></div><div>c</div>";
      await insertNode(node);
    } else {
      await nextFrame();
    }
    expectDocument("a\n\nb\n\nc\n");
  });
});
const createFile = () => {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    canvas.toBlob(file => {
      file.name = "image.png";
      resolve(file);
    });
  });
};
const createDataTransfer = function () {
  let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    types: Object.keys(data),
    files: data.Files || [],
    getData: type => data[type]
  };
};
const createEvent = function (type) {
  let properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const event = document.createEvent("Events");
  event.initEvent(type, true, true);
  for (const key in properties) {
    const value = properties[key];
    Object.defineProperty(event, key, {
      value
    });
  }
  return event;
};
const paste = async function () {
  let param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    dataTransfer,
    clipboardData
  } = param;
  const pasteEvent = createEvent("paste", {
    clipboardData: clipboardData || dataTransfer
  });
  const inputEvent = createEvent("beforeinput", {
    inputType: "insertFromPaste",
    dataTransfer
  });
  if (document.activeElement.dispatchEvent(pasteEvent)) {
    document.activeElement.dispatchEvent(inputEvent);
  }
  await delay(60);
};

testGroup("List formatting", {
  template: "editor_empty"
}, () => {
  test$3("creating a new list item", async () => {
    await typeCharacters("a");
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("\n");
    assert.locationRange({
      index: 1,
      offset: 0
    });
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], ["bulletList", "bullet"]);
  });
  test$3("breaking out of a list", async () => {
    await typeCharacters("a");
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("\n\n");
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], []);
    expectDocument("a\n\n");
  });
  test$3("pressing return at the beginning of a non-empty list item", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a\nb");
    await moveCursor("left");
    await pressKey("return");
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], ["bulletList", "bullet"]);
    assert.blockAttributes([3, 5], ["bulletList", "bullet"]);
    expectDocument("a\n\nb\n");
  });
  test$3("pressing tab increases nesting level, tab+shift decreases nesting level", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a");
    await pressKey("return");
    await pressKey("tab");
    await typeCharacters("b");
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], ["bulletList", "bullet", "bulletList", "bullet"]);
    await nextFrame();
    // press shift tab
    triggerEvent(document.activeElement, "keydown", {
      key: "Tab",
      charCode: 0,
      keyCode: 9,
      which: 9,
      shiftKey: true
    });
    assert.blockAttributes([0, 1], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], ["bulletList", "bullet"]);
    expectDocument("a\nb\n");
  });
  testIf(input.getLevel() === 0, "pressing shift-return at the end of a list item", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a");
    const pressShiftReturn = triggerEvent(document.activeElement, "keydown", {
      charCode: 0,
      keyCode: 13,
      which: 13,
      shiftKey: true
    });
    assert.notOk(pressShiftReturn); // Assert defaultPrevented
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    expectDocument("a\n\n");
  });
  test$3("pressing delete at the beginning of a non-empty nested list item", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a\n");
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    await typeCharacters("b\n");
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    await typeCharacters("c");
    getSelectionManager().setLocationRange({
      index: 1,
      offset: 0
    });
    getComposition().deleteInDirection("backward");
    getEditorController().render();
    await nextFrame();
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    assert.blockAttributes([3, 4], ["bulletList", "bullet", "bulletList", "bullet"]);
    expectDocument("ab\nc\n");
  });
  test$3("decreasing list item's level decreases its nested items level too", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("a\n");
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    await typeCharacters("b\n");
    await clickToolbarButton({
      action: "increaseNestingLevel"
    });
    await typeCharacters("c");
    getSelectionManager().setLocationRange({
      index: 1,
      offset: 1
    });
    for (let n = 0; n < 3; n++) {
      getComposition().deleteInDirection("backward");
      getEditorController().render();
    }
    assert.blockAttributes([0, 2], ["bulletList", "bullet"]);
    assert.blockAttributes([2, 3], []);
    assert.blockAttributes([3, 5], ["bulletList", "bullet"]);
    expectDocument("a\n\nc\n");
  });
});

const test = function () {
  testIf(input.getLevel() === 0, ...arguments);
};
testGroup("Mutation input", {
  template: "editor_empty"
}, () => {
  test("deleting a newline", async () => {
    const element = getEditorElement();
    element.editor.insertString("a\n\nb");
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 229,
      which: 229
    });
    const br = element.querySelectorAll("br")[1];
    br.parentNode.removeChild(br);
    await nextFrame();
    expectDocument("a\nb\n");
  });
  test("typing a space in formatted text at the end of a block", async () => {
    const element = getEditorElement();
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("a");
    // Press space key
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 32,
      which: 32
    });
    triggerEvent(element, "keypress", {
      charCode: 32,
      keyCode: 32,
      which: 32
    });
    const boldElement = element.querySelector("strong");
    boldElement.appendChild(document.createTextNode(" "));
    boldElement.appendChild(document.createElement("br"));
    await nextFrame();
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    assert.textAttributes([0, 2], {
      bold: true
    });
    expectDocument("a \n");
  });
  test("typing formatted text after a newline at the end of block", async () => {
    const element = getEditorElement();
    element.editor.insertHTML("<ul><li>a</li><li><br></li></ul>");
    element.editor.setSelectedRange(3);
    await clickToolbarButton({
      attribute: "bold"
    });

    // Press B key
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 66,
      which: 66
    });
    triggerEvent(element, "keypress", {
      charCode: 98,
      keyCode: 98,
      which: 98
    });
    const node = document.createTextNode("b");
    const extraBR = element.querySelectorAll("br")[1];
    extraBR.parentNode.insertBefore(node, extraBR);
    extraBR.parentNode.removeChild(extraBR);
    await nextFrame();
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    assert.textAttributes([0, 1], {});
    assert.textAttributes([3, 4], {
      bold: true
    });
    expectDocument("a\n\nb\n");
  });
  test("typing an emoji after a newline at the end of block", async () => {
    const element = getEditorElement();
    await typeCharacters("\n");

    // Tap 👏🏻 on iOS
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 0,
      which: 0,
      key: "👏🏻"
    });
    triggerEvent(element, "keypress", {
      charCode: 128079,
      keyCode: 128079,
      which: 128079,
      key: "👏🏻"
    });
    const node = document.createTextNode("👏🏻");
    const extraBR = element.querySelectorAll("br")[1];
    extraBR.parentNode.insertBefore(node, extraBR);
    extraBR.parentNode.removeChild(extraBR);
    await nextFrame();
    expectDocument("\n👏🏻\n");
  });
  test("backspacing an attachment at the beginning of an otherwise empty document", async () => {
    const element = getEditorElement();
    element.editor.loadHTML("<img src=\"".concat(TEST_IMAGE_URL, "\" width=\"10\" height=\"10\">"));
    await nextFrame();
    element.editor.setSelectedRange([0, 1]);
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 8,
      which: 8
    });
    element.firstElementChild.innerHTML = "<br>";
    await nextFrame();
    assert.locationRange({
      index: 0,
      offset: 0
    });
    expectDocument("\n");
  });
  test("backspacing a block comment node", async expectDocument => {
    const element = getEditorElement();
    element.editor.loadHTML("<blockquote>a</blockquote><div>b</div>");
    await nextFrame();
    element.editor.setSelectedRange(2);
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 8,
      which: 8
    });
    const commentNode = element.lastChild.firstChild;
    commentNode.parentNode.removeChild(commentNode);
    await nextFrame();
    assert.locationRange({
      index: 0,
      offset: 1
    });
    expectDocument("ab\n");
  });
  test("typing formatted text with autocapitalization on", async () => {
    const element = getEditorElement();
    await clickToolbarButton({
      attribute: "bold"
    });
    // Type "b", autocapitalize to "B"
    triggerEvent(element, "keydown", {
      charCode: 0,
      keyCode: 66,
      which: 66
    });
    triggerEvent(element, "keypress", {
      charCode: 98,
      keyCode: 98,
      which: 98
    });
    triggerEvent(element, "textInput", {
      data: "B"
    });
    await insertNode(document.createTextNode("B"));
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    assert.textAttributes([0, 1], {
      bold: true
    });
    expectDocument("B\n");
  });
});

testGroup("Pasting", {
  template: "editor_empty"
}, () => {
  test$3("paste plain text", async () => {
    await typeCharacters("abc");
    await moveCursor("left");
    await pasteContent("text/plain", "!");
    expectDocument("ab!c\n");
  });
  test$3("paste simple html", async () => {
    await typeCharacters("abc");
    await moveCursor("left");
    await pasteContent("text/html", "&lt;");
    expectDocument("ab<c\n");
  });
  test$3("paste complex html", async () => {
    await typeCharacters("abc");
    await moveCursor("left");
    await pasteContent("text/html", "<div>Hello world<br></div><div>This is a test</div>");
    expectDocument("abHello world\nThis is a test\nc\n");
  });
  test$3("paste html in expanded selection", async () => {
    await typeCharacters("abc");
    await moveCursor("left");
    await expandSelection({
      direction: "left",
      times: 2
    });
    await pasteContent("text/html", "<strong>x</strong>");
    assert.selectedRange(1);
    expectDocument("xc\n");
  });
  test$3("paste plain text with CRLF ", async () => {
    await pasteContent("text/plain", "a\r\nb\r\nc");
    expectDocument("a\nb\nc\n");
  });
  test$3("paste html with CRLF ", async () => {
    await pasteContent("text/html", "<div>a<br></div>\r\n<div>b<br></div>\r\n<div>c<br></div>");
    expectDocument("a\nb\nc\n");
  });
  test$3("paste plain text with CR", async () => {
    await pasteContent("text/plain", "a\rb\rc");
    expectDocument("a\nb\nc\n");
  });
  test$3("paste html with CR", async () => {
    await pasteContent("text/html", "<div>a<br></div>\r<div>b<br></div>\r<div>c<br></div>");
    expectDocument("a\nb\nc\n");
  });
  test$3("paste unsafe html", async () => {
    window.unsanitized = [];
    const pasteData = {
      "text/plain": "x",
      "text/html": "        <img onload=\"window.unsanitized.push('img.onload');\" src=\"".concat(TEST_IMAGE_URL, "\">\n        <img onerror=\"window.unsanitized.push('img.onerror');\" src=\"data:image/gif;base64,TOTALLYBOGUS\">\n        <form><math><mtext></form><form><mglyph><style></math><img src onerror=\"window.unsanitized.push('img.onerror');\">\n        <script>\n          window.unsanitized.push('script tag');\n        </script>")
    };
    await pasteContent(pasteData);
    await delay(20);
    assert.deepEqual(window.unsanitized, []);
    delete window.unsanitized;
  });
  test$3("paste unsafe html with noscript", async () => {
    window.unsanitized = [];
    const pasteData = {
      "text/plain": "x",
      "text/html": "        <div><noscript><div class=\"123</noscript>456<img src=1 onerror=window.unsanitized.push(1)//\"></div></noscript></div>\n      "
    };
    await pasteContent(pasteData);
    await delay(20);
    assert.deepEqual(window.unsanitized, []);
    delete window.unsanitized;
  });
  test$3("paste data-trix-attachment unsafe html", async () => {
    window.unsanitized = [];
    const pasteData = {
      "text/plain": "x",
      "text/html": "      copy<div data-trix-attachment=\"{&quot;contentType&quot;:&quot;text/anything&quot;,&quot;content&quot;:&quot;&lt;img src=1 onerror=window.unsanitized.push(1)&gt;HELLO123&quot;}\"></div>me\n      "
    };
    await pasteContent(pasteData);
    await delay(20);
    assert.deepEqual(window.unsanitized, []);
    delete window.unsanitized;
  });
  test$3("paste data-trix-attachment encoded mathml", async () => {
    window.unsanitized = [];
    const pasteData = {
      "text/plain": "x",
      "text/html": "      copy<div data-trix-attachment=\"{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;img src=x onerror=window.unsanitized.push(1)&gt;&lt;/style&gt;XSS POC&quot;}\"></div>me\n      "
    };
    await pasteContent(pasteData);
    await delay(20);
    assert.deepEqual(window.unsanitized, []);
    delete window.unsanitized;
  });
  test$3("paste data-trix-attachment encoded embed", async () => {
    window.unsanitized = [];
    const pasteData = {
      "text/plain": "x",
      "text/html": "      copy<div data-trix-attachment=\"{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;embed src='window.unsanitized.push(1)'&gt;XSS POC&quot;}\"></div>me\n      "
    };
    await pasteContent(pasteData);
    await delay(20);
    assert.deepEqual(window.unsanitized, []);
    delete window.unsanitized;
  });
  test$3("prefers plain text when html lacks formatting", async () => {
    const pasteData = {
      "text/html": "<meta charset='utf-8'>a\nb",
      "text/plain": "a\nb"
    };
    await pasteContent(pasteData);
    expectDocument("a\nb\n");
  });
  test$3("prefers formatted html", async () => {
    const pasteData = {
      "text/html": "<meta charset='utf-8'>a\n<strong>b</strong>",
      "text/plain": "a\nb"
    };
    await pasteContent(pasteData);
    expectDocument("a b\n");
  });
  test$3("paste URL", async () => {
    await typeCharacters("a");
    await pasteContent("URL", "http://example.com");
    assert.textAttributes([1, 18], {
      href: "http://example.com"
    });
    expectDocument("ahttp://example.com\n");
  });
  test$3("paste URL with name", async () => {
    const pasteData = {
      URL: "http://example.com",
      "public.url-name": "Example",
      "text/plain": "http://example.com"
    };
    await pasteContent(pasteData);
    assert.textAttributes([0, 7], {
      href: "http://example.com"
    });
    expectDocument("Example\n");
  });
  test$3("paste JavaScript URL", async () => {
    const pasteData = {
      URL: "javascript:alert('XSS')"
    };
    await pasteContent(pasteData);
    assert.textAttributes([0, 23], {});
    expectDocument("javascript:alert('XSS')\n");
  });
  test$3("paste URL with name containing extraneous whitespace", async () => {
    const pasteData = {
      URL: "http://example.com",
      "public.url-name": "   Example from \n link  around\n\nnested \nelements ",
      "text/plain": "http://example.com"
    };
    await pasteContent(pasteData);
    assert.textAttributes([0, 40], {
      href: "http://example.com"
    });
    expectDocument("Example from link around nested elements\n");
  });
  test$3("paste complex html into formatted block", async () => {
    await typeCharacters("abc");
    await clickToolbarButton({
      attribute: "quote"
    });
    await pasteContent("text/html", "<div>Hello world<br></div><pre>This is a test</pre>");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 2);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["quote"], assert.equal(block.toString(), "abcHello world\n"));
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["quote", "code"]);
    assert.equal(block.toString(), "This is a test\n");
  });
  test$3("paste list into list", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("abc\n");
    await pasteContent("text/html", "<ul><li>one</li><li>two</li></ul>");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "abc\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "one\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "two\n");
  });
  test$3("paste list into quote", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    await typeCharacters("abc");
    await pasteContent("text/html", "<ul><li>one</li><li>two</li></ul>");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["quote"]);
    assert.equal(block.toString(), "abc\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["quote", "bulletList", "bullet"]);
    assert.equal(block.toString(), "one\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["quote", "bulletList", "bullet"]);
    assert.equal(block.toString(), "two\n");
  });
  test$3("paste list into quoted list", async () => {
    await clickToolbarButton({
      attribute: "quote"
    });
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("abc\n");
    await pasteContent("text/html", "<ul><li>one</li><li>two</li></ul>");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["quote", "bulletList", "bullet"]);
    assert.equal(block.toString(), "abc\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["quote", "bulletList", "bullet"]);
    assert.equal(block.toString(), "one\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["quote", "bulletList", "bullet"]);
    assert.equal(block.toString(), "two\n");
  });
  test$3("paste nested list into empty list item", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("y\nzz");
    getSelectionManager().setLocationRange({
      index: 0,
      offset: 1
    });
    await nextFrame();
    await pressKey("backspace");
    await pasteContent("text/html", "<ul><li>a<ul><li>b</li></ul></li></ul>");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "a\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet", "bulletList", "bullet"]);
    assert.equal(block.toString(), "b\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "zz\n");
  });
  test$3("paste nested list over list item contents", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("y\nzz");
    getSelectionManager().setLocationRange({
      index: 0,
      offset: 1
    });
    await nextFrame();
    await expandSelection("left");
    await pasteContent("text/html", "<ul><li>a<ul><li>b</li></ul></li></ul>");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "a\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet", "bulletList", "bullet"]);
    assert.equal(block.toString(), "b\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "zz\n");
  });
  test$3("paste list into empty block before list", async () => {
    await clickToolbarButton({
      attribute: "bullet"
    });
    await typeCharacters("c");
    await moveCursor("left");
    await pressKey("return");
    getSelectionManager().setLocationRange({
      index: 0,
      offset: 0
    });
    await nextFrame();
    await pasteContent("text/html", "<ul><li>a</li><li>b</li></ul>");
    const document = getDocument();
    assert.equal(document.getBlockCount(), 3);
    let block = document.getBlockAtIndex(0);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "a\n");
    block = document.getBlockAtIndex(1);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "b\n");
    block = document.getBlockAtIndex(2);
    assert.deepEqual(block.getAttributes(), ["bulletList", "bullet"]);
    assert.equal(block.toString(), "c\n");
  });
  test$3("paste file", async () => {
    await typeCharacters("a");
    await pasteContent("Files", createFile$1());
    await expectDocument("a".concat(OBJECT_REPLACEMENT_CHARACTER, "\n"));
  });
  testIf(input.getLevel() === 0, "paste event with no clipboardData", async () => {
    await typeCharacters("a");
    triggerEvent(document.activeElement, "paste");
    document.activeElement.insertAdjacentHTML("beforeend", "<span>bc</span>");
    await nextFrame();
    expectDocument("abc\n");
  });
});

testGroup("Text formatting", {
  template: "editor_empty"
}, () => {
  test$3("applying attributes to text", async () => {
    await typeCharacters("abc");
    await expandSelection("left");
    await clickToolbarButton({
      attribute: "bold"
    });
    assert.textAttributes([0, 2], {});
    assert.textAttributes([2, 3], {
      bold: true
    });
    assert.textAttributes([3, 4], {
      blockBreak: true
    });
  });
  test$3("applying a link to text", async () => {
    await typeCharacters("abc");
    await moveCursor("left");
    await expandSelection("left");
    await clickToolbarButton({
      attribute: "href"
    });
    assert.ok(isToolbarDialogActive({
      attribute: "href"
    }));
    await typeInToolbarDialog("http://example.com", {
      attribute: "href"
    });
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 2], {
      href: "http://example.com"
    });
    assert.textAttributes([2, 3], {});
  });
  test$3("inserting a link", async () => {
    await typeCharacters("a");
    await clickToolbarButton({
      attribute: "href"
    });
    assert.ok(isToolbarDialogActive({
      attribute: "href"
    }));
    await typeInToolbarDialog("http://example.com", {
      attribute: "href"
    });
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 19], {
      href: "http://example.com"
    });
    expectDocument("ahttp://example.com\n");
  });
  test$3("inserting a javascript: link is forbidden", async () => {
    await typeCharacters("XSS");
    await moveCursor("left");
    await expandSelection("left");
    await clickToolbarButton({
      attribute: "href"
    });
    assert.ok(isToolbarDialogActive({
      attribute: "href"
    }));
    await typeInToolbarDialog("javascript:alert('XSS')", {
      attribute: "href"
    });
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 2], {
      frozen: true
    });
    assert.textAttributes([2, 3], {});
  });
  test$3("editing a link", async () => {
    insertString("a");
    const text = Text.textForStringWithAttributes("bc", {
      href: "http://example.com"
    });
    insertText(text);
    insertString("d");
    await moveCursor({
      direction: "left",
      times: 2
    });
    await clickToolbarButton({
      attribute: "href"
    });
    assert.ok(isToolbarDialogActive({
      attribute: "href"
    }));
    assert.locationRange({
      index: 0,
      offset: 1
    }, {
      index: 0,
      offset: 3
    });
    await typeInToolbarDialog("http://example.org", {
      attribute: "href"
    });
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 3], {
      href: "http://example.org"
    });
    assert.textAttributes([3, 4], {});
  });
  test$3("removing a link", async () => {
    const text = Text.textForStringWithAttributes("ab", {
      href: "http://example.com"
    });
    insertText(text);
    assert.textAttributes([0, 2], {
      href: "http://example.com"
    });
    await expandSelection({
      direction: "left",
      times: 2
    });
    await clickToolbarButton({
      attribute: "href"
    });
    await clickToolbarDialogButton({
      method: "removeAttribute"
    });
    await assert.textAttributes([0, 2], {});
  });
  test$3("selecting an attachment disables text formatting", async () => {
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak();
    insertText(text);
    await typeCharacters("a");
    assert.notOk(isToolbarButtonDisabled({
      attribute: "bold"
    }));
    await expandSelection("left");
    assert.notOk(isToolbarButtonDisabled({
      attribute: "bold"
    }));
    await expandSelection("left");
    assert.ok(isToolbarButtonDisabled({
      attribute: "bold"
    }));
  });
  test$3("selecting an attachment deactivates toolbar dialog", async () => {
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak();
    insertText(text);
    await clickToolbarButton({
      attribute: "href"
    });
    assert.ok(isToolbarDialogActive({
      attribute: "href"
    }));
    await clickElement(getEditorElement().querySelector("figure"));
    assert.notOk(isToolbarDialogActive({
      attribute: "href"
    }));
    assert.ok(isToolbarButtonDisabled({
      attribute: "href"
    }));
  });
  test$3("typing over a selected attachment does not apply disabled formatting attributes", async () => {
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak();
    insertText(text);
    await expandSelection("left");
    assert.ok(isToolbarButtonDisabled({
      attribute: "bold"
    }));
    await typeCharacters("a");
    assert.textAttributes([0, 1], {});
    expectDocument("a\n");
  });
  test$3("applying a link to an attachment with a host-provided href", async () => {
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak();
    insertText(text);
    await typeCharacters("a");
    assert.notOk(isToolbarButtonDisabled({
      attribute: "href"
    }));
    await expandSelection("left");
    assert.notOk(isToolbarButtonDisabled({
      attribute: "href"
    }));
    await expandSelection("left");
    assert.ok(isToolbarButtonDisabled({
      attribute: "href"
    }));
  });
  test$3("typing after a link", async () => {
    await typeCharacters("ab");
    await expandSelection({
      direction: "left",
      times: 2
    });
    await clickToolbarButton({
      attribute: "href"
    });
    await typeInToolbarDialog("http://example.com", {
      attribute: "href"
    });
    await collapseSelection("right");
    assert.locationRange({
      index: 0,
      offset: 2
    });
    await typeCharacters("c");
    assert.textAttributes([0, 2], {
      href: "http://example.com"
    });
    assert.textAttributes([2, 3], {});
    await moveCursor("left");
    assert.notOk(isToolbarButtonActive({
      attribute: "href"
    }));
    await moveCursor("left");
    assert.ok(isToolbarButtonActive({
      attribute: "href"
    }));
  });
  test$3("applying formatting and then typing", async () => {
    await typeCharacters("a");
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("bcd");
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("e");
    assert.textAttributes([0, 1], {});
    assert.textAttributes([1, 4], {
      bold: true
    });
    assert.textAttributes([4, 5], {});
  });
  test$3("applying formatting and then moving the cursor away", async () => {
    await typeCharacters("abc");
    await moveCursor("left");
    assert.notOk(isToolbarButtonActive({
      attribute: "bold"
    }));
    await clickToolbarButton({
      attribute: "bold"
    });
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    await moveCursor("right");
    assert.notOk(isToolbarButtonActive({
      attribute: "bold"
    }));
    await moveCursor("left");
    assert.notOk(isToolbarButtonActive({
      attribute: "bold"
    }));
    assert.textAttributes([0, 3], {});
    assert.textAttributes([3, 4], {
      blockBreak: true
    });
  });
  test$3("applying formatting to an unfocused editor", async () => {
    const input = makeElement("input", {
      type: "text"
    });
    document.body.appendChild(input);
    input.focus();
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("a");
    assert.textAttributes([0, 1], {
      bold: true
    });
    document.body.removeChild(input);
  });
  test$3("editing formatted text", async () => {
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("ab");
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("c");
    assert.notOk(isToolbarButtonActive({
      attribute: "bold"
    }));
    await moveCursor("left");
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    await moveCursor("left");
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    await typeCharacters("Z");
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    assert.textAttributes([0, 3], {
      bold: true
    });
    assert.textAttributes([3, 4], {});
    assert.textAttributes([4, 5], {
      blockBreak: true
    });
    await moveCursor("right");
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
    await moveCursor("right");
    assert.notOk(isToolbarButtonActive({
      attribute: "bold"
    }));
  });
  testIf(input.getLevel() === 0, "key command activates toolbar button", async () => {
    await typeToolbarKeyCommand({
      attribute: "bold"
    });
    assert.ok(isToolbarButtonActive({
      attribute: "bold"
    }));
  });
  test$3("backspacing newline after text", async () => {
    await typeCharacters("a\n");
    await pressKey("backspace");
    expectDocument("a\n");
  });
});

testGroup("Undo/Redo", {
  template: "editor_empty"
}, async () => {
  test$3("typing and undoing", async () => {
    const first = getDocument().copy();
    await typeCharacters("abc");
    assert.notOk(getDocument().isEqualTo(first));
    await clickToolbarButton({
      action: "undo"
    });
    assert.ok(getDocument().isEqualTo(first));
  });
  test$3("typing, formatting, typing, and undoing", async () => {
    const first = getDocument().copy();
    await typeCharacters("abc");
    const second = getDocument().copy();
    await clickToolbarButton({
      attribute: "bold"
    });
    await typeCharacters("def");
    const third = getDocument().copy();
    await clickToolbarButton({
      action: "undo"
    });
    assert.ok(getDocument().isEqualTo(second));
    await clickToolbarButton({
      action: "undo"
    });
    assert.ok(getDocument().isEqualTo(first));
    await clickToolbarButton({
      action: "redo"
    });
    assert.ok(getDocument().isEqualTo(second));
    await clickToolbarButton({
      action: "redo"
    });
    assert.ok(getDocument().isEqualTo(third));
  });
  test$3("formatting changes are batched by location range", async () => {
    await typeCharacters("abc");
    const first = getDocument().copy();
    await expandSelection("left");
    await clickToolbarButton({
      attribute: "bold"
    });
    await clickToolbarButton({
      attribute: "italic"
    });
    const second = getDocument().copy();
    await moveCursor("left");
    await expandSelection("left");
    await clickToolbarButton({
      attribute: "italic"
    });
    const third = getDocument().copy();
    await clickToolbarButton({
      action: "undo"
    });
    assert.ok(getDocument().isEqualTo(second));
    await clickToolbarButton({
      action: "undo"
    });
    assert.ok(getDocument().isEqualTo(first));
    await clickToolbarButton({
      action: "redo"
    });
    assert.ok(getDocument().isEqualTo(second));
    await clickToolbarButton({
      action: "redo"
    });
    assert.ok(getDocument().isEqualTo(third));
  });
  test$3("block formatting are undoable", async () => {
    await typeCharacters("abc");
    const first = getDocument().copy();
    await clickToolbarButton({
      attribute: "heading1"
    });
    const second = getDocument().copy();
    await clickToolbarButton({
      action: "undo"
    });
    assert.ok(getDocument().isEqualTo(first));
    clickToolbarButton({
      action: "redo"
    });
    assert.ok(getDocument().isEqualTo(second));
  });
});

/* eslint-disable
*/
//# sourceMappingURL=test.js.map
