"""Higgs diagnostic negatives; not student vocabulary or pronunciation gold."""
import json
import build_unit4_lesson1_audio as b
b.OUT=b.ROOT/'tests/fixtures/jj-asr'
b.TEXTS={'jack':'Jack.','jog':'Jog.','jacket':'Jacket.'}
if __name__=='__main__':
 b.transcript_ok=lambda key,text:b.norm(text)==b.norm(b.TEXTS[key])
 b.main()
 (b.OUT/'clips.js').unlink(missing_ok=True)
