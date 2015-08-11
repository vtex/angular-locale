# Angular Locale
Currency and Locale manager for AngularJS

## Usage

### Reference script
```html
<script src="angular-locale.min.js"></script>
```

### Inject `vtex.ngLocale`
```coffeescript
angular.module 'yourApp', ['vtex.ngLocale']
```

### Events
#### localeSelected.vtex
- `LocaleService` automatically **listens** to this and expects `lang` arguments.
- `lang` follows 'xx-XX' format, e.g.: 'en-US'.
- Therefore both `tmhDynamicLocale` and `$translate` (in this order) are called and updated with new i18n data.

#### localeUpdated.vtex
- `LocaleService` **triggers** this once it has set `$translate` to use new language and i18n is updated.
Obs: `setCurrency` is called everytime language/locale gets updated, since it will reset `$locale.NUMBER_FORMATS` each time.

#### currencyUpdated.vtex
- `LocaleService` **triggers** this once it has set `$locale` according to current currency configuration.

### API `LocaleService`
#### setLanguage language
- string `eventName`, Object `data` with any information you want to be registered within the event

#### setCurrency currencyConfiguration
- currencyConfiguration `Object` for United States Dollar:

```coffeescript
currencySymbol: '$ '
decimalSeparator: ','
groupSeparator: '.'
ngPatterns:
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
```

This gets mapped into Angular's `$locale`:

```coffeescript
$locale.NUMBER_FORMATS.CURRENCY_SYM = currencyConfiguration.currencySymbol
$locale.NUMBER_FORMATS.DECIMAL_SEP = currencyConfiguration.decimalSeparator
$locale.NUMBER_FORMATS.GROUP_SEP = currencyConfiguration.groupSeparator
$locale.NUMBER_FORMATS.PATTERNS[1] = currencyConfiguration.ngPatterns
```

*Obs:* ngPatterns/NUMBER_FORMATS.PATTERNS[1] has a default value, no worries :)

### Development
Inside `src` you can find this module source code, written in **CoffeeScript**. To build the `.js` and uglify it, install npm dev-dependencies and run grunt:

    (sudo) npm i
    grunt
