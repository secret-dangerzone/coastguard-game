import keyboard from './keyboard'

const k = {}
k.upInput = keyboard('ArrowUp')
k.leftInput = keyboard('ArrowLeft')
k.rightInput = keyboard('ArrowRight')

export default boat => {
  const thrusting = k.upInput.isDown
  const turningLeft = k.leftInput.isDown && !k.rightInput.isDown
  const turningRight = k.rightInput.isDown && !k.leftInput.isDown

  if (thrusting) {
    boat.vx += Math.cos(boat.rotation - Math.PI / 2) * boat.acceleration
    boat.vy += Math.sin(boat.rotation - Math.PI / 2) * boat.acceleration
  } else {
    boat.vx *= boat.friction
    boat.vy *= boat.friction
  }
  if (turningRight) {
    boat.rotation +=
      Math.sqrt(Math.abs(boat.vx) + Math.abs(boat.vy)) * boat.turnSpeed
  }
  if (turningLeft) {
    boat.rotation -=
      Math.sqrt(Math.abs(boat.vx) + Math.abs(boat.vy)) * boat.turnSpeed
  }
}
