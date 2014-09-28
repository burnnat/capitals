var usePhonetics = true;

var smallCaps = {
  'a': 0x1D00,
  'b': 0x0299,
  'c': 0x1D04,
  'd': 0x1D05,
  'e': 0x1D07,
  'f': 0xA730,
  'g': 0x0262,
  'h': 0x029C,
  'i': 0x026A,
  'j': 0x1D0A,
  'k': 0x1D0B,
  'l': 0x029F,
  'm': 0x1D0D,
  'n': 0x0274,
  'o': 0x1D0F,
  'p': 0x1D18,
  'q': 0x01EB,
  'r': 0x0280,
  's': 0xA731,
  't': 0x1D1B,
  'u': 0x1D1C,
  'v': 0x1D20,
  'w': 0x1D21,
  'x': 0x0078,
  'y': 0x028F,
  'z': 0x1D22
};

var normalCaps = {};

for (var c in smallCaps) {
  normalCaps[String.fromCharCode(smallCaps[c])] = c.charCodeAt(0);
}

function swapChars(charset) {
  modifySelected(function(text) {
    return text.replace(
      /./g,
      function(c) {
        var code = charset[c];
        
        return code ? String.fromCharCode(code) : c;
      }
    );
  });
}

var variantSurrogate = '\uFE0C';

function makeSmallCaps() {
  if (usePhonetics) {
    swapChars(smallCaps);
  }
  else {
    modifySelected(
      function(text) {
        return text.replace(
          /[a-z]/g,
          function(c) {
            return c.toUpperCase() + variantSurrogate;
          }
        );
      },
      function(el, text, start, end) {
        var regex = new RegExp('([A-Z]' + variantSurrogate + ')+', 'g');
        var match;
        
        while (match = regex.exec(text)) {
          el.setFontSize(start + match.index, start + match[0].length, 8);
        }
      }
    );
  }
}

function makeNormalCaps() {
  if (usePhonetics) {
    swapChars(normalCaps);
  }
  else {
    modifySelected(
      function(text) {
        return text.replace(
          new RegExp('[A-Z]' + variantSurrogate, 'g'),
          function(c) {
            return c[0].toLowerCase();
          }
        );
      },
      function(el, text, start, end) {
        
      }
    );
  }
}
