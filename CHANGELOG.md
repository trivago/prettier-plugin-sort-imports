## Changelog


---
### 5.2.2
- Update packages and pin babel/types [#343](https://github.com/trivago/prettier-plugin-sort-imports/pull/343) by [@byara](https://github.com/byara)

### 5.2.1
- add svelte 5.x as peer dependency [#337](https://github.com/trivago/prettier-plugin-sort-imports/pull/337) by [@werner-drklein](https://github.com/werner-drklein)

### 5.2.0
- fix type import ordering [#331](https://github.com/trivago/prettier-plugin-sort-imports/pull/331) by [@rsslldnphy](https://github.com/rsslldnphy) 
- Fix conditional import of prettier-plugin-svelte [#332](https://github.com/trivago/prettier-plugin-sort-imports/pull/332) by [@rsslldnphy](https://github.com/rsslldnphy)

### v5.1.0
- Fix svelte packages being required all the time [#327](https://github.com/trivago/prettier-plugin-sort-imports/pull/327) by [@byara](https://github.com/byara)

### v5.0.1
- Clean up unwanted packages and unpin dependencies [#322](https://github.com/trivago/prettier-plugin-sort-imports/pull/322) by [@byara](https://github.com/byara)

### v5.0.0
#### New features
- Type imports [#153](https://github.com/trivago/prettier-plugin-sort-imports/pull/153) by [Xenfo](https://github.com/broofa)
- Svelte support [#310](https://github.com/trivago/prettier-plugin-sort-imports/pull/310) by [canarddemagret](https://github.com/canarddemagret)
- Side effect import support [#320](https://github.com/trivago/prettier-plugin-sort-imports/pull/320) by [blutorange](https://github.com/blutorange) and [vladislavarsenev](https://github.com/vladislavarsenev)
- Fixed dollar sign group replace in Vue [#283](https://github.com/trivago/prettier-plugin-sort-imports/pull/283) by [adamDilger](https://github.com/adamDilger)
- Support `importOrderImportAttributesKeyword` [#273](https://github.com/trivago/prettier-plugin-sort-imports/pull/273) by [chentsulin](https://github.com/chentsulin)


### v4.3.0
#### New features
- added support for sort-imports-ignore [#237](https://github.com/trivago/prettier-plugin-sort-imports/pull/237) by [stephdotnet](https://github.com/stephdotnet)
- Upgrade node in CI to current and lts versions [#264](https://github.com/trivago/prettier-plugin-sort-imports/pull/264) by [harryzcy](https://github.com/harryzcy)

### v4.2.1
#### Chore
- Resolves Issue 262 - CVE-2023-45133 - upgrade to latest babel traverse [#266](https://github.com/trivago/prettier-plugin-sort-imports/pull/266) by [c-h-russell-walker](https://github.com/c-h-russell-walker)

### v4.2.0
#### Chore
- update prettier peer dependency semVer to include 3.x [#239](https://github.com/trivago/prettier-plugin-sort-imports/pull/239) by [basselworkforce](https://github.com/basselworkforce)

### v4.1.1
#### Revert
- Type imports[#153](https://github.com/trivago/prettier-plugin-sort-imports/pull/153) by [Xenfo](https://github.com/broofa)

### v4.1.0
#### New features
- Move @babel/core to devDependencies  [#200](https://github.com/trivago/prettier-plugin-sort-imports/pull/200) by [yykamei](https://github.com/yykamei)
- Only preserve directives already at the start of the program [#198](https://github.com/trivago/prettier-plugin-sort-imports/pull/198) by [c-dante](https://github.com/c-dante) 
- Bump babel to support satisfies keyword [#196](https://github.com/trivago/prettier-plugin-sort-imports/pull/196) by [Leomotors](https://github.com/Leomotors)
- Update prettier for TS 4.9 [#194](https://github.com/trivago/prettier-plugin-sort-imports/pull/194) by [taiwabisabi](https://github.com/taiwabisabi) 
- Fixed empty/no script tag in vue component error [#192](https://github.com/trivago/prettier-plugin-sort-imports/pull/192) by [adamDilger](https://github.com/adamDilger)
- Change @vue/compiler-sfc to an optional dependency[#189](https://github.com/trivago/prettier-plugin-sort-imports/pull/189) by [transitive-bullshit](https://github.com/transitive-bullshit)
- Type imports[#153](https://github.com/trivago/prettier-plugin-sort-imports/pull/153) by [Xenfo](https://github.com/broofa)

### v4.0.0
#### New features
- Make @vue/compiler-sfc peer dependency [#183](https://github.com/trivago/prettier-plugin-sort-imports/pull/183) by [blake-newman](https://github.com/blake-newman)
- Keep script directives at top of file [#186](https://github.com/trivago/prettier-plugin-sort-imports/pull/186) by [broofa](https://github.com/broofa)

### v3.4.0
#### New features
- Vue JS support [#174](https://github.com/trivago/prettier-plugin-sort-imports/pull/174) by [blake-newman](https://github.com/blake-newman)
- Export config type [#173](https://github.com/trivago/prettier-plugin-sort-imports/pull/173) by [Leomotors](https://github.com/Leomotors)

### v3.3.1
#### Chores
- Update @babel/parser (to support TypeScript 4.7) [#161](https://github.com/trivago/prettier-plugin-sort-imports/pull/161) by [odiak](https://github.com/odiak)

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

