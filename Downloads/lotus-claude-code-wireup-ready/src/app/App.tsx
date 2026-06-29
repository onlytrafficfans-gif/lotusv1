import MiddleScreen from "./screens/MiddleScreen";

export default function App() {
  return (
    <MiddleScreen onComplete={() => console.log("Complete")} />
  );
}
