import { useAtom, useSetAtom } from "jotai";
import { CameraStream } from "./App";
import {
  selectedDigitAtom,
  cameraStreamAtom,
  LabelType,
  cameraModeOnAtom,
  showEditorAtom,
  cameraCameraAtom,
  cameraCanvasContainerAtom,
  cameraVideoElementAtom,
  activeCanvasAtom,
  editModeOnAtom,
  submittedCanvasAtom,
  customDigitsAtom,
} from "./atoms";
import { labels } from "./consts";
import { CameraIcon, MonitorIcon, UploadIcon, XIcon } from "lucide-react";
import { Button, Select } from "./Components";
import { useEffect } from "react";
import { panCamera, zoomCamera } from "./Camera";
import { getTargetDimensions } from "./utils";
import axios from "axios";

export function Editor() {
  const [selectedDigit, setSelectedDigit] = useAtom(selectedDigitAtom);
  const [, setStream] = useAtom(cameraStreamAtom);
  const [cameraModeOn, setCameraModeOn] = useAtom(cameraModeOnAtom);
  const setShowEditor = useSetAtom(showEditorAtom);
  const [editMoeOn] = useAtom(editModeOnAtom);

  const mainMode = !cameraModeOn;

  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col overflow-hidden">
      <div className="flex gap-2 items-center py-2 bg-neutral-800 px-2 justify-between">
        <div className="px-2">Contribute</div>
        <Select
          value={selectedDigit}
          onChange={(e) => {
            setSelectedDigit(e.currentTarget.value as LabelType);
          }}
        >
          {labels.map((label, i) => (
            <option key={i} value={label}>
              {label}
            </option>
          ))}
        </Select>
        <Button
          onClick={() => {
            setShowEditor(false);
          }}
        >
          <XIcon size={16} />
        </Button>
      </div>
      <div className="bg-black grow flex relative overflow-hidden">
        <ZoomContent />
      </div>
      {cameraModeOn ? <CameraControls /> : null}
      {editMoeOn ? (
        <div className="flex gap-2 justify-center py-2 pb-4 bg-neutral-900">
          <EditModeControls />
        </div>
      ) : null}
      {mainMode && !editMoeOn ? (
        <div className="flex gap-2 justify-center py-2 pb-4 bg-neutral-900">
          <Button>
            <UploadIcon size={16} />
            Upload
          </Button>
          <Button
            onClick={() => {
              setCameraModeOn(true);
              navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                  setStream(stream);
                });
            }}
          >
            <CameraIcon size={16} />
            Camera
          </Button>
          <Button>
            <MonitorIcon size={16} />
            Screenshare
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function CameraControls() {
  const [, setCameraModeOn] = useAtom(cameraModeOnAtom);
  const [cameraVideoElement] = useAtom(cameraVideoElementAtom);
  const setActiveCanvas = useSetAtom(activeCanvasAtom);
  const setStream = useSetAtom(cameraStreamAtom);
  const setEditModeOn = useSetAtom(editModeOnAtom);

  function onCapture() {
    if (cameraVideoElement) {
      const canvas = document.createElement("canvas");
      canvas.width = cameraVideoElement.videoWidth;
      canvas.height = cameraVideoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(cameraVideoElement, 0, 0);
        setActiveCanvas(canvas);
        setStream(null);
        setCameraModeOn(false);
        setEditModeOn(true);
      }
    }
  }

  return (
    <div className="flex gap-2 justify-center py-2 pb-4 bg-neutral-900">
      <select>
        <option>Camera 1</option>
      </select>
      <Button
        onClick={() => {
          onCapture();
        }}
      >
        Capture
      </Button>
      <Button
        onClick={() => {
          setCameraModeOn(false);
        }}
      >
        Cancel
      </Button>
    </div>
  );
}

