import * as PIXI from 'pixi.js'
import drownerPath from '../assets/drowner.png'
import midBoatPath from '../assets/mid-boat.png'
import hitTestRectangle from './hit-test-rectangle'
import keyboard from './keyboard'

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
  midBoat.vx = 0
  midBoat.vy = 0
  midBoat.position.set(canvasWidth / 2, canvasHeight - midBoat.height)
  app.stage.addChild(midBoat)

  message = new Text('Ready...')
  app.stage.addChild(message)

  const left = keyboard('ArrowLeft')
  const up = keyboard('ArrowUp')
  const right = keyboard('ArrowRight')
  const down = keyboard('ArrowDown')

  left.press = () => {
    midBoat.vx = -5
    midBoat.vy = 0
  }

  left.release = () => {
    if (!right.isDown && midBoat.vy === 0) {
      midBoat.vx = 0
    }
  }

  up.press = () => {
    midBoat.vy = -5
    midBoat.vx = 0
  }
  up.release = () => {
    if (!down.isDown && midBoat.vx === 0) {
      midBoat.vy = 0
    }
  }

  right.press = () => {
    midBoat.vx = 5
    midBoat.vy = 0
  }
  right.release = () => {
    if (!left.isDown && midBoat.vy === 0) {
      midBoat.vx = 0
    }
  }

  down.press = () => {
    midBoat.vy = 5
    midBoat.vx = 0
  }
  down.release = () => {
    if (!up.isDown && midBoat.vx === 0) {
      midBoat.vy = 0
    }
  }

  state = play

  app.ticker.add(delta => gameLoop(delta))
}
loader.add('drowner', drownerPath).add('midBoat', midBoatPath)
loader.load(setup)

const gameLoop = delta => {
  state(delta)
}

const play = delta => {
  midBoat.y += midBoat.vy
  midBoat.x += midBoat.vx

  drowners.children.forEach(drowner => {
    if (hitTestRectangle(midBoat, drowner)) {
      drowners.removeChild(drowner)
      if (drowners.children.length > 0) {
        message.text = `Rescued ${numberOfDrowners -
          drowners.children.length}/${numberOfDrowners}`
      } else {
        message.text = 'What a success, you rescued everyone!!!'
      }
    }
  })
}
