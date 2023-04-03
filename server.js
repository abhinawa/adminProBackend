// import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
// import cluster from "cluster";
// import os from "os";
dotenv.config({ path: ".env" });

// const cpuLength = os.cpus().length;

// if (!cluster.isWorker) {
//   for (let i = 0; i < cpuLength; i++) {
//     cluster.fork(); //creating workers
//   }

//   cluster.on("exit", (worker) => {
//     console.log(`${worker.process.pid} died creating new worker`);
//     cluster.fork();
//   });
// } else {
//   app.listen(process.env.PORT, () => {
//     console.log(`Worker ${process.pid} Listening on PORT ${process.env.PORT}`);
//   });
// }

app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
});
