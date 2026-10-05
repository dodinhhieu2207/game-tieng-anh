/* Static-host-safe routes. No pathname rewriting, fetch or build step. */
(()=>{
 const parse=hash=>{
  const [path,query='']=(hash||'#/').replace(/^#/,'').split('?');const parts=path.split('/').filter(Boolean),params=new URLSearchParams(query);
  if(!parts.length)return {screen:'home'};
  if(parts[0]==='letters')return parts[1]==='game'?{screen:'letter-game',game:parts[2]}:{screen:'letters'};
  if(parts[0]!=='unit'||!/^\d+$/.test(parts[1]||''))return {screen:'unknown'};
  const route={screen:'unit',unit:Number(parts[1])};
  if(parts[2]==='existing')return {...route,screen:'existing',group:params.get('group')||'',game:params.get('game')||null};
  if(parts[2]==='lesson'&&/^[1-6]$/.test(parts[3]||''))return {...route,screen:'lesson',lesson:Number(parts[3]),mode:params.get('mode')==='class'?'class':'practice',activity:params.get('activity')};
  return parts.length===2?route:{screen:'unknown'};
 };
 let listener=()=>{},last='';
 const notify=()=>{const hash=location.hash||'#/';if(hash===last)return;last=hash;listener(parse(hash));};
 window.LearningRouter={parse,start(fn){listener=fn;addEventListener('hashchange',notify);if(!location.hash)history.replaceState(null,'','#/');notify();},go(hash,{replace=false}={}){if(replace){history.replaceState(null,'',hash);last='';notify();}else if(location.hash===hash){last='';notify();}else{location.hash=hash;notify();}}};
})();
