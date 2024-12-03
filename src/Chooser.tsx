import { useAtom, useSetAtom } from "jotai";
import { selectedDigitAtom, showChooserAtom, showEditorAtom } from "./atoms";
import { labels } from "./consts";

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
    <div className="absolute left-0 top-0 w-full h-full flex flex-col bg-neutral-800 overflow-hidden">
      <div className="flex justify-between bg-neutral-900 mb-3">
        <div className="text-center text-sm px-4 py-2 uppercase">
          Contribute
        </div>
        <button
          className="text-white px-4 py-2 text-sm uppercase underline"
          onClick={() => setShowChooser(false)}
        >
          Close
        </button>
      </div>
      <div className="grow flex overflow-auto">
        <div className="m-auto flex flex-col">
          <div className="text-center mb-4">Choose a digit</div>
          <div className="flex flex-wrap justify-center items-center gap-4 q-4">
            {srcs.map((src, i) => {
              const width = labels[i] === ":" ? 220 : 440;
              const height =
                labels[i] === "AM" || labels[i] === "PM" ? 400 : 800;
              return (
                <button
                  key={i}
                  className="flex flex-col items-center gap-1 group"
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
                  <div className="text-white group-hover:underline">
                    {labels[i]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
