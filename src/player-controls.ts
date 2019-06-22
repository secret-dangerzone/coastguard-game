import keyboard from './keyboard'

const k = {}
k.upInput = keyboard('ArrowUp')
k.leftInput = keyboard('ArrowLeft')
k.rightInput = keyboard('ArrowRight')

const deltaAngle = (x, y) => Math.PI - Math.abs(Math.abs(x - y) - Math.PI)

export default boat => {
  const thrusting = k.upInput.isDown
  const turningLeft = k.leftInput.isDown && !k.rightInput.isDown
  const turningRight = k.rightInput.isDown && !k.leftInput.isDown

  if (thrusting) {
    boat.vx += Math.cos(boat.rotation - Math.PI / 2) * boat.acceleration
    boat.vy += Math.sin(boat.rotation - Math.PI / 2) * boat.acceleration
  }
  const driftAngle = Math.abs(
    deltaAngle(boat.rotation % Math.PI, Math.atan2(boat.vy, boat.vx)) -
      Math.PI / 2
  )
  const friction = 1 - boat.friction * (driftAngle / Math.PI + Math.PI / 4)
  boat.vx *= friction
  boat.vy *= friction
  boat.speed = Math.sqrt(boat.vx * boat.vx + boat.vy * boat.vy)
  if (turningRight) {
    boat.rotation += boat.speed * boat.turnSpeed
  }
  if (turningLeft) {
    boat.rotation -= boat.speed * boat.turnSpeed
  }
}
