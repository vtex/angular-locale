(function() {
  angular.module('vtex.ngLocale', []).service('LocaleService', function($rootScope, $window, $locale, $translate, tmhDynamicLocale) {
    var $w;
    $w = $window;
    this.setLanguage = function(lang) {
      lang || (lang = vtex.locale || vtex.topbar.service.Locale.getLocale() || $w.navigator.userLanguage || $w.navigator.language || 'pt-BR');
      if (!(lang.length === 5 && lang.indexOf('-') === 2)) {
        throw new Error('Locale: Language must follow xx-XX format');
      }
      return tmhDynamicLocale.set(lang.toLowerCase()).then(function(locale) {
        return $translate.use(lang).then(function() {
          return $rootScope.$broadcast('localeUpdated.vtex', locale);
        });
      });
    };
    this.setCurrency = function(currency) {
      var defaultPatterns, ref;
      currency || (currency = vtex.topbar.utils.config.currency);
      if (((ref = currency.code) != null ? ref.length : void 0) !== 3) {
        throw new Error('Locale: Currency Code must follow XXX format');
      }
      currency = vtex.topbar.utils.config.currency;
      defaultPatterns = {
        gSize: 3,
        lgSize: 3,
        macFrac: 0,
        maxFrac: 2,
        minFrac: 2,
        minInt: 1,
        negPre: "- \u00a4",
        negSuf: "",
        posPre: "\u00a4",
        posSuf: ""
      };
      $locale.NUMBER_FORMATS.CURRENCY_SYM = currency.currencySymbol;
      $locale.NUMBER_FORMATS.DECIMAL_SEP = currency.decimalSeparator;
      $locale.NUMBER_FORMATS.GROUP_SEP = currency.groupSeparator;
      $locale.NUMBER_FORMATS.PATTERNS[1] = currency.ngPatterns || defaultPatterns;
      return $rootScope.$broadcast('currencyUpdated.vtex', currency.code);
    };
    return this;
  }).run(function(LocaleService, $window) {
    LocaleService.setLanguage();
    LocaleService.setCurrency();
    return angular.element($window).on('localeSelected.vtex', function(evt, lang) {
      return LocaleService.setLanguage(lang);
    });
  });

}).call(this);
