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

		$locale.NUMBER_FORMATS.CURRENCY_SYM = currency.configuration.currencySymbol
		$locale.NUMBER_FORMATS.DECIMAL_SEP = currency.configuration.decimalSeparator
		$locale.NUMBER_FORMATS.GROUP_SEP = currency.configuration.groupSeparator
		$locale.NUMBER_FORMATS.PATTERNS[1] = currency.configuration.ngPatterns

		$rootScope.$broadcast 'currencyUpdated.vtex', currency.code


	return this


.run ($rootScope, $window, LocaleService) ->
	LocaleService.setLanguage()

	$rootScope.$on 'localeUpdated.vtex', ->
		LocaleService.setCurrency()

	angular.element($window).on 'localeSelected.vtex', (evt, lang) ->
		LocaleService.setLanguage lang
