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
      var ref;
      currency || (currency = vtex.topbar.utils.config.currency);
      if (((ref = currency.code) != null ? ref.length : void 0) !== 3) {
        throw new Error('Locale: Currency Code must follow XXX format');
      }
      $locale.NUMBER_FORMATS.CURRENCY_SYM = currency.configuration.currencySymbol;
      $locale.NUMBER_FORMATS.DECIMAL_SEP = currency.configuration.decimalSeparator;
      $locale.NUMBER_FORMATS.GROUP_SEP = currency.configuration.groupSeparator;
      $locale.NUMBER_FORMATS.PATTERNS[1] = currency.configuration.ngPatterns;
      return $rootScope.$broadcast('currencyUpdated.vtex', currency.code);
    };
    return this;
  }).run(function($rootScope, $window, LocaleService) {
    LocaleService.setLanguage();
    $rootScope.$on('localeUpdated.vtex', function() {
      return LocaleService.setCurrency();
    });
    return angular.element($window).on('localeSelected.vtex', function(evt, lang) {
      return LocaleService.setLanguage(lang);
    });
  });

}).call(this);
