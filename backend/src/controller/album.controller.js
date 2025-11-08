import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

export const addSongToAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { songId } = req.body;

    // Validate inputs
    if (!songId) {
      return res.status(400).json({ message: "Song ID is required" });
    }

    // Find album
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Find song
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Check if song is already in the album
    if (album.songs.includes(songId)) {
      return res.status(400).json({ message: "Song is already in this album" });
    }

    // Add song to album
    album.songs.push(songId);
    await album.save();

    // Update song's albumId
    song.albumId = albumId;
    await song.save();

    // Return updated album with populated songs
    const updatedAlbum = await Album.findById(albumId).populate("songs");

    res.status(200).json({
      message: "Song added to album successfully",
      album: updatedAlbum,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSongFromAlbum = async (req, res, next) => {
  try {
    const { albumId, songId } = req.params;

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "Invalid album ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }

    // Find album
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Find song
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Check if song is in the album
    const songInAlbum = album.songs.some(
      (id) => id.toString() === songId.toString()
    );
    if (!songInAlbum) {
      return res.status(400).json({ message: "Song is not in this album" });
    }

    // Remove song from album
    album.songs = album.songs.filter((id) => id.toString() !== songId.toString());
    await album.save();

    // Update song's albumId to null
    song.albumId = null;
    await song.save();

    // Return updated album with populated songs
    const updatedAlbum = await Album.findById(albumId).populate("songs");

    res.status(200).json({
      message: "Song removed from album successfully",
      album: updatedAlbum,
    });
  } catch (error) {
    console.error("Error in removeSongFromAlbum:", error);
    next(error);
  }
};
