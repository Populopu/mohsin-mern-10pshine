import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NoteEditor = ({ value, setValue }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      placeholder="Write your note..."
    />
  );
};

export default NoteEditor;
