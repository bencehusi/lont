import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

const SendGridTemplateId = "d-17682e5e3c8a46f1bd45ceaf1bb0ea26";

export async function SendOrderConfirmation({
  session_id,
  email,
  customer_name,
  order_number,
  purchase_date,
  purchased_products,
  download_links,
}: {
  session_id: string;
  email: string;
  customer_name: string;
  order_number: string;
  purchase_date: string;
  purchased_products: string[];
  download_links: { font_name: string; link: string }[];
}) {
  const msg = {
    to: email,
    from: {
      email: "order@libraryofnarrativetypes.xyz",
      name: "Nora from Library of Narrative Types",
    },
    templateId: SendGridTemplateId,
    dynamicTemplateData: {
      session_id,
      customer_name,
      order_number,
      purchase_date,
      purchased_products,
      download_links,
    },
  };
  try {
    await sgMail.send(msg);
    return { message: "Email sent" };
  } catch (error) {
    console.error(error);
    /* @ts-ignore */
    console.error(error?.response.body, process.env.SEND_GRID_API_KEY);
    return { error: "Email not sent" };
  }
}
