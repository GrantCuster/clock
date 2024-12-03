import { useRef, useState, useEffect } from "react";
import { showChooserAtom } from "./atoms";
import { useSetAtom } from "jotai";

export function Clock() {
  const intervalRef = useRef<number | null>(null);
  const setShowChooser = useSetAtom(showChooserAtom);
  const [, setBump] = useState(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setBump((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const _hours = new Date().getHours();
  const minutes = new Date().getMinutes().toString().padStart(2, "0");
  const amppm = (_hours >= 12 ? "PM" : "AM").toString();
  const hours =
    _hours > 12
      ? (_hours - 12).toString().padStart(2, "0")
      : _hours.toString().padStart(2, "0");

  return (
    <div className="grow flex flex-col">
      <div className="grow px-8 flex">
        <div className="aspect-[121/40] flex items-end m-auto w-full">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                hours[0] === "0" ? "none" : `url("/${hours[0]}.jpg")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("/${hours[1]}.jpg")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="h-full w-1/2"
            style={{
              backgroundImage: 'url("/colon.jpg")',
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("/${minutes[0]}.jpg")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("/${minutes[1]}.jpg")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="h-1/2 w-full"
            style={{
              backgroundImage: `url("/${amppm.toLowerCase()}.jpg")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </div>
      <div className="flex justify-center pb-4">
        <button
          className="text-white px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full uppercase"
          onClick={() => setShowChooser(true)}
        >
          Contribute
        </button>
      </div>
    </div>
  );
}
