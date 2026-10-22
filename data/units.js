/* Lesson numbering must be confirmed from the textbook, not inferred from game names. */
(()=>{
 const activity=(id,game,options={})=>({id,game,...options});
 const six=known=>Array.from({length:6},(_,i)=>({id:i+1,title:null,targetLanguage:[],activities:[],status:'planned',locked:false,...known[i+1]}));
 window.LearningConfig={
  units:[
   {id:2,title:"What's this?",space:'unit2',selectorBanner:'assets/shared-ui/unit2-navigation-banner.png',selectorScene:'assets/shared-ui/unit2-navigation-bg.png',navigationCard:'assets/shared-ui/unit2-navigation-card.png',selectorBackground:'assets/shared-ui/unit2-select-bg.png',thumbnail:'assets/unit2-ee/characters/elephant-neutral.png',lessons:six({
    1:{title:'Words',status:'available',description:'School Things',activities:['spin','listen','bag','reveal','missing','match','puzzle','colour'].map(game=>activity(game,game))},
    2:{title:'Grammar',status:'available',description:'Ask, answer and build the sentence.',activities:['sentence','team','race'].map(game=>activity(game,game))},
    3:{title:'Sounds and letters: Ee',status:'available',targetLanguage:['Ee','egg','elephant'],activities:['eeintro','eefind','eetrace','eecolour'].map(game=>activity(game,game))},
    4:{title:'Numbers 5–6',status:'available',targetLanguage:['5 · five','6 · six'],activities:['egglisten','eggcount','numberwords','numberpaint'].map(game=>activity(game,game))},
    5:{title:'Letter Ff',status:'available',targetLanguage:['Ff','fish','farm'],activities:['ffintro','ffsort','fffeed','ffpack','ffbuild','ffmatch','fftrace','ffcolour'].map(game=>activity(game,game))},
    6:{title:'Story',description:'Story activities will be added here.'}
   }).map(lesson=>({...lesson,cardImage:`assets/shared-ui/unit2-navigation-lesson${lesson.id}.png`,cardAspect:'1 / 1.06'}))},
   {id:3,title:'Toy Town',space:'unit3',selectorBanner:'assets/shared-ui/unit3-navigation-banner.png',selectorScene:'assets/shared-ui/unit3-navigation-bg.png',navigationCard:'assets/shared-ui/unit3-navigation-card.png',selectorBackground:'assets/shared-ui/unit3-select-bg.png',thumbnail:'assets/unit3/toys/teddy.webp',lessons:six({
    1:{title:'Toys',status:'available',description:'Meet the plane, puppet, robot, balloon and teddy. Listen, look, remember and match.',activities:[
     activity('u3learn','u3learn',{title:'Say & Play'}),activity('u3catch','u3catch'),activity('u3mystery','u3mystery',{title:'Mystery Box'}),activity('u3missing','u3missing'),activity('u3match','u3match',{title:'Toy Delivery'}),activity('u3trace','u3trace'),activity('u3colour','u3colour')]},
    2:{title:'Is it a ...?',status:'available',targetLanguage:['Is it a ...?','Yes, it is.',"No, it isn't."],activities:[
     activity('meet-pattern','u3pattern',{title:'Meet the Pattern',icon:'flashcards'}),
     activity('question-detective','u3detective',{title:'Question Detective',icon:'question'}),
     activity('match-answer','u3answer',{title:'Answer Islands',icon:'matching'}),
     activity('build-sentence','u3sentence',{title:'Sentence Express',icon:'sentence'}),
     activity('listen-decide','u3decide',{title:'Toy Machine',image:'assets/toy-machine/cabinet.webp',icon:'listening'}),
     activity('talk-to-toy-buddy','u3buddy',{title:'Talk to Toy Buddy'})]},
    3:{title:'Sounds and letters: Gg',description:'Meet G and g. Listen, sort, trace and say girl and guitar.',status:'available',targetLanguage:['G g','girl','guitar'],activities:[
     activity('meet-gg','u3ggmeet',{title:'Learn Gg',image:'assets/unit3/lesson3/art/sign-gg.webp',icon:'flashcards'}),activity('sound-detective','u3ggsound',{title:'Sound Garden',image:'assets/sound-garden/sprout.webp',icon:'listening'}),activity('catch-g','u3ggcatch',{title:'Find Gg',image:'assets/unit3/lesson3/art/bubble-capital.webp',icon:'question'}),activity('big-small','u3ggsort',{title:'Gg Maze Relay',image:'assets/gg-maze-relay/garden.webp',icon:'matching'}),activity('fix-word','u3ggfix',{title:'Build & Say',image:'assets/unit3/lesson3/art/missing-g.webp',icon:'sentence'}),activity('trace-say','u3ggtrace',{title:'Trace & Write',image:'assets/unit3/lesson3/art/trace-pencil.webp',icon:'book'}),activity('final-challenge','u3ggfinal',{title:'My Gg Check',image:'assets/unit3/lesson3/art/trophy.webp',icon:'question',final:true})]}
    ,4:{title:'Numbers 7–8',description:'Count, read and say seven and eight. Review five and six.',status:'available',targetLanguage:['7 · seven','8 · eight'],activities:[
     activity('number-parade','u3nparade',{title:'Number Parade',image:'assets/number-studio/parade/scene.webp',icon:'listening'}),
     activity('toy-detective','u3ndetective',{title:'Toy Detective',image:'assets/toy-detective/badge.webp',icon:'question'}),
     activity('gift-workshop','u3ngift',{title:'Gift Workshop',image:'assets/number-studio/gift/prop.webp',icon:'matching'}),
     activity('number-snap','u3nsnap',{title:'Number Snap',image:'assets/number-studio/snap/prop.webp',icon:'matching'}),
     activity('say-open','u3nsay',{title:'Say & Open',image:'assets/number-studio/book/prop.webp',icon:'question'}),
     activity('toy-relay','u3nrelay',{title:'Toy Town Relay',image:'assets/number-studio/relay/accent.webp',icon:'matching',final:true}),
     activity('toy-catch','u3toycatch',{title:'Toy Catch',image:'assets/toy-catch/buggy.webp',icon:'matching'})]}
    ,5:{title:'Letters and Sounds: Hh and Ii',description:'Hh: hat, horse. Ii: ill, insect.',activities:[activity('meet-hi','u3himeet',{title:'Learn Hh and Ii',image:'assets/unit3/lesson5/lesson-card.webp'}),activity('letter-pond','u3hipond',{title:'Letter Pond',image:'assets/unit3/lesson5/adventure/pond.webp'}),activity('word-mine','u3himine',{title:'Word Mine',image:'assets/word-mine/winch.webp'}),activity('review-ai','letterfly',{title:'A–I Word Builder',image:'assets/unit3/lesson5/letters/ii-badge.svg'})],targetLanguage:['Hh','hat','horse','Ii','ill','insect'],status:'available',cardImage:'assets/unit3/lesson5/lesson-card.webp',selectorLabel:'Letters and Sounds',assetPreview:{background:'assets/unit3/lesson5/background.webp',gallery:'assets/unit3/lesson5/catalog.html',groups:[{letter:'Hh',badge:'assets/unit3/lesson5/letters/hh-badge.svg',words:[{word:'hat',image:'assets/unit3/lesson5/words/hat.webp'},{word:'horse',image:'assets/unit3/lesson5/words/horse.webp'}]},{letter:'Ii',badge:'assets/unit3/lesson5/letters/ii-badge.svg',words:[{word:'ill',image:'assets/unit3/lesson5/words/ill.webp',alt:'A child feeling ill'},{word:'insect',image:'assets/unit3/lesson5/words/insect.webp?v=20261020-ladybug'}]}]}}
    ,6:{title:'Story',description:'Listen, act and put the story in order.',status:'available',targetLanguage:['Is it a teddy bear?','Is it a plane?','Is it a robot?',"No, it isn’t.",'Yes, it is.',"It’s a robot."],activities:[activity('story-preview','u3storypreview',{title:'Story Studio',image:'assets/unit3/lesson6/sample/scene-01.webp',icon:'book'}),activity('your-turn','u3storyturn',{title:'Your Turn',image:'assets/unit3/lesson6/games/mic.webp',icon:'question'}),activity('story-mix-up','u3storymix',{title:'Story Mix-Up',image:'assets/unit3/lesson6/story/scene-04.webp',icon:'matching'}),activity('story-stage','u3storystage',{title:'Story Stage',image:'assets/unit3/lesson6/stage/medal.webp',icon:'question'})],cardImage:'assets/unit3/lesson6/sample/scene-01.webp',selectorLabel:'Story'}
   }).map(lesson=>({...lesson,cardImage:lesson.cardImage||`assets/shared-ui/unit3-navigation-lesson${lesson.id}.png`,cardAspect:'2 / 1',selectorLabel:lesson.selectorLabel||['Toys','Grammar','Sounds and letters','Numbers','Review','Story'][lesson.id-1]}))}
  ],
  // The integrated Ellie lesson has no confirmed textbook lesson assignment.
  migration:[
   {unit:2,lesson:null,game:'elliejourney',group:"Ellie's Classroom Adventure",status:'needs-mapping',reason:'Integrated vocabulary, counting and speaking; not confirmed as the textbook Story.'}
  ],
  independentGames:['letterfly','abcflash']
 };
})();
