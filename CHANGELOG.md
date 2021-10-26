## Changelog

---

### v3.0.0

#### New features
- `<THIRD_PARTY_MODULES>` special word in import order to place third
party imports at desired place. #65 by @risenforces
- `importOrderSortSpecifiers` option to sort the imports in an import declaration. #72 by @ratierd
- `importOrderCaseInsensitive` option to control the case sensitivity #69 by @timiles 
- `importOrderParserPlugins` option to pass plugins to babel parser #88 by @saaryab 

#### Breaking Changes
- Renaming of the `experimentalBabelParserPluginsList` to `importOrderParserPlugins`. by @byara

