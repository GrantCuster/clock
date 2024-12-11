import { useRef, useState, useEffect } from "react";
import { customDigitsAtom, showChooserAtom } from "./atoms";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "./Components";
import { ImageIcon } from "lucide-react";

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
          <DigitImage digit={hours[1]} />
          <div
            className="h-full w-1/2"
            style={{
              backgroundImage: 'url("/colon.jpg")',
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <DigitImage digit={minutes[0]} />
          <DigitImage digit={minutes[1]} />
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
        <Button onClick={() => setShowChooser(true)}>
          <ImageIcon size={16} /> Contribute
        </Button>
      </div>
    </div>
  );
}

function DigitImage({ digit }: { digit: string }) {
  const [customDigits] = useAtom(customDigitsAtom);

  const imageString =
    customDigits[digit as keyof typeof customDigits]?.replace(
      /(\r\n|\n|\r)/gm,
      "",
    ) || digit + ".jpg";

  return (
    <div
      className="h-full w-full"
      style={{
        backgroundImage: `url("/${imageString}")`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}
