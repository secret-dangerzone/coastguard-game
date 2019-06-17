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

let drowners, message, midBoat, state

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const app = new Application()
app.renderer.backgroundColor = 0x2ebae8
document.body.appendChild(app.view)

const setup = (loader, resources) => {
  drowners = new Container()
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
  app.stage.addChild(drowners)

  midBoat = Sprite.from(resources.midBoat.texture)
  midBoat.anchor.set(0.5, 0.5)
  midBoat.scale.set(0.5, 0.5)
  midBoat.rotation = 0
  midBoat.acceleration = 0.05
  midBoat.turnSpeed = 0.05
  midBoat.friction = 0.99
  midBoat.vx = 0
  midBoat.vy = 0
  midBoat.position.set(canvasWidth / 2, canvasHeight - midBoat.height)

  app.stage.addChild(midBoat)

  message = new Text('Ready...')
  app.stage.addChild(message)

  state = play

  app.ticker.add(delta => gameLoop(delta))
}
loader.add('drowner', drownerPath).add('midBoat', midBoatPath)
loader.load(setup)

const gameLoop = delta => {
  state(delta)
}

const play = delta => {
  playerControls(midBoat)
  midBoat.y += midBoat.vy
  midBoat.x += midBoat.vx

  drowners.children.forEach(drowner => {
    if (hitTestRectangle(midBoat, drowner)) {
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
