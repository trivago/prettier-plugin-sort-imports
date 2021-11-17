import thirdParty0 from "third-party0";
import something3 from "@core/something3";
import thirdDisco0 from "third-disco0";
import otherthing3 from "@core/otherthing3";

import "side-effect-z";

import anotherSameLevelRelativePath3 from "./anotherSameLevelRelativePath3";
import something0 from "@core/something0";
import thirdDisco1 from "third-disco1";
import otherthing0 from "@core/otherthing0";
import sameLevelRelativePath3 from "./sameLevelRelativePath3";
import thirdParty1 from "third-party1";
import oneLevelRelativePath1 from "../oneLevelRelativePath1";
import anotherOneLevelRelativePath1 from "../anotherOneLevelRelativePath1";

import "side-effect-y3";
import "side-effect-y1";
import "side-effect-y2";

import oneLevelRelativePath2 from "../oneLevelRelativePath2";
import anotherOneLevelRelativePath2 from "../anotherOneLevelRelativePath2";
import something2 from "@core/something2";
import thirdParty3 from "third-party3";
import anotherSameLevelRelativePath1 from "./anotherSameLevelRelativePath1";
import sameLevelRelativePath1 from "./sameLevelRelativePath1";
import otherthing2 from "@core/otherthing2";
import thirdDisco3 from "third-disco3";

import "side-effect-x";
import anotherSameLevelRelativePath2 from "./anotherSameLevelRelativePath2";
import sameLevelRelativePath2 from "./sameLevelRelativePath2";
import something1 from "@core/something1";
import oneLevelRelativePath3 from "../oneLevelRelativePath3";
import anotherOneLevelRelativePath3 from "../anotherOneLevelRelativePath3";
import otherthing1 from "@core/otherthing1";
import thirdDisco2 from "third-disco2";
import thirdParty2 from "third-party2";

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent extends BaseComponent {
  title = "ng-prettier";

  override get text(): string {
    return isEmpty(this.title) ? "" : this.title;
  }
}
