//@ts-ignore
// I am file top level comments
import threeLevelRelativePath from "../../../threeLevelRelativePath";
// I am stick to sameLevelRelativePath
import sameLevelRelativePath from "./sameLevelRelativePath";
// I am stick to third party comment
import thirdParty from "third-party";
// leading comment
import { 
    random // inner comment
} from './random';
// leading comment
export { 
    random // inner comment
} from './random';
import c from 'c';
import oneLevelRelativePath from "../oneLevelRelativePath";
import otherthing from "@core/otherthing";
import a from 'a';
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
export default {
    title: 'hello',
};
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";
import x from 'x';

// I am function comment

function add(a:number,b:number) {
  return a + b; // I am inside function 
}
