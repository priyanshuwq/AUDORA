import { Router } from "express";
import {
  getAlbumById,
  getAllAlbums,
  addSongToAlbum,
} from "../controller/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);
router.post("/:albumId/songs", addSongToAlbum);

export default router;
