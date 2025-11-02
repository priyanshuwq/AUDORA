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
import { Calendar, Trash2 } from "lucide-react";

const SongsTable = () => {
  const { songs, isLoading, error, deleteSong } = useMusicStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading songs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile: stacked card list */}
      <div className="md:hidden grid gap-3 scrollbar-hide">
        {songs.map((song) => (
          <div
            key={song._id}
            className="flex items-center gap-3 bg-black/20 rounded-xl p-3"
          >
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">
                {song.title}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {song.artist}
              </div>
            </div>
            <div>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-red-400"
                onClick={() => deleteSong(song._id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet: original table but without heavy borders */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <Table className="min-w-[700px] bg-transparent">
          <TableHeader>
            <TableRow className="bg-transparent">
              <TableHead className="w-[50px] bg-transparent"></TableHead>
              <TableHead className="bg-transparent">Title</TableHead>
              <TableHead className="bg-transparent">Artist</TableHead>
              <TableHead className="bg-transparent">Release Date</TableHead>
              <TableHead className="text-right bg-transparent">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {songs.map((song) => (
              <TableRow
                key={song._id}
                className="hover:bg-zinc-800/40 rounded-lg"
              >
                <TableCell>
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="size-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {song.artist}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Calendar className="h-4 w-4" />
                    {song.createdAt.split("T")[0]}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className="text-red-400 hover:text-red-300"
                      onClick={() => deleteSong(song._id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default SongsTable;
