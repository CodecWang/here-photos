export default function AlbumLayout({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer: React.ReactNode;
}) {
  return (
    <>
      {children}
      {viewer}
    </>
  );
}
