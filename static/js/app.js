class BoggleGame {
    // Make a new game at this DOM id
    constructor(boardId, secs = 60) {
      this.secs = secs; // game length
      this.showTimer();
  
      this.score = 0;
      this.words = new Set();
      this.board = $("#" + boardId);
  
      // Every 1000msec, "tick"
      this.timer = setInterval(this.tick.bind(this), 1000);
  
      $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }
  
    // Shows word in list of words
    showWord(word) {
      $(".words", this.board).append($("<li>", { text: word }));
    }
  
    // Shows score in html
    showScore() {
      $(".score", this.board).text(this.score);
    }
  
    // Shows a status message
    showMessage(msg, cls) {
      $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }
  
    // Handles submission of word: if unique and valid, score & show
    async handleSubmit(evt) {
      evt.preventDefault();
      const $word = $(".word", this.board);
  
      let word = $word.val();
      if (!word) return;
  
      if (this.words.has(word)) {
        this.showMessage(`Already found ${word}`, "err");
        return;
      }
  
      // Checks server for validity
      const resp = await axios.get("/check-word", { params: { word: word }});
      if (resp.data.result === "not-word") {
        this.showMessage(`${word} is not a valid English word`, "err");
      } else if (resp.data.result === "not-on-board") {
        this.showMessage(`${word} is not a valid word on this board`, "err");
      } else {
        this.showWord(word);
        this.score += word.length;
        this.showScore();
        this.words.add(word);
        this.showMessage(`Added: ${word}`, "ok");
      }
    
      $word.val("").focus();

    }
  
  // Updates timer
    showTimer() {
      $(".timer", this.board).text(this.secs);
    }
  
  // Handles countdown
    async tick() {
      this.secs -= 1;
      this.showTimer();
  
      if (this.secs === 0) {
        clearInterval(this.timer);
        await this.scoreGame();
      }
    }
  
   // End of game/timer score updates
    async scoreGame() {
      $(".add-word", this.board).hide();
      const resp = await axios.post("/post-score", { score: this.score });
      if (resp.data.brokeRecord) {
        this.showMessage(`New record: ${this.score}`, "ok");
      } else {
        this.showMessage(`Final score: ${this.score}`, "ok");
      }
    }
  }
;

// Makes game board interactive
word = [];
const input = $('#input')
const select = $('td')
// When letter is clicked, add to input box
select.on('click', function(e) {
  const letter = (e.target.innerText);
  word.push(letter.toLowerCase());
  guess = word.join('')
  input.val(guess);
  input.focus();
})
// Clears input field after button is clicked
const button = $('#btn')
button.on('click', function(e) {
  word = [];
})
input.on('keydown', function(e) {
  if (e.key == 'Backspace') {
    word = [];
  }
})