var prefsDefault = {
  smallcaps: 'unicode'
};

function showPreferences() {
  var dialog = HtmlService.createTemplateFromFile("PrefsDialog");
  var prefs = PropertiesService.getDocumentProperties();

  for (var key in prefsDefault) {
    dialog[key] = prefs.getProperty(key) || prefsDefault[key];
  }

  DocumentApp.getUi().showModalDialog(dialog.evaluate(), "Preferences");
}

function savePreferences(form) {
  PropertiesService.getDocumentProperties().setProperties(form);
}
