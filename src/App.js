import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";
import remarkMath from "remark-math";
import rehypeMathJaxSvg from "rehype-mathjax";

function App() {
  const [data, setData] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(false);

  const HandleChange = (event) => {
    event.preventDefault();
    setData(event.target.value);
  };

  const SaveFile = () => {
    const Time = new Date();
    const elem = document.createElement("a");
    const file = new Blob([data + "\n"], { type: "text/plain" });
    elem.href = URL.createObjectURL(file);
    elem.download = `${
      fileName.length > 0 ? fileName : Time.toISOString() + ".txt"
    }`;
    document.body.appendChild(elem);
    elem.click();
  };

  const LoadFile = (e) => {
    e.preventDefault();
    const Reader = new FileReader();
    Reader.onload = async (e) => {
      const Text = e.target.result;
      setData(Text);
    };
    setFileName(e.target.files[0].name);
    Reader.readAsText(e.target.files[0]);
  };

  const HandlePreview = () => {
    setPreview(!preview);
  };

  return (
    <div className="App">
      <button onClick={SaveFile}>Save</button>
      <input
        type="file"
        id="fileinput"
        onChange={LoadFile}
        className="cfileinput"
      />
      <button onClick={HandlePreview}>Preview</button>
      <div className="Editors">
        <TextArea preview={preview} HandleChange={HandleChange} data={data} />
        <MdArea preview={preview} data={data} />
      </div>
    </div>
  );
}

const MdArea = (props) => {
  const className = `mdown ${props.preview ? "preview" : "edit"}`;
  return (
    <ReactMarkdown
      children={props.data}
      className={className}
      rehypePlugins={[rehypeMathJaxSvg]}
      remarkPlugins={[remarkMath]}
      components={{
        code: CodeBlock,
      }}
    />
  );
};

const TextArea = (props) => {
  if (!props.preview) {
    return (
      <textarea
        value={props.data}
        onChange={props.HandleChange}
        className="texta"
        cols="250"
        rows="100"
      />
    );
  } else {
    return null;
  }
};

const CodeBlock = ({ inline, children, className, ...props }) => {
  const language = /language-(\w+)/.exec(className || "");
  return !inline && language ? (
    <SyntaxHighlighter language={language[1]} style={atomDark}>
      {children}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default App;
