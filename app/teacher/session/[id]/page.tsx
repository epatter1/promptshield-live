import SessionClient from "./SessionClient";

export default async function SessionPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Session {id}</h1>
      <SessionClient id={id} />
    </div>
  );
}