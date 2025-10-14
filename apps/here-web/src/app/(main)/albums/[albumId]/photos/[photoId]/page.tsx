import PhotoViewer from '~/components/photos/photo-viewer';

export default async function Page({
  params,
}: {
  params: { photoId: string };
}) {
  const { photoId } = await params;
  // return (
  //   <>
  //     <span>fsaklfjlk</span>
  //     <PhotoViewer photoId={photoId} />
  //   </>
  // );
  return <div className="h-32 w-32 bg-red-500">aaa</div>;
}
