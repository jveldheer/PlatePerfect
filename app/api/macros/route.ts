/**
 * Nutrition Macro Lookup API
 *
 * @swagger
 * /api/macros:
 *   get:
 *     summary: Get nutrition macros for a food item
 *     description: |
 *       Lookup nutrition information using USDA FoodData Central and Open Food Facts.
 *       Supports UPC/barcode lookup and text-based food search.
 *     parameters:
 *       - name: upc
 *         in: query
 *         description: UPC/barcode for product lookup
 *         schema:
 *           type: string
 *       - name: text
 *         in: query
 *         description: Text query for food search
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         description: Food name for search
 *         schema:
 *           type: string
 *       - name: amount
 *         in: query
 *         description: Amount for portion calculation
 *         schema:
 *           type: number
 *       - name: unit
 *         in: query
 *         description: Unit for portion (g, oz, cup, etc.)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid request
 *   post:
 *     summary: Get nutrition macros for a food item (POST)
 *     description: Same as GET but accepts JSON body
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               upc:
 *                 type: string
 *               text:
 *                 type: string
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               unit:
 *                 type: string
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMacros } from "@/lib/nutrition";

const QuerySchema = z
  .object({
    upc: z.string().optional(),
    text: z.string().optional(),
    name: z.string().optional(),
    amount: z.coerce.number().positive().optional(),
    unit: z.string().optional(),
  })
  .refine((v) => v.upc || v.text || v.name, {
    message: "Must provide at least one of: upc, text, or name",
  });

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = QuerySchema.parse(params);

    // Get macro data
    const data = await getMacros(parsed);

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (err: any) {
    const statusCode = err.message?.includes("not found") ? 404 : 400;

    return NextResponse.json(
      {
        ok: false,
        error: err.message || "Failed to fetch nutrition data",
      },
      { status: statusCode }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const parsed = QuerySchema.parse(body);

    // Get macro data
    const data = await getMacros(parsed);

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (err: any) {
    const statusCode = err.message?.includes("not found") ? 404 : 400;

    return NextResponse.json(
      {
        ok: false,
        error: err.message || "Failed to fetch nutrition data",
      },
      { status: statusCode }
    );
  }
}
