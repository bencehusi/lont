import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

const SendGridTemplateId = "d-17682e5e3c8a46f1bd45ceaf1bb0ea26";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "disabled" });
  }
  const msg = {
    to: "bence.husi@gmail.com", // Change to your recipient
    from: {
      email: "hello@libraryofnarrativetypes.xyz", // Change to your verified sender
      name: "Nora from Library of Narrative Types",
    },
    reply_to: "libraryofnarrativetypes@gmail.com",
    templateId: SendGridTemplateId,
    dynamicTemplateData: {
      session_id:
        "cs_test_a19rrC4iu3k8Ip13QKS3HmaAiPDziaaOrX42T8ouErdwlUDi4tFUM66exE", // The stripe session id
      customer_name: "John Doe",
      order_number: "pi_3Q3x1cAsRZjwPvPZ1xH5y8Fx", // The payment_intent id
      purchase_date: "October 5, 2023",
      purchased_products: ["Font Name 1", "Font Name 2"],
      download_links: [
        {
          font_name: "Font Name 1",
          link: "https://www.libraryofnarrativetypes.com/download/font1",
        },
        {
          font_name: "Font Name 2",
          link: "https://www.libraryofnarrativetypes.com/download/font2",
        },
      ],
    },
  };
  try {
    const result = await sgMail.send(msg);
    console.log(result);
    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    /* @ts-ignore */
    console.error(error?.response.body, process.env.SEND_GRID_API_KEY);
    return NextResponse.json({ error: "Email not sent" }, { status: 500 });
  }
}
