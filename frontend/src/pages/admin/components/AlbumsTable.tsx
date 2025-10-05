import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useEffect } from "react";

const AlbumsTable = () => {
  const { albums, deleteAlbum, fetchAlbums } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="hover:bg-zinc-800/50">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead>Songs</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {albums.map((album) => (
            <TableRow key={album._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  className="w-10 h-10 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{album.title}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {album.artist}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {album.releaseYear}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Music className="h-4 w-4" />
                  {album.songs.length} songs
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlbum(album._id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default AlbumsTable;
