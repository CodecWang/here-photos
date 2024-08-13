import UploadIcon from "@/icons/upload-icon";

export default function Upload() {
  return (
    <div className="tooltip tooltip-bottom" data-tip="Upload photos">
      <button className="btn btn-ghost">
        <UploadIcon className="size-6 md:size-5" />
        <span className="hidden md:inline">Upload</span>
      </button>
    </div>
  );
}
