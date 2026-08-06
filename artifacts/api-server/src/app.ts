import express, { type Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import cookieParser from "cookie-parser";
import router from "./routes";
import { logger } from "./lib/logger";

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET must be set. It is used to sign the portal session cookie.",
  );
}

const app: Express = express();

// Trust one proxy hop so req.ip resolves to the real client IP from the
// X-Forwarded-For header set by Vercel's edge and Replit's dev proxy.
// Without this, req.ip is the proxy's address, not the browser's.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
