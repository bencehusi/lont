import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

const SendGridTemplateId = "d-71a1e887abe94554b98d83b69cb675b5";

export async function POST(req: NextRequest) {
  const msg = {
    to: "bence.husi@gmail.com", // Change to your recipient
    from: "order@libraryofnarrativetypes.xyz", // Change to your verified sender
    templateId: SendGridTemplateId,
    dynamicTemplateData: {
      customer_name: "John Doe",
      order_number: "LN123456789", // The payment_intent id
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
