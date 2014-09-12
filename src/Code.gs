function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
      .addItem('Make uppercase', 'makeUpperCase')
      .addItem('Make lowercase', 'makeLowerCase')
      .addItem('Make title case', 'makeTitleCase')
    .addSeparator()
      .addItem('Add small caps', 'makeSmallCaps')
      .addItem('Remove small caps', 'makeNormalCaps')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function modifySelected(fn) {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  var builder = doc.newRange();
  
  var hasText = false;
  
  if (selection) {
    var elements = selection.getRangeElements();
    
    for (var i = 0; i < elements.length; i++) {
      var range = elements[i];
      var element = range.getElement();
      
      if (element.editAsText) {
        var text = element.editAsText();
        var value = text.getText();
        
        if (range.isPartial()) {
          var startIndex = range.getStartOffset();
          var endIndex = range.getEndOffsetInclusive();
          value = value.substring(startIndex, endIndex + 1);
          
          if (value.length > 0) {
            hasText = true;
          }
          
          text.deleteText(startIndex, endIndex);
          text.insertText(startIndex, fn(value));
          
          builder.addElement(element, startIndex, endIndex);
        }
        else {
          if (value.length > 0) {
            hasText = true;
          }
          
          text.setText(fn(value));
          builder.addElement(element);
        }
      }
    }
  }
  
  if (!hasText) {
    var ui = DocumentApp.getUi();
    ui.alert('No text selected', 'Please select the text you want to modify.', ui.ButtonSet.OK);
  }
  else {
    doc.setSelection(builder.build());
  }
}

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

function makeSmallCaps() {
  swapChars(smallCaps);
}

function makeNormalCaps() {
  swapChars(normalCaps);
}

function makeUpperCase() {
  modifySelected(function(text) {
    return text.toUpperCase();
  });
}

function makeLowerCase() {
  modifySelected(function(text) {
    return text.toLowerCase();
  });
}

function makeTitleCase() {
  modifySelected(function(text) {
    return text.toTitleCase();
  });
}