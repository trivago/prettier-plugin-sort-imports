## Changelog


---
### v3.3.0
#### Chores
- Update babel version [#134](https://github.com/trivago/prettier-plugin-sort-imports/pull/147) by [marvinroger](https://github.com/marvinroger)
- Fix typo in Migration docs [#158](https://github.com/trivago/prettier-plugin-sort-imports/pull/158) by [raineorshine](https://github.com/raineorshine)

### v3.2.0
#### New features
- Group Namespace specifiers [#105](https://github.com/trivago/prettier-plugin-sort-imports/pull/105) by [Mattinton](https://github.com/Mattinton)

#### Chores
- Clean up unit test and snapshot test
- Add contribution guidelines for bug fixes and new features

### v3.1.1

- Fixes package management [#100](https://github.com/trivago/prettier-plugin-sort-imports/issues/100)

### v3.1.0

#### Chores
- Update Babel parser to `7.14.6` [#79](https://github.com/trivago/prettier-plugin-sort-imports/pull/79) by [juanrgm](https://github.com/juanrgm)
- `.npmignore` cleanup [#96](https://github.com/trivago/prettier-plugin-sort-imports/issues/96) by [byara](https://github.com/byara)
- Remove npm badges in the README  [#101](https://github.com/trivago/prettier-plugin-sort-imports/issues/101) by [byara](https://github.com/byara)

### v3.0.0

#### New features
- `<THIRD_PARTY_MODULES>` special word in import order to place third
party imports at desired place. [#65](https://github.com/trivago/prettier-plugin-sort-imports/pull/65) by [@risenforces](https://github.com/risenforces)
- `importOrderSortSpecifiers` option to sort the imports in an import declaration. [#72](https://github.com/trivago/prettier-plugin-sort-imports/pull/72) by [@ratierd](https://github.com/ratierd)
- `importOrderCaseInsensitive` option to control the case sensitivity [#69](https://github.com/trivago/prettier-plugin-sort-imports/pull/79) by [@timiles](https://github.com/timiles) 
- `importOrderParserPlugins` option to pass plugins to babel parser [#88](https://github.com/trivago/prettier-plugin-sort-imports/pull/88) by [@saaryab](https://github.com/saaryab) 

#### Breaking Changes
- Renaming of the `experimentalBabelParserPluginsList` to `importOrderParserPlugins`. by [@byara](https://github.com/byara)

