const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

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
		else this.velocity.y = 0
	}
}

class Plataform {
	constructor({ x, y }){
		this.position = {
			x,
			y
		}

		this.width = 200
		this.height = 20
	}

	draw(){
		c.fillStyle = 'blue'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

const player = new Player();
const plataforms = [new Plataform({x: 200, y: 100}),new Plataform({x: 500, y: 200})]

const keys = {
	right: {
		pressed: false
	},
	left: {
		pressed: false
	}
}

let scrollOffset = 0

function animate(){
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)
	player.update()
	plataforms.forEach(plataform => {
		plataform.draw()
	})
	
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
			
		} else if (keys.left.pressed) {
			scrollOffset -= 5
			plataforms.forEach(plataform => {
				plataform.position.x += 5		
			})
		}
	}

	// detecção de colisão da plataforma
	plataforms.forEach(plataform => {
		if(player.position.y + player.height <= plataform.position.y && player.position.y + player.height + player.velocity.y >= plataform.position.y && player.position.x + player.width >= plataform.position.x && player.position.x <= plataform.position.x + plataform.width) {
			player.velocity.y = 0
		}
	})
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
			player.velocity.y -= 20
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