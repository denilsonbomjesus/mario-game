const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
	constructor() {
		this.position = {
			x: 100,
			y: 100
		}
		this.velocity = {
			x: 0,
			y: 0
		}

		this.width = 30
		this.height = 30
	}

	draw() {
		c.fillStyle = 'red'
		c.fillRect(this.
			position.x, this.position.y, this.width, this.height)
	}

	update() {
		this.draw();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		if(this.position.y + this.height + this.velocity.y <= canvas.height)
			this.velocity.y += gravity
	}
}

// const plataform = document.querySelector('.plataforma')
const image = new Image()
image.src = './assets/platform.png'

const imageBackground = new Image()
imageBackground.src = './assets/background.png'

const imageHills = new Image()
imageHills.src = './assets/hills.png'

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
let plataforms = [
	new Plataform({x: -1, y: 470, image: image}), 
	new Plataform({x: image.width - 3, y: 470, image: image}),
	new Plataform({x: image.width * 2 + 100, y: 470, image: image})
]

let genericObjects = [
	new GenericObject({x: -1, y: -1, image: imageBackground}),
	new GenericObject({x: -1, y: -1, image: imageHills})
]

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
		new Plataform({x: -1, y: 470, image: image}), 
		new Plataform({x: image.width - 3, y: 470, image: image}),
		new Plataform({x: image.width * 2 + 100, y: 470, image: image})
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
		player.velocity.x = 5
	} else if (keys.left.pressed && player.position.x > 100) {
		player.velocity.x = -5
	} else {
		player.velocity.x = 0

		// fazer plataforma se mover junto com player
		if(keys.right.pressed){
			scrollOffset += 5
			plataforms.forEach(plataform => {
				plataform.position.x -= 5		
			})
			genericObjects.forEach(genericObject => {
				genericObject.position.x -= 3
			})
			
		} else if (keys.left.pressed) {
			scrollOffset -= 5
			plataforms.forEach(plataform => {
				plataform.position.x += 5		
			})
			genericObjects.forEach(genericObject => {
				genericObject.position.x += 3
			})
		}
	}

	// detecção de colisão da plataforma
	plataforms.forEach(plataform => {
		if(player.position.y + player.height <= plataform.position.y && player.position.y + player.height + player.velocity.y >= plataform.position.y && player.position.x + player.width >= plataform.position.x && player.position.x <= plataform.position.x + plataform.width) {
			player.velocity.y = 0
		}
	})

	// condição de vitoria
	if(scrollOffset > 2000){
		console.log('você venceu!')
	}

	//condição de derrota
	if(player.position.y > canvas.height){
		init()
	}
}

animate();

addEventListener('keydown', ({ keyCode }) => {
	switch (keyCode) {
		case 65:
			console.log('left')
			keys.left.pressed = true
			break

		case 83:
			console.log('down')
			break

		case 68:
			console.log('right')
			keys.right.pressed = true
			break

		case 87:
			console.log('up')
			player.velocity.y -= 5
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
			player.velocity.y -= 20
			break
	} 
})