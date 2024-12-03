import { useAtom } from "jotai";
import { Clock } from "./Clock";
import { showChooserAtom, showEditorAtom } from "./atoms";
import { Chooser } from "./Chooser";
import { labels } from "./consts"r

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

function Editor() {
  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col bg-neutral-800 overflow-hidden">
      <div>
        <select>
          {labels.map((label, i) => (
            <option key={i}>{label}</option>
          ))}
          editor
        </select>
      </div>
    </div>
  );
}
