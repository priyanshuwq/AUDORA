import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";

const SongsTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-red-500" />
              Songs Library
            </CardTitle>
            <CardDescription>Manage your music tracks</CardDescription>
          </div>
          <AddSongDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[60vh] overflow-y-auto">
          <SongsTable />
        </div>
      </CardContent>
    </Card>
  );
};
export default SongsTabContent;
