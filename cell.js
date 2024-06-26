function Cell(i, j, w){ 
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w; //Egy cella szélessége + magassága (mert négyzet)
    this.neighborCount = 0;

    this.akna = false
    this.revealed = false;
}

//Lerajzoljuk minden cella fajtát.
Cell.prototype.show = function(){
    stroke(0);
    strokeWeight(2);
    if(this.revealed){ //Ha felvan fedve egy cella
        if(this.akna){ //és az egy akna
            fill(255, 0, 0); //színezzük a hátteret pirosra
            rect(this.x, this.y, this.w, this.w); //egy négyzet segítségével ami a bomba alatt van
            strokeWeight(1,3);
            fill(40, 40, 40); //bomba színe
            ellipse(this.x + this.w*0.5, this.y + this.w*0.5, this.w*0.5); //és egy karikát (bombát) rajzolunk bele
        } else{ //vagy üres (lehet szám)
            fill(232, 232, 232); //színezzük
            rect(this.x, this.y, this.w, this.w); //a cellát
            if (this.neighborCount > 0) {
                textAlign(CENTER);
                textSize(21);
                //textStyle(BOLD);
                noStroke();
                var textColor;
                //Switch case szerkezet ami különböző számokat különböző színnel színezi
                switch (this.neighborCount) {
                    case 1:
                        textColor = color(0, 0, 255); //Kék
                        break;
                    case 2:
                        textColor = color(0, 128, 0); //Zöld
                        break;
                    case 3:
                        textColor = color(255, 0, 0); //Piros 
                        break;
                    case 4:
                        textColor = color(0, 0, 0); //Fekete 
                        break;
                    case 5:
                        textColor = color(128, 0, 128); //Lila 
                        break;
                    case 6:
                        textColor = color(255, 165, 0); //Narancssárga 
                        break;
                    case 7:
                        textColor = color(255, 255, 0); //Sárga 
                        break;
                    case 8:
                        textColor = color(255); //Fehér 
                        break;
                    default:
                        textColor = color(0); //Alapértelmezett szín
                }
                fill(textColor);
                text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 8); //Mozgatjuk a számot a cella közepére
            }
        }
    } else { //vagy jobb klikkel "flaggeljük"
        if(this.flagged){
            
            fill(179, 179, 179);
            rect(this.x, this.y, this.w, this.w);
            text('🚩', this.x + this.w*0.5, this.y + this.w*0.7, this.w*0.3);
        } else { //alapértelmezett cella
            fill(179, 179, 179); 
            rect(this.x, this.y, this.w, this.w);
        }
    } 
}

//Egy funkció ami megnézi egy cella körül hogy mennyi akna van és kiír egy számot a cella közepére
Cell.prototype.countAknak = function(){
    if(this.akna){
        this.neighborCount = -1;
        return;
    }
    var total = 0;
    //Minden szomszédos cellát megnéz 
    for(var xoff = -1; xoff <= 1; xoff++){
        for(var yoff = -1; yoff <= 1; yoff++){
            var i = this.i + xoff;
            var j = this.j + yoff;
            if(i > -1 && i < cols && j > -1 && j < rows){
                var neighbor = grid[i][j];
                if(neighbor.akna){
                total++;
                }      
            }
        }
    }
    this.neighborCount = total;
}

//Egy funkciót ami ellenőrzi hogy egy pont benne van-e a cellában
Cell.prototype.contains = function(x, y){
    return(x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w)
}

//Egy funkció, ami ellenőrzi 
Cell.prototype.toggleFlag = function(){
    if(!this.revealed){ //hogy még nincs felfedezve
        this.flagged = !this.flagged; //a flaggelt cellát visszaállítsa nem flaggelt cellára (felfedezetlen cella)
    }
}

//Egy funkció ami felfedi az adott cellát
Cell.prototype.reveal = function() {
    if (this.revealed || gameOver) {
        return; // Ha már felfedték vagy a játék véget ért, ne tegyen semmit
    }
    // Ha zászlót fedünk fel, növeljük a bomba számlálót
    if (this.flagged) {
        this.toggleFlag();
        increaseMineCount(); 
    }
    this.revealed = true;
    if (this.akna) {
        revealAllBombs();
        gameOver = true;
        clearInterval(timerId);
        // Itt kezeljük, ha aknára kattintottak. Például megjeleníthetünk egy üzenetet.
        alert('Sajnálom, vesztettél! Aknára léptél.');
    } else {
        // Növeljük a biztonságosan felfedezett cellák számát
        safeCellsRevealed++;
        if (this.neighborCount == 0) {
            this.floodFill();
        }
    }

    // Ellenőrizzük a győzelmi feltételt
    checkWinCondition();
};


//Ugyanazt az elméletet használjuk a flood fillhez mint a szomszédos számokhoz
Cell.prototype.floodFill = function(){
    for(var xoff = -1; xoff <= 1; xoff++){
        for(var yoff = -1; yoff <= 1; yoff++){
            var i = this.i + xoff;
            var j = this.j + yoff;
            if(i > -1 && i < cols && j > -1 && j < rows){
                var neighbor = grid[i][j];
                //Ha a szomszédos cella nem akna és nem felfedezett
                if(!neighbor.akna && !neighbor.revealed){
                    //Akkor felfedjük
                    neighbor.reveal();
                }      
            }
        }
    }
}


function checkWinCondition() {
    var unrevealedCells = 0;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (!grid[i][j].revealed) {
                unrevealedCells++;
            }
        }
    }

    if (unrevealedCells === osszesAkna) {
        if (!gameOver == true) { 
        gameOver = true;
        clearInterval(timerId);
        alert('Gratulálok! Megnyerted a játékot ' + document.getElementById('elapsedTime').textContent + ' alatt!');
        }
    }
}
