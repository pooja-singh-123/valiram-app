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


export async function getOrderData(orderId) {
  // This example uses metafields to store the data. For more information, refer to https://shopify.dev/docs/apps/custom-data/metafields.

  const res = await makeGraphQLQuery(
    `query Order($id: ID!) {
        order(id: $id) {
          customer {
            firstName
            lastName
            email
          }
          metafield(namespace: "custom", key:"qrcode") {
            value
            namespace
            key
            reference {
                ... on MediaImage {
                    image {
                        originalSrc
                    }
                }
            }
          }
        }
    }
  `,
    { id: orderId }
  );

  if (res?.data?.order) {
    const response = {
      firstName: res.data.order.customer.firstName,
      lastName: res.data.order.customer.lastName,
      email: res.data.order.customer.email,
      QRImage: res.data.order.metafield.reference.image.originalSrc
    }
    return response;
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

export async function callMailAPI (requestBody) {
    try {
        const response = await fetch('https://gate-hotels-colored-member.trycloudflare.com/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response;

    } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
    }
}
