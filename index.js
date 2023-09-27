const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

const imageSpriteRunLeft = new Image()
imageSpriteRunLeft.src = './assets/spriteRunLeft.png'

const imageSpriteRunRight = new Image()
imageSpriteRunRight.src = './assets/spriteRunRight.png'

const imageSpriteStandLeft = new Image()
imageSpriteStandLeft.src = './assets/spriteStandLeft.png'

const imageSpriteStandRight = new Image()
imageSpriteStandRight.src = './assets/spriteStandRight.png'

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

		this.image = imageSpriteStandRight
		this.frames = 0
		this.sprites = {
			stand: {
				right: imageSpriteStandRight,
				left: imageSpriteStandLeft,
				cropWidth: 177,
				width: 66
			},
			run: {
				right: imageSpriteRunRight,
				left: imageSpriteRunLeft,
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

const imagePlatform = new Image()
imagePlatform.src = './assets/platform.png'

const imageBackground = new Image()
imageBackground.src = './assets/background.png'

const imageHills = new Image()
imageHills.src = './assets/hills.png'

const imagePlatformSmallTall = new Image()
imagePlatformSmallTall.src = './assets/platformSmallTall.png'

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
		new Plataform({x: imagePlatform.width * 4 + 300 - 2 + imagePlatform.width - imagePlatformSmallTall.width, y: 270, image: imagePlatformSmallTall}),
		new Plataform({x: -1, y: 470, image: imagePlatform}), 
		new Plataform({x: imagePlatform.width - 3, y: 470, image: imagePlatform}),
		new Plataform({x: imagePlatform.width * 2 + 100, y: 470, image: imagePlatform}),
		new Plataform({x: imagePlatform.width * 3 + 300, y: 470, image: imagePlatform}),
		new Plataform({x: imagePlatform.width * 4 + 300 - 2, y: 470, image: imagePlatform}),
		new Plataform({x: imagePlatform.width * 5 + 700 - 2, y: 470, image: imagePlatform}),
	]

	genericObjects = [
		new GenericObject({x: -1, y: -1, image: imageBackground}),
		new GenericObject({x: -1, y: -1, image: imageHills})
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
	if(scrollOffset > imagePlatform.width * 5 + 300 - 2){
		console.log('você venceu!')
	}

	//condição de derrota
	if(player.position.y > canvas.height){
		init()
	}
}

init();
animate();

addEventListener('keydown', ({ keyCode }) => {
	switch (keyCode) {
		case 65:
			console.log('left')
			keys.left.pressed = true
			lastKey = 'left'
			break

		case 83:
			console.log('down')
			break

		case 68:
			console.log('right')
			keys.right.pressed = true
			lastKey = 'right'
			break

		case 87:
			console.log('up')
			player.velocity.y -= 10
			break
	} 
})

addEventListener('keyup', ({ keyCode }) => {
	switch (keyCode) {
		case 65:
			console.log('left')
			keys.left.pressed = false
			break

		case 83:
			console.log('down')
			break

		case 68:
			console.log('right')
 			keys.right.pressed = false
 			break

		case 87:
			console.log('up')
			break
	} 
})