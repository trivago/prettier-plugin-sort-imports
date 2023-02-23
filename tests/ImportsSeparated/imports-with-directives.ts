'use strict';
'use client';

// comment after directives
import otherthing from "@core/otherthing";
import abc from "@core/abc";

// Comment

function add(a:number,b:number) {
  return a + b;
}

function addStrict(a:number,b:number) {
  'use strict';
  return a + b;
}

'preserve me';

const workletAdd = (a:number,b:number) => {
  'worklet';
  return a + b;
}

(function() {
  'use strict';
  // some iffe example
  return true;
})();
