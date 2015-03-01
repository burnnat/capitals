var prefsInitial = {
  smallcaps: 'scaled'
};

function showPreferences() {
  var dialog = HtmlService.createTemplateFromFile("PrefsDialog");

  var userPrefs = PropertiesService.getUserProperties();
  var defaults = {};

  for (var key in prefsInitial) {
    defaults[key] = userPrefs.getProperty(key) || prefsInitial[key];
  }

  var docPrefs = PropertiesService.getDocumentProperties();
  var prefs = {};

  for (var key in prefsInitial) {
    prefs[key] = docPrefs.getProperty(key) || defaults[key];
  }

  dialog.defaults = defaults;
  dialog.prefs = prefs;

  DocumentApp.getUi().showModalDialog(dialog.evaluate(), "Preferences");
}

function savePreferences(form) {
  PropertiesService.getDocumentProperties().setProperties(form);
}

function saveDefaults(form) {
  PropertiesService.getUserProperties().setProperties(form);
}
