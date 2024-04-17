]

var State = {
  active: false,
  startLine: 0,
  startCategory: 0
}

var opts = {
  font: 'Sarasa Term SC Nerd Regular',
  'font-size': 5,
  'usage-font-size': 5,
}

function repeat(s, num) {
  var ret = '';
  for (var i = 0; i < num; i++) {
    ret = ret + s;
  }
  return ret;
}

function renderCategory(category) {
  var lines = []
  lines.push(assdraw.bolden(category.category))
  var maxKeysLength = 0;
  category.shortcuts.forEach(function(shortcut) {
    if (shortcut.keys.length > maxKeysLength) maxKeysLength = shortcut.keys.length
  })
  category.shortcuts.forEach(function(shortcut) {
    var padding = repeat(" ", maxKeysLength - shortcut.keys.length)
    lines.push(assdraw.escape(shortcut.keys + padding + " " + shortcut.effect))
  })
  return lines
}

function render() {
  var screen = mp.get_osd_size()
  if (!State.active) {
    mp.set_osd_ass(0, 0, '{}')
    return
  }
  var ass = new assdraw()
  ass.newEvent()
  ass.override(function() {
    this.lineAlignment(assdraw.TOP_LEFT)
    this.primaryFillAlpha('00')
    this.borderAlpha('00')
    this.shadowAlpha('99')
    this.primaryFillColor('eeeeee')
    this.borderColor('111111')
    this.shadowColor('000000')
    this.fontName(opts.font)
    this.fontSize(opts['font-size'])
    this.borderSize(0.2)
    this.xShadowDistance(0)
    this.yShadowDistance(0.1)
    this.letterSpacing(0)
    this.wrapStyle(assdraw.EOL_WRAPPING)
  })
  var mainLines = [];
  var pushedCategory = false
  shortcuts.forEach(function(category, i) {
    if (i < State.startCategory) {
      return;
    }
    pushedCategory = true;
    if (pushedCategory) {
      mainLines.push("")
    }
    mainLines.push.apply(mainLines, renderCategory(category))
  })
  mainLines.slice(State.startLine).forEach(function(line) {
    ass.appendLN(line);
  })

  ass.newEvent()
  var sideLines = renderCategory({
    category: 'usage',
    shortcuts: Keybindings
  })
  ass.override(function() {
    this.lineAlignment(assdraw.TOP_RIGHT)
    this.fontSize(opts['usage-font-size'])
  })
  sideLines.forEach(function(line) {
    ass.appendLN(line);
  })

  mp.set_osd_ass(0, 0, ass.text)
}

function setActive(active) {
  if (active == State.active) return
  if (active) {
    State.active = true
    updateBindings(Keybindings, true)
  } else {
    State.active = false
    updateBindings(Keybindings, false)
  }
  render()
}

function updateBindings(bindings, enable) {
  bindings.forEach(function(binding, i) {
    var name = '__cheatsheet_binding_' + i
    if (enable) {
      mp.add_forced_key_binding(binding.keys, name, binding.callback, binding.options)
    } else {
      mp.remove_key_binding(name)
    }
  })
}

var Keybindings = [
  {
    keys: 'esc',
    effect: 'close',
    callback: function() { setActive(false) }
  },
  {
    keys: '?',
    effect: 'close',
    callback: function() { setActive(false) }
  },
  {
    keys: 'j',
    effect: 'next line',
    callback: function() {
      State.startLine += 1
      render()
    },
    options: 'repeatable'
  },
  {
    keys: 'k',
    effect: 'prev line',
    callback: function() {
      State.startLine = Math.max(0, State.startine - 1)
      render()
    },
    options: 'repeatable'
  },
  {
    keys: 'n',
    effect: 'next category',
    callback: function() {
      State.startCategory += 1
      State.startLine = 0
      render()
    },
    options: 'repeatable'
  },
  {
    keys: 'p',
    effect: 'prev category',
    callback: function() {
      State.startCategory = Math.max(0, State.startCategory - 1)
      State.startLine = 0
      render()
    },
    options: 'repeatable'
  },
]

mp.add_key_binding('?', 'cheatsheet-enable', function() { setActive(true) })

mp.observe_property('osd-width', 'native', render)
mp.observe_property('osd-height', 'native', render)

},{"./assdraw.js":1}]},{},[2]);
