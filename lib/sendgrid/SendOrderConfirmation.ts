import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

const SendGridTemplateId = "d-71a1e887abe94554b98d83b69cb675b5";

export async function SendOrderConfirmation({
  email,
  customer_name,
  order_number,
  purchase_date,
  purchased_products,
  download_links,
}: {
  email: string;
  customer_name: string;
  order_number: string;
  purchase_date: string;
  purchased_products: string[];
  download_links: { font_name: string; link: string }[];
}) {
  const msg = {
    to: email,
    from: "order@libraryofnarrativetypes.xyz",
    templateId: SendGridTemplateId,
    dynamicTemplateData: {
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
