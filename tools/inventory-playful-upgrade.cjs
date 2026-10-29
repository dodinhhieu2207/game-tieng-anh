/* Generate the route inventory from the app's actual configuration. No scores modified. */
const fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('data/units.js','utf8'),context);
const config=context.window.LearningConfig;
const status=fs.existsSync('docs/design/GAME_UPGRADE_STATUS.json')?JSON.parse(fs.readFileSync('docs/design/GAME_UPGRADE_STATUS.json','utf8')).upgrades:{};
const entries=config.units.flatMap(u=>u.lessons.flatMap(l=>l.activities.map(a=>({unit:u.id,lesson:l.id,id:a.id,game:a.game,title:a.title||a.id,route:`#/unit/${u.id}/lesson/${l.id}?mode=practice&activity=${a.id}`,upgrade:status[a.game]||null,status:status[a.game]?'targeted changes locally validated':a.game==='u4familyswitch'?'pilot-local':'foundation-only; individual review pending'}))));
for(const game of config.independentGames)entries.push({group:'Letter Land / independent',game,route:'#/letters/game/'+game,status:'foundation-only; individual review pending'});
for(const m of config.migration)entries.push({...m,route:`#/unit/${m.unit}/existing?group=${encodeURIComponent(m.group)}`,status:'mapping retained; individual review pending'});
fs.mkdirSync('docs/design',{recursive:true});
fs.writeFileSync('docs/design/GAME_UPGRADE_INVENTORY.json',JSON.stringify({date:'2026-10-29',scope:'All existing games, including original Letter Land registry; not all individually upgraded',entries},null,2)+'\n');
console.log(`${entries.length} configured entries inventoried; inspect live games registry separately for Letter Land subactivities.`);
