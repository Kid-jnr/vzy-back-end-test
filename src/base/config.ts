import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export const PORT = configService.get("PORT");
export const JWT_SECRET = configService.get("JWT_SECRET");


export const STRIPE_SECRET_KEY = configService.get("STRIPE_SECRET_KEY");
export const STRIPE_WEBHOOK_SECRET = configService.get("STRIPE_WEBHOOK_SECRET");