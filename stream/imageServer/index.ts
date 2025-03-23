import { Application, Router, send } from "@oak/oak"
import { logger } from "@logger"

logger.setLogLevel(5)

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await Deno.stat(filePath)
    return true
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false
    }
    throw error // Re-throw other unexpected errors
  }
}

const fallbackImage = "static/image.png"

const router = new Router()
router.get("/champ-pick/:id", async (ctx) => {
  const imgPath = `static/hinhtuong/pick/${ctx.params.id}.png`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh tuong-pick missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})
router.get("/champ-waiting/:id", async (ctx) => {
  const imgPath = `static/hinhtuong/waiting/${ctx.params.id}.png`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh tuong-waiting missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})
router.get("/champ-ban/:id", async (ctx) => {
  const imgPath = `static/hinhtuong/ban/${ctx.params.id}.png`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh tuong-ban missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})
router.get("/champ-end/:id", async (ctx) => {
  const imgPath = `static/hinhtuong/end/${ctx.params.id}.png`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh tuong-end missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})
router.get("/item/:id", async (ctx) => {
  const imgPath = `static/hinhtrangbi/${ctx.params.id}.png`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh trang bi missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})
router.get("/spell/:id", async (ctx) => {
  const imgPath = `static/hinhspell/${ctx.params.id}.png`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh spell missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})
router.get("/rune/:id", async (ctx) => {
  const imgPath = `static/hinhrune/${ctx.params.id}.webp`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh rune missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})
router.get("/player/:id", async (ctx) => {
  const imgPath = `static/hinhplayer/${ctx.params.id}.jpg`
  const isImgExisted = await fileExists(imgPath)
  if (isImgExisted) {
    await send(ctx, imgPath)
  } else {
    logger.log("hinh player missing: " + ctx.params.id, "ERROR")
    await send(ctx, fallbackImage)
  }
})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

export const runImageServer = async () => {
  app.listen({ port: 8000 })
  logger.log("Image server is listening on HTTP://localhost:8000", "SUCCESS")
}

runImageServer()
