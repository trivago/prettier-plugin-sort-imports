// top comment
import {
    aLetter,
    zLetter, // in-between comment
    bLetter,
} from './random';
export default {
    title: 'hello',
};
// fourth level import comment
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
// some comment
import something from "@server/something";
/**
 * there is a block comment
 */
import {
    a,
    c, // this is c
    j, // this is j
    q,
    b,
    d, // this is d
} from 'xkcd';

import {
    dayCalendarPath,
    weekCalendarPath,
    monthCalendarPath,
    agendaCalendarPath,
  } from "../path_helpers/calendar_paths";

// function comment
function add(a:number,b:number) {
  return a + b; // I am inside function
}
