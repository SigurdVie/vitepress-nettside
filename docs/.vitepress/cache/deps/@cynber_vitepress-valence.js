import {
  Fragment,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createTextVNode,
  createVNode,
  defineComponent,
  h,
  inject,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeStyle,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList,
  renderSlot,
  resolveDynamicComponent,
  toDisplayString,
  unref,
  vModelText,
  watch,
  withCtx,
  withDirectives,
  withModifiers
} from "./chunk-LW4I4DCF.js";

// node_modules/@iconify/vue/dist/iconify.mjs
var matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
var stringToIcon = (value, validate, allowSimpleName, provider = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      // Allow provider without '@': "provider:prefix:name"
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix,
      name: name2
    };
    return validate && !validateIconName(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate && !validateIconName(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return validate && !validateIconName(result, allowSimpleName) ? null : result;
  }
  return null;
};
var validateIconName = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!// Check prefix: cannot be empty, unless allowSimpleName is enabled
  // Check name: cannot be empty
  ((allowSimpleName && icon.prefix === "" || !!icon.prefix) && !!icon.name);
};
var defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
var defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
var defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
var defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}
function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  Object.keys(icons).concat(Object.keys(aliases)).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse(name);
  tree.forEach(parse);
  return mergeIconData(data, currentProps);
}
function parseIconSet(data, callback) {
  const names = [];
  if (typeof data !== "object" || typeof data.icons !== "object") {
    return names;
  }
  if (data.not_found instanceof Array) {
    data.not_found.forEach((name) => {
      callback(name, null);
      names.push(name);
    });
  }
  const tree = getIconsTree(data);
  for (const name in tree) {
    const item = tree[name];
    if (item) {
      callback(name, internalGetIconData(data, name, item));
      names.push(name);
    }
  }
  return names;
}
var optionalPropertyDefaults = {
  provider: "",
  aliases: {},
  not_found: {},
  ...defaultIconDimensions
};
function checkOptionalProps(item, defaults) {
  for (const prop in defaults) {
    if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
      return false;
    }
  }
  return true;
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data = obj;
  if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
    return null;
  }
  const icons = data.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (
      // Name cannot be empty
      !name || // Must have body
      typeof icon.body !== "string" || // Check other props
      !checkOptionalProps(
        icon,
        defaultExtendedIconProps
      )
    ) {
      return null;
    }
  }
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  for (const name in aliases) {
    const icon = aliases[name];
    const parent = icon.parent;
    if (
      // Name cannot be empty
      !name || // Parent must be set and point to existing icon
      typeof parent !== "string" || !icons[parent] && !aliases[parent] || // Check other props
      !checkOptionalProps(
        icon,
        defaultExtendedIconProps
      )
    ) {
      return null;
    }
  }
  return data;
}
var dataStorage = /* @__PURE__ */ Object.create(null);
function newStorage(provider, prefix) {
  return {
    provider,
    prefix,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function getStorage(provider, prefix) {
  const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
  return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
}
function addIconSet(storage2, data) {
  if (!quicklyValidateIconSet(data)) {
    return [];
  }
  return parseIconSet(data, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing.add(name);
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = { ...icon };
      return true;
    }
  } catch (err) {
  }
  return false;
}
var simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  if (icon) {
    const storage2 = getStorage(icon.provider, icon.prefix);
    const iconName = icon.name;
    return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
  }
}
function addIcon(name, data) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  if (data) {
    return addIconToStorage(storage2, icon.name, data);
  } else {
    storage2.missing.add(icon.name);
    return true;
  }
}
function addCollection(data, provider) {
  if (typeof data !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = data.provider || "";
  }
  if (simpleNames && !provider && !data.prefix) {
    let added = false;
    if (quicklyValidateIconSet(data)) {
      data.prefix = "";
      parseIconSet(data, (name, icon) => {
        if (addIcon(name, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  const prefix = data.prefix;
  if (!validateIconName({
    provider,
    prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, prefix);
  return !!addIconSet(storage2, data);
}
var defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
var defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations
});
var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
var unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index = content.indexOf("<" + tag);
  while (index >= 0) {
    const start = content.indexOf(">", index);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) {
      break;
    }
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) {
      break;
    }
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}
var isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = wrapSVGContent(
        body,
        '<g transform="' + transformations.join(" ") + '">',
        "</g>"
      );
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  const viewBox = [box.left, box.top, boxWidth, boxHeight];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
}
var regex = /\sid="(\S+)"/g;
var randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
var counter = 0;
function replaceIDs(body, prefix = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  ids.forEach((id) => {
    const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(
      // Allowed characters before id: [#;"]
      // Allowed characters after id: [)"], .[a-z]
      new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
      "$1" + newID + suffix + "$3"
    );
  });
  body = body.replace(new RegExp(suffix, "g"), "");
  return body;
}
var storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    // API hosts
    resources,
    // Root path
    path: source.path || "/",
    // URL length limit
    maxURL: source.maxURL || 500,
    // Timeout before next host is used.
    rotate: source.rotate || 750,
    // Timeout before failing query.
    timeout: source.timeout || 5e3,
    // Randomise default API end point.
    random: source.random === true,
    // Start index
    index: source.index || 0,
    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
var configStorage = /* @__PURE__ */ Object.create(null);
var fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
var fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config = createAPIConfig(customConfig);
  if (config === null) {
    return false;
  }
  configStorage[provider] = config;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
var detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
};
var fetchModule = detectFetch();
function calculateMaxLength(provider, prefix) {
  const config = getAPIConfig(provider);
  if (!config) {
    return 0;
  }
  let result;
  if (!config.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = prefix + ".json?icons=";
    result = config.maxURL - maxHostLength - config.path.length - url.length;
  }
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
var prepare = (provider, prefix, icons) => {
  const results = [];
  const maxLength = calculateMaxLength(provider, prefix);
  const type = "icons";
  let item = {
    type,
    provider,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index) => {
    length += name.length + 1;
    if (length >= maxLength && index > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    const config = getAPIConfig(provider);
    if (config) {
      return config.path;
    }
  }
  return "/";
}
var send = (host, params, callback) => {
  if (!fetchModule) {
    callback("abort", 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      const urlParams = new URLSearchParams({
        icons: iconsList
      });
      path += prefix + ".json?" + urlParams.toString();
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      callback("abort", 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    const status = response.status;
    if (status !== 200) {
      setTimeout(() => {
        callback(shouldAbort(status) ? "abort" : "next", status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data) => {
    if (typeof data !== "object" || data === null) {
      setTimeout(() => {
        if (data === 404) {
          callback("abort", data);
        } else {
          callback("next", defaultError);
        }
      });
      return;
    }
    setTimeout(() => {
      callback("success", data);
    });
  }).catch(() => {
    callback("next", defaultError);
  });
};
var fetchAPIModule = {
  prepare,
  send
};
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = /* @__PURE__ */ Object.create(null);
  icons.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider);
    }
    if (a.prefix !== b.prefix) {
      return a.prefix.localeCompare(b.prefix);
    }
    return a.name.localeCompare(b.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
    const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
    let list;
    if (name in localStorage.icons) {
      list = result.loaded;
    } else if (prefix === "" || localStorage.missing.has(name)) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix,
      name
    };
    list.push(item);
  });
  return result;
}
function removeCallback(storages, id) {
  storages.forEach((storage2) => {
    const items = storage2.loaderCallbacks;
    if (items) {
      storage2.loaderCallbacks = items.filter((row) => row.id !== id);
    }
  });
}
function updateCallbacks(storage2) {
  if (!storage2.pendingCallbacksFlag) {
    storage2.pendingCallbacksFlag = true;
    setTimeout(() => {
      storage2.pendingCallbacksFlag = false;
      const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
      if (!items.length) {
        return;
      }
      let hasPending = false;
      const provider = storage2.provider;
      const prefix = storage2.prefix;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name]) {
            icons.loaded.push({
              provider,
              prefix,
              name
            });
          } else if (storage2.missing.has(name)) {
            icons.missing.push({
              provider,
              prefix,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([storage2], item.id);
          }
          item.callback(
            icons.loaded.slice(0),
            icons.missing.slice(0),
            icons.pending.slice(0),
            item.abort
          );
        }
      });
    });
  }
}
var idCounter = 0;
function storeCallback(callback, icons, pendingSources) {
  const id = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id,
    icons,
    callback,
    abort
  };
  pendingSources.forEach((storage2) => {
    (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
    if (icon) {
      result.push(icon);
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config, payload, query, done) {
  const resourcesCount = config.resources.length;
  const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
  let resources;
  if (config.random) {
    let list = config.resources.slice(0);
    resources = [];
    while (list.length > 1) {
      const nextIndex = Math.floor(Math.random() * list.length);
      resources.push(list[nextIndex]);
      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
    }
    resources = resources.concat(list);
  } else {
    resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError;
  let timer = null;
  let queue = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function subscribe(callback, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback === "function") {
      doneCallbacks.push(callback);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue.length,
      subscribe,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback) => {
      callback(void 0, lastError);
    });
  }
  function clearQueue() {
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function moduleResponse(item, response, data) {
    const isError = response !== "success";
    queue = queue.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (response === "abort") {
      lastError = data;
      failQuery();
      return;
    }
    if (isError) {
      lastError = data;
      if (!queue.length) {
        if (!resources.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (!config.random) {
      const index = config.resources.indexOf(item.resource);
      if (index !== -1 && index !== config.index) {
        config.index = index;
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback) => {
      callback(data);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources.shift();
    if (resource === void 0) {
      if (queue.length) {
        timer = setTimeout(() => {
          resetTimer();
          if (status === "pending") {
            clearQueue();
            failQuery();
          }
        }, config.timeout);
        return;
      }
      failQuery();
      return;
    }
    const item = {
      status: "pending",
      resource,
      callback: (status2, data) => {
        moduleResponse(item, status2, data);
      }
    };
    queue.push(item);
    queriesSent++;
    timer = setTimeout(execNext, config.rotate);
    query(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function initRedundancy(cfg) {
  const config = {
    ...defaultConfig,
    ...cfg
  };
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(
      config,
      payload,
      queryCallback,
      (data, error) => {
        cleanup();
        if (doneCallback) {
          doneCallback(data, error);
        }
      }
    );
    queries.push(query2);
    return query2;
  }
  function find(callback) {
    return queries.find((value) => {
      return callback(value);
    }) || null;
  }
  const instance = {
    query,
    find,
    setIndex: (index) => {
      config.index = index;
    },
    getIndex: () => config.index,
    cleanup
  };
  return instance;
}
function emptyCallback$1() {
}
var redundancyCache = /* @__PURE__ */ Object.create(null);
function getRedundancyCache(provider) {
  if (!redundancyCache[provider]) {
    const config = getAPIConfig(provider);
    if (!config) {
      return;
    }
    const redundancy = initRedundancy(config);
    const cachedReundancy = {
      config,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config = createAPIConfig(target);
    if (config) {
      redundancy = initRedundancy(config);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api = getAPIModule(moduleKey);
      if (api) {
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback)().abort;
}
function emptyCallback() {
}
function loadedNewIcons(storage2) {
  if (!storage2.iconsLoaderFlag) {
    storage2.iconsLoaderFlag = true;
    setTimeout(() => {
      storage2.iconsLoaderFlag = false;
      updateCallbacks(storage2);
    });
  }
}
function checkIconNamesForAPI(icons) {
  const valid = [];
  const invalid = [];
  icons.forEach((name) => {
    (name.match(matchIconName) ? valid : invalid).push(name);
  });
  return {
    valid,
    invalid
  };
}
function parseLoaderResponse(storage2, icons, data) {
  function checkMissing() {
    const pending = storage2.pendingIcons;
    icons.forEach((name) => {
      if (pending) {
        pending.delete(name);
      }
      if (!storage2.icons[name]) {
        storage2.missing.add(name);
      }
    });
  }
  if (data && typeof data === "object") {
    try {
      const parsed = addIconSet(storage2, data);
      if (!parsed.length) {
        checkMissing();
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }
  checkMissing();
  loadedNewIcons(storage2);
}
function parsePossiblyAsyncResponse(response, callback) {
  if (response instanceof Promise) {
    response.then((data) => {
      callback(data);
    }).catch(() => {
      callback(null);
    });
  } else {
    callback(response);
  }
}
function loadNewIcons(storage2, icons) {
  if (!storage2.iconsToLoad) {
    storage2.iconsToLoad = icons;
  } else {
    storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
  }
  if (!storage2.iconsQueueFlag) {
    storage2.iconsQueueFlag = true;
    setTimeout(() => {
      storage2.iconsQueueFlag = false;
      const { provider, prefix } = storage2;
      const icons2 = storage2.iconsToLoad;
      delete storage2.iconsToLoad;
      if (!icons2 || !icons2.length) {
        return;
      }
      const customIconLoader = storage2.loadIcon;
      if (storage2.loadIcons && (icons2.length > 1 || !customIconLoader)) {
        parsePossiblyAsyncResponse(
          storage2.loadIcons(icons2, prefix, provider),
          (data) => {
            parseLoaderResponse(storage2, icons2, data);
          }
        );
        return;
      }
      if (customIconLoader) {
        icons2.forEach((name) => {
          const response = customIconLoader(name, prefix, provider);
          parsePossiblyAsyncResponse(response, (data) => {
            const iconSet = data ? {
              prefix,
              icons: {
                [name]: data
              }
            } : null;
            parseLoaderResponse(storage2, [name], iconSet);
          });
        });
        return;
      }
      const { valid, invalid } = checkIconNamesForAPI(icons2);
      if (invalid.length) {
        parseLoaderResponse(storage2, invalid, null);
      }
      if (!valid.length) {
        return;
      }
      const api = prefix.match(matchIconName) ? getAPIModule(provider) : null;
      if (!api) {
        parseLoaderResponse(storage2, valid, null);
        return;
      }
      const params = api.prepare(provider, prefix, valid);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data) => {
          parseLoaderResponse(storage2, item.icons, data);
        });
      });
    });
  }
}
var loadIcons = (icons, callback) => {
  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
  const sortedIcons = sortIcons(cleanedIcons);
  if (!sortedIcons.pending.length) {
    let callCallback = true;
    if (callback) {
      setTimeout(() => {
        if (callCallback) {
          callback(
            sortedIcons.loaded,
            sortedIcons.missing,
            sortedIcons.pending,
            emptyCallback
          );
        }
      });
    }
    return () => {
      callCallback = false;
    };
  }
  const newIcons = /* @__PURE__ */ Object.create(null);
  const sources = [];
  let lastProvider, lastPrefix;
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix } = icon;
    if (prefix === lastPrefix && provider === lastProvider) {
      return;
    }
    lastProvider = provider;
    lastPrefix = prefix;
    sources.push(getStorage(provider, prefix));
    const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
    if (!providerNewIcons[prefix]) {
      providerNewIcons[prefix] = [];
    }
  });
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix, name } = icon;
    const storage2 = getStorage(provider, prefix);
    const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
    if (!pendingQueue.has(name)) {
      pendingQueue.add(name);
      newIcons[provider][prefix].push(name);
    }
  });
  sources.forEach((storage2) => {
    const list = newIcons[storage2.provider][storage2.prefix];
    if (list.length) {
      loadNewIcons(storage2, list);
    }
  });
  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
function mergeCustomisations(defaults, item) {
  const result = {
    ...defaults
  };
  for (const key in item) {
    const value = item[key];
    const valueType = typeof value;
    if (key in defaultIconSizeCustomisations) {
      if (value === null || value && (valueType === "string" || valueType === "number")) {
        result[key] = value;
      }
    } else if (valueType === typeof result[key]) {
      result[key] = key === "rotate" ? value % 4 : value;
    }
  }
  return result;
}
var separator = /[\s,]+/;
function flipFromString(custom, flip) {
  flip.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function rotateFromString(value, defaultValue = 0) {
  const units = value.replace(/^-?[0-9.]*/, "");
  function cleanup(value2) {
    while (value2 < 0) {
      value2 += 4;
    }
    return value2 % 4;
  }
  if (units === "") {
    const num = parseInt(value);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value.slice(0, value.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
function iconToHTML(body, attributes) {
  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const attr in attributes) {
    renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
}
function encodeSVGforURL(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function svgToData(svg) {
  return "data:image/svg+xml," + encodeSVGforURL(svg);
}
function svgToURL(svg) {
  return 'url("' + svgToData(svg) + '")';
}
var defaultExtendedIconCustomisations = {
  ...defaultIconCustomisations,
  inline: false
};
var svgDefaults = {
  "xmlns": "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "aria-hidden": true,
  "role": "img"
};
var commonProps = {
  display: "inline-block"
};
var monotoneProps = {
  backgroundColor: "currentColor"
};
var coloredProps = {
  backgroundColor: "transparent"
};
var propsToAdd = {
  Image: "var(--svg)",
  Repeat: "no-repeat",
  Size: "100% 100%"
};
var propsToAddTo = {
  webkitMask: monotoneProps,
  mask: monotoneProps,
  background: coloredProps
};
for (const prefix in propsToAddTo) {
  const list = propsToAddTo[prefix];
  for (const prop in propsToAdd) {
    list[prefix + prop] = propsToAdd[prop];
  }
}
var customisationAliases = {};
["horizontal", "vertical"].forEach((prefix) => {
  const attr = prefix.slice(0, 1) + "Flip";
  customisationAliases[prefix + "-flip"] = attr;
  customisationAliases[prefix.slice(0, 1) + "-flip"] = attr;
  customisationAliases[prefix + "Flip"] = attr;
});
function fixSize(value) {
  return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
}
var render = (icon, props) => {
  const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
  const componentProps = { ...svgDefaults };
  const mode = props.mode || "svg";
  const style = {};
  const propsStyle = props.style;
  const customStyle = typeof propsStyle === "object" && !(propsStyle instanceof Array) ? propsStyle : {};
  for (let key in props) {
    const value = props[key];
    if (value === void 0) {
      continue;
    }
    switch (key) {
      case "icon":
      case "style":
      case "onLoad":
      case "mode":
      case "ssr":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key] = value === true || value === "true" || value === 1;
        break;
      case "flip":
        if (typeof value === "string") {
          flipFromString(customisations, value);
        }
        break;
      case "color":
        style.color = value;
        break;
      case "rotate":
        if (typeof value === "string") {
          customisations[key] = rotateFromString(value);
        } else if (typeof value === "number") {
          customisations[key] = value;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value !== true && value !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default: {
        const alias = customisationAliases[key];
        if (alias) {
          if (value === true || value === "true" || value === 1) {
            customisations[alias] = true;
          }
        } else if (defaultExtendedIconCustomisations[key] === void 0) {
          componentProps[key] = value;
        }
      }
    }
  }
  const item = iconToSVG(icon, customisations);
  const renderAttribs = item.attributes;
  if (customisations.inline) {
    style.verticalAlign = "-0.125em";
  }
  if (mode === "svg") {
    componentProps.style = {
      ...style,
      ...customStyle
    };
    Object.assign(componentProps, renderAttribs);
    let localCounter = 0;
    let id = props.id;
    if (typeof id === "string") {
      id = id.replace(/-/g, "_");
    }
    componentProps["innerHTML"] = replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifyVue");
    return h("svg", componentProps);
  }
  const { body, width, height } = icon;
  const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
  const html = iconToHTML(body, {
    ...renderAttribs,
    width: width + "",
    height: height + ""
  });
  componentProps.style = {
    ...style,
    "--svg": svgToURL(html),
    "width": fixSize(renderAttribs.width),
    "height": fixSize(renderAttribs.height),
    ...commonProps,
    ...useMask ? monotoneProps : coloredProps,
    ...customStyle
  };
  return h("span", componentProps);
};
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  const _window = window;
  if (_window.IconifyPreload !== void 0) {
    const preload = _window.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload === "object" && preload !== null) {
      (preload instanceof Array ? preload : [preload]).forEach((item) => {
        try {
          if (
            // Check if item is an object and not null/array
            typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
            typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
            !addCollection(item)
          ) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      });
    }
  }
  if (_window.IconifyProviders !== void 0) {
    const providers = _window.IconifyProviders;
    if (typeof providers === "object" && providers !== null) {
      for (let key in providers) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value = providers[key];
          if (typeof value !== "object" || !value || value.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      }
    }
  }
}
var emptyIcon = {
  ...defaultIconProps,
  body: ""
};
var Icon = defineComponent({
  // Do not inherit other attributes: it is handled by render()
  inheritAttrs: false,
  // Set initial data
  data() {
    return {
      // Current icon name
      _name: "",
      // Loading
      _loadingIcon: null,
      // Mounted status
      iconMounted: false,
      // Callback counter to trigger re-render
      counter: 0
    };
  },
  mounted() {
    this.iconMounted = true;
  },
  unmounted() {
    this.abortLoading();
  },
  methods: {
    abortLoading() {
      if (this._loadingIcon) {
        this._loadingIcon.abort();
        this._loadingIcon = null;
      }
    },
    // Get data for icon to render or null
    getIcon(icon, onload, customise) {
      if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
        this._name = "";
        this.abortLoading();
        return {
          data: icon
        };
      }
      let iconName;
      if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
        this.abortLoading();
        return null;
      }
      let data = getIconData(iconName);
      if (!data) {
        if (!this._loadingIcon || this._loadingIcon.name !== icon) {
          this.abortLoading();
          this._name = "";
          if (data !== null) {
            this._loadingIcon = {
              name: icon,
              abort: loadIcons([iconName], () => {
                this.counter++;
              })
            };
          }
        }
        return null;
      }
      this.abortLoading();
      if (this._name !== icon) {
        this._name = icon;
        if (onload) {
          onload(icon);
        }
      }
      if (customise) {
        data = Object.assign({}, data);
        const customised = customise(data.body, iconName.name, iconName.prefix, iconName.provider);
        if (typeof customised === "string") {
          data.body = customised;
        }
      }
      const classes = ["iconify"];
      if (iconName.prefix !== "") {
        classes.push("iconify--" + iconName.prefix);
      }
      if (iconName.provider !== "") {
        classes.push("iconify--" + iconName.provider);
      }
      return { data, classes };
    }
  },
  // Render icon
  render() {
    this.counter;
    const props = this.$attrs;
    const icon = this.iconMounted || props.ssr ? this.getIcon(props.icon, props.onLoad, props.customise) : null;
    if (!icon) {
      return render(emptyIcon, props);
    }
    let newProps = props;
    if (icon.classes) {
      newProps = {
        ...props,
        class: (typeof props["class"] === "string" ? props["class"] + " " : "") + icon.classes.join(" ")
      };
    }
    return render({
      ...defaultIconProps,
      ...icon.data
    }, newProps);
  }
});

// node_modules/@cynber/vitepress-valence/dist/vitepress-valence.es.js
import { useData as he } from "vitepress";
var fe = { class: "horizontal-card" };
var pe = { class: "card-content" };
var ye = { class: "card-info" };
var _e = { class: "card-meta" };
var ge = {
  key: 0,
  class: "card-author"
};
var ve = {
  key: 1,
  class: "card-date"
};
var ke = {
  key: 0,
  class: "card-tags"
};
var $e = { class: "tag" };
var we = {
  key: 0,
  class: "card-image"
};
var Ce = ["src"];
var be = defineComponent({
  __name: "HorizontalCard",
  props: {
    title: {},
    excerpt: {},
    author: {},
    date: {},
    image: {},
    category: {},
    url: {},
    hideAuthor: { type: Boolean },
    hideDate: { type: Boolean },
    hideImage: { type: Boolean },
    hideCategory: { type: Boolean },
    hideDomain: { type: Boolean },
    disableLinks: { type: Boolean },
    isExternal: { type: Boolean },
    titleLines: {},
    excerptLines: {}
  },
  setup(c) {
    return (e, o) => (openBlock(), createElementBlock("div", fe, [
      (openBlock(), createBlock(resolveDynamicComponent(e.disableLinks ? "div" : "a"), {
        href: e.disableLinks ? null : e.url,
        class: "card-link"
      }, {
        default: withCtx(() => [
          createBaseVNode("div", pe, [
            createBaseVNode("div", ye, [
              createBaseVNode("div", {
                class: "card-title",
                style: normalizeStyle({ "--line-clamp-title": e.titleLines || 2 })
              }, toDisplayString(e.title), 5),
              createBaseVNode("div", _e, [
                e.hideAuthor ? createCommentVNode("", true) : (openBlock(), createElementBlock("span", ge, "By " + toDisplayString(e.author), 1)),
                e.hideDate ? createCommentVNode("", true) : (openBlock(), createElementBlock("span", ve, toDisplayString(e.date), 1))
              ]),
              createBaseVNode("div", {
                class: "card-excerpt",
                style: normalizeStyle({ "--line-clamp-excerpt": e.excerptLines || 5 })
              }, toDisplayString(e.excerpt), 5),
              e.hideCategory ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", ke, [
                createBaseVNode("span", $e, toDisplayString(e.category), 1)
              ]))
            ]),
            e.image && !e.hideImage ? (openBlock(), createElementBlock("div", we, [
              createBaseVNode("img", {
                src: e.image,
                alt: "Banner"
              }, null, 8, Ce)
            ])) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 8, ["href"]))
    ]));
  }
});
var x = (c, e) => {
  const o = c.__vccOpts || c;
  for (const [l, n] of e)
    o[l] = n;
  return o;
};
var se = x(be, [["__scopeId", "data-v-30940f18"]]);
var De = { class: "card" };
var Le = {
  key: 0,
  class: "card-image"
};
var xe = ["src"];
var Ie = { class: "card-info" };
var Te = { class: "card-meta" };
var Se = {
  key: 0,
  class: "card-author"
};
var Be = {
  key: 1,
  class: "post-date"
};
var Ae = {
  key: 0,
  class: "card-tags"
};
var Ee = { class: "tag" };
var Ue = {
  key: 1,
  class: "card-footer"
};
var Pe = { class: "footer-content" };
var Re = defineComponent({
  __name: "VerticalCard",
  props: {
    title: {},
    excerpt: {},
    author: {},
    date: {},
    image: {},
    category: {},
    url: {},
    hideAuthor: { type: Boolean },
    hideDate: { type: Boolean },
    hideImage: { type: Boolean },
    hideCategory: { type: Boolean },
    hideDomain: { type: Boolean },
    disableLinks: { type: Boolean },
    isExternal: { type: Boolean },
    titleLines: {},
    excerptLines: {}
  },
  setup(c) {
    return (e, o) => (openBlock(), createElementBlock("div", De, [
      (openBlock(), createBlock(resolveDynamicComponent(e.disableLinks ? "div" : "a"), {
        href: e.disableLinks ? null : e.url,
        class: "card-link"
      }, {
        default: withCtx(() => [
          e.image && !e.hideImage ? (openBlock(), createElementBlock("div", Le, [
            createBaseVNode("img", {
              src: e.image,
              alt: "Banner Image"
            }, null, 8, xe)
          ])) : createCommentVNode("", true),
          createBaseVNode("div", Ie, [
            createBaseVNode("h3", {
              class: "card-title",
              style: normalizeStyle({ "--line-clamp-title": e.titleLines || 2 })
            }, toDisplayString(e.title), 5),
            createBaseVNode("div", Te, [
              !e.hideAuthor && e.author ? (openBlock(), createElementBlock("span", Se, "by " + toDisplayString(e.author), 1)) : createCommentVNode("", true),
              e.hideDate ? createCommentVNode("", true) : (openBlock(), createElementBlock("span", Be, toDisplayString(e.date), 1))
            ]),
            createBaseVNode("p", {
              class: "card-body",
              style: normalizeStyle({ "--line-clamp-excerpt": e.excerptLines || 3 })
            }, toDisplayString(e.excerpt), 5),
            !e.hideCategory && e.category ? (openBlock(), createElementBlock("div", Ae, [
              createBaseVNode("span", Ee, toDisplayString(e.category), 1)
            ])) : createCommentVNode("", true)
          ]),
          e.isExternal && !e.hideDomain ? (openBlock(), createElementBlock("div", Ue, [
            createBaseVNode("div", Pe, [
              createVNode(unref(Icon), {
                icon: "gridicons:external",
                class: "external-icon"
              })
            ])
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["href"]))
    ]));
  }
});
var Y = x(Re, [["__scopeId", "data-v-b0af8a26"]]);
var Oe = {};
var je = { class: "cards-container" };
function Me(c, e) {
  return openBlock(), createElementBlock("div", je, [
    renderSlot(c.$slots, "default", {}, void 0, true)
  ]);
}
var oe = x(Oe, [["render", Me], ["__scopeId", "data-v-33f4120e"]]);
var Ve = {};
var Fe = { class: "cards-container" };
function Ne(c, e) {
  return openBlock(), createElementBlock("div", Fe, [
    renderSlot(c.$slots, "default", {}, void 0, true)
  ]);
}
var G = x(Ve, [["render", Ne], ["__scopeId", "data-v-08d93c93"]]);
var He = { class: "top-bar" };
var ze = { class: "title-date-container" };
var qe = ["innerHTML"];
var We = defineComponent({
  __name: "HeaderCard",
  props: {
    title: {},
    date: { default: "" },
    time: { default: "" },
    titleLines: { default: 2 },
    link: {},
    dateFormat: { default: "long" },
    dateTimeDescription: {}
  },
  setup(c) {
    const e = c, o = computed(() => {
      let l = "";
      if (e.date) {
        const n = new Date(e.date);
        if (isNaN(n.getTime()))
          l = e.date;
        else if (e.dateFormat === "iso")
          l = n.toISOString().split("T")[0];
        else {
          const u = {
            year: "numeric",
            month: "long",
            day: "numeric"
          };
          l = n.toLocaleDateString(void 0, u);
        }
      }
      if (e.time) {
        const n = e.time.match(
          /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?$/
        );
        if (n) {
          const [, u, _] = n, w = `${u.padStart(2, "0")}:${_}`;
          l = l ? `${l} at ${w}` : w;
        }
      }
      return e.dateTimeDescription && l ? `${e.dateTimeDescription} ${l}` : l;
    });
    return (l, n) => (openBlock(), createElementBlock("div", He, [
      createBaseVNode("div", ze, [
        (openBlock(), createBlock(resolveDynamicComponent(l.link ? "a" : "span"), {
          class: "gallery-title",
          href: l.link || void 0
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(l.title), 1)
          ]),
          _: 1
        }, 8, ["href"])),
        o.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: "gallery-date",
          innerHTML: o.value
        }, null, 8, qe)) : createCommentVNode("", true)
      ])
    ]));
  }
});
var Z = x(We, [["__scopeId", "data-v-ba68ecf4"]]);
var Je = ["href"];
var Ge = { class: "post-header" };
var Ke = {
  key: 0,
  class: "post-title"
};
var Ye = ["src"];
var Qe = { class: "post-info" };
var Ze = {
  key: 0,
  class: "author-section"
};
var Xe = ["src"];
var et = { class: "author-details" };
var tt = ["href"];
var at = { class: "author-description" };
var nt = { class: "meta-data" };
var rt = { key: 0 };
var st = { key: 1 };
var ot = defineComponent({
  __name: "BlogPostHeader",
  props: {
    returnLink: {},
    returnText: {},
    hideTitle: { type: Boolean },
    hideDate: { type: Boolean },
    hideAuthor: { type: Boolean },
    hideCategory: { type: Boolean },
    hideBanner: { type: Boolean },
    authorsDataKey: {}
  },
  setup(c) {
    const e = c, o = e.authorsDataKey || "authors", l = inject(o) || {}, { page: n } = he(), u = n.value.frontmatter, _ = ref(l[u.author || ""] || { name: "" }), w = ref(
      e.returnLink || u.returnLinkValue || "/"
    ), C = ref(
      "← " + (e.returnText || u.returnTextValue || "Back Home")
    );
    return (D, y) => (openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("a", {
        class: "return-text",
        href: w.value
      }, toDisplayString(C.value), 9, Je),
      createBaseVNode("header", Ge, [
        e.hideTitle ? createCommentVNode("", true) : (openBlock(), createElementBlock("h1", Ke, toDisplayString(unref(u).title), 1)),
        !e.hideBanner && unref(u).banner ? (openBlock(), createElementBlock("img", {
          key: 1,
          src: unref(u).banner,
          alt: "Banner Image",
          class: "banner-image"
        }, null, 8, Ye)) : createCommentVNode("", true),
        createBaseVNode("div", Qe, [
          !e.hideAuthor && _.value.name ? (openBlock(), createElementBlock("div", Ze, [
            createBaseVNode("img", {
              src: _.value.avatar,
              alt: "Author's Avatar",
              class: "author-avatar"
            }, null, 8, Xe),
            createBaseVNode("div", et, [
              createBaseVNode("a", {
                href: _.value.url,
                class: "author-name"
              }, toDisplayString(_.value.name), 9, tt),
              createBaseVNode("p", at, toDisplayString(_.value.description), 1)
            ])
          ])) : createCommentVNode("", true),
          createBaseVNode("div", nt, [
            !e.hideDate && unref(u).date ? (openBlock(), createElementBlock("p", rt, toDisplayString(new Date(unref(u).date).toLocaleDateString(void 0, {
              year: "numeric",
              month: "long",
              day: "numeric"
            })), 1)) : createCommentVNode("", true),
            !e.hideCategory && unref(u).category ? (openBlock(), createElementBlock("p", st, " Category: " + toDisplayString(unref(u).category), 1)) : createCommentVNode("", true)
          ])
        ])
      ])
    ], 64));
  }
});
var it = x(ot, [["__scopeId", "data-v-c3a645d3"]]);
function lt(c) {
  const e = new Date(c);
  return typeof c == "string" && !c.includes("T") ? (/* @__PURE__ */ new Date(c + "T00:00:00")).toLocaleDateString(
    "en-US",
    {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  ) : e.toLocaleDateString(void 0, {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
var ct = { class: "blog-post-list-container" };
var dt = { key: 0 };
var ut = defineComponent({
  __name: "BlogPostList",
  props: {
    posts: {},
    format: {},
    sortOrder: {},
    startDate: {},
    endDate: {},
    renderDrafts: { type: Boolean },
    featuredOnly: { type: Boolean },
    filterAuthors: {},
    excludeAuthors: {},
    filterCategories: {},
    excludeCategories: {},
    excludeURLs: {},
    maxCards: {},
    hideAuthor: { type: Boolean },
    hideDate: { type: Boolean },
    hideImage: { type: Boolean },
    hideCategory: { type: Boolean },
    hideDomain: { type: Boolean },
    disableLinks: { type: Boolean },
    titleLines: {},
    excerptLines: {},
    postsDataKey: {},
    authorsDataKey: {}
  },
  setup(c) {
    const e = c, o = inject(e.postsDataKey || "postsData", []), l = inject(e.authorsDataKey || "authors", {}), n = computed(() => e.posts || o), u = computed(() => {
      switch (e.format) {
        case "horizontal":
          return se;
        case "vertical":
          return Y;
        default:
          return Y;
      }
    }), _ = computed(() => {
      switch (e.format) {
        case "horizontal":
          return oe;
        case "vertical":
          return G;
        default:
          return G;
      }
    }), w = computed(() => {
      const s = [...n.value];
      return s.sort(($, b) => {
        const A = new Date($.frontmatter.date).getTime(), d = new Date(b.frontmatter.date).getTime();
        return e.sortOrder === "ascending" ? A - d : d - A;
      }), s;
    }), C = computed(() => w.value.filter((s) => {
      var _a2, _b, _c, _d, _e2;
      const { frontmatter: $ } = s;
      if (e.featuredOnly && !$.featured || !e.renderDrafts && $.draft) return false;
      const b = new Date($.date).getTime();
      if (e.startDate && b < new Date(e.startDate).getTime() || e.endDate && b > new Date(e.endDate).getTime() || ((_a2 = e.filterAuthors) == null ? void 0 : _a2.length) && !e.filterAuthors.includes($.author || "") || ((_b = e.excludeAuthors) == null ? void 0 : _b.length) && e.excludeAuthors.includes($.author || "") || ((_c = e.filterCategories) == null ? void 0 : _c.length) && !e.filterCategories.includes($.category || "") || ((_d = e.excludeCategories) == null ? void 0 : _d.length) && e.excludeCategories.includes($.category || ""))
        return false;
      if ((_e2 = e.excludeURLs) == null ? void 0 : _e2.length) {
        const A = s.url.replace(/\.html$/, "");
        if (e.excludeURLs.some((I) => I.replace(/\.html$/, "") === A)) return false;
      }
      return true;
    })), D = computed(() => e.maxCards != null && e.maxCards >= 0 ? C.value.slice(0, e.maxCards) : C.value);
    function y(s) {
      const $ = l[s];
      return $ ? $.name : s;
    }
    function i(s) {
      return {
        title: s.frontmatter.title,
        excerpt: s.frontmatter.excerpt,
        url: s.url,
        hideDomain: e.hideDomain,
        isExternal: false,
        author: y(s.frontmatter.author || ""),
        date: lt(s.frontmatter.date),
        image: s.frontmatter.banner,
        category: s.frontmatter.category,
        hideAuthor: e.hideAuthor,
        hideDate: e.hideDate,
        hideImage: e.hideImage,
        hideCategory: e.hideCategory,
        disableLinks: e.disableLinks,
        titleLines: e.titleLines,
        excerptLines: e.excerptLines
      };
    }
    return (s, $) => (openBlock(), createElementBlock("div", ct, [
      s.format === "debug" ? (openBlock(), createElementBlock("div", dt, [
        createBaseVNode("pre", null, toDisplayString(JSON.stringify(D.value, null, 2)), 1)
      ])) : createCommentVNode("", true),
      (openBlock(), createBlock(resolveDynamicComponent(_.value), { class: "cards-container" }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(D.value, (b) => (openBlock(), createBlock(resolveDynamicComponent(u.value), mergeProps({
            key: b.url,
            ref_for: true
          }, i(b)), null, 16))), 128))
        ]),
        _: 1
      }))
    ]));
  }
});
var mt = x(ut, [["__scopeId", "data-v-022d41ed"]]);
var ht = defineComponent({
  __name: "TextCell",
  props: {
    value: {}
  },
  setup(c) {
    return (e, o) => (openBlock(), createElementBlock("span", null, toDisplayString(e.value), 1));
  }
});
var ft = { class: "link-cell" };
var pt = ["href"];
var yt = ["href"];
var _t = defineComponent({
  __name: "LinkCell",
  props: {
    value: {},
    internalIcon: {},
    externalIcon: {},
    internalText: {},
    externalText: {},
    displayInternalAs: {},
    displayExternalAs: {},
    width: {},
    height: {},
    iconColorMap: {},
    defaultIconColor: {}
  },
  setup(c) {
    const e = c, o = computed(() => {
      var _a2;
      return ((_a2 = e.value) == null ? void 0 : _a2.startsWith("/")) || false;
    }), l = computed(() => !!e.value), n = computed(() => e.value), u = computed(
      () => o.value ? e.internalIcon || "material-symbols:link-rounded" : e.externalIcon || "majesticons:open"
    ), _ = computed(
      () => {
        var _a2, _b;
        return o.value ? ((_a2 = e.iconColorMap) == null ? void 0 : _a2.internal) || e.defaultIconColor || "var(--vp-c-brand)" : ((_b = e.iconColorMap) == null ? void 0 : _b.external) || e.defaultIconColor || "var(--vp-c-orange)";
      }
    ), w = computed(
      () => o.value ? e.displayInternalAs || "icon" : e.displayExternalAs || "icon"
    ), C = computed(
      () => o.value ? e.internalText || "Open Page" : e.externalText || "Open Link"
    ), D = computed(() => e.width || "1.5em"), y = computed(() => e.height || "1.5em");
    return (i, s) => (openBlock(), createElementBlock("div", ft, [
      l.value && w.value === "icon" ? (openBlock(), createElementBlock("a", {
        key: 0,
        href: n.value,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "icon-link"
      }, [
        createVNode(unref(Icon), {
          icon: u.value,
          style: normalizeStyle({ color: _.value, width: D.value, height: y.value }),
          class: "icon"
        }, null, 8, ["icon", "style"])
      ], 8, pt)) : l.value && w.value === "text" ? (openBlock(), createElementBlock("a", {
        key: 1,
        href: n.value,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "text-link"
      }, toDisplayString(C.value), 9, yt)) : createCommentVNode("", true)
    ]));
  }
});
var gt = x(_t, [["__scopeId", "data-v-38e44808"]]);
var vt = { class: "boolean-cell" };
var kt = {
  key: 0,
  class: "icon-container"
};
var $t = {
  key: 1,
  class: "text-container"
};
var wt = {
  key: 2,
  class: "default-container"
};
var Ct = "ic:twotone-check-box";
var bt = "material-symbols:close-rounded";
var Dt = "True";
var Lt = "False";
var xt = defineComponent({
  __name: "BooleanCell",
  props: {
    value: { type: Boolean },
    trueColor: {},
    falseColor: {},
    displayAs: {},
    trueIcon: {},
    falseIcon: {},
    trueText: {},
    falseText: {},
    iconWidth: {},
    iconHeight: {}
  },
  setup(c) {
    const e = c, o = e.trueIcon || Ct, l = e.falseIcon || bt, n = e.trueText || Dt, u = e.falseText || Lt, _ = e.trueColor || "var(--vp-c-green-3)", w = e.falseColor || "var(--vp-c-red-3)", C = e.iconWidth || "1.5em", D = e.iconHeight || "1.5em", y = e.displayAs || "icon";
    return (i, s) => (openBlock(), createElementBlock("div", vt, [
      unref(y) === "icon" ? (openBlock(), createElementBlock("div", kt, [
        createVNode(unref(Icon), {
          icon: i.value ? unref(o) : unref(l),
          style: normalizeStyle({
            color: i.value ? unref(_) : unref(w),
            width: unref(C),
            height: unref(D)
          }),
          class: "icon"
        }, null, 8, ["icon", "style"])
      ])) : unref(y) === "text" ? (openBlock(), createElementBlock("div", $t, [
        createBaseVNode("span", {
          style: normalizeStyle({ color: i.value ? unref(_) : unref(w) })
        }, toDisplayString(i.value ? unref(n) : unref(u)), 5)
      ])) : (openBlock(), createElementBlock("div", wt, [
        createBaseVNode("span", null, toDisplayString(i.value), 1)
      ]))
    ]));
  }
});
var It = x(xt, [["__scopeId", "data-v-e6763927"]]);
var Tt = { class: "badge-container" };
var St = defineComponent({
  __name: "TagsCell",
  props: {
    value: {},
    tagColors: {},
    defaultTagColor: {}
  },
  setup(c) {
    const e = c, o = e.defaultTagColor || "var(--vp-c-brand-soft)", l = e.tagColors || {};
    return (n, u) => (openBlock(), createElementBlock("div", Tt, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(n.value, (_) => (openBlock(), createElementBlock("span", {
        key: _,
        class: "badge",
        style: normalizeStyle({ backgroundColor: unref(l)[_] || unref(o) })
      }, toDisplayString(_), 5))), 128))
    ]));
  }
});
var Bt = x(St, [["__scopeId", "data-v-f5365c48"]]);
var At = { class: "number-cell" };
var Et = defineComponent({
  __name: "NumberCell",
  props: {
    value: {},
    decimals: {},
    formatter: { type: Function }
  },
  setup(c) {
    const e = c, o = computed(() => {
      if (e.formatter && typeof e.formatter == "function")
        return e.formatter(e.value);
      const n = e.value % 1 !== 0 ? e.decimals ?? 2 : 0;
      return e.value.toLocaleString(void 0, {
        minimumFractionDigits: n,
        maximumFractionDigits: n
      });
    });
    return (l, n) => (openBlock(), createElementBlock("div", At, [
      createBaseVNode("span", null, toDisplayString(o.value), 1)
    ]));
  }
});
var Ut = x(Et, [["__scopeId", "data-v-fca0a933"]]);
var Pt = { class: "icon-cell" };
var Rt = { key: 1 };
var Ot = defineComponent({
  __name: "IconCell",
  props: {
    value: {},
    iconMap: {},
    defaultIcon: {},
    iconColorMap: {},
    defaultIconColor: {},
    width: {},
    height: {}
  },
  setup(c) {
    const e = c, o = computed(() => {
      var _a2;
      return ((_a2 = e.iconMap) == null ? void 0 : _a2[e.value]) || e.defaultIcon;
    }), l = computed(
      () => {
        var _a2;
        return ((_a2 = e.iconColorMap) == null ? void 0 : _a2[e.value]) || e.defaultIconColor || "var(--vp-c-brand)";
      }
    ), n = computed(() => e.width || "1.5em"), u = computed(() => e.height || "1.5em");
    return (_, w) => (openBlock(), createElementBlock("div", Pt, [
      o.value ? (openBlock(), createBlock(unref(Icon), {
        key: 0,
        icon: o.value,
        style: normalizeStyle({ color: l.value, width: n.value, height: u.value }),
        class: "icon"
      }, null, 8, ["icon", "style"])) : (openBlock(), createElementBlock("span", Rt, toDisplayString(_.value), 1))
    ]));
  }
});
var jt = x(Ot, [["__scopeId", "data-v-e4d1a333"]]);
var Mt = {
  key: 0,
  class: "title"
};
var Vt = { class: "table-container" };
var Ft = {
  key: 0,
  class: "styled-table"
};
var Nt = ["onClick"];
var Ht = { key: 0 };
var zt = { key: 1 };
var qt = defineComponent({
  __name: "JSONTable",
  props: {
    jsonPath: {},
    jsonDataProp: {},
    columns: {},
    filters: {},
    title: {},
    defaultSortField: {},
    defaultSortDirection: {}
  },
  setup(c) {
    const e = c, o = ref([]), l = ref(e.defaultSortField || null), n = ref(e.defaultSortDirection === "ascending"), u = ref(e.columns || []), _ = ref(e.filters || null), w = e.title;
    function C(d, I) {
      return I.split(".").reduce(
        (v, S) => v && v[S] !== void 0 ? v[S] : null,
        d
      );
    }
    function D(d) {
      switch (d) {
        case "link":
          return gt;
        case "boolean":
          return It;
        case "tags":
          return Bt;
        case "number":
          return Ut;
        case "icon":
          return jt;
        default:
          return ht;
      }
    }
    function y(d) {
      l.value === d ? n.value = !n.value : (l.value = d, n.value = true);
    }
    const i = computed(() => {
      let d = s.value;
      return l.value ? d.slice().sort((I, v) => {
        const S = C(I, l.value), E = C(v, l.value);
        return S == null ? 1 : E == null ? -1 : S < E ? n.value ? -1 : 1 : S > E ? n.value ? 1 : -1 : 0;
      }) : d;
    }), s = computed(() => _.value ? o.value.filter((d) => $(_.value, d)) : o.value);
    function $(d, I) {
      if (d.type === "and" || d.type === "or") {
        const v = d, S = d.type === "and" ? "every" : "some";
        return v.conditions[S]((E) => $(E, I));
      } else if (d.type === "condition") {
        const v = d, S = C(I, v.key);
        return b(S, v.operator, v.value);
      } else
        return console.warn("Unknown filter type:", d.type), true;
    }
    function b(d, I, v) {
      switch (I) {
        case "equals":
          return d === v;
        case "notEquals":
          return d !== v;
        case "greaterThan":
          return d > v;
        case "greaterThanOrEqual":
          return d >= v;
        case "lessThan":
          return d < v;
        case "lessThanOrEqual":
          return d <= v;
        case "includes":
          return Array.isArray(d) && d.includes(v);
        case "notIncludes":
          return Array.isArray(d) && !d.includes(v);
        case "contains":
          return typeof d == "string" && d.includes(v);
        case "notContains":
          return typeof d == "string" && !d.includes(v);
        default:
          return console.warn("Unknown operator:", I), false;
      }
    }
    async function A() {
      if (e.jsonPath)
        try {
          const d = await fetch(e.jsonPath);
          o.value = await d.json(), e.defaultSortField && (l.value = e.defaultSortField, n.value = e.defaultSortDirection === "ascending");
        } catch (d) {
          console.error("Error fetching JSON:", d);
        }
    }
    return watch(
      () => e.jsonDataProp,
      (d) => {
        if (d && d.length) {
          if (o.value = d, u.value.length === 0 && d.length) {
            const I = d[0];
            u.value = Object.keys(I).map((v) => ({
              key: v,
              title: v,
              format: "text"
            }));
          }
          e.defaultSortField && (l.value = e.defaultSortField, n.value = e.defaultSortDirection === "ascending");
        } else e.jsonPath && A();
      },
      { immediate: true }
    ), onMounted(() => {
      !e.jsonDataProp || !e.jsonDataProp.length ? A() : (o.value = e.jsonDataProp, e.defaultSortField && (l.value = e.defaultSortField, n.value = e.defaultSortDirection === "ascending"));
    }), (d, I) => (openBlock(), createElementBlock("div", null, [
      unref(w) ? (openBlock(), createElementBlock("h3", Mt, toDisplayString(unref(w)), 1)) : createCommentVNode("", true),
      createBaseVNode("div", Vt, [
        i.value.length && u.value.length ? (openBlock(), createElementBlock("table", Ft, [
          createBaseVNode("thead", null, [
            createBaseVNode("tr", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(u.value, (v) => (openBlock(), createElementBlock("th", {
                key: v.key,
                onClick: (S) => y(v.key),
                class: normalizeClass({ sortable: true, active: l.value === v.key })
              }, [
                createTextVNode(toDisplayString(v.title || v.key) + " ", 1),
                l.value === v.key ? (openBlock(), createElementBlock("span", Ht, toDisplayString(n.value ? "↑" : "↓"), 1)) : createCommentVNode("", true)
              ], 10, Nt))), 128))
            ])
          ]),
          createBaseVNode("tbody", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(i.value, (v, S) => (openBlock(), createElementBlock("tr", { key: S }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(u.value, (E) => (openBlock(), createElementBlock("td", {
                key: E.key
              }, [
                (openBlock(), createBlock(resolveDynamicComponent(D(E.format || "text")), mergeProps({
                  value: C(v, E.key),
                  ref_for: true
                }, E.options), null, 16, ["value"]))
              ]))), 128))
            ]))), 128))
          ])
        ])) : (openBlock(), createElementBlock("div", zt, "No data available"))
      ])
    ]));
  }
});
var Wt = x(qt, [["__scopeId", "data-v-ebd38ee2"]]);
var Jt = { class: "image-card-square" };
var Gt = ["href", "data-pswp-width", "data-pswp-height"];
var Kt = ["src"];
var Yt = defineComponent({
  __name: "ImageCardSquare",
  props: {
    image: {}
  },
  setup(c) {
    const e = ref(0), o = ref(0), l = (n) => {
      const u = n.target;
      e.value = u.naturalWidth, o.value = u.naturalHeight;
    };
    return (n, u) => (openBlock(), createElementBlock("div", Jt, [
      createBaseVNode("a", {
        href: n.image,
        "data-pswp-width": e.value,
        "data-pswp-height": o.value,
        target: "_blank",
        class: "image-card-square"
      }, [
        createBaseVNode("img", {
          src: n.image,
          alt: "Gallery Image",
          onLoad: l
        }, null, 40, Kt)
      ], 8, Gt)
    ]));
  }
});
var ie = x(Yt, [["__scopeId", "data-v-936fac72"]]);
var Qt = ["href", "data-pswp-width", "data-pswp-height"];
var Zt = ["src", "alt"];
var Xt = defineComponent({
  __name: "ImageCardVertical",
  props: {
    image: {}
  },
  setup(c) {
    const e = ref({
      width: 0,
      height: 0
    }), o = (l) => {
      const n = l.target;
      e.value = {
        width: n.naturalWidth,
        height: n.naturalHeight
      };
    };
    return (l, n) => (openBlock(), createElementBlock("a", {
      href: l.image,
      "data-pswp-width": e.value.width,
      "data-pswp-height": e.value.height,
      target: "_blank",
      class: "vertical-image-card"
    }, [
      createBaseVNode("img", {
        src: l.image,
        alt: l.image,
        onLoad: o
      }, null, 40, Zt)
    ], 8, Qt));
  }
});
var ea = x(Xt, [["__scopeId", "data-v-8dd93014"]]);
var ta = { class: "image-gallery-container" };
var aa = { key: 0 };
var na = {
  key: 0,
  class: "no-images"
};
var ra = ["id"];
var sa = defineComponent({
  __name: "ImageGallery",
  props: {
    title: {},
    titleLines: { default: 2 },
    date: { default: "" },
    dateFormat: {},
    time: {},
    dateTimeDescription: {},
    link: {},
    folders: {},
    images: {},
    excludeExtensions: {},
    includeExtensions: {},
    format: {},
    galleryDataKey: {},
    forceSort: {},
    layout: { default: "grid" },
    directUrls: {}
  },
  setup(c) {
    const e = ref(`gallery-${Math.random().toString(36).substr(2, 9)}`);
    let o = null;
    const l = async () => {
      o && (o.destroy(), o = null), await nextTick();
      const { default: i } = await import("./photoswipe-lightbox.esm-BjTq-zOm-4N3YVDH5.js");
      setTimeout(() => {
        try {
          o = new i({
            gallery: `#${e.value}`,
            children: "a",
            pswpModule: () => import("./photoswipe.esm-DcivMT-M-TDQXS2Q7.js")
          }), o.init();
        } catch (s) {
          console.error("PhotoSwipe initialization error:", s);
        }
      }, 100);
    }, n = c, u = inject(n.galleryDataKey || "galleryData", []);
    onMounted(() => {
      l();
    }), onUnmounted(() => {
      o && (o.destroy(), o = null);
    }), computed(() => {
      const i = {
        year: "numeric",
        month: "long",
        day: "numeric"
      }, s = new Date(n.date);
      return isNaN(s.getTime()) ? n.date : s.toLocaleDateString(void 0, i);
    });
    const _ = computed(() => G), w = computed(() => n.layout === "grid" ? ie : ea), C = computed(() => ({
      "image-grid": n.layout === "grid",
      "image-vertical": n.layout === "vertical"
    })), D = computed(() => {
      var _a2, _b;
      return !((_a2 = n.folders) == null ? void 0 : _a2.length) && !((_b = n.images) == null ? void 0 : _b.length) ? u.filter((i) => {
        var _a3, _b2, _c;
        const s = (_a3 = i.filename.split(".").pop()) == null ? void 0 : _a3.toLowerCase();
        return !(((_b2 = n.excludeExtensions) == null ? void 0 : _b2.length) && s && n.excludeExtensions.includes(s) || ((_c = n.includeExtensions) == null ? void 0 : _c.length) && s && !n.includeExtensions.includes(s));
      }) : u.filter((i) => {
        var _a3, _b2, _c, _d, _e2;
        const s = (_a3 = i.filename.split(".").pop()) == null ? void 0 : _a3.toLowerCase();
        if (((_b2 = n.excludeExtensions) == null ? void 0 : _b2.length) && s && n.excludeExtensions.includes(s) || ((_c = n.includeExtensions) == null ? void 0 : _c.length) && s && !n.includeExtensions.includes(s))
          return false;
        const $ = ((_d = n.folders) == null ? void 0 : _d.includes(i.folder)) || false, b = ((_e2 = n.images) == null ? void 0 : _e2.includes(i.path)) || false;
        return $ || b;
      });
    }), y = computed(() => {
      if (n.directUrls && n.directUrls.length > 0)
        return n.directUrls;
      if (n.forceSort && n.forceSort.length > 0) {
        const i = [...n.forceSort];
        return D.value.forEach((s) => {
          i.includes(s.path) || i.push(s.path);
        }), i;
      }
      return D.value.map((i) => i.path).sort();
    });
    return watch(y, () => {
      l();
    }), (i, s) => (openBlock(), createElementBlock("div", ta, [
      i.format === "debug" ? (openBlock(), createElementBlock("div", aa, [
        createBaseVNode("pre", null, toDisplayString(unref(u)), 1)
      ])) : createCommentVNode("", true),
      (openBlock(), createBlock(resolveDynamicComponent(_.value), { class: "gallery-container" }, {
        default: withCtx(() => [
          createVNode(Z, {
            title: i.title,
            date: i.date,
            "date-format": i.dateFormat,
            time: i.time,
            dateTimeDescription: i.dateTimeDescription,
            "title-lines": i.titleLines,
            link: i.link
          }, null, 8, ["title", "date", "date-format", "time", "dateTimeDescription", "title-lines", "link"]),
          y.value.length === 0 ? (openBlock(), createElementBlock("div", na, " No images found for this gallery. ")) : (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(C.value),
            id: e.value
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(y.value, ($, b) => (openBlock(), createBlock(resolveDynamicComponent(w.value), {
              key: b,
              image: $
            }, null, 8, ["image"]))), 128))
          ], 10, ra))
        ]),
        _: 1
      }))
    ]));
  }
});
var oa = x(sa, [["__scopeId", "data-v-31f1603f"]]);
var ia = { class: "lemmy-card" };
var la = { key: 0 };
var ca = {
  key: 0,
  class: "lemmy-card-header"
};
var da = {
  key: 0,
  class: "lemmy-card-user-community"
};
var ua = { class: "lemmy-user-info" };
var ma = ["href"];
var ha = { class: "lemmy-user-icon" };
var fa = ["src"];
var pa = { class: "lemmy-username" };
var ya = {
  key: 1,
  class: "lemmy-separator"
};
var _a = ["href"];
var ga = { class: "lemmy-community-name" };
var va = { class: "lemmy-icon-container" };
var ka = ["href"];
var $a = ["href"];
var wa = { class: "lemmy-card-content" };
var Ca = ["src"];
var ba = {
  key: 1,
  class: "lemmy-card-footer"
};
var Da = { class: "lemmy-footer-item" };
var La = { class: "lemmy-footer-item" };
var xa = {
  key: 2,
  class: "lemmy-post-date"
};
var Ia = { class: "lemmy-footer-item" };
var Ta = {
  key: 1,
  class: "error-message-container"
};
var Sa = { class: "error-message" };
var Ba = ["href"];
var Aa = defineComponent({
  __name: "EmbedCardLemmy",
  props: {
    url: {},
    hideUser: { type: Boolean },
    hideCommunity: { type: Boolean },
    hideTitle: { type: Boolean },
    hideBanner: { type: Boolean },
    hideExcerpt: { type: Boolean },
    hideScore: { type: Boolean },
    hideComments: { type: Boolean },
    hideDate: { type: Boolean },
    titleLines: {},
    excerptLines: {}
  },
  setup(c) {
    const e = c, o = ref("Loading..."), l = ref(""), n = ref({
      display_name: "",
      name: "",
      avatar: "",
      actor_id: ""
    }), u = ref({
      name: "",
      actor_id: ""
    }), _ = new URL(e.url).origin, w = ref(""), C = ref(null), D = ref(0), y = ref(0);
    var i = false;
    const s = computed(() => {
      if (!w.value) return "";
      const g = new Date(w.value), k = g.getFullYear(), z = `0${g.getMonth() + 1}`.slice(-2), B = `0${g.getDate()}`.slice(-2);
      return `${k}-${z}-${B}`;
    }), $ = computed(() => {
      try {
        return `${new URL(n.value.actor_id).origin}/u/${n.value.name}`;
      } catch {
        return console.error("Invalid creator actor_id URL:", n.value.actor_id), "#";
      }
    }), b = computed(() => {
      try {
        return `${new URL(u.value.actor_id).origin}/c/${u.value.name}`;
      } catch {
        return console.error("Invalid community actor_id URL:", u.value.actor_id), "#";
      }
    }), A = computed(() => o.value !== "Loading..." && o.value !== "Post not found or invalid data." && o.value !== "Error loading post."), d = () => {
      window.open(e.url, "_blank");
    };
    function I(g) {
      try {
        const k = new URL(g), z = `${k.protocol}//${k.host}`, B = k.pathname.split("/").filter(Boolean);
        let R = "";
        return B[0] === "post" ? B[1] === "id" ? R = B[2] : R = B[1] : B[0] === "comment" && B[1] === "id" && (R = B[2]), { instanceURL: z, postID: R };
      } catch (k) {
        return console.error("Error parsing URL:", k), { instanceURL: "", postID: "" };
      }
    }
    async function v(g) {
      var _a2;
      try {
        const z = await (await fetch(g)).text();
        return ((_a2 = new DOMParser().parseFromString(z, "text/html").querySelector("meta[property='og:image']")) == null ? void 0 : _a2.getAttribute("content")) || null;
      } catch (k) {
        return console.error("Failed to fetch OG Image:", k), null;
      }
    }
    async function S(g, k) {
      const z = `${g}/api/v3/post?id=${k}`;
      try {
        const B = await fetch(z);
        if (!B.ok)
          throw new Error(`HTTP error! status: ${B.status}`);
        const R = await B.json();
        if (R && R.post_view) {
          const W = R.post_view, q = W.post;
          o.value = q.name, l.value = q.body || "", n.value = W.creator, u.value = W.community, w.value = q.published, C.value = q.thumbnail_url || null, D.value = W.counts.score, y.value = W.counts.comments, !C.value && q.url && !q.body && (C.value = await v(q.url), i = true);
        } else
          o.value = "Post not found or invalid data.", console.error("Invalid data structure:", R);
      } catch (B) {
        o.value = "Error loading post.", console.error("Error fetching post data:", B);
      }
    }
    function E(g) {
      g.target.src = "https://placehold.co/24";
    }
    function le(g) {
      C.value = null;
    }
    const ce = computed(() => ({
      display: "-webkit-box",
      "-webkit-line-clamp": e.titleLines || 2,
      "-webkit-box-orient": "vertical",
      overflow: "hidden",
      "text-overflow": "ellipsis"
    })), de = computed(() => ({
      display: "-webkit-box",
      "-webkit-line-clamp": e.excerptLines || 4,
      "-webkit-box-orient": "vertical",
      overflow: "hidden",
      "text-overflow": "ellipsis"
    }));
    return onMounted(() => {
      const { instanceURL: g, postID: k } = I(e.url);
      g && k ? S(g, k) : o.value = "Invalid URL.";
    }), (g, k) => (openBlock(), createElementBlock("div", ia, [
      A.value ? (openBlock(), createElementBlock("div", la, [
        !g.hideUser || !g.hideCommunity ? (openBlock(), createElementBlock("div", ca, [
          !g.hideUser || !g.hideCommunity ? (openBlock(), createElementBlock("div", da, [
            createBaseVNode("div", ua, [
              g.hideUser ? createCommentVNode("", true) : (openBlock(), createElementBlock("a", {
                key: 0,
                onClick: k[0] || (k[0] = withModifiers(() => {
                }, ["stop"])),
                href: $.value,
                title: "User profile",
                class: "lemmy-user-link",
                target: "_blank"
              }, [
                createBaseVNode("div", ha, [
                  createBaseVNode("img", {
                    src: n.value.avatar || "https://placehold.co/24",
                    alt: "User Avatar",
                    onError: E
                  }, null, 40, fa)
                ]),
                createBaseVNode("span", pa, toDisplayString(n.value.display_name || n.value.name), 1)
              ], 8, ma)),
              !g.hideUser && !g.hideCommunity ? (openBlock(), createElementBlock("span", ya, "in")) : createCommentVNode("", true),
              g.hideCommunity ? createCommentVNode("", true) : (openBlock(), createElementBlock("a", {
                key: 2,
                onClick: k[1] || (k[1] = withModifiers(() => {
                }, ["stop"])),
                href: b.value,
                title: "Community",
                class: "lemmy-community-link",
                target: "_blank"
              }, [
                createBaseVNode("span", ga, toDisplayString(u.value.name), 1)
              ], 8, _a))
            ])
          ])) : createCommentVNode("", true),
          createBaseVNode("div", va, [
            createBaseVNode("a", {
              href: e.url,
              target: "_blank",
              title: "View post on Lemmy",
              class: "lemmy-header-icon-link"
            }, [
              createVNode(unref(Icon), {
                icon: "bi:link-45deg",
                class: "lemmy-header-icon",
                width: "24",
                height: "24"
              })
            ], 8, ka),
            createBaseVNode("a", {
              href: unref(_),
              target: "_blank",
              title: "Instance",
              class: "lemmy-header-icon-link"
            }, [
              createVNode(unref(Icon), {
                icon: "simple-icons:lemmy",
                class: "lemmy-header-icon",
                width: "24",
                height: "24"
              })
            ], 8, $a)
          ])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", wa, [
          g.hideTitle ? createCommentVNode("", true) : (openBlock(), createElementBlock("h3", {
            key: 0,
            class: "lemmy-card-title",
            style: normalizeStyle(ce.value),
            onClick: d,
            title: "View post on Lemmy"
          }, toDisplayString(o.value), 5)),
          C.value && !g.hideBanner ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: "lemmy-card-image",
            onClick: d,
            title: "View post on Lemmy"
          }, [
            createBaseVNode("img", {
              src: C.value,
              alt: "Post Image",
              onError: le
            }, null, 40, Ca)
          ])) : createCommentVNode("", true),
          l.value && !g.hideExcerpt ? (openBlock(), createElementBlock("p", {
            key: 2,
            class: "lemmy-card-description",
            style: normalizeStyle(de.value)
          }, toDisplayString(l.value), 5)) : createCommentVNode("", true)
        ]),
        !g.hideScore || !g.hideComments || !g.hideDate ? (openBlock(), createElementBlock("div", ba, [
          g.hideScore ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", {
            key: 0,
            class: "lemmy-score",
            onClick: d,
            title: "View post on Lemmy"
          }, [
            createBaseVNode("div", Da, [
              createVNode(unref(Icon), {
                icon: "mingcute:arrow-up-fill",
                class: "lemmy-icon",
                width: "24",
                height: "24"
              }),
              createBaseVNode("span", null, toDisplayString(D.value), 1)
            ])
          ])),
          g.hideComments ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", {
            key: 1,
            class: "lemmy-comments",
            onClick: d,
            title: "View post on Lemmy"
          }, [
            createBaseVNode("div", La, [
              createVNode(unref(Icon), {
                icon: "mdi:comment-outline",
                class: "lemmy-icon",
                width: "24",
                height: "24"
              }),
              createBaseVNode("span", null, toDisplayString(y.value), 1)
            ])
          ])),
          k[2] || (k[2] = createBaseVNode("div", { class: "lemmy-gap" }, null, -1)),
          g.hideDate ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", xa, [
            createBaseVNode("div", Ia, toDisplayString(s.value), 1)
          ]))
        ])) : createCommentVNode("", true)
      ])) : (openBlock(), createElementBlock("div", Ta, [
        createBaseVNode("div", Sa, [
          k[3] || (k[3] = createTextVNode(" This post could not be loaded. ")),
          k[4] || (k[4] = createBaseVNode("br", null, null, -1)),
          k[5] || (k[5] = createTextVNode(" It may have been deleted or removed. ")),
          k[6] || (k[6] = createBaseVNode("br", null, null, -1)),
          k[7] || (k[7] = createBaseVNode("br", null, null, -1)),
          k[8] || (k[8] = createTextVNode(" You can try viewing it ")),
          createBaseVNode("a", {
            href: e.url,
            target: "_blank"
          }, "here", 8, Ba),
          k[9] || (k[9] = createTextVNode(". "))
        ])
      ]))
    ]));
  }
});
var Ea = x(Aa, [["__scopeId", "data-v-4e596844"]]);
var Ua = defineComponent({
  __name: "EmbedLemmy",
  props: {
    headerTitle: { default: "" },
    headerTitleLines: {},
    headerLink: {},
    headerDate: { default: "" },
    links: {},
    hideUser: { type: Boolean },
    hideCommunity: { type: Boolean },
    hideTitle: { type: Boolean },
    hideBanner: { type: Boolean },
    hideExcerpt: { type: Boolean },
    hideScore: { type: Boolean },
    hideComments: { type: Boolean },
    hideDate: { type: Boolean },
    titleLines: {},
    excerptLines: {}
  },
  setup(c) {
    const e = c, o = computed(() => !!(e.headerTitle || e.headerDate || e.headerLink)), {
      links: l,
      hideUser: n,
      hideCommunity: u,
      hideTitle: _,
      hideBanner: w,
      hideExcerpt: C,
      hideScore: D,
      hideComments: y,
      hideDate: i,
      titleLines: s,
      excerptLines: $
    } = e;
    return (b, A) => (openBlock(), createBlock(G, null, {
      default: withCtx(() => [
        o.value ? (openBlock(), createBlock(Z, {
          key: 0,
          title: b.headerTitle,
          date: b.headerDate,
          "title-lines": b.headerTitleLines,
          link: b.headerLink
        }, null, 8, ["title", "date", "title-lines", "link"])) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(l), (d, I) => (openBlock(), createBlock(Ea, {
          key: I,
          url: d,
          hideUser: unref(n),
          hideCommunity: unref(u),
          hideTitle: unref(_),
          hideBanner: unref(w),
          hideExcerpt: unref(C),
          hideScore: unref(D),
          hideComments: unref(y),
          hideDate: unref(i),
          titleLines: unref(s),
          excerptLines: unref($)
        }, null, 8, ["url", "hideUser", "hideCommunity", "hideTitle", "hideBanner", "hideExcerpt", "hideScore", "hideComments", "hideDate", "titleLines", "excerptLines"]))), 128))
      ]),
      _: 1
    }));
  }
});
var Pa = {
  name: "MailchimpEmbed",
  props: {
    actionUrl: {
      type: String,
      required: true
    },
    hiddenFieldName: {
      type: String,
      required: true
    },
    showReferral: {
      type: Boolean,
      default: true
    },
    referralLink: {
      type: String,
      required: function() {
        return this.showReferral;
      }
    },
    title: {
      type: String,
      default: "Subscribe"
    },
    description: {
      type: String,
      default: ""
    },
    buttonText: {
      type: String,
      default: "Subscribe"
    }
  },
  data() {
    return {
      email: "",
      hiddenFieldValue: ""
    };
  },
  mounted() {
    const c = document.createElement("script");
    c.type = "text/javascript", c.src = this.validationScriptUrl, c.async = true, document.body.appendChild(c), window.fnames = [], window.ftypes = [], window.fnames[0] = "EMAIL", window.ftypes[0] = "email", window.fnames[1] = "FNAME", window.ftypes[1] = "text", window.fnames[2] = "LNAME", window.ftypes[2] = "text", window.fnames[3] = "ADDRESS", window.ftypes[3] = "address", window.fnames[4] = "PHONE", window.ftypes[4] = "phone", window.fnames[5] = "BIRTHDAY", window.ftypes[5] = "birthday", window.fnames[6] = "COMPANY", window.ftypes[6] = "text", window.jQuery && (window.$mcj = window.jQuery.noConflict(true));
  },
  methods: {
    handleSubmit() {
      this.$el.querySelector("form").submit();
    }
  },
  computed: {
    validationScriptUrl() {
      return "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    }
  }
};
var Ra = { id: "mc_embed_shell" };
var Oa = { id: "mailc_embed_signup" };
var ja = ["action"];
var Ma = { id: "mailc_embed_signup_scroll" };
var Va = { class: "title" };
var Fa = {
  key: 0,
  class: "description"
};
var Na = { class: "mc-field-group" };
var Ha = {
  "aria-hidden": "true",
  style: { position: "absolute", left: "-5000px" }
};
var za = ["name"];
var qa = { class: "optionalParent" };
var Wa = { class: "clear foot" };
var Ja = {
  type: "submit",
  name: "subscribe",
  id: "mc-embedded-subscribe",
  class: "button"
};
var Ga = {
  key: 0,
  class: "referral"
};
var Ka = ["href"];
function Ya(c, e, o, l, n, u) {
  return openBlock(), createElementBlock("div", Ra, [
    createBaseVNode("div", Oa, [
      createBaseVNode("form", {
        action: o.actionUrl,
        method: "post",
        id: "mc-embedded-subscribe-form",
        name: "mc-embedded-subscribe-form",
        class: "validate",
        target: "_blank",
        onSubmit: e[2] || (e[2] = withModifiers((..._) => u.handleSubmit && u.handleSubmit(..._), ["prevent"]))
      }, [
        createBaseVNode("div", Ma, [
          createBaseVNode("div", Va, toDisplayString(o.title), 1),
          o.description ? (openBlock(), createElementBlock("div", Fa, [
            createBaseVNode("p", null, toDisplayString(o.description), 1)
          ])) : createCommentVNode("", true),
          e[5] || (e[5] = createBaseVNode("div", { class: "indicates-required" }, [
            createBaseVNode("span", { class: "asterisk" }, "*"),
            createTextVNode(" indicates required ")
          ], -1)),
          createBaseVNode("div", Na, [
            e[3] || (e[3] = createBaseVNode("label", { for: "mce-EMAIL" }, [
              createTextVNode(" Email Address "),
              createBaseVNode("span", { class: "asterisk" }, "*")
            ], -1)),
            withDirectives(createBaseVNode("input", {
              type: "email",
              name: "EMAIL",
              class: "required email",
              id: "mce-EMAIL",
              "onUpdate:modelValue": e[0] || (e[0] = (_) => n.email = _),
              required: ""
            }, null, 512), [
              [vModelText, n.email]
            ])
          ]),
          e[6] || (e[6] = createBaseVNode("div", {
            id: "mce-responses",
            class: "clear foot"
          }, [
            createBaseVNode("div", {
              class: "response",
              id: "mce-error-response",
              style: { display: "none" }
            }),
            createBaseVNode("div", {
              class: "response",
              id: "mce-success-response",
              style: { display: "none" }
            })
          ], -1)),
          createBaseVNode("div", Ha, [
            withDirectives(createBaseVNode("input", {
              type: "text",
              name: o.hiddenFieldName,
              tabindex: "-1",
              "onUpdate:modelValue": e[1] || (e[1] = (_) => n.hiddenFieldValue = _)
            }, null, 8, za), [
              [vModelText, n.hiddenFieldValue]
            ])
          ]),
          createBaseVNode("div", qa, [
            createBaseVNode("div", Wa, [
              createBaseVNode("button", Ja, toDisplayString(o.buttonText), 1),
              o.showReferral && o.referralLink ? (openBlock(), createElementBlock("p", Ga, [
                createBaseVNode("a", {
                  href: o.referralLink,
                  title: "Mailchimp - email marketing made easy and fun"
                }, e[4] || (e[4] = [
                  createBaseVNode("span", { class: "referral-container" }, [
                    createBaseVNode("img", {
                      class: "referral_badge dark-only",
                      src: "https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-light.svg",
                      alt: "Intuit Mailchimp"
                    }),
                    createBaseVNode("img", {
                      class: "referral_badge light-only",
                      src: "https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg",
                      alt: "Intuit Mailchimp"
                    })
                  ], -1)
                ]), 8, Ka)
              ])) : createCommentVNode("", true)
            ])
          ])
        ])
      ], 40, ja)
    ])
  ]);
}
var Qa = x(Pa, [["render", Ya], ["__scopeId", "data-v-aba492b9"]]);
var Za = { class: "blog-post-list-container" };
var Xa = { key: 0 };
var en = {
  key: 1,
  class: "cards-container"
};
var tn = ["href"];
var an = { class: "card-content" };
var nn = { class: "card-info" };
var rn = { class: "post-title" };
var sn = { class: "post-meta" };
var on = { class: "post-date" };
var ln = {
  key: 0,
  class: "post-author"
};
var cn = { class: "post-tags" };
var dn = {
  key: 0,
  class: "tag"
};
var un = { class: "post-excerpt" };
var mn = {
  key: 0,
  class: "card-image"
};
var hn = ["src"];
var fn = {
  __name: "BlogPostsVertical",
  props: {
    posts: {
      type: Array,
      required: false
    },
    renderDrafts: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: [Date, String],
      default: null
    },
    endDate: {
      type: [Date, String],
      default: null
    },
    format: {
      type: String,
      default: "verticalCards",
      validator: (c) => ["debug", "verticalCards"].includes(c)
    },
    sortOrder: {
      type: String,
      default: "desc",
      validator: (c) => ["asc", "desc"].includes(c)
    },
    featuredOnly: {
      type: Boolean,
      default: false
    },
    filterAuthors: {
      type: Array,
      default: () => []
    },
    excludeAuthors: {
      type: Array,
      default: () => []
    },
    filterCategories: {
      type: Array,
      default: () => []
    },
    excludeCategories: {
      type: Array,
      default: () => []
    },
    excludeURLs: {
      type: Array,
      default: () => []
    },
    maxCards: {
      type: Number,
      default: null
    }
  },
  setup(c) {
    const e = c, o = inject("postsData", []), l = inject("authors", {}), n = computed(() => e.posts || o), u = computed(() => {
      const y = [...n.value];
      return y.sort((i, s) => {
        const $ = new Date(i.frontmatter.date), b = new Date(s.frontmatter.date);
        return e.sortOrder === "asc" ? $ - b : b - $;
      }), y;
    }), _ = computed(() => u.value.filter((y) => {
      const { frontmatter: i } = y;
      if (e.featuredOnly && !i.featured || !e.renderDrafts && i.draft)
        return false;
      const s = new Date(i.date);
      if (e.startDate && s < new Date(e.startDate) || e.endDate && s > new Date(e.endDate) || e.filterAuthors.length > 0 && !e.filterAuthors.includes(i.author) || e.excludeAuthors.length > 0 && e.excludeAuthors.includes(i.author) || e.filterCategories.length > 0 && !e.filterCategories.includes(i.category) || e.excludeCategories.length > 0 && e.excludeCategories.includes(i.category))
        return false;
      if (e.excludeURLs.length > 0) {
        const $ = y.url.replace(/\.html$/, "");
        if (e.excludeURLs.some((A) => A.replace(/\.html$/, "") === $))
          return false;
      }
      return true;
    })), w = computed(() => e.maxCards !== null && e.maxCards >= 0 ? _.value.slice(0, e.maxCards) : _.value);
    function C(y) {
      return new Date(y).toLocaleDateString(void 0, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    function D(y) {
      const i = l[y];
      return i ? i.name : y;
    }
    return (y, i) => (openBlock(), createElementBlock("div", Za, [
      c.format === "debug" ? (openBlock(), createElementBlock("div", Xa, [
        createBaseVNode("pre", null, toDisplayString(JSON.stringify(w.value, null, 2)), 1)
      ])) : c.format === "verticalCards" ? (openBlock(), createElementBlock("div", en, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(w.value, (s) => (openBlock(), createElementBlock("div", {
          key: s.url,
          class: "post-card"
        }, [
          createBaseVNode("a", {
            href: s.url,
            class: "card-link"
          }, [
            createBaseVNode("div", an, [
              createBaseVNode("div", nn, [
                createBaseVNode("div", rn, toDisplayString(s.frontmatter.title), 1),
                createBaseVNode("div", sn, [
                  createBaseVNode("span", on, toDisplayString(C(s.frontmatter.date)), 1),
                  s.frontmatter.author ? (openBlock(), createElementBlock("span", ln, " by " + toDisplayString(D(s.frontmatter.author)), 1)) : createCommentVNode("", true)
                ]),
                createBaseVNode("div", cn, [
                  s.frontmatter.category ? (openBlock(), createElementBlock("span", dn, toDisplayString(s.frontmatter.category), 1)) : createCommentVNode("", true)
                ]),
                createBaseVNode("div", un, toDisplayString(s.frontmatter.excerpt), 1)
              ]),
              s.frontmatter.banner ? (openBlock(), createElementBlock("div", mn, [
                createBaseVNode("img", {
                  src: s.frontmatter.banner,
                  alt: "Banner Image"
                }, null, 8, hn)
              ])) : createCommentVNode("", true)
            ])
          ], 8, tn)
        ]))), 128))
      ])) : createCommentVNode("", true)
    ]));
  }
};
var pn = x(fn, [["__scopeId", "data-v-64d8a45a"]]);
var yn = { class: "featured-posts-container" };
var _n = { class: "cards-wrapper" };
var gn = ["href"];
var vn = { class: "card-image" };
var kn = ["src"];
var $n = { class: "card-info" };
var wn = { class: "post-title" };
var Cn = { class: "post-meta" };
var bn = { class: "post-date" };
var Dn = {
  key: 0,
  class: "post-author"
};
var Ln = { class: "post-tags" };
var xn = {
  key: 0,
  class: "tag"
};
var In = { class: "post-excerpt" };
var Tn = {
  __name: "BlogPostsHorizontal",
  props: {
    posts: {
      type: Array,
      required: false
    },
    renderDrafts: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: [Date, String],
      default: null
    },
    endDate: {
      type: [Date, String],
      default: null
    },
    sortOrder: {
      type: String,
      default: "desc",
      validator: (c) => ["asc", "desc"].includes(c)
    },
    featuredOnly: {
      type: Boolean,
      default: false
    },
    filterAuthors: {
      type: Array,
      default: () => []
    },
    excludeAuthors: {
      type: Array,
      default: () => []
    },
    filterCategories: {
      type: Array,
      default: () => []
    },
    excludeCategories: {
      type: Array,
      default: () => []
    },
    excludeURLs: {
      type: Array,
      default: () => []
    },
    maxCards: {
      type: Number,
      default: null
    }
  },
  setup(c) {
    const e = c, o = inject("postsData", []), l = inject("authors", {}), n = computed(() => e.posts || o), u = computed(() => {
      const y = [...n.value];
      return y.sort((i, s) => {
        const $ = new Date(i.frontmatter.date), b = new Date(s.frontmatter.date);
        return e.sortOrder === "asc" ? $ - b : b - $;
      }), y;
    }), _ = computed(() => u.value.filter((y) => {
      const { frontmatter: i } = y;
      if (e.featuredOnly && !i.featured || !e.renderDrafts && i.draft)
        return false;
      const s = new Date(i.date);
      if (e.startDate && s < new Date(e.startDate) || e.endDate && s > new Date(e.endDate) || e.filterAuthors.length > 0 && !e.filterAuthors.includes(i.author) || e.excludeAuthors.length > 0 && e.excludeAuthors.includes(i.author) || e.filterCategories.length > 0 && !e.filterCategories.includes(i.category) || e.excludeCategories.length > 0 && e.excludeCategories.includes(i.category))
        return false;
      if (e.excludeURLs.length > 0) {
        const $ = y.url.replace(/\.html$/, "");
        if (e.excludeURLs.some((A) => A.replace(/\.html$/, "") === $))
          return false;
      }
      return true;
    })), w = computed(() => e.maxCards !== null && e.maxCards >= 0 ? _.value.slice(0, e.maxCards) : _.value);
    function C(y) {
      return new Date(y).toLocaleDateString(void 0, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    function D(y) {
      const i = l[y];
      return i ? i.name : y;
    }
    return (y, i) => (openBlock(), createElementBlock("div", yn, [
      createCommentVNode("", true),
      createBaseVNode("div", _n, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(w.value, (s) => (openBlock(), createElementBlock("div", {
          key: s.url,
          class: "featured-post-card"
        }, [
          createBaseVNode("a", {
            href: s.url,
            class: "card-link"
          }, [
            createBaseVNode("div", vn, [
              s.frontmatter.banner ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: s.frontmatter.banner,
                alt: "Banner Image"
              }, null, 8, kn)) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", $n, [
              createBaseVNode("h3", wn, toDisplayString(s.frontmatter.title), 1),
              createBaseVNode("div", Cn, [
                createBaseVNode("span", bn, toDisplayString(C(s.frontmatter.date)), 1),
                s.frontmatter.author ? (openBlock(), createElementBlock("span", Dn, " by " + toDisplayString(D(s.frontmatter.author)), 1)) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", Ln, [
                s.frontmatter.category ? (openBlock(), createElementBlock("span", xn, toDisplayString(s.frontmatter.category), 1)) : createCommentVNode("", true)
              ]),
              createBaseVNode("p", In, toDisplayString(s.frontmatter.excerpt), 1)
            ])
          ], 8, gn)
        ]))), 128))
      ])
    ]));
  }
};
var Sn = x(Tn, [["__scopeId", "data-v-cf8ebe71"]]);
var Bn = Object.freeze(Object.defineProperty({
  __proto__: null,
  BlogPostHeader: it,
  BlogPostList: mt,
  BlogPostsHorizontal: Sn,
  BlogPostsVertical: pn,
  EmbedLemmy: Ua,
  EmbedMailchimpSubscribe: Qa,
  HeaderCard: Z,
  HorizontalCard: se,
  HorizontalContainer: oe,
  ImageCardSquare: ie,
  ImageGallery: oa,
  JSONTable: Wt,
  VerticalCard: Y,
  VerticalContainer: G
}, Symbol.toStringTag, { value: "Module" }));
var An = 8;
var On = Object.freeze(Object.defineProperty({
  __proto__: null,
  TEST_VALUE: An
}, Symbol.toStringTag, { value: "Module" }));
function En(c) {
  const e = Bn;
  for (const o in e)
    c.component(o, e[o]);
}
var jn = { install: En };
export {
  it as BlogPostHeader,
  mt as BlogPostList,
  Sn as BlogPostsHorizontal,
  pn as BlogPostsVertical,
  Ua as EmbedLemmy,
  Qa as EmbedMailchimpSubscribe,
  Z as HeaderCard,
  se as HorizontalCard,
  oe as HorizontalContainer,
  ie as ImageCardSquare,
  oa as ImageGallery,
  Wt as JSONTable,
  On as MyConstants,
  Y as VerticalCard,
  G as VerticalContainer,
  jn as default,
  lt as formatDate
};
//# sourceMappingURL=@cynber_vitepress-valence.js.map
