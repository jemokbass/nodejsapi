import logger from "pino";

export const log = logger({
  base: { pid: false },
  transport: {
    target: "pino-pretty",
    options: {
      colorized: true,
    },
  },
  timestamp: () => `, "time": "${new Date().toLocaleString()}"`,
});
