import printTest from "./src";

process.on("exit", (code) => {
  console.log("Process sync exit event with code: ", code);
});

printTest();
