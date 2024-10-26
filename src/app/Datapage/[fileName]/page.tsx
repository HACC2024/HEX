import { database } from "../../../../.firebase/firebase";
import { ref as dbRef, get } from "firebase/database";

interface FileData {
  name: string;
  description: string;
  file: { [key: string]: string[] };
  category: string;
}

export async function generateStaticParams() {
  const dbRefPath = dbRef(database, "Admin");
  const snapshot = await get(dbRefPath);
  const files = snapshot.exists() ? snapshot.val() : {};
  const paths = Object.keys(files).map((fileKey) => ({
    fileName: encodeURIComponent(files[fileKey].name),
  }));

  return paths;
}

export default async function FilePage({
  params,
}: {
  params: { fileName: string };
}) {
  const { fileName } = params;

  const dbRefPath = dbRef(database, `Admin`);
  const snapshot = await get(dbRefPath);
  const files = snapshot.exists() ? snapshot.val() : {};

  const decodedFileName = decodeURIComponent(fileName);
  const fileData = Object.values<FileData>(files).find(
    (file) => file.name === decodedFileName
  );


  return (
    <div>
      <h1>{fileData!.name}</h1>
      <p>{fileData!.description}</p>
    </div>
  );
}
