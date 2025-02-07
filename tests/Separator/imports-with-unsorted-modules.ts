import z from 'z';
import { isEmpty, concat, flatten } from "lodash-es";
import threeLevelRelativePathA, { nonDefaultModuleC, nonDefaultModuleA, nonDefaultModuleB } from "../../../threeLevelRelativePathA";
import * as allThreeLevelRelativePathBModules from "../../../threeLevelRelativePathB";
import threeLevelRelativePathC, {
  nonDefaultModuleC as nonConflictingModuleNameC,
  nonDefaultModuleA as nonConflictingModuleNameA,
  nonDefaultModuleB as nonConflictingModuleNameB,
  nonDefaultModuleE,
  nonDefaultModuleD
} from "../../../threeLevelRelativePathC";
import sameLevelRelativePath from "./sameLevelRelativePath";
import thirdParty from "third-party";
import oneLevelRelativePath from "../oneLevelRelativePath";
import otherthing from "@core/otherthing";
import abc from "@core/abc";
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";
import xyz from "@ui/xyz";

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "ng-prettier";

  get text(): string {
    return isEmpty(this.title) ? "" : this.title;
  }
}
