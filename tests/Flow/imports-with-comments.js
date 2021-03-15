/**
 * @flow
 */

// I am top level comment in this file.
import { type Something } from './__generated__/';
import threeLevelRelativePath from "../../../threeLevelRelativePath";
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

const handleChange = (value: ?string) => {}

export type AliasFoo3  = {
  givesANum(): number
};
export function givesAFoo3Obj(): AliasFoo3 {
  return {
    givesANum(): number { return 42; }
  };
};
