import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { html } = await req.json();

    if (!html) {
      throw new Error("HTML content is required");
    }

    console.log("Starting PDF generation...");

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    console.log("Rendering PDF...");

    // Generate PDF with specific options
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size:9px; text-align:center; width:100%; color:#666;">Resumo Executivo</div>',
      footerTemplate: '<div style="font-size:9px; text-align:center; width:100%; color:#666;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    });

    await browser.close();

    console.log("PDF generated successfully");

    // Convert PDF buffer to base64
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdf)));

    return new Response(
      JSON.stringify({ pdf: base64Pdf }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate PDF"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
