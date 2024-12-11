import { useAtom, useSetAtom } from "jotai";
import { selectedDigitAtom, showChooserAtom, showEditorAtom } from "./atoms";
import { labels } from "./consts";
import { XIcon } from "lucide-react";
import { Button } from "./Components";

export function Chooser() {
  const setShowChooser = useSetAtom(showChooserAtom);
  const [showEditor, setShowEditor] = useAtom(showEditorAtom);
  const [selectedDigit, setSelectedDigit] = useAtom(selectedDigitAtom);

  const srcs = [
    "/0.jpg",
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/7.jpg",
    "/8.jpg",
    "/9.jpg",
    "/colon.jpg",
    "/am.jpg",
    "/pm.jpg",
  ];

  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col bg-neutral-900 overflow-hidden">
      <div className="flex justify-between py-2 px-2 bg-neutral-800">
        <div className="text-center px-4 py-2  ">Choose a digit</div>
        <Button onClick={() => setShowChooser(false)}>
          <XIcon size={16} />
        </Button>
      </div>
      <div className="grow flex overflow-auto py-5">
        <div className="m-auto flex flex-col">
          <div className="flex flex-wrap justify-center items-center gap-4 q-4">
            {srcs.map((src, i) => {
              const width = labels[i] === ":" ? 220 : 440;
              const height =
                labels[i] === "AM" || labels[i] === "PM" ? 400 : 800;
              return (
                <button
                  key={i}
                  className="flex flex-col items-center bg-neutral-700 hover:bg-neutral-600 p-2 rounded-xl gap-1 "
                  onClick={() => {
                    setShowChooser(false);
                    setSelectedDigit(labels[i]);
                    setShowEditor(true);
                  }}
                >
                  <div
                    className=""
                    style={{
                      width: width / 2,
                      height: height / 2,
                      backgroundImage: `url("${src}")`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className="text-white ">{labels[i]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
