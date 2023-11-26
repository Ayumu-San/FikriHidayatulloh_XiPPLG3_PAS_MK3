// Memuat variabel-variabel dalam game
let board;
let boardWidth = 750;
let boardHeight = 400;
let context;

let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

let cactusArray = [];

let cactus1Width = 30;
let cactus2Width = 60;
let cactus3Width = 92;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let velocityX = -8;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

let resetButton;
let animationRequestId;

// Ketika halaman selesai dimuat
window.onload = function() {
    // Mengambil elemen kanvas
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    // Gatau apa, cuma ini buat nggambil context(?)
    context = board.getContext("2d");

    // Memuat gambar dinosaurus
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Memuat gambar kaktus
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    // Mulai animasi game
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
}

// Fungsi untuk menampilkan popup game over
function showGameOverPopup() {
    // Hentikan animasi sebelumnya (jika ada)
    cancelAnimationFrame(animationRequestId);

    // Buat elemen popup
    const popup = document.createElement("div");
    popup.id = "gameOverPopup";
    popup.innerHTML = `
        <div>
            <h2>Game Over!</h2>
            <p>Your Score: ${score}</p>
            <button id="resetButton">Play Again</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Tambahkan event listener untuk tombol reset
    resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetGame);
}

// Fungsi untuk mereset game setelah tombol reset diklik
function resetGame() {
    // Hapus popup
    document.body.removeChild(document.getElementById("gameOverPopup"));

    // Hentikan animasi sebelumnya (jika ada)
    cancelAnimationFrame(animationRequestId);

    // Reset semua variabel game
    cactusArray = [];
    velocityY = 0;
    gameOver = false;
    score = 0;

    // Mulai game lagi
    requestAnimationFrame(update);
}

// Fungsi utama yang mengupdate animasi game
function update() {
    // Dapatkan ID animasi untuk dapat dihentikan nanti
    animationRequestId = requestAnimationFrame(update);

    // Jika game over, tampilkan popup ini
    if (gameOver) {
        showGameOverPopup();
        return;
    }

    // Bersihkan kanvas
    context.clearRect(0, 0, board.width, board.height);

    // Update posisi dan gambar dinosaurus
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Loop untuk mengupdate dan menempatkan kaktus-kaktus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Deteksi tabrakan antara dinosaurus dan kaktus
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    // Tampilkan skor di kanvas
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

// Fungsi untuk menggerakkan dinosaurus
function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
    }
}

// Fungsi untuk menempatkan kaktus di layar
function placeCactus() {
    if (gameOver) {
        return;
    }

    // Objek kaktus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    // Peluang menempatkan kaktus
    let placeCactusChance = Math.random();

    // Menentukan jenis kaktus berdasarkan peluang
    if (placeCactusChance > .90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > .70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > .50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    // Jika sudah ada lebih dari 5 kaktus, hapus yang paling awal
    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

// Fungsi untuk mendeteksi tabrakan antara dua objek
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}