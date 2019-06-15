import * as PIXI from 'pixi.js'
import drownerPath from '../assets/drowner.png'
import midBoatPath from '../assets/mid-boat.png'

const app = new PIXI.Application()
document.body.appendChild(app.view)

const loader = PIXI.Loader.shared
loader.add('drowner', drownerPath).add('midBoat', midBoatPath)
loader.load((loader, resources) => {
  const drowner = PIXI.Sprite.from(resources.drowner.texture)
  const midBoat = PIXI.Sprite.from(resources.midBoat.texture)
  app.stage.addChild(drowner)
  app.stage.addChild(midBoat)
})
