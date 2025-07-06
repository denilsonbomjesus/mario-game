const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

// Todas as imagens do jogo
const images = [
    { name: 'spriteRunLeft', src: './assets/spriteRunLeft.png' },
    { name: 'spriteRunRight', src: './assets/spriteRunRight.png' },
    { name: 'spriteStandLeft', src: './assets/spriteStandLeft.png' },
    { name: 'spriteStandRight', src: './assets/spriteStandRight.png' },
    { name: 'platform', src: './assets/platform.png' },
    { name: 'background', src: './assets/background.png' },
    { name: 'hills', src: './assets/hills.png' },
    { name: 'platformSmallTall', src: './assets/platformSmallTall.png' }
];

const loadedImages = {};
let imagesLoadedCount = 0;

function loadImage(imageObj) {
    const img = new Image();
    img.src = imageObj.src;
    img.onload = () => {
        loadedImages[imageObj.name] = img;
        imagesLoadedCount++;
        if (imagesLoadedCount === images.length) {
            // Todas as imagens foram carregadas, agora podemos iniciar o jogo
            initializeGame();
        }
    };
    img.onerror = () => {
        console.error(`Falha ao carregar a imagem: ${imageObj.src}`);
    };
}

images.forEach(imageObj => loadImage(imageObj));

class Player {
	constructor() {
		this.speed = 10
		this.position = {
			x: 100,
			y: 100
		}
		this.velocity = {
			x: 0,
			y: 0
		}

		this.width = 66
		this.height = 150

		this.image = loadedImages.spriteStandRight
		this.frames = 0
		this.sprites = {
			stand: {
				right: loadedImages.spriteStandRight,
				left: loadedImages.spriteStandLeft,
				cropWidth: 177,
				width: 66
			},
			run: {
				right: loadedImages.spriteRunRight,
				left: loadedImages.spriteRunLeft,
				cropWidth: 341,
				width: 127.875
			}
		}
		this.currentSprites = this.sprites.stand.right		
		this.currentCropWidth = 177
	}

	draw() {
		c.drawImage(
			this.currentSprites,
			this.currentCropWidth * this.frames,
			0,
			this.currentCropWidth,
			400,
			this.position.x, 
			this.position.y, 
			this.width, 
			this.height
			)
	}

	update() {
		this.frames++
		if(this.frames > 59 && 
			(this.currentSprites === this.sprites.stand.right || 
				this.currentSprites === this.sprites.stand.left)){
			this.frames = 0
		} else if (this.frames > 29 && 
			(this.currentSprites === this.sprites.run.right || 
				this.currentSprites === this.sprites.run.left)){
			this.frames = 0
		}

		this.draw();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		if(this.position.y + this.height + this.velocity.y <= canvas.height)
			this.velocity.y += gravity
	}
}

class Plataform {
	constructor({ x, y, image }){
		this.position = {
			x,
			y
		}
		this.image = image
		this.width = image.width
		this.height = image.height
	}

	draw(){
		c.drawImage(this.image, this.position.x, this.position.y)
	}
}

class GenericObject {
	constructor({ x, y, image }){
		this.position = {
			x,
			y
		}
		this.image = image
		this.width = image.width
		this.height = image.height
	}

	draw(){
		c.drawImage(this.image, this.position.x, this.position.y)
	}
}

let player = new Player();
let plataforms = []

let genericObjects = []
let lastKey

const keys = {
	right: {
		pressed: false
	},
	left: {
		pressed: false
	}
}

let scrollOffset = 0

// inicialização
function init() {
	player = new Player();
	plataforms = [
		new Plataform({x: loadedImages.platform.width * 4 + 300 - 2 + loadedImages.platform.width - loadedImages.platformSmallTall.width, y: 270, image: loadedImages.platformSmallTall}),
		new Plataform({x: -1, y: 470, image: loadedImages.platform}), 
		new Plataform({x: loadedImages.platform.width - 3, y: 470, image: loadedImages.platform}),
		new Plataform({x: loadedImages.platform.width * 2 + 100, y: 470, image: loadedImages.platform}),
		new Plataform({x: loadedImages.platform.width * 3 + 300, y: 470, image: loadedImages.platform}),
		new Plataform({x: loadedImages.platform.width * 4 + 300 - 2, y: 470, image: loadedImages.platform}),
		new Plataform({x: loadedImages.platform.width * 5 + 700 - 2, y: 470, image: loadedImages.platform}),
	]

	genericObjects = [
		new GenericObject({x: -1, y: -1, image: loadedImages.background}),
		new GenericObject({x: -1, y: -1, image: loadedImages.hills})
	]

	scrollOffset = 0
}

