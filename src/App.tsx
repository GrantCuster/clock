import { useAtom } from "jotai";
import { Clock } from "./Clock";
import {
  cameraStreamAtom,
  cameraVideoElementAtom,
  showChooserAtom,
  showEditorAtom,
} from "./atoms";
import { Chooser } from "./Chooser";
import { useEffect, useRef, useState } from "react";
import { Editor } from "./Editor";

function App() {
  const [showChooser] = useAtom(showChooserAtom);
  const [showEditor] = useAtom(showEditorAtom);

  return (
    <div className="h-[100dvh] w-full flex overflow-hidden">
      <Clock />
      {showChooser ? <Chooser /> : null}
      {showEditor ? <Editor /> : null}
    </div>
  );
}

export default App;

export function CameraStream() {
  const [stream] = useAtom(cameraStreamAtom);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [cameraVideoElement, setCameraVideoElement] = useAtom(cameraVideoElementAtom);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          setVideoSize({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });
        }
      };
    }
  }, [stream]);

  return stream ? (
    <video
      className="relative"
      ref={(el) => {
        videoRef.current = el;
        if (el && !cameraVideoElement) {
          setCameraVideoElement(el);
        }
      }}
      autoPlay
      playsInline
      style={{
        transform: "scaleX(-1)",
        width: videoSize.width,
        height: videoSize.height,
      }}
    />
  ) : null;
}
