import * as PIXI from 'pixi.js'
import drownerPath from '../assets/drowner.png'
import midBoatPath from '../assets/mid-boat.png'
import waterTile from '../assets/water-tile.png'
import waterFilter from '../assets/water-filter.png'
import hitTestRectangle from './hit-test-rectangle'
import playerControls from './player-controls'

const Application = PIXI.Application
const Container = PIXI.Container
const Sprite = PIXI.Sprite
const Text = PIXI.Text
const loader = PIXI.Loader.shared
const Texture = PIXI.Texture
const TilingSprite = PIXI.TilingSprite
const filters = PIXI.filters

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

let boat, state, water

const setup = (loader, resources) => {

  const waterFilterSprite = Sprite.from(waterFilter)
  waterFilterSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
  const displacementFilter = new filters.DisplacementFilter(waterFilterSprite)
  waterFilterSprite.scale.y = 0.6
  waterFilterSprite.scale.x = 0.6
  camera.addChild(waterFilterSprite)

  const waterTexture = Texture.from(waterTile)
  water = new TilingSprite(waterTexture, canvasWidth * 3, canvasHeight * 3)
  water.position.x = canvasWidth * -1
  water.position.y = canvasHeight * -1
  water.filters = [displacementFilter]
  camera.addChild(water)

  animateFilter(waterFilterSprite, 0)

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
  boat.acceleration = 0.09
  boat.turnSpeed = 0.01
  boat.friction = 0.01
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

const scaleForSpeed = boat => 1 - Math.min(boat.speed / 20, 0.2)

const xAxisCameraOffset = (boat, scale) => {
  const halfWidth = canvasWidth / 2 / scale
  return boat.x + boat.vx * 20 - halfWidth
}

const yAxisCameraOffset = (boat, scale) => {
  const halfHeight = canvasHeight / 2 / scale
  return boat.y + boat.vy * 20 - halfHeight
}

const animateFilter = (filterSprite, initCount) => {

  const count = initCount || 0

  filterSprite.x = count * 10
  filterSprite.y = count * 10

  requestAnimationFrame(_ => animateFilter(filterSprite, count + 0.05))
}

const play = delta => {
  playerControls(boat)
  boat.y += boat.vy
  boat.x += boat.vx

  water.position.y += boat.vy
  water.position.x += boat.vx
  water.tilePosition.y -= boat.vy
  water.tilePosition.x -= boat.vx

  const scale = scaleForSpeed(boat)
  camera.scale.set(scale, scale)
  camera.pivot.set(
    xAxisCameraOffset(boat, scale),
    yAxisCameraOffset(boat, scale)
  )

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
