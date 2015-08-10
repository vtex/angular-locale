angular.module('vtex.ngLocale', [])

.service 'LocaleService', ($rootScope, $window, $locale, $translate, tmhDynamicLocale) ->

	$w = $window

	@setLanguage = (lang) ->
		lang or= vtex.locale or vtex.topbar.service.Locale.getLocale() or $w.navigator.userLanguage or $w.navigator.language or 'pt-BR'

		throw new Error 'Locale: Language must follow xx-XX format' unless lang.length is 5 and lang.indexOf('-') is 2

		tmhDynamicLocale.set(lang.toLowerCase()).then (locale) ->
			$translate.use(lang).then -> $rootScope.$broadcast 'localeUpdated.vtex', locale

	@setCurrency = (currency) ->
		currency or= vtex.topbar.utils.config.currency

		throw new Error 'Locale: Currency Code must follow XXX format' if currency.code?.length isnt 3

		currency = vtex.topbar.utils.config.currency
		defaultPatterns =
			gSize: 3
			lgSize: 3
			macFrac: 0
			maxFrac: 2
			minFrac: 2
			minInt: 1
			negPre: "- \u00a4"
			negSuf: ""
			posPre: "\u00a4"
			posSuf: ""

		$locale.NUMBER_FORMATS.CURRENCY_SYM = currency.currencySymbol
		$locale.NUMBER_FORMATS.DECIMAL_SEP = currency.decimalSeparator
		$locale.NUMBER_FORMATS.GROUP_SEP = currency.groupSeparator
		$locale.NUMBER_FORMATS.PATTERNS[1] = currency.ngPatterns or defaultPatterns

		$rootScope.$broadcast 'currencyUpdated.vtex', currency.code


	return this


.run (LocaleService, $window) ->
	LocaleService.setLanguage()
	LocaleService.setCurrency()

	angular.element($window).on 'localeSelected.vtex', (evt, lang) ->
		LocaleService.setLanguage lang
