export async function getMetaFieldValue(orderId) {
  // This example uses metafields to store the data. For more information, refer to https://shopify.dev/docs/apps/custom-data/metafields.
  const res = await makeGraphQLQuery(
    `query Order($id: ID!) {
      order(id: $id) {
        metafield(namespace: "custom", key:"qrcode") {
            value
        }
      }
    }
  `,
    { id: orderId }
  );

  if (res?.data?.order?.metafield?.value) {
    return res.data.order.metafield.value;
  } else if(res.errors?.[0].message) {
    throw new Error(res.errors[0].message);
  } else{
    throw new Error("No Data Found.");
  }
}


export async function getEmail(orderId) {
  // This example uses metafields to store the data. For more information, refer to https://shopify.dev/docs/apps/custom-data/metafields.

  const res = await makeGraphQLQuery(
    `query Order($id: ID!) {
        order(id: $id) {
          customer {
              email
          }
        }
    }
  `,
    { id: orderId }
  );

  if (res?.data?.order?.customer?.email) {
    return res.data.order.customer.email;
  } else if(res.errors?.[0].message) {
    throw new Error(res.errors[0].message);
  } else{
    throw new Error("No Data Found.");
  }
}

async function makeGraphQLQuery(query, variables) {
  const graphQLQuery = {
    query,
    variables,
  };

  const res = await fetch("shopify:admin/api/graphql.json", {
    method: "POST",
    body: JSON.stringify(graphQLQuery),
  });

  if (!res.ok) {
    console.error("Network error");
  }

  return await res.json();
}

export async function sendEmail(customerEmail, subject, message) {
  const apiKey = 'YOUR_SENDGRID_API_KEY';
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: customerEmail }]
      }],
      from: { email: 'pooja.singh@ranosys.com' },
      subject: subject,
      content: [{
        type: 'text/plain',
        value: message
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  return response.json();
}