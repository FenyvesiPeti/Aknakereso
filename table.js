var gameStartTime;
var timerId;
var timerStarted = false;
var gameOver = false; // Játék állapotának nyomon követésére
var safeCellsRevealed = 0; // Nyilvántartjuk, hogy hány biztonságos cellát fedeztek fel
var totalSafeCells = cols * rows - osszesAkna; // Az összes biztonságos cella számítása


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

var canvasWidth = 630;
var canvasHeight = 510;

var osszesAkna = 30; //Aknák száma
var aknaSzam = osszesAkna; //Eltároljuk egy másik változóban hogy mennyi akna van még hátra

//Maga a tábla elkészítése
function setup(){
    let canvas = createCanvas(canvasWidth, canvasHeight); //Canvas generálása (oszlopok + w, sorok + w)
    canvas.id('Canvas'); //Adunk neki egy ID-t
    canvas.parent('canvasPosition'); //Megadjuk a canvas helyét
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

    document.getElementById("remainingMines").innerText = aknaSzam + "💣";; //Kiírjuk hogy mennyi akna van hátra (még nem működik rendesen)
    document.getElementById("resetButton").addEventListener("click", function(){ //Egy gomb ami reseteli a játékot
        resetGame();
    });
}

//Egy funkció ami nézi az egérkattintásokat
function mousePressed() {
    let cellClicked = false; // Tegyük fel, hogy nem történt cellára kattintás
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) { // Ha a kattintás egy cellát érint
                cellClicked = true; // Jelöljük, hogy történt cellára kattintás
                if (!timerStarted && !gameOver) {
                    gameStartTime = new Date();
                    timerId = setInterval(updateTimer, 1000);
                    timerStarted = true;
                }

                // A cellával kapcsolatos többi művelet...
                if(mouseButton === LEFT) {
                    if(!grid[i][j].revealed && !grid[i][j].flagged) {
                        grid[i][j].reveal(); // Felfedezzük a cellát
                    }
                } else if (mouseButton === RIGHT) {
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

                return; // Kilépünk a funkcióból, mivel már kezeltük a kattintást
            }
        }
    }
}

function increaseMineCount(){ //Növeli az aknaSzam-ot 1-el
    if (aknaSzam > 0){ //ha több mint 0 (nem lehet negatív érték)
        aknaSzam++;
        document.getElementById("remainingMines").innerText = aknaSzam + "💣";
    }
}

function decreaseMineCount(){ //Csökkenti az aknaSzam-ot 1-el
    if (aknaSzam > 0){ //ha több mint 0 (nem lehet negatív érték)
        aknaSzam--;
        document.getElementById("remainingMines").innerText = aknaSzam + "💣";
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
    gameOver = false;
    //location.reload(); //Újratölti az oldalt (amíg nincs fixelve)

    grid = create2DArray(cols, rows);
    for (var i = 0; i< cols; i++){ //Minden oszlopra 
        for (var j = 0; j< rows; j++){ //És minden sorra csinálunk egy cellát
            grid[i][j] = new Cell(i, j, w); //Legeneráljuk a cellákat, és eltároljuk az indexét hogy hol van a 2dimenziós tömben hol van. (pl:grid[1][3] = 1. oszlop 3. sora)
        }
    }
    // Újra elhelyezzük az aknákat
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
    // Frissítjük az aknák számát megjelenítő elemet
    aknaSzam = osszesAkna; // Az aknák számát is visszaállítjuk az eredeti értékére
    document.getElementById("remainingMines").innerText = aknaSzam + "💣";
}

function updateTimer() {
    var now = new Date();
    var elapsed = new Date(now - gameStartTime);
    var minutes = elapsed.getUTCMinutes();
    var seconds = elapsed.getUTCSeconds();

    // Formátum: "xx:xx"
    var formattedTime = (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    document.getElementById("elapsedTime").innerText = formattedTime;
}

function revealAllBombs() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].akna) { // Ha a cella bombát tartalmaz
                grid[i][j].revealed = true; // Felfedjük a bombát
            }
        }
    }
}
