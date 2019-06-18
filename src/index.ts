import * as PIXI from 'pixi.js'
import drownerPath from '../assets/drowner.png'
import midBoatPath from '../assets/mid-boat.png'
import hitTestRectangle from './hit-test-rectangle'
import playerControls from './player-controls'

const Application = PIXI.Application
const Container = PIXI.Container
const Sprite = PIXI.Sprite
const Text = PIXI.Text
const loader = PIXI.Loader.shared

const canvasWidth = 800
const canvasHeight = 600
const numberOfDrowners = 5

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const app = new Application()
app.renderer.backgroundColor = 0x2ebae8
document.body.appendChild(app.view)

const camera = new Container()
app.stage.addChild(camera)

const message = new Text('Ready...')
message.position.set(8, 8)
app.stage.addChild(message)

const drowners = new Container()

let boat, state

const setup = (loader, resources) => {
  for (let i = 0; i < numberOfDrowners; i++) {
    const drowner = Sprite.from(resources.drowner.texture)
    drowner.anchor.set(0.5, 0.5)
    drowner.scale.set(0.5, 0.5)
    drowner.position.set(
      randomInt(drowner.width / 2, canvasWidth - drowner.width / 2),
      randomInt(drowner.height / 2, canvasHeight - drowner.height / 2)
    )
    drowners.addChild(drowner)
  }
  camera.addChild(drowners)

  boat = Sprite.from(resources.midBoat.texture)
  boat.anchor.set(0.5, 0.5)
  boat.scale.set(0.5, 0.5)
  boat.rotation = 0
  boat.acceleration = 0.05
  boat.turnSpeed = 0.05
  boat.friction = 0.99
  boat.vx = 0
  boat.vy = 0
  boat.position.set(canvasWidth / 2, canvasHeight / 2)
  camera.addChild(boat)

  state = play

  app.ticker.add(delta => gameLoop(delta))
}
loader.add('drowner', drownerPath).add('midBoat', midBoatPath)
loader.load(setup)

const gameLoop = delta => {
  state(delta)
}

const play = delta => {
  playerControls(boat)
  boat.y += boat.vy
  boat.x += boat.vx
  camera.pivot.set(boat.x - canvasWidth / 2, boat.y - canvasHeight / 2)

  drowners.children.forEach(drowner => {
    if (hitTestRectangle(boat, drowner)) {
      drowners.removeChild(drowner)
      if (drowners.children.length > 0) {
        message.text = `Rescued ${numberOfDrowners -
          drowners.children.length}/${numberOfDrowners}`
      } else {
        message.text = 'Success, you rescued everyone!!!'
      }
    }
  })
}
