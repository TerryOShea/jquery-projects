class HanoiView{
  constructor(game, $el){
    this.game = game;
    this.el = $el;
    this.setupTowers();
    let colorOffset = Math.floor(Math.random() * 120);
    this.largeColor = `hsl(${colorOffset}, 100%, 50%)`;
    this.mediumColor = `hsl(${colorOffset + 120}, 100%, 50%)`;
    this.littleColor = `hsl(${colorOffset + 240}, 100%, 50%)`;
  }
  setupTowers(){
    for(let i = 0; i<3; i++){
      let $tower = $(`<ul class="tower-${i}"></ul>`);
      for(let j = 2; j>=0; j--){
        let block = $("<li></li>").attr("pos", `${i}, ${j}`);
        $tower.append(block);
      }
      this.el.append($tower);
      $tower.on("click", event => {
        this.clickTower(i);
      });
    }
  }
  render(){
    $("li").removeClass("little medium large");
    const towers = this.game.towers;

    towers.forEach((tower, i) => {
      for (let j = 0; j < 3; j++) {
        if(tower[j]){
          let $block = $(`li[pos*='${i}, ${j}']`);
          if (tower[j] === 1){
            $block.addClass("little");
            $block.css('background', this.littleColor);
          }else if (tower[j] === 2){
            $block.addClass("medium");
            $block.css('background', this.mediumColor);
          }else{
            $block.addClass("large");
            $block.css('background', this.largeColor);
          }
        }
      }
    });
  }
  clickTower(clickedTower){
    if(Number.isInteger(this.fromTower)){
      $(".highlighted").removeClass("highlighted");
      if(this.game.move(this.fromTower, clickedTower)){
        this.render();
        if (this.game.isWon()){
          alert("You won!! stop moving");
        }
      } else {
        alert("not valid move");
      }
      this.fromTower = undefined;
    } else {
      $(`.tower-${clickedTower}`).addClass('highlighted');
      this.fromTower = clickedTower;
      console.log(this.fromTower);
    }
  }
}


module.exports = HanoiView;
