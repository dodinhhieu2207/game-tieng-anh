const assert=require('node:assert/strict');
const {test}=require('node:test');
const speech=require('../shared/speech-evaluator.js');

test('family yes/no distinguishes true, false, incomplete and contradictory speech',()=>{
 assert.equal(speech.evaluate('Yes, it is.','mum','mum','family-yes-no').result,'CORRECT');
 assert.equal(speech.evaluate("No, it isn't.",'dad','mum','family-yes-no').result,'CORRECT');
 assert.equal(speech.evaluate('Yes, it is.','dad','mum','family-yes-no').result,'WRONG_LOGIC');
 assert.equal(speech.evaluate("No, it isn't.",'mum','mum','family-yes-no').result,'WRONG_LOGIC');
 assert.equal(speech.evaluate('yes','mum','mum','family-yes-no').result,'INCOMPLETE');
 assert.equal(speech.evaluate('this is my mum','mum','mum','family-yes-no').result,'UNCLEAR');
});
