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

function makeUpperCase() {
  reviseText(function(text) {
    return text.toUpperCase();
  });
}

function makeLowerCase() {
  reviseText(function(text) {
    return text.toLowerCase();
  });
}

function makeTitleCase() {
  reviseText(function(text) {
    return text.toTitleCase();
  });
}
