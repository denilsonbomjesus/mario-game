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

		this.jumpsRemaining = 2;
		this.maxJumps = 2;
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

// lastPlatformX e lastPlatformY são a posição da ÚLTIMA plataforma gerada
let lastPlatformX = 0
let lastPlatformY = 470

// definindo limites de gap precisos para pulos (considerando duplo pulo)
const minGapWithinBlock = 100; // distância mínima entre plataformas dentro de um "bloco"
const maxGapWithinBlock = 400; // distância máxima para pulo SIMPLES dentro de um "bloco"

const maxDoubleJumpGap = 650;
const chanceForDoubleJumpGap = 0.3; // 30% de chance de gerar um gap maior (para duplo pulo)

function generateMorePlatforms() {
	// determinar o ponto mais à direita que já tem plataforma
	// se não houver plataformas, começar do lastPlatformX inicial
	// se houver, pegar a posição X da última plataforma + sua largura
	let currentRightmostX = 0;
	if (plataforms.length > 0) {
		// pegar a última plataforma no array e usar sua posição no mundo
		currentRightmostX = plataforms[plataforms.length - 1].position.x + plataforms[plataforms.length - 1].width;
	} else {
		// se não há plataformas, usa o lastPlatformX inicial do init
		currentRightmostX = lastPlatformX;
	}

	// a janela de geração é o que o jogador pode ver + uma margem à frente
	// certificar que o lastPlatformX usado aqui já está na coordenada do mundo
	const generationTargetX = scrollOffset + canvas.width + 1000; // gerar 1000px à frente da tela visível

	// loop para gerar plataformas até que cubrir a área desejada
	while (currentRightmostX < generationTargetX) {
		const platformType = Math.random() < 0.3 ? 'platformSmallTall' : 'platform'
		const image = loadedImages[platformType]

		// altura com limite
		let yChange = Math.random() < 0.5 ? (Math.random() < 0.5 ? -100 : 100) : 0
		lastPlatformY += yChange
		lastPlatformY = Math.min(470, Math.max(250, lastPlatformY))

		let gap;
		if (Math.random() < chanceForDoubleJumpGap) {
			gap = Math.floor(Math.random() * (maxDoubleJumpGap - maxGapWithinBlock)) + maxGapWithinBlock + 50;
		} else {
			gap = Math.floor(Math.random() * (maxGapWithinBlock - minGapWithinBlock)) + minGapWithinBlock;
		}

		// a nova posição de X é baseada no final da plataforma anterior + o gap
		const nextX = currentRightmostX + gap;

		// adiciona a nova plataforma
		plataforms.push(new Plataform({
			x: nextX,
			y: lastPlatformY,
			image: image
		}));

		// atualiza o ponto mais à direita para a próxima iteração do loop
		currentRightmostX = nextX + image.width;
	}
}

// inicialização
function init() {
	player = new Player();
	plataforms = [
		new Plataform({
			x: 0,
			y: 470,
			image: loadedImages.platform
		})
	]

	// lastPlatformX e lastPlatformY representam a última posição de geração no mundo
	lastPlatformX = loadedImages.platform.width + 100; // inicia depois da primeira plataforma fixa
	lastPlatformY = 470;

	// a primeira chamada de generateMorePlatforms preenche a tela inicial
	generateMorePlatforms();

	genericObjects = [
		new GenericObject({ x: 0, y: -1, image: loadedImages.background }),
		new GenericObject({ x: loadedImages.background.width, y: -1, image: loadedImages.background }),
		new GenericObject({ x: 0, y: -1, image: loadedImages.hills }),
		new GenericObject({ x: loadedImages.hills.width, y: -1, image: loadedImages.hills })
	]

	scrollOffset = 0
}

function animate(){
	requestAnimationFrame(animate)
	c.fillStyle = 'white'
	c.fillRect(0, 0, canvas.width, canvas.height)

	genericObjects.forEach( genericObject => {
		genericObject.draw()

		if(genericObject.position.x + genericObject.width <= 0){
			genericObject.position.x += genericObject.width * 2
		}

		c.drawImage(
			genericObject.image,
			genericObject.position.x + genericObject.width,
			genericObject.position.y
		)
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

			// gerar mais plataformas conforme o scroll avança
			generateMorePlatforms()
			
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
		if (player.position.y + player.height <= plataform.position.y && player.position.y + player.height + player.velocity.y >= plataform.position.y && player.position.x + player.width >= plataform.position.x && player.position.x <= plataform.position.x + plataform.width) {
			
			player.velocity.y = 0
			if (player.jumpsRemaining < player.maxJumps) {
				player.jumpsRemaining = player.maxJumps;
			}
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

	// condição de vitoria -> a implementar
	// if(scrollOffset > loadedImages.platform.width * 5 + 300 - 2){
	// 	console.log('você venceu!')
	// }

	// condição de derrota (cair do mapa)
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
		case 65: // A
		case 37: // Seta esquerda
			console.log('left')
			keys.left.pressed = true
			lastKey = 'left'
			break

		case 83: // S
		case 40: // Seta baixo
			console.log('down')
			break

		case 68: // D
		case 39: // Seta direita
			console.log('right')
			keys.right.pressed = true
			lastKey = 'right'
			break

		case 87: // W
		case 38: // Seta para cima
			console.log('up')
			if (player.jumpsRemaining > 0) {
				player.velocity.y -= 10
				player.jumpsRemaining--;
			}
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