export function ZoomContent() {
  const [selectedDigit] = useAtom(selectedDigitAtom);
  const { targetWidth, targetHeight } = getTargetDimensions(selectedDigit);
  const [stream] = useAtom(cameraStreamAtom);
  const [cameraCamera, setCameraCamera] = useAtom(cameraCameraAtom);
  const [cameraCanvasContainer, setCameraCanvasContainer] = useAtom(
    cameraCanvasContainerAtom,
  );
  const [activeCanvas] = useAtom(activeCanvasAtom);
  const [submittedCanvas] = useAtom(submittedCanvasAtom);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (cameraCanvasContainer) {
        event.preventDefault();

        const { clientX: x, clientY: y, deltaX, deltaY, ctrlKey } = event;

        if (ctrlKey) {
          setCameraCamera((camera) =>
            zoomCamera(camera, { x, y }, deltaY / 400, cameraCanvasContainer),
          );
        } else {
          if (event.shiftKey) {
            setCameraCamera((camera) => panCamera(camera, deltaY, 0));
          } else {
            setCameraCamera((camera) => panCamera(camera, deltaX, deltaY));
          }
        }
      }
    }
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [cameraCanvasContainer, setCameraCamera]);

  return (
    <>
      <div
        ref={(div) => {
          if (div) {
            setCameraCanvasContainer(div);
          }
        }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "100%",
          height: "100%",
          transformOrigin: "0 0",
          transform: `scale(${cameraCamera.z}) translate(-50%, -50%) translate(${cameraCamera.x}px, ${cameraCamera.y}px)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {stream ? <CameraStream /> : null}
        {activeCanvas ? (
          <img src={activeCanvas.toDataURL("image/jpeg")} alt="" />
        ) : null}
      </div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: 0,
          top: 0,
          width: `calc(50% - ${targetWidth / 2}px)`,
          height: `calc(50% - ${targetHeight / 2}px)`,
        }}
      ></div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: `calc(50% + ${targetWidth / 2}px)`,
          top: 0,
          width: `calc(50% - ${targetWidth / 2}px)`,
          height: `calc(50% - ${targetHeight / 2}px)`,
        }}
      ></div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: 0,
          top: `calc(50% - ${targetHeight / 2}px)`,
          width: `calc(50% - ${targetWidth / 2}px)`,
          height: targetHeight,
        }}
      ></div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: `calc(50% + ${targetWidth / 2}px)`,
          top: `calc(50% - ${targetHeight / 2}px)`,
          width: `calc(50% - ${targetWidth / 2}px)`,
          height: targetHeight,
        }}
      ></div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: 0,
          top: `calc(50% + ${targetHeight / 2}px)`,
          width: `calc(50% - ${targetWidth / 2}px)`,
          height: `calc(50% - ${targetHeight / 2}px)`,
        }}
      ></div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: `calc(50% + ${targetWidth / 2}px)`,
          top: `calc(50% + ${targetHeight / 2}px)`,
          width: `calc(50% - ${targetWidth / 2}px)`,
          height: `calc(50% - ${targetHeight / 2}px)`,
        }}
      ></div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: `calc(50% - ${targetWidth / 2}px)`,
          top: `calc(50% + ${targetHeight / 2}px)`,
          width: targetWidth,
          height: `calc(50% - ${targetHeight / 2}px)`,
        }}
      ></div>
      <div
        className={`absolute h-full bg-black bg-opacity-50`}
        style={{
          left: `calc(50% - ${targetWidth / 2}px)`,
          top: 0,
          width: targetWidth,
          height: `calc(50% - ${targetHeight / 2}px)`,
        }}
      ></div>
      <div
        className="border-blue-500 relative border-2 m-auto"
        style={{
          width: targetWidth,
          height: targetHeight,
        }}
      ></div>
      {submittedCanvas ? (
        <img
          className="absolute top-0 left"
          src={submittedCanvas.toDataURL("image/jpeg")}
          alt=""
        />
      ) : null}
      <CameraReadout />
    </>
  );
}

export function CameraReadout() {
  const [readout] = useAtom(cameraCameraAtom);

  return (
    <div className="absolute left-0 top-0 font-mono text-xs">
      {Math.round(readout.x)}, {Math.round(readout.y)}, {readout.z.toFixed(2)}
    </div>
  );
}

export function EditModeControls() {
  const [camera, setCamera] = useAtom(cameraCameraAtom);
  const [editModeOn, setEditModeOn] = useAtom(editModeOnAtom);
  const [selectedDigit] = useAtom(selectedDigitAtom);
  const { targetWidth, targetHeight } = getTargetDimensions(selectedDigit);
  const [activeCanvas] = useAtom(activeCanvasAtom);
  const setSubmittedCanvas = useSetAtom(submittedCanvasAtom);
  const setCustomDigits = useSetAtom(customDigitsAtom);
  const [, setCameraModeOn] = useAtom(cameraModeOnAtom);
  const [, setShowEditor] = useAtom(showEditorAtom);
  const [, setActiveCanvas] = useAtom(activeCanvasAtom);

  async function handleSubmit() {
    if (activeCanvas) {
      const canvasWidth = activeCanvas.width * camera.z;
      const canvasHeight = activeCanvas.height * camera.z;
      const x = -canvasWidth / 2 + camera.x * camera.z;
      const y = -canvasHeight / 2 + camera.y * camera.z;
      const targetX = -targetWidth / 2;
      const targetY = -targetHeight / 2;

      const dest = document.createElement("canvas");
      dest.width = targetWidth;
      dest.height = targetHeight;
      const dtx = dest.getContext("2d");
      if (dtx) {
        dtx.drawImage(
          activeCanvas,
          (targetX - x) / camera.z,
          (targetY - y) / camera.z,
          targetWidth / camera.z,
          targetHeight / camera.z,
          0,
          0,
          targetWidth,
          targetHeight,
        );
        const response = await axios.post("/api/upload", {
          filename: selectedDigit,
          dataUrl: dest.toDataURL("image/jpeg"),
        });
        setCustomDigits((prev) => ({
          ...prev,
          [selectedDigit]: response.data.path,
        }));
        setEditModeOn(false);
        setCameraModeOn(false);
        setShowEditor(false);
        setActiveCanvas(null);
      }
    }
  }

  return <Button onClick={handleSubmit}>Submit</Button>;
}
