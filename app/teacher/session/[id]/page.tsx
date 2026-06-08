import SessionClient from "./SessionClient";

export default async function SessionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Session {id}</h1>
      <SessionClient id={id} />
    </div>
  );
}