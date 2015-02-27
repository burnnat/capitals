function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
      .addItem('Make uppercase', 'makeUpperCase')
      .addItem('Make lowercase', 'makeLowerCase')
      .addItem('Make title case', 'makeTitleCase')
    .addSeparator()
      .addItem('Add small caps', 'makeSmallCaps')
      .addItem('Remove small caps', 'makeNormalCaps')
    .addSeparator()
      .addItem('Preferences', 'showPreferences')
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

        var partial = range.isPartial();
        var startIndex;
        var endIndex;

        if (partial) {
          startIndex = range.getStartOffset();
          endIndex = range.getEndOffsetInclusive();
          value = value.substring(startIndex, endIndex + 1);
        }
        else {
          startIndex = 0;
          endIndex = value.length - 1;
        }

        if (value.length > 0) {
          hasText = true;
        }
        else {
          continue;
        }

        fn(element, text, value, partial, startIndex, endIndex, builder);
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

function replaceText(fn, attrFn) {
  modifySelected(function(el, text, value, partial, startIndex, endIndex, builder) {
    value = fn(value);

    var attrs = [];

    for (var i = startIndex; i <= endIndex; i++) {
      attrs[i - startIndex] = text.getAttributes(i);
    }

    text.deleteText(startIndex, endIndex);
    text.insertText(startIndex, value);

    var attrValue = null;

    for (var i = 0; i < value.length; i++) {
      attrValue = attrFn ? attrFn(attrs, i) : cleanAttributes(attrs[i]);

      if (attrValue) {
        text.setAttributes(
          startIndex + i,
          startIndex + i,
          attrValue
        );
      }
    }

    if (partial) {
      builder.addElement(el, startIndex, startIndex + value.length - 1);
    }
    else {
      builder.addElement(el);
    }
  });
}

function cleanAttributes(attrs) {
  var cleaned = {};
  var value;

  for (var att in attrs) {
    value = attrs[att];

    if (value !== null) {
      cleaned[att] = value;
    }
  }

  return cleaned;
}

function makeUpperCase() {
  replaceText(function(text) {
    return text.toUpperCase();
  });
}

function makeLowerCase() {
  replaceText(function(text) {
    return text.toLowerCase();
  });
}

function makeTitleCase() {
  replaceText(function(text) {
    return text.toTitleCase();
  });
}