function animate(){
	requestAnimationFrame(animate)
	c.fillStyle = 'white'
	c.fillRect(0, 0, canvas.width, canvas.height)

	genericObjects.forEach( genericObject => {
		genericObject.draw()
	})

	plataforms.forEach(plataform => {
		plataform.draw()
	})
	player.update()
	
	// fazer player se mover
	if(keys.right.pressed && player.position.x < 400){
		player.velocity.x = player.speed
	} else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)){
		player.velocity.x = -player.speed
	} else {
		player.velocity.x = 0

		// fazer plataforma se mover junto com player
		if(keys.right.pressed){
			scrollOffset += player.speed
			plataforms.forEach(plataform => {
				plataform.position.x -= player.speed		
			})
			genericObjects.forEach(genericObject => {
				genericObject.position.x -= player.speed * 0.66
			})
			
		} else if (keys.left.pressed && scrollOffset > 0) {
			scrollOffset -= player.speed
			plataforms.forEach(plataform => {
				plataform.position.x += player.speed		
			})
			genericObjects.forEach(genericObject => {
				genericObject.position.x += player.speed * 0.66
			})
		}
	}

	// detecção de colisão da plataforma
	plataforms.forEach(plataform => {
		if(player.position.y + player.height <= plataform.position.y && player.position.y + player.height + player.velocity.y >= plataform.position.y && player.position.x + player.width >= plataform.position.x && player.position.x <= plataform.position.x + plataform.width) {
			player.velocity.y = 0
		}
	})

	// troca de sprites
	if(keys.right.pressed && lastKey === 'right' && player.currentSprites !== player.sprites.run.right){
		player.frames = 1
		player.currentSprites = player.sprites.run.right
		player.currentCropWidth = player.sprites.run.cropWidth
		player.width = player.sprites.run.width
	} else if(keys.left.pressed &&lastKey === 'left' && player.currentSprites !== player.sprites.run.left){
		player.frames = 1
		player.currentSprites = player.sprites.run.left
		player.currentCropWidth = player.sprites.run.cropWidth
		player.width = player.sprites.run.width
	} else if(!keys.left.pressed &&lastKey === 'left' && player.currentSprites !== player.sprites.stand.left){
		player.frames = 1
		player.currentSprites = player.sprites.stand.left
		player.currentCropWidth = player.sprites.stand.cropWidth
		player.width = player.sprites.stand.width
	} else if(!keys.right.pressed &&lastKey === 'right' && player.currentSprites !== player.sprites.stand.right){
		player.frames = 1
		player.currentSprites = player.sprites.stand.right
		player.currentCropWidth = player.sprites.stand.cropWidth
		player.width = player.sprites.stand.width
	}

	// condição de vitoria
	if(scrollOffset > loadedImages.platform.width * 5 + 300 - 2){
		console.log('você venceu!')
	}

	//condição de derrota
	if(player.position.y > canvas.height){
		init()
	}
}

function initializeGame(){
	init();
	animate();
}

addEventListener('keydown', ({ keyCode }) => {
	switch (keyCode) {
		case 65:
		case 37:
			console.log('left')
			keys.left.pressed = true
			lastKey = 'left'
			break

		case 83:
		case 40:
			console.log('down')
			break

		case 68:
		case 39:
			console.log('right')
			keys.right.pressed = true
			lastKey = 'right'
			break

		case 87:
		case 38:
			console.log('up')
			player.velocity.y -= 10
			break
	} 
})

addEventListener('keyup', ({ keyCode }) => {
	switch (keyCode) {
		case 65:
		case 37:
			console.log('left')
			keys.left.pressed = false
			break

		case 83:
		case 40:
			console.log('down')
			break

		case 68:
		case 39:
			console.log('right')
 			keys.right.pressed = false
 			break

		case 87:
		case 38:
			console.log('up')
			break
	} 
})