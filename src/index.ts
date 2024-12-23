import { BrowserContainer } from "./container/browsercontainer";

initialise();

function initialise() {
  const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement;
  const params = new URLSearchParams(location.search);
  void new BrowserContainer(canvas3d, params).start();
}
