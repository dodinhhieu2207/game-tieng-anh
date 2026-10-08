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
     activity('u3learn','u3learn'),activity('u3catch','u3catch'),activity('u3mystery','u3mystery'),activity('u3missing','u3missing'),activity('u3match','u3match'),activity('u3trace','u3trace'),activity('u3colour','u3colour')]},
    2:{title:'Is it a ...?',status:'available',targetLanguage:['Is it a ...?','Yes, it is.',"No, it isn't."],activities:[
     activity('meet-pattern','u3pattern',{title:'Meet the Pattern',icon:'flashcards'}),
     activity('question-detective','u3detective',{title:'Question Detective',icon:'question'}),
     activity('match-answer','u3answer',{title:'Match the Answer',icon:'matching'}),
     activity('build-sentence','u3sentence',{title:'Build the Sentence',icon:'sentence'}),
     activity('listen-decide','u3decide',{title:'Listen & Decide',icon:'listening'}),
     activity('talk-to-toy-buddy','u3buddy',{title:'Talk to Toy Buddy'})]},
    3:{title:'Sounds and letters: Gg',description:'Meet G and g. Listen, sort, trace and say girl and guitar.',status:'available',targetLanguage:['G g','girl','guitar'],activities:[
     activity('meet-gg','u3ggmeet',{title:'Meet Gg',icon:'flashcards'}),activity('sound-detective','u3ggsound',{title:'Sound Detective',icon:'listening'}),activity('catch-g','u3ggcatch',{title:'Catch the G',icon:'question'}),activity('big-small','u3ggsort',{title:'Big G or small g?',icon:'matching'}),activity('fix-word','u3ggfix',{title:'Fix the Word',icon:'sentence'}),activity('trace-say','u3ggtrace',{title:'Trace & Say',icon:'book'}),activity('final-challenge','u3ggfinal',{title:'Final Challenge',icon:'question',final:true})]}
   }).map(lesson=>({...lesson,cardImage:`assets/shared-ui/unit3-navigation-lesson${lesson.id}.png`,cardAspect:'2 / 1',selectorLabel:['Toys','Grammar','Sounds and letters','Numbers','Review','Story'][lesson.id-1]}))}
  ],
  // The integrated Ellie lesson has no confirmed textbook lesson assignment.
  migration:[
   {unit:2,lesson:null,game:'elliejourney',group:"Ellie's Classroom Adventure",status:'needs-mapping',reason:'Integrated vocabulary, counting and speaking; not confirmed as the textbook Story.'}
  ],
  independentGames:['letterfly','abcflash']
 };
})();
