(() => {
  const game = 'u4pictureclue';
  const art = 'assets/unit4/lesson6/clues/';
  const panel = number => art + 'scene-' + number + '.webp?v=source-sharp';
  const rounds = [
    {clue: 1, scene: 1, person: 'grandpa'},
    {clue: 2, scene: 2, person: 'mum'},
    {clue: 3, scene: 4, person: 'brother'}
  ];

  function enter() {
    let index = 0;
    let awarded = false;

    function render() {
      window.Unit4StoryAudio.stop();
      const round = rounds[index];
      setStage(`<section class="picture-clue">
        <header><h2>Picture Clue Challenge</h2><span>${index + 1} / ${rounds.length}</span></header>
        <div class="picture-clue-board">
          <div class="picture-clue-view">
            <img src="${panel(round.clue)}" alt="A close-up from the story" data-clue-panel="${round.clue}">
          </div>
          <div class="picture-clue-copy">
            <h3 tabindex="-1" data-clue-prompt>Who’s this?</h3>
            <p data-clue-line>Say your guess aloud.</p>
            <button type="button" data-clue-model hidden>Hear the sentence</button>
            <button type="button" data-clue-action>Show the picture</button>
            <p class="u4-story-status" role="status"></p>
          </div>
        </div>
      </section>`);
      const stage = document.querySelector('.picture-clue');
      const image = stage.querySelector('img');
      const title = stage.querySelector('[data-clue-prompt]');
      const line = stage.querySelector('[data-clue-line]');
      const button = stage.querySelector('[data-clue-action]');
      const hear = stage.querySelector('[data-clue-model]');
      hear.onclick=()=>window.Unit4StoryAudio.model(round.person,hear,stage.querySelector('[role=status]'),title);
      button.onclick = () => {
        if (stage.dataset.revealed) {
          window.Unit4StoryAudio.stop();
          if (index + 1 < rounds.length) {
            index++;
            render();
            document.querySelector('[data-clue-prompt]').focus();
          } else {
            stage.querySelector('.picture-clue-board').innerHTML =
              '<div class="picture-clue-copy"><h3 tabindex="-1">Story clues complete!</h3><button type="button">Play again</button></div>';
            stage.querySelector('h3').focus();
            stage.querySelector('button').onclick = enter;
            if (!awarded) {
              awarded = true;
              document.dispatchEvent(new CustomEvent('learning:activity-completed', {detail: {game, stars: 3}}));
            }
          }
          return;
        }
        stage.dataset.revealed = 'true';
        image.src = panel(round.scene);
        image.alt = 'Story scene with my ' + round.person;
        title.textContent = 'This is my ' + round.person + '.';
        line.textContent = 'Point and say the sentence.';
        hear.hidden = false;
        button.textContent = index + 1 === rounds.length ? 'Finish' : 'Next clue';
        title.focus({preventScroll:true});
      };
    }

    render();
    restartCurrent = enter;
  }

  games[game] = {enter};
  GAME_META[game] = ['UNIT 4 · LESSON 6', 'Picture Clue Challenge', 'Look, guess and speak'];
})();
