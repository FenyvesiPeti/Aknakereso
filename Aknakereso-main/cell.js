let aknaSzam = 0;
let aknakSzama = 0.5;

function Cell(i, j, w){ 
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w; //Egy cella szélessége + magassága (mert négyzet)
    this.aknakCount = 0;
    if(random(1) < aknakSzama){ //Megmondjuk hogy mennyi akna legyen a táblában
        this.akna = true;
        aknaSzam++; //Ezt eltároljuk, hogy a "Hátralévő aknák száma"-t kitudjuk írni
    } else //Magákat az aknákat + felderített mezőket nem jelenítjük meg
    {
        this.akna = false;
    }
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
            fill(166, 166, 166); //színezzük
            rect(this.x, this.y, this.w, this.w); //a cellát
            textAlign(CENTER);
            fill(0);
            //beallitja a szoveg szint attol fuggoen, hogy mennyi szomszedja van
            if (this.aknakCount === 0) {
                fill(64); 
            } else if (this.aknakCount === 1) {
                fill(0, 0, 255); 
            } else if (this.aknakCount === 2) {
                fill(0, 128, 0); 
            } else if (this.aknakCount === 3) {
                fill(255, 0, 0); 
            } else if (this.aknakCount === 4) {
                fill(0, 0, 128); 
            } else if (this.aknakCount === 5) {
                fill(139, 69, 19); 
            } else if (this.aknakCount === 6) {
                fill(0, 128, 128); 
            } else if (this.aknakCount === 7) {
                fill(0); 
            } else if (this.aknakCount === 8) {
                fill(128); 
            }
            text(this.aknakCount, this.x + this.w * 0.5, this.y + this.w * 0.75);   //eltolja a megfelelő helyre a számlálót
            //a számok méretét, betűtípusát állítom
            textSize(25);
            textStyle(BOLD);
        }
    } else { //vagy jobb klikkel "flaggeljük"
        if(this.flagged){
            fill(255, 255, 0);
            rect(this.x, this.y, this.w, this.w);
        } else { //alapértelmezett cella
            noFill(); 
            rect(this.x, this.y, this.w, this.w);
        }
    } 
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
Cell.prototype.reveal = function(){
    this.revealed = true;
}

//Szomszed aknak meszamolasa
Cell.prototype.countAknak = function () {
    if (this.akna) {
        return -1;
    }
    var total = 0;
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (this.i + i > -1 && this.i + i < cols && this.j + j > -1 && this.j + j < rows) {    //figyelmen kivul hagyja ha egy szomszéd kívül esik a táblán
                var neighbor = grid[this.i+i][this.j+j];
                if (neighbor.akna) {
                    total++;
                }
            }
        }
    }
    //elegánsabb, de több sor :)
    //for (var xoff = -1; xoff <= 1; xoff++) {
    //    for (var yoff = -1; yoff <= 1; yoff++) {
    //        var i = this.i + xoff;
    //        var j = this.j + yoff;
    //        if (i > -1 && i < cols && j > -1 && j < rows) {
    //            var neighbor = grid[i][j];
    //            if (neighbor.akna) {
    //                total++;
    //            }
    //        }
    //    }
    //}
    console.log(total);
    this.aknakCount = total;
}