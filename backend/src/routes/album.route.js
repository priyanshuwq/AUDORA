import { Router } from "express";
import {
  getAlbumById,
  getAllAlbums,
  addSongToAlbum,
  removeSongFromAlbum,
} from "../controller/album.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);
router.post("/:albumId/songs", addSongToAlbum);
router.delete("/:albumId/songs/:songId", requireAdmin, removeSongFromAlbum);

export default router;
