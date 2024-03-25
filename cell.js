let aknaSzam = 0;
let aknakSzama = 0.5;

function Cell(i, j, w){ 
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w; //Egy cella szélessége + magassága (mert négyzet)
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

