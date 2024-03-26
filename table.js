//2 dimenziós tömb, amiben eltároljuk az osszes cellát (grid)
function create2DArray(cols, rows){ 
    var arr = new Array(cols); //minden oszlopra 
    for(var i = 0; i < arr.length; i++){
        arr[i] = new Array(rows); //generálunk egy sort
    }
    return arr; //Visszahívjuk
}

var grid;
var cols;
var rows;
var w = 30; //30pixel x 30pixel méretű négyzet (cella)

var osszesAkna = 30; //Aknák száma
var aknaSzam = osszesAkna; //Eltároljuk egy másik változóban hogy mennyi akna van még hátra

//Maga a tábla elkészítése
function setup(){
    let canvas = createCanvas(510, 510); //Canvas generálása (oszlopok + w, sorok + w)
    canvas.id('Canvas'); //Adunk neki egy ID-t
    canvas = document.getElementById('Canvas'); //hogy letudjuk tiltani a jobb klikk "menüt" amikor a táblában kattintunk
        canvas.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    cols = floor(width / w); //Kiszámoljuk az oszlopok méretét (floor hogy egész szám legyen)
    rows = floor(height / w); //Kiszámoljuk a sorok méretét (floor hogy egész szám legyen)
    grid = create2DArray(cols, rows);
    for (var i = 0; i< cols; i++){ //Minden oszlopra 
        for (var j = 0; j< rows; j++){ //És minden sorra csinálunk egy cellát
            grid[i][j] = new Cell(i, j, w); //Legeneráljuk a cellákat, és eltároljuk az indexét hogy hol van a 2dimenziós tömben hol van. (pl:grid[1][3] = 1. oszlop 3. sora)
        }
    }
    //Kiválasztjuk az osszesAkna helyét
    var options = [];
    //Készítünk egy ciklust ahol eltároljuk az összes cellát egy tömbben
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            options.push([i, j]);
        }
    }

    // Egy ciklus ami elhelyezi az aknákat
    for( var n = 0; n < osszesAkna; n++){
        var index = floor(random(options.length)); //És az eltárololt cellákból random kiválasztunk egyet ahol lesz az akna
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        options.splice(index, 1); //Kitörli az indexet a tömbökből, így nem lehet ugyanazon a helyen 2 akna (nem lehet újra opció)
        grid[i][j].akna = true;
    }

    // Egy külön for ciklus ami megszámolja
    for (var i = 0; i< cols; i++){ 
        for (var j = 0; j< rows; j++){ 
            grid[i][j].countAknak();
        }
    }

    document.getElementById("remainingMines").innerText = "Hátralévő 💣 száma: " + aknaSzam; //Kiírjuk hogy mennyi akna van hátra (még nem működik rendesen)
    document.getElementById("resetButton").addEventListener("click", function(){ //Egy gomb ami reseteli a játékot
        resetGame();
    });
}

//Egy funkció ami nézi az egérkattintásokat
function mousePressed(){
    for (var i = 0; i< cols; i++){
        for (var j = 0; j < rows; j++){
            if(grid[i][j].contains(mouseX, mouseY)){ //Ha benna van az egér a cellában kattintáskor
                if(mouseButton === LEFT){ //Ballklikk
                    if(!grid[i][j].revealed && !grid[i][j].flagged){ //Ha a cella nincs felfedezve és nincs flaggelve akkor
                        grid[i][j].reveal(); //felfedezzük
                    }
                } else if (mouseButton === RIGHT) { //Jobbklikk
                    if (!grid[i][j].revealed) { //Ha egy mező még nincs felfedezve
                        if (!grid[i][j].flagged) {
                            grid[i][j].toggleFlag(); //akkor megflaggeljük
                            decreaseMineCount(); //Meghívjuk ezt a függvényt
                        } else {
                            grid[i][j].toggleFlag(); 
                            increaseMineCount(); //Meghívjuk ezt a függvényt
                        }
                    }
                }
            } 
        } 
    }
}

function increaseMineCount(){ //Növeli az aknaSzam-ot 1-el
    if (aknaSzam > 0){ //ha több mint 0 (nem lehet negatív érték)
        aknaSzam++;
        document.getElementById("remainingMines").innerText = "Hátralévő 💣 száma: " + aknaSzam;
    }
}

function decreaseMineCount(){ //Csökkenti az aknaSzam-ot 1-el
    if (aknaSzam > 0){ //ha több mint 0 (nem lehet negatív érték)
        aknaSzam--;
        document.getElementById("remainingMines").innerText = "Hátralévő 💣 száma: " + aknaSzam;
    }
}

//Megrajzoljuk magát a "táblát"
function draw(){
    background(255, 255, 255); 
    for (var i = 0; i < cols; i++){
        for (var j = 0; j< rows; j++){
            grid[i][j].show(); //Kirajzoljuk
        }
    }
}

function resetGame(){
    // Minden cellát visszaállítunk felfedezetlen állapotba
    for (var i = 0; i < cols; i++) { 
        for (var j = 0; j < rows; j++) { 
            grid[i][j].revealed = false; //Minden cella felfedezetlen állapotba vissza
            grid[i][j].akna = false; //Az összes aknát eltávolítjuk
            grid[i][j].flagged = false; //Az összes cellát ami flaggelt eltávolítjuk
        }
    }

    // Újra elhelyezzük az aknákat (ugyanaz a kód)
    var options = [];
    //Készítünk egy ciklust ahol eltároljuk az összes cellát egy tömbben
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            options.push([i, j]);
        }
    }

    // Egy ciklus ami elhelyezi az aknákat
    for( var n = 0; n < osszesAkna; n++){
        var index = floor(random(options.length)); //És az eltárololt cellákból random kiválasztunk egyet ahol lesz az akna
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        options.splice(index, 1); //Kitörli az indexet a tömbökből, így nem lehet ugyanazon a helyen 2 akna (nem lehet újra opció)
        grid[i][j].akna = true;
    }

    // Frissítjük az aknák számát megjelenítő elemet
    aknaSzam = osszesAkna; // Az aknák számát is visszaállítjuk az eredeti értékére
    document.getElementById("remainingMines").innerText = "Hátralévő 💣 száma: " + aknaSzam;
